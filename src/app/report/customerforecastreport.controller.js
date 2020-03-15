(function() {
	'use strict';
	angular
		.module('cpo')
		.service('CustomerForecastReportService', ['$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants','FilterInGridService',
			function($http, $translate, CommonService, $uibModal, uiGridConstants,FilterInGridService) {
				this.selectBatchDate = function(scope) {
					if(scope.tabIndex == 1) {
						this.getCustomerForecastReport(scope);
					} else if(scope.tabIndex == 2) {
						this.getOpenFCSummaryReport(scope);
					} else if(scope.tabIndex == 3) {
						this.getFCSummaryReport(scope);
					}
				}
				this.fetchBatchDates = function(scope) {
					var _this = this;
					var param = {
						in_code: 'CAPACITYCUSFCREPORTBATCHDATE'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {

						if(data.CAPACITYCUSFCREPORTBATCHDATE) {

							scope.cuss = data.CAPACITYCUSFCREPORTBATCHDATE;

							for(var i = 0; i < scope.cuss.length; i++) {
								scope.cuss[i].id = scope.cuss[i].value;
								scope.cuss[i].label = scope.cuss[i].label.split(' ')[0];
							}
							if(scope.searchRequest.cus != null) {
								for(var j = 0; j < scope.cuss.length; j++) {
									if(scope.cuss[j].id == scope.searchRequest.cus.id) {
										scope.searchRequest.cus = scope.cuss[j] ? scope.cuss[j] : null;
									}
								}
							}
							if(scope.searchRequest.cus == null) {
								scope.searchRequest.cus = scope.cuss[0] ? scope.cuss[0] : null;
							}

							_this.selectBatchDate(scope);

						}

					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.exportFile = function(scope) {
					var _this = this;
					//					if(!scope.reportItems || scope.reportItems.length == 0) {
					//						modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
					//						return;
					//					}
					var param = {
						pageSize: 100000,
						pageNo: 1
					};
					if(scope.tabIndex == 1) {
						param.documentType = 501;
						param.document_id = scope.searchRequest.cus.value;
					} else if(scope.tabIndex == 2) {
						param.documentType = 502;
						param.document_id = scope.searchRequest.cus.value;
					} else if(scope.tabIndex == 3) {
						param.documentType = 503;
						param.document_id = scope.searchRequest.cus.value;
					} else if(scope.tabIndex == 4) {
						param.documentType = 2001;
						param.document_id = scope.actualOpenFCSummaryReportDocumentId;
						if(scope.searchRequest.searchWorkingNo) {
							param.like_workingNo = scope.searchRequest.searchWorkingNo;
						}
					} else if(scope.tabIndex == 5) {
						param = _this.buildFcComparisonReportRequestParameter(scope);
						param.documentType = 40001;
						exportExcel(param, "cpo/portal/document/export_file?", "_blank");
						return;
					}

					//  exportExcel(param, "cpo/portal/document/export_file?", "_blank");
					CommonService.showLoadingView("Exporting...");
					GLOBAL_Http($http, "cpo/portal/document/check_record_count?", 'GET', param, function(data) {
						CommonService.hideLoadingView();
						if(data.status == 0) {
							if(parseInt(data.message) > 0) {
								exportExcel(param, "cpo/portal/document/export_file?", "_blank");
							} else {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
							}
						}
					}, function(data) {
						CommonService.hideLoadingView();
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}
				this.resetPageInfo = function(scope) {

					scope.page = {
						curPage: 1,
						pageSize: 20,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.headerList = new Array();
					scope.gridOptions.paginationCurrentPage = 1;
				}

				this.getCustomerForecastReport = function(scope) {

					var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'customerforcast_report_1', false, null, null);
					scope.gridOptions.columnDefs = staticColumns;
					scope.reportItems = [];
					var param = {
						pageSize: scope.page.pageSize,
						pageNo: scope.page.curPage
					};
					if(!scope.searchRequest.cus.value) {
						return;
					}
					param.document_id = scope.searchRequest.cus.value;
					if(scope.workingNo) {
						param['workingNo'] = scope.workingNo;
					}
					if(scope.productType) {
						param['productType'] = scope.productType;
					}

					GLOBAL_Http($http, "cpo/api/customer_report/query_customer_report?", 'GET', param, function(data) {

						if(data.output) {
							if(scope.tabIndex != 1) {
								return;
							}
							// var height = (scope.page.pageSize * 30) + 36;
							// $("#customerForecastReportOne").css('height', height + 'px');
							scope.reportItems = data.output;
							scope.page.totalNum = data.total;
							scope.gridOptions.totalItems = scope.page.totalNum;
							scope.headerList = [];
							if(scope.headerList.length == 0) {
								scope.headerList = data.headerList;
								var headerList = scope.headerList;
								var header = [];
								for(var i = 0; i < headerList.length; i++) {
									var hea = headerList[i];
									if(hea.indexOf("20") > -1) {
										var sub = hea.substring(0, 6);
										if(header.indexOf(sub) < 0) {
											header.push(sub);
										}
									}
								}
								header.sort();
								for(var i = 0; i < header.length; i++) {
									var header1 = header[i] + "  Forecast Quantity";
									var header2 = header[i] + "  Open Forecast Quantity";
									var header3 = header[i] + "  Order Quantity";
									var header4 = header[i] + "  PV Quantity";
									var column1 = {
										name: header1,
										displayName: header1,
										field: header1,
										minWidth: '150',
										enableCellEdit: false
									};
									var column2 = {
										name: header2,
										displayName: header2,
										field: header2,
										minWidth: '150',
										enableCellEdit: false
									};
									var column3 = {
										name: header3,
										displayName: header3,
										field: header3,
										minWidth: '150',
										enableCellEdit: false
									};
									var column4 = {
										name: header4,
										displayName: header4,
										field: header4,
										minWidth: '150',
										enableCellEdit: false
									};
									scope.gridOptions.columnDefs.push(column1);
									scope.gridOptions.columnDefs.push(column2);
									scope.gridOptions.columnDefs.push(column3);
									scope.gridOptions.columnDefs.push(column4);
								}
							}
						} else {
							//	modalAlert(CommonService, 3, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				};
				this.getOpenFCSummaryReport = function(scope) {
					var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'customerforcast_report_2', false, null, null);
					scope.gridOptions.columnDefs = staticColumns;
					scope.reportItems = [];

					var param = {
						pageSize: scope.page.pageSize,
						pageNo: scope.page.curPage
					};

					if(!scope.searchRequest.cus.value) {
						return;
					}
					param.document_id = scope.searchRequest.cus.value;

					if(scope.workingNo) {
						param['workingNo'] = scope.workingNo;
					}
					if(scope.productType) {
						param['productType'] = scope.productType;
					}

					GLOBAL_Http($http, "cpo/api/customer_report/query_customer_forecast_report_by_working_no_and_sct?", 'GET', param, function(data) {

						if(data.output) {
							if(scope.tabIndex != 2) {
								return;
							}
							scope.headerList = data.headerList;

							// var height = (scope.page.pageSize * 30) + 36;
							// $("#customerForecastReportOne").css('height', height + 'px');

							scope.page.totalNum = data.total;
							scope.gridOptions.totalItems = scope.page.totalNum;

							for(var i = 0; i < scope.headerList.length; i++) {
								var header = scope.headerList[i];

								var column = {
									name: header,
									displayName: header,
									field: header,
									minWidth: '150',
									enableCellEdit: false
								};
								scope.gridOptions.columnDefs.push(column);
							}
							var result = data.output;
							angular.forEach(result, function(item, index, array) {

								angular.forEach(item.monthlyQuantities, function(item2, index, array) {
									item[item2.month] = item2.qty;

								})
							})
							scope.reportItems = result;

						} else {
							//  modalAlert(CommonService, 3, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				};
				this.getFCSummaryReport = function(scope) {
					var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'customerforcast_report_3', false, null, null);
					scope.gridOptions.columnDefs = staticColumns;
					scope.reportItems = [];

					var param = {
						pageSize: scope.page.pageSize,
						pageNo: scope.page.curPage
					};
					if(!scope.searchRequest.cus.value) {
						return;
					}
					param.document_id = scope.searchRequest.cus.value;

					if(scope.workingNo) {
						param['workingNo'] = scope.workingNo;
					}
					if(scope.productType) {
						param['productType'] = scope.productType;
					}
					//
					//
					GLOBAL_Http($http, "cpo/api/customer_report/query_customer_forecast_report_by_working_no?", 'GET', param, function(data) {

						if(data.output) {
							if(scope.tabIndex != 3) {
								return;
							}
							scope.headerList = data.headerList;
							// var height = (scope.page.pageSize * 30) + 36;
							// $("#customerForecastReportOne").css('height', height + 'px');

							//   scope.reportItems = data.output;
							scope.page.totalNum = data.total;
							scope.gridOptions.totalItems = scope.page.totalNum;

							for(var i = 0; i < scope.headerList.length; i++) {
								var header = scope.headerList[i];

								var column = {
									name: header,
									displayName: header,
									field: header,
									minWidth: '150',
									enableCellEdit: false
								};
								scope.gridOptions.columnDefs.push(column);
							}
							var result = data.output;
							angular.forEach(result, function(item, index, array) {

								angular.forEach(item.monthlyQuantities, function(item2, index, array) {
									item[item2.month] = item2.qty;

								})
							})
							scope.reportItems = result;

						} else {
							//   modalAlert(CommonService, 3, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				};
				this.getActualOpenFCSummaryReport = function(scope) {

					var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'actual_open_fc_sumary_report', false, null, null, true);
					scope.gridOptions.columnDefs = staticColumns;
					scope.reportItems = [];
					var param = {
						document_id: scope.actualOpenFCSummaryReportDocumentId
					};
					if(scope.searchRequest.searchWorkingNo) {
						param.like_workingNo = scope.searchRequest.searchWorkingNo;
					}

					GLOBAL_Http($http, "cpo/api/customer_report/query_customer_forecast_deduction_report?", 'GET', param, function(data) {
						if(scope.tabIndex != 4) {
							return;
						}
						scope.page.totalNum = data.output.length;
						scope.gridOptions.totalItems = scope.page.totalNum;

						scope.reportItems = data.output;

					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				var lastSearchKey=null;
				var compareNumberList=[];
				var compareNotNumberList=[];
				this.getFcComparisonReport = function(scope) {
					var _this = this;
					if(scope.searchRequest.fcComparisonDocs.length < 2) {
						modalAlert(CommonService, 3, 'Please select at least two compare file.', null);
						return;
					}
					var param = _this.buildFcComparisonReportRequestParameter(scope);
					scope.gridOptions2.zsColumnFilterRequestParam =  angular.copy(param);
					var searchKey = FilterInGridService.getFilterParams(scope.gridApi2.grid);
			        for (var key in searchKey) {
			            param[key] = searchKey[key];
			        }
			        if(lastSearchKey){
			        	var isExistDifferent=false;
				        for (var key in param) {
				        	if(compareNumberList.indexOf(key)<0){
				            	 if(param[key]!=lastSearchKey[key]){
				            	 	isExistDifferent=true;
				            	 	break;
				            	 }
				        	}
				        }
				        if(!isExistDifferent){
				        	return;
				        }
			        }
			        lastSearchKey=angular.copy(param) ;
					scope.gridOptions2.showLoading = true;
					GLOBAL_Http($http, "cpo/api/customer_report/query_customer_forecast_comparison_report?", 'GET', param, function(data) {

						scope.gridOptions2.showLoading = false;
						if(scope.tabIndex != 5) {
							return;
						}
						var headers = [];
						compareNumberList=[];
						compareNotNumberList=[];
						angular.forEach(data.jsonExportEntries, function(item, index) {
							var col = {
								name: (item.headerName ? item.headerName : "") + index,
								displayName: item.headerName,
								field: item.jsonObjectKey,
								width: '150'
							};
							if(!isNaN(item.headerName.substr(0, 3))) {
								compareNumberList.push(item.jsonObjectKey);
								col.enableFiltering=true;
								col.filters = [{
										condition: uiGridConstants.filter.GREATER_THAN,
										placeholder: 'greater than'
									},
									{
										condition: uiGridConstants.filter.LESS_THAN,
										placeholder: 'less than'
									}
								];
							} else {
								compareNotNumberList.push(item.jsonObjectKey);
								col.enableFiltering = false;
								col.headerCellTemplate = 'app/worktable/filter.html';
							}
							headers.push(col);
						});
						angular.forEach(scope.gridApi2.grid.columns, function(item, index) {
							if(compareNotNumberList.indexOf(item.field)>-1){
								item.filters=[];
							}
						});
						scope.gridOptions2.columnDefs = angular.copy(headers);
						scope.fcComparisonData=data.output;
						scope.gridOptions2.totalItems = data.output.length;
						debugger;
					}, function(data) {
						scope.gridOptions2.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

				this.buildFcComparisonReportRequestParameter = function(scope) {
					var param = {
						group_by_field: listToString(scope.searchRequest.fcComparisonFields, "id"),
						compareField: scope.searchRequest.fcComparisonQuantityType.id,
						in_document_id: listToString(scope.searchRequest.fcComparisonDocs, "id")
					};
					if(scope.searchRequest.fromMonth) {
						param.fromMonth = scope.searchRequest.fromMonth;
					}
					if(scope.searchRequest.toMonth) {
						param.toMonth = scope.searchRequest.toMonth;
					}
					param.compareOrder=scope.compareOrder;
					debugger;
					return param;
				}

				this.searchlist = function(scope) {
					var _this = this;
					scope.page.pageSize = 20;
					scope.page.curPage = 1;

					_this.getCustomerForecastReport(scope);
				}
				this.selectDocumentChanged = function(scope) {
					scope.actualOpenFCSummaryReportDocumentId = scope.searchRequest.selectDoc.id;

					this.getActualOpenFCSummaryReport(scope);
				}
				this.getCustomerForecastDocuments = function(scope, tabIndex) {
					var _this = this;
					var param = {
						in_code: "CUSFCREPORTBYSUMMARY,FCCOMPARISONFIELD,FCCOMPARISONQUANTITY"
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {

						if(data.CUSFCREPORTBYSUMMARY) {
							scope.searchRequest.fcComparisonDocs = [];
							scope.docs = data.CUSFCREPORTBYSUMMARY;
							for(var i = 0; i < scope.docs.length; i++) {
								scope.docs[i].id = scope.docs[i].value;
							}
							scope.searchRequest.selectDoc = scope.docs[0];
							if(tabIndex == 5) {

							} else {
								_this.selectDocumentChanged(scope);
							}
						} else {
							scope.docs = [];
						}

						scope.fields = data.FCCOMPARISONFIELD;
						scope.searchRequest.fcComparisonFields = [];
						for(var i = 0; i < scope.fields.length; i++) {
							scope.fields[i].id = scope.fields[i].value;
						}
						scope.searchRequest.fcComparisonFields.push(scope.fields[0]);

						scope.fcComparisonQuantityTypes = data.FCCOMPARISONQUANTITY;
						for(var i = 0; i < scope.fcComparisonQuantityTypes.length; i++) {
							scope.fcComparisonQuantityTypes[i].id = scope.fcComparisonQuantityTypes[i].value;
						}
						scope.searchRequest.fcComparisonQuantityType = scope.fcComparisonQuantityTypes[0];
					});

				}
				this.initCustomerReport = function(scope) {
					var _this = this;

					var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'customerforcast_report_1', false, null, null);
					scope.gridOptions = {
						data: 'reportItems',
						paginationPageSizes: [20, 30, 40, 50, 100],
						paginationPageSize: 20,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						flatEntityAccess: true,
						fastWatch: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 1,
						totalItems: scope.page.totalNum,
						useExternalPagination: true,
						enablePagination: true,
						enablePaginationControls: true,

						columnDefs: staticColumns,
						onRegisterApi: function(gridApi) {
							scope.gridApi = gridApi;
							scope.gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
								if(sortColumns.length !== 0) {
									if(sortColumns[0].sort.direction === 'asc') {
										scope.page.sortDirection = true;
									}
									if(sortColumns[0].sort.direction === 'desc') {
										scope.page.sortDirection = false;
									}
									scope.page.sortColumn = sortColumns[0].displayName;
								}
							});
							scope.gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;

								if(scope.tabIndex == 1) {
									_this.getCustomerForecastReport(scope);
								} else if(scope.tabIndex == 2) {
									_this.getOpenFCSummaryReport(scope);
								} else if(scope.tabIndex == 3) {
									_this.getFCSummaryReport(scope);
								}

							});
						}
					};
					var url = "cpo/api/customer_report/query_customer_forecast_comparison_report_filter?";
					scope.gridOptions2 = {
						data: 'fcComparisonData',
						rowEditWaitInterval: -1,
						paginationPageSizes: [100000],
						paginationPageSize: 100000,
						enableRowSelection: true,
						flatEntityAccess: true,
						fastWatch: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: true,
						enableHorizontalScrollbar: 1,
						enableFiltering: true,
						enableVerticalScrollbar: 1,
						totalItems: scope.page.totalNum,
						useExternalPagination: false,
						enablePagination: true,
						enablePaginationControls: true,
						zsGridName: "customerForecastReportTwo",
						zsColumnFilterRequestUrl: url,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						columnDefs: [],
						onRegisterApi: function(gridApi) {
							scope.gridApi2 = gridApi;
							gridApi.core.on.filterChanged(scope, function(col) {
								_this.getFcComparisonReport(scope);
							});

						}
					};
				}

				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;
					scope.tabIndex = 1;
					scope.searchRequest = {
						selectDoc: {},
						searchWorkingNo: ""
					};
					scope.actualOpenFCSummaryReportDocumentId = 0;
					scope.page = {
						curPage: 1,
						pageSize: 20,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};

					scope.idPropertySettings = {
						smartButtonMaxItems: 100,
						smartButtonTextConverter: function(itemText, originalItem) {
							return itemText;
						},
						showCheckAll: false,
						showUncheckAll: false
					};
					scope.headerList = [];
					//					_this.getSeasonList(scope);
					scope.reportItems = [];
					scope.fcComparisonData=[];
					_this.initCustomerReport(scope);
					//	_this.getCustomerForecastReport(scope);
					//  _this.getOpenFCSummaryReport(scope);
				};
			}
		])
		.controller('customerForecastReportCtrl', ['$scope', 'CustomerForecastReportService',
			function($scope, CustomerForecastReportService) {
				$scope.exportFile = function() {
					CustomerForecastReportService.exportFile($scope);

				}
				$scope.fetchInfo = function(index) {
					$scope.tabIndex = index;
					$scope.gridOptions.useExternalPagination = true;
					//   CustomerForecastReportService.tabIndex = index;
					CustomerForecastReportService.resetPageInfo($scope);
					if(index < 4) {
						CustomerForecastReportService.fetchBatchDates($scope);
					} else if(index == 4) {
						$scope.gridOptions.useExternalPagination = false;
						CustomerForecastReportService.getCustomerForecastDocuments($scope);
					} else if(index == 5) {
						CustomerForecastReportService.getCustomerForecastDocuments($scope, index);
					}
				}
				$scope.searchActualOpenForecast = function() {
					CustomerForecastReportService.resetPageInfo($scope);
					CustomerForecastReportService.getActualOpenFCSummaryReport($scope);
				}
				$scope.selectBatchDate = function() {
					CustomerForecastReportService.selectBatchDate($scope);
				}
				$scope.searchlist = function() {
					CustomerForecastReportService.searchlist($scope);
				}
				$scope.selectDocumentChanged = function() {
					CustomerForecastReportService.selectDocumentChanged($scope);
				}
				$scope.search = function() {
					CustomerForecastReportService.getFcComparisonReport($scope);
				}
				$scope.compareOrderChange = function(compareOrder) {
					$scope.compareOrder=compareOrder;
					debugger;
				}
				CustomerForecastReportService.init($scope);
			}
		])
})();