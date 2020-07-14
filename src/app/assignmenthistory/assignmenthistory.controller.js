(function() {
	'use strict';
	angular
		.module('cpo')
		.service('assignmentHistoryService', ['uiGridConstants', '$http', '$translate', 'CommonService', '$uibModal', 'workTableCommonService',
			function(uiGridConstants, $http, $translate, CommonService, $uibModal, workTableCommonService) {
				this.selectTab = function(scope, Tab) {
					var _this = this;
					scope.activeTab = Tab;
					scope.orderType = '';
					if(Tab != '5' && Tab != '6') {
						_this.getOrderTypeList(scope);
					} else {
						_this.getBatchDate(scope);
						_this.searchlist(scope);
					}
					// if(Tab=='6'||Tab=='1'){
					//   _this.getBatchDate(scope);
					// }
				};
				this.getPageFromOrderType = function(scope, orderType) {
					var page = null;
					switch(orderType) {
						case 1:
							page = scope.page6;
							break;
						case 2:
							page = scope.page5;
							break;
						case 3:
							page = scope.page1;
							break;
						case 4:
							page = scope.page2;
							break;
						case 5:
							page = scope.page3;
							break;
						case 6:
							page = scope.page4;
							break;
					}
					return page;
				}
				this.getBatchDate = function(scope) {
					var _this = this;
					var orderType = null;
					switch(scope.activeTab) {
						case 5:
							orderType = "1";
							break;
						case 6:
							orderType = "2";
							break;
						case 1:
							orderType = "3";
							break;
						case 2:
							orderType = "4";
							break;
						case 3:
							orderType = "5";
							break;
						case 4:
							orderType = "6";
							break;
							defaults: orderType = Tab;
							break;
					}

					var params = {
						orderType: orderType
					}
					if(scope.orderType && scope.orderType.value && scope.orderType.value.length > 0) {
						params['orderActualType'] = scope.orderType.value;
					}

					GLOBAL_Http($http, "cpo/api/document/query_batch_date?", 'GET', params, function(data) {

						if(data.status && data.output && data.output.length > 0) {
							var result = data.output.map(function(item) {
								return {
									documentId: item.documentIds,
									label: item.batchDate.split(' ')[0]
								}

							})
							scope.batchDates = [{
								documentId: null,
								label: "All"
							}].concat(result);
							if(scope.batchDates.length > 1) {
								scope.batchDate = scope.batchDates[1];
							} else {
								scope.batchDate = scope.batchDates[0];
							}
							_this.searchlist(scope);

						} else {
							scope.batchDates = [{
								documentId: null,
								label: "All"
							}]
							scope.batchDate = scope.batchDates[0];
						}

					}, function(data) {
						scope.batchDates = [{
							documentId: null,
							label: "All"
						}];
						scope.batchDate = scope.batchDates[0];
					});

				}
				this.initMarketingforecastGrid = function(scope, i, gridData) {
					var _this = this;
					var hoverTemplate = document.getElementById("hoverTemplate").innerText;

					var url = "cpo/api/worktable/query_assignment_result_filter?";
					var param = {
						orderType: "1",
						eq_assign_result_status: "4",
						status: "4"

					};

					scope['gridOptions' + i] = {
						data: gridData,
						paginationPageSizes: [20, 50, 100, 200, 500],
						enableColumnMenus: true,
						paginationPageSize: 20,
						rowEditWaitInterval: -1,
						enableRowSelection: false,
						enableRowHeaderSelection: true,
						enableFullRowSelection: false,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: true,
						useExternalPagination: true,
						enablePaginationControls: true,
						expandableRowTemplate: '<div class="sub-ui-grid" ui-grid="row.entity.subGridOptions"></div>',
						expandableRowHeight: 150,
						zsColumnFilterRequestUrl: url,
						zsColumnFilterRequestParam: param,
						expandableRowScope: {
							subGridVariable: 'subGridScopeVariable1'
						},
						columnDefs: workTableCommonService.constructeAssignmentStaticColumns(scope, "assignMkfcOrder", true, 200),
						onRegisterApi: function(gridApi) {
							scope['gridApi' + i] = gridApi;
							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope['page' + i].curPage = newPage;
								scope['page' + i].pageSize = pageSize;
								_this.getAssignFactoryResult(scope, '1', '4', scope['page' + i]);
							});

							gridApi.core.on.filterChanged(scope, function(col) {
								var __this = this;
								var grid = __this.grid;
								var newsearchKey = CommonService.getFilterParams(grid);
								scope['gridOptions1'].searchKeys = newsearchKey;
								var page = _this.getPageFromOrderType(scope, 1);
								page.curPage = 1;
								_this.getAssignFactoryResult(scope, '1', '4', page);
							});
						}
					};

				};
				this.initCustomerforecastGrid = function(scope, i, gridData) {
					var _this = this;
					var hoverTemplate = document.getElementById("hoverTemplate").innerText;

					var url = "cpo/api/worktable/query_assignment_result_filter?";
					var param = {
						orderType: "2",
						eq_assign_result_status: "4",
						status: "4"

					};
					scope['gridOptions' + i] = {
						data: gridData,
						paginationPageSizes: [20, 50, 100, 200, 500],
						enableColumnMenus: true,
						searchKeys: [],
						paginationPageSize: 20,
						rowEditWaitInterval: -1,
						enableRowSelection: false,
						enableRowHeaderSelection: true,
						enableFullRowSelection: false,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: true,
						useExternalPagination: true,
						enablePaginationControls: true,
						zsColumnFilterRequestUrl: url,
						zsColumnFilterRequestParam: param,
						expandableRowTemplate: '<div class="sub-ui-grid" ui-grid="row.entity.subGridOptions"></div>',
						expandableRowHeight: 150,
						expandableRowScope: {
							subGridVariable: 'subGridScopeVariable1'
						},
						columnDefs: workTableCommonService.constructeAssignmentStaticColumns(scope, "assignCustomerforecast", true, 200),
						onRegisterApi: function(gridApi) {
							scope['gridApi' + i] = gridApi;
							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope['page' + i].curPage = newPage;
								scope['page' + i].pageSize = pageSize;
								_this.getAssignFactoryResult(scope, '2', '4', scope['page' + i]);
							});
							gridApi.core.on.filterChanged(scope, function(col) {
								var __this = this;
								var grid = __this.grid;
								var newsearchKey = CommonService.getFilterParams(grid);
								scope['gridOptions2'].searchKeys = newsearchKey;
								var page = _this.getPageFromOrderType(scope, 2);
								page.curPage = 1;
								_this.getAssignFactoryResult(scope, '2', '4', page);
							});

						}
					};
				};

				this.getSeasonList = function(scope) {
					var _this = this;
					GLOBAL_Http($http, "cpo/api/worktable/query_season?", 'GET', {}, function(data) {
						if(data.status == 0) {
							if(data.output) {
								scope.seasonList = data.output;
								for(var i = 0; i < scope.seasonList.length; i++) {
									scope.seasonList[i].label = scope.seasonList[i].label;
									scope.seasonList[i].value = scope.seasonList[i].value;
								}
								scope.season = scope.seasonList[0];

								// _this.getAssignFactoryResult(scope , '1' , '4' , scope.page5);
								// _this.getAssignFactoryResult(scope , '2' , '4' , scope.page6)
								// _this.getAssignFactoryResult(scope , '3' , '4' , scope.page1);
								// _this.getAssignFactoryResult(scope , '4' , '4' , scope.page2);
								// _this.getAssignFactoryResult(scope , '5' , '4' , scope.page3);
								// _this.getAssignFactoryResult(scope , '6' , '4' , scope.page4);

								var monthly = [];
								var seasonStr = scope.season.value.substring(0, 2);
								var dateStr = scope.season.value.substring(2, scope.season.value.length);
								var intDate = parseInt(dateStr) + 1;
								if(seasonStr.trim() == "FW") {
									for(var j = 3; j < 9; j++) {
										var FWdate = "20" + (intDate - 1) + "0" + j;
										monthly.push(FWdate);
									}
								} else if(seasonStr.trim() == "SS") {
									for(var j = 9; j < 13; j++) {
										var zeroStr = "0" + j;
										if(j > 9) {
											zeroStr = "" + j;
										}
										var SSdate = "20" + (intDate - 1) + zeroStr;
										monthly.push(SSdate);
									}
									monthly.push("20" + intDate + "01");
									monthly.push("20" + intDate + "02");
								}
								var columnDefs = angular.copy(scope.gridOptions5.columnDefs);
								for(var i = 0; i < columnDefs.length; i++) {
									if('AAA0' == columnDefs[i].name) {
										columnDefs.splice(i, 6);
										break;
									}
								}
								for(var i = 0; i < monthly.length; i++) {
									var column = {
										name: ('AAA' + i),
										displayName: monthly[i],
										field: 'likelyVol' + (i + 1),
										minWidth: '100',
										enableCellEdit: false,
										filters: [{
											condition: uiGridConstants.filter.CONTAINS,
											placeholder: ''
										}]
									}
									columnDefs.push(column);
								}
								scope.gridOptions5.columnDefs = columnDefs;

							} else {
								scope.seasonList = [];
							}
						} else {
							var message = data.message;
							if(message) {
								modalAlert(CommonService, 3, message, null);
							}
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.getRoundList = function(scope) {
					scope.roundList = [{
						label: "All",
						value: ""
					}, {
						label: "1",
						value: "1"
					}, {
						label: "2",
						value: "2"
					}, {
						label: "3",
						value: "3"
					}, {
						label: "4",
						value: "4"
					}];
					scope.round = scope.roundList[0];
				}

				this.exportFile = function(scope) {
					var tabValue = "";
					var documentType = '';
					var param;
					switch(scope.activeTab) {
						case 5:
							param = angular.copy(scope.exportFileParams[1]);
							param['orderType'] = '1';
							param['documentType'] = '201';
							tabValue = "1";
							break;
						case 6:
							param = angular.copy(scope.exportFileParams[2]);
							param['orderType'] = '2';
							param['documentType'] = '202';
							tabValue = "2";
							break;
						case 1:
							param = angular.copy(scope.exportFileParams[3]);
							param['orderType'] = '3';
							param['documentType'] = '203';
							tabValue = "3";
							break;
						case 2:
							param = angular.copy(scope.exportFileParams[4]);
							param['orderType'] = '4';
							param['documentType'] = '204';
							tabValue = "4";
							break;
						case 3:
							param = angular.copy(scope.exportFileParams[5]);
							param['orderType'] = '5';
							param['documentType'] = '205';
							tabValue = "5";
							break;
						case 4:
							param = angular.copy(scope.exportFileParams[6]);
							param['orderType'] = '6';
							param['documentType'] = '206';
							tabValue = "6";
							break;
							defaults: tabValue = Tab;
							break;
					}

					for(var key in param) {
						if(param[key] == "All") {
							delete param[key]
						}
					}
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

					//  exportExcel(param, "cpo/portal/document/export_file?", "_blank");
				}
				this.getOrderTypeList = function(scope) {
					var _this = this;
					var param = {
						in_code: 'ASSIGNMENTHISTORYORDERTYPE-' + scope.activeTab
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
						if(data["ASSIGNMENTHISTORYORDERTYPE-" + scope.activeTab].length > 0) {
							var orderType = {
								label: "All",
								value: ""
							};
							data["ASSIGNMENTHISTORYORDERTYPE-" + scope.activeTab].unshift(orderType);
							scope.orderTypeList = data["ASSIGNMENTHISTORYORDERTYPE-" + scope.activeTab];
							scope.orderType = scope.orderTypeList[1];
							_this.getBatchDate(scope);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.initBulkOrderGrid = function(scope, i) {
					var _this = this;
					var hoverTemplate = document.getElementById("assignmentHistoryHoverTemplate").innerText;

					var url = "cpo/api/worktable/query_assignment_result_filter?";
					var param = {
						orderType: "3",
						eq_assign_result_status: "4",
						status: "4"

					};
					var columnDefs = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", true, 200);
					var column = {
						"field": "manualOrderStatus",
						"displayName": "Manual Order Status",
						width: '100',
						enableCellEdit: false,
						enableSorting: false,
						headerCellTemplate: 'app/worktable/filter.html'
					};
					columnDefs.unshift(column);
					scope['gridOptions' + i] = {
						data: 'bulkOrder',
						paginationPageSizes: [20, 50, 100, 200, 500],
						enableColumnMenus: true,
						paginationPageSize: 50,
						rowEditWaitInterval: -1,
						enableRowSelection: false,
						enableRowHeaderSelection: true,
						enableFullRowSelection: false,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: true,
						zsColumnFilterRequestUrl: url,
						zsColumnFilterRequestParam: param,
						useExternalPagination: true,
						enablePaginationControls: true,
						columnDefs: columnDefs,
						onRegisterApi: function(gridApi) {
							scope['gridApi' + i] = gridApi;
							gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
								if(sortColumns.length !== 0) {
									if(sortColumns[0].sort.direction === 'asc') {
										scope['page' + i].sortDirection = true;
									}
									if(sortColumns[0].sort.direction === 'desc') {
										scope['page' + i].sortDirection = false;
									}
									scope['page' + i].sortColumn = sortColumns[0].displayName;
								}
							});
							gridApi.selection.on.rowSelectionChanged(scope, function(row, event) {
								//行选中事件
								//								_this.rowSelect(scope, row.Entity);
							});
							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope['page' + i].curPage = newPage;
								scope['page' + i].pageSize = pageSize;
								_this.getAssignFactoryResult(scope, '3', '4', scope['page' + i]);
							});
							gridApi.core.on.filterChanged(scope, function(col) {
								var __this = this;
								var grid = __this.grid;
								var newsearchKey = {};

								var newsearchKey = CommonService.getFilterParams(grid);
								scope['gridOptions3'].searchKeys = newsearchKey;

								var page = _this.getPageFromOrderType(scope, 3);
								page.curPage = 1;
								_this.getAssignFactoryResult(scope, '3', '4', page);

							});
						}
					};
				};

				this.searchlist = function(scope) {
					var _this = this;
					var page = {
						pageSize: "20",
						curPage: "1"
					};
					var tabValue = "";
					switch(scope.activeTab) {
						case 5:
							tabValue = "1";
							break;
						case 6:
							tabValue = "2";
							break;
						case 1:
							tabValue = "3";
							break;
						case 2:
							tabValue = "4";
							break;
						case 3:
							tabValue = "5";
							break;
						case 4:
							tabValue = "6";
							break;
							defaults: tabValue = Tab;
							break;
					}
					_this.getAssignFactoryResult(scope, tabValue, '4', page);
					if(tabValue == "1") {
						var monthly = [];
						var seasonStr = scope.season ? scope.season.value.substring(0, 2) : "";
						var dateStr = scope.season ? scope.season.value.substring(2, scope.season.value.length) : "";
						var intDate = parseInt(dateStr) + 1;
						if(seasonStr.trim() == "FW") {
							for(var j = 3; j < 9; j++) {
								var FWdate = "20" + (intDate - 1) + "0" + j;
								monthly.push(FWdate);
							}
						} else if(seasonStr.trim() == "SS") {
							for(var j = 9; j < 13; j++) {
								var zeroStr = "0" + j;
								if(j > 9) {
									zeroStr = "" + j;
								}
								var SSdate = "20" + (intDate - 1) + zeroStr;
								monthly.push(SSdate);
							}
							monthly.push("20" + intDate + "01");
							monthly.push("20" + intDate + "02");
						}
						var columnDefs = angular.copy(scope.gridOptions5.columnDefs);
						for(var i = 0; i < columnDefs.length; i++) {
							if('AAA0' == columnDefs[i].name) {
								columnDefs.splice(i, 6);
								break;
							}
						}

						for(var i = 0; i < monthly.length; i++) {
							var column = {
								name: ('AAA' + i),
								displayName: monthly[i],
								field: 'likelyVol' + (i + 1),
								minWidth: '100',
								enableCellEdit: false,
								cellTemplate: hoverTemplate,
								filters: [{
									condition: uiGridConstants.filter.CONTAINS,
									placeholder: ''
								}]
							}
							columnDefs.push(column);
						}
						scope.gridOptions5.columnDefs = columnDefs;
					}
				}

				this.transferDocumnet = function(scope) {
					var _this = this;
					var selectedRows = null; //scope.gridApi5.selection.getSelectedRows();
					var ids = new Array();
					if(scope.activeTab == 1) {
						selectedRows = scope.gridApi1.selection.getSelectedRows();
					} else if(scope.activeTab == 2) {
						selectedRows = scope.gridApi2.selection.getSelectedRows();
					} else if(scope.activeTab == 3) {
						selectedRows = scope.gridApi3.selection.getSelectedRows();
					} else if(scope.activeTab == 4) {
						selectedRows = scope.gridApi4.selection.getSelectedRows();
					};
					if(selectedRows.length < 1) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}

					for(var index in selectedRows) {
						var row = selectedRows[index];
						ids.push(row.factAssignId);
					}
					var param = {
						documentType: scope.orderType.value,
						pageNo: '1',
						pageSize: '100000'
					}
					GLOBAL_Http($http, "cpo/api/document/query_document?", 'GET', param, function(data) {
						if(data.output && data.output.documents && data.output.documents.length > 0) {

							scope.documents = data.output.documents.map(function(item) {
								return {
									id: item.documentId,
									label: item.documentOldName + " (" + new Date(item.utcCreate).toLocaleDateString() + ")"
								}
							});
							var topScope = scope;
							var modalInstance = $uibModal.open({
								animation: true,
								ariaLabelledBy: 'modal-title',
								ariaDescribedBy: 'modal-body',
								templateUrl: 'transfer-document.html',
								size: "md",
								controller: function($scope, $uibModalInstance) {

									$scope.documents = topScope.documents;
									$scope.selectDocument = $scope.documents[0];

									$scope.submit = function() {

										$uibModalInstance.resolve({
											documentId: $scope.selectDocument.id
										});
										$uibModalInstance.dismiss();
									};
									$scope.dismiss = function() {
										$uibModalInstance.dismiss();
									}

								}

							});

							modalInstance.resolve = function(result) {

								var documentId = result.documentId;

								var param = {
									documentId: documentId,
									ids: ids.join(",")
								}
								GLOBAL_Http($http, "cpo/api/worktable/transfer_order_document", 'POST', param, function(data) {
									if(data.status == 0) {
										modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
										_this.searchlist(scope);
									} else {
										modalAlert(CommonService, 2, data.message, null);
									}
								}, function(data) {

									modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
								});

							}

						} else {
							var message = data.message ? data.message : $translate.instant('errorMsg.NO_ARTICLE_SEASON_IN_RANGEE_FOUND');
							modalAlert(CommonService, 2, message, null);
						}
					}, function(data) {

						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.initSampleOrderGrid = function(scope, i, gridData) {
					var _this = this;

					var url = "cpo/api/worktable/query_assignment_result_filter?";
					var status = null;
					switch(i) {
						case 2:
							status = 4;
							break;
						case 3:
							status = 5;
							break;
						case 4:
							status = 6;
							break;
					}
					var param = {
						orderType: status,
						eq_assign_result_status: "4",
						status: "4"
					};

					var hoverTemplate = document.getElementById("assignmentHistoryHoverTemplate").innerText;
					scope['gridOptions' + i] = {
						data: gridData,
						paginationPageSizes: [20, 50, 100, 200, 500],
						enableColumnMenus: true,
						enableGridMenu: true,
						paginationPageSize: 50,
						rowEditWaitInterval: -1,
						enableRowSelection: false,
						enableRowHeaderSelection: true,
						enableFullRowSelection: false,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						zsColumnFilterRequestUrl: url,
						zsColumnFilterRequestParam: param,
						totalItems: scope.page.totalNum,
						enablePagination: true,
						useExternalPagination: true,
						enablePaginationControls: true,
						expandableRowTemplate: '<div class="sub-ui-grid" ui-grid="row.entity.subGridOptions"></div>',
						expandableRowHeight: 150,
						expandableRowScope: {
							subGridVariable: 'subGridScopeVariable1'
						},
						columnDefs: workTableCommonService.constructeAssignmentStaticColumns(scope, "assignSampleorderforecast", true, 150),
						onRegisterApi: function(gridApi) {
							scope['gridApi' + i] = gridApi;
							gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
								if(sortColumns.length !== 0) {
									if(sortColumns[0].sort.direction === 'asc') {
										scope['page' + i].sortDirection = true;
									}
									if(sortColumns[0].sort.direction === 'desc') {
										scope['page' + i].sortDirection = false;
									}
									scope['page' + i].sortColumn = sortColumns[0].displayName;
								}
							});
							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								var page = _this.getPageFromOrderType(scope, i);

								page.curPage = newPage;
								page.pageSize = pageSize;
								_this.getAssignFactoryResult(scope, i, '4', page);
							});
							gridApi.core.on.filterChanged(scope, function(col) {
								var __this = this;
								var grid = __this.grid;

								var newsearchKey = CommonService.getFilterParams(grid);
								scope['gridOptions' + i].searchKeys = newsearchKey;

								var page = _this.getPageFromOrderType(scope, i);
								page.curPage = 1;
								_this.getAssignFactoryResult(scope, i, '4', page);

							});
						}
					};
				}
				this.getAssignFactoryResult = function(scope, type, status, page) {
					scope.showLoading = true;
					var param = {
						orderType: type,
						pageSize: page.pageSize,
						pageNo: page.curPage,
						eq_assign_result_status: "4",
						status: "4"
					};
					// if ( type == '1' ||type=="2") {
					//   param[ 'eq_assign_result_status' ] = 4;
					// } else {
					//   param[ 'status' ] = 4;
					// }

					if(scope.workingNo) {
						param['like_workingNo'] = scope.workingNo;
					}

					if(scope.orderType) {
						if(scope.orderType.label != '') {
							param['order_actual_type'] = scope.orderType.label;
						}
					}

					if(scope.activeTab != 5 && scope.activeTab != 6) {
						if(scope.po) {
							param['like_po'] = scope.po;
						}
					}

					if(scope.activeTab != 5 && scope.activeTab != 6) {
						if(scope.pos) {
							param['in_po'] = scope.pos.replace(',', '**').replace('\n', '**').replace(' ', '**');
							debugger;
						}
					}

					if(scope.batchDate) {
						if(scope.batchDate.documentId && scope.batchDate.documentId != '') {
							param['eq_document_id'] = scope.batchDate.documentId;
						}
					}

					for(var key in param) {
						if(param[key] == "All") {
							delete param[key]
						}
					}
					var _this = this;
					for(var attr in scope['gridOptions' + type].searchKeys) {
						if(scope['gridOptions' + type].searchKeys[attr]) {
							param[attr] = urlCharTransfer(scope['gridOptions' + type].searchKeys[attr]);
						}
					}

					scope.exportFileParams[type] = angular.copy(param);
					scope.exportFileParams[type].orderType = param.orderType;
					delete scope.exportFileParams[type].pageSize;
					delete scope.exportFileParams[type].pageNo;

					//设置过滤参数
					switch(type) {
						case '1':
							{
								scope.gridOptions5.zsColumnFilterRequestParam = angular.copy(scope.exportFileParams[type]);
								break;
							}
						case '2':
							{
								scope.gridOptions6.zsColumnFilterRequestParam = angular.copy(scope.exportFileParams[type]);

								break;
							}
						case '3':
							{
								scope.gridOptions1.zsColumnFilterRequestParam = angular.copy(scope.exportFileParams[type]);
								break;
							}
						case '4':
							{
								scope.gridOptions2.zsColumnFilterRequestParam = angular.copy(scope.exportFileParams[type]);

								break;
							}
						case '5':
							{
								scope.gridOptions3.zsColumnFilterRequestParam = angular.copy(scope.exportFileParams[type]);

								break;
							}
						case '6':
							{
								scope.gridOptions4.zsColumnFilterRequestParam = angular.copy(scope.exportFileParams[type]);
								break;
							}
					}

					GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

						if(data.output) {

							switch(type) {
								case '1':
									{
										scope.mkcfcOrder = translateData(data.output);
										scope.gridOptions5.data = scope.mkcfcOrder;
										scope.page5.totalNum = data.total;
										scope.gridOptions5.totalItems = scope.page5.totalNum;
										// if ( data.total > 0 ) {
										//   var height = (page.pageSize * 30) + 36;
										//   $("#assignmentHistoryGrid5").css('height' , height + 'px');
										// }

										break;
									}
								case '2':
									{
										scope.gridOptions6.columnDefs = workTableCommonService.constructeAssignmentStaticColumns(scope, "assignCustomerforecast", true, 150);
										scope.cusOrder = translateData(data.output);
										scope.gridOptions6.data = scope.cusOrder;
										scope.page6.totalNum = data.total;
										scope.gridOptions6.totalItems = scope.page6.totalNum;

										if(data.sizeListCount) {

											workTableCommonService.cusorderDynamicColumnsForAChinaBuyPlan(data.sizeListCount, scope.gridOptions6);

											if(scope.gridOptions6.data && scope.gridOptions6.data.length > 0) {
												for(var index in scope.gridOptions6.data) {
													var item = scope.gridOptions6.data[index];
													var aChinaBuyPlanSizes = item.aChinaBuyPlanSizes;
													if(aChinaBuyPlanSizes) {
														for(var index2 = 0; index2 < aChinaBuyPlanSizes.length; index2++) {
															var xx = aChinaBuyPlanSizes[index2];

															if(xx) {
																item['SIZENAME_' + (index2 + 1)] = xx.sizename ? xx.sizename : "";
																item["OQTY_" + (index2 + 1)] = xx.sizequantity ? xx.sizequantity : "";
															}
														}
													}
												}
											}
										}

										break;
									}
								case '3':
									{
										scope.bulkOrder = translateData(data.output);
										scope.gridOptions1.data = scope.bulkOrder;
										scope.page1.totalNum = data.total;
										scope.gridOptions1.columnDefs = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", true, 200);
										workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions1);
										var column = {
											"field": "manualOrderStatus",
											"displayName": "Manual Order Status",
											width: '100',
											enableCellEdit: false,
											enableSorting: false,
											headerCellTemplate: 'app/worktable/filter.html'
										};
										scope.gridOptions1.columnDefs.unshift(column);
										for(var index in scope.bulkOrder) {
											var item = scope.bulkOrder[index];
											var manufacturingSize = item.ediOrderSizes;
											if(manufacturingSize) {
												for(var index2 = 0; index2 < manufacturingSize.length; index2++) {
													var xx = manufacturingSize[index];

													if(xx) {
														item["OQTY_" + (index2 + 1)] = xx.sizeQuantity ? xx.sizeQuantity : "";
														item["TS_" + (index2 + 1)] = xx.manufacturingSize ? xx.manufacturingSize : "";
													}
												}
											}
										}

										scope.gridOptions1.totalItems = scope.page1.totalNum;
										// if ( data.total > 0 ) {
										//   var height = (page.pageSize * 30) + 36;
										//   $("#assignmentHistoryGrid1").css('height' , height + 'px');
										// }
										break;
									}
								case '4':
									{
										scope.sampleOrder = translateData(data.output);
										scope.gridOptions2.data = scope.sampleOrder
										scope.page2.totalNum = data.total;
										scope.gridOptions2.totalItems = scope.page2.totalNum;
										// if ( data.total > 0 ) {
										//   var height = (page.pageSize * 30) + 36;
										//   $("#assignmentHistoryGrid2").css('height' , height + 'px');
										// }
										break;
									}
								case '5':
									{
										scope.miOrder = translateData(data.output);
										scope.gridOptions3.data = scope.miOrder
										scope.page3.totalNum = data.total;
										scope.gridOptions3.totalItems = scope.page3.totalNum;
										// if ( data.total > 0 ) {
										//   var height = (page.pageSize * 30) + 36;
										//   $("#assignmentHistoryGrid3").css('height' , height + 'px');
										// }
										break;
									}
								case '6':
									{
										scope.nonTradeCardOrder = translateData(data.output);
										scope.gridOptions4.data = scope.nonTradeCardOrder;
										scope.page4.totalNum = data.total;
										scope.gridOptions4.totalItems = scope.page4.totalNum;
										// if ( data.total > 0 ) {
										//   var height = (page.pageSize * 30) + 36;
										//   $("#assignmentHistoryGrid4").css('height' , height + 'px');
										// }
										break;
									}
							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
						scope.showLoading = false;
					}, function(data) {
						scope.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.init = function(scope) {
					var _this = this;

					for(var i = 1; i < 7; i++) {
						scope['page' + i] = {
							curPage: 1,
							pageSize: 20,
							sortColumn: 'id',
							sortDirection: true,
							totalNum: 0
						};
					}
					scope.bulkOrder = [];
					scope.sampleOrder = [];
					scope.miOrder = [];
					scope.nonTradeCardOrder = [];
					scope.mkcfcOrder = [];
					scope.cusOrder = [];
					scope.showLoading = false;
					scope.exportFileParams = {};
					_this.initBulkOrderGrid(scope, 1);
					_this.initSampleOrderGrid(scope, 2, scope.sampleOrder);
					_this.initSampleOrderGrid(scope, 3, scope.miOrder);
					_this.initSampleOrderGrid(scope, 4, scope.nonTradeCardOrder);
					_this.initMarketingforecastGrid(scope, 5, scope.mkcfcOrder);
					_this.initCustomerforecastGrid(scope, 6, scope.cusOrder);
					_this.getRoundList(scope);
					_this.getSeasonList(scope);
					$("#orderTypeSelect").hide();
					scope.activeTab = 5;

					scope.$watch('orderType', function() {
						if(scope.orderType == "") {
							return;
						}
						_this.getBatchDate(scope);
						_this.searchlist(scope);
					});

				};

				this.changeManualOrderStatus = function(scope) {
					var _this = this;
					var selectedRows = null; //scope.gridApi5.selection.getSelectedRows();
					var ids = new Array();
					var assignResultIds=new Array();
					if(scope.activeTab == 1) {
						selectedRows = scope.gridApi1.selection.getSelectedRows();
					}
					if(selectedRows.length < 1) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}

					for(var index in selectedRows) {
						var row = selectedRows[index];
						ids.push(row.orderMasterId);
						assignResultIds.push(row.assignResultId);
					}

					var _this = this;
					var param = {
						in_code: 'ManualOrderStatus'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
						scope.orderStatusList = data['ManualOrderStatus'];
						var topScope = scope;
						var modalInstance = $uibModal.open({
							animation: true,
							ariaLabelledBy: 'modal-title',
							ariaDescribedBy: 'modal-body',
							templateUrl: 'changeOrderStatus.html',
							size: "md",
							controller: function($scope, $uibModalInstance) {

								$scope.orderStatusList = topScope.orderStatusList;
								$scope.selectOrderStatus = $scope.orderStatusList[0];

								$scope.submit = function(selectOrderStatus) {
									$uibModalInstance.resolve({
										orderStatus: selectOrderStatus.label
									});
									$uibModalInstance.dismiss();
								};
								$scope.dismiss = function() {
									$uibModalInstance.dismiss();
								}

							}

						});

						modalInstance.resolve = function(result) {
							var manualOrderStatus = result.orderStatus;

							var param = {
								ids: ids.join(","),
								assignResultIds:assignResultIds.join(","),
								orderStatus: manualOrderStatus
							}
							GLOBAL_Http($http, "cpo/api/worktable/change_manual_order_status", 'POST', param, function(data) {
								if(data.status == 0) {
									modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
									_this.searchlist(scope);
								} else {
									modalAlert(CommonService, 2, data.message, null);
								}
							}, function(data) {

								modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
							});

						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

			}
		])
		.controller('assignmentHistoryCtrl', ['$scope', 'assignmentHistoryService',
			function($scope, assignmentHistoryService) {
				$scope.selectTab = function(Tab) {
					if(Tab == 5 || Tab == 4) {
						$("#orderTypeSelect").hide();
					} else {
						$("#orderTypeSelect").show();
					}
					assignmentHistoryService.selectTab($scope, Tab);
				}
				$scope.changeOrderActualType = function() {

				}
				$scope.exportFile = function(scope) {
					assignmentHistoryService.exportFile($scope);
				}
				$scope.searchlist = function() {
					assignmentHistoryService.searchlist($scope);
				}
				$scope.transferDocumnet = function() {
					assignmentHistoryService.transferDocumnet($scope);
				}
				$scope.changeManualOrderStatus = function() {
					assignmentHistoryService.changeManualOrderStatus($scope);
				}
				assignmentHistoryService.init($scope);
			}
		])
})();