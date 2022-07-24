(function() {
	'use strict';
	angular
		.module('cpo')
		.service('CustomerForecastService', ["$timeout", '$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants', 'factoryCapacityService', 'workTableCommonService',
			function($timeout, $http, $translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants, factoryCapacityService, workTableCommonService) {
				var searchKey2 = {};
				var searchKey3 = {};
				var searchKey4 = {};
				var searchKey5 = {};
				var searchKey6 = {};
				var searchKey7 = {};
				var searchKey8 = {};
				var searchKey9 = {};

				this.disableReleaseOrderButton = false;

				this.getSelectedData = function(scope) {
					GLOBAL_Http($http, "cpo/api/criteria/query_criteria_version?", 'GET', {}, function(data) {
						if(data.status == 0) {
							if(data.output) {
								scope.versionList = data.output.criteriaVersions;
								for(var i = 0; i < scope.versionList.length; i++) {
									scope.versionList[i].label = scope.versionList[i].versionName;
									scope.versionList[i].id = scope.versionList[i].criteriaVersionId;
								}
								scope.version = scope.versionList[0];
							} else {
								scope.versionList = [];
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

				this.importFile = function(scope) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'FileModal',
						controller: 'FileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: "502"
								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {

						if(returnData) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
							_this.refreshAll(scope);
						}
					}, function() {});

				}
				this.initGripOptionZero = function(scope) {
					var blueGreenTemplate = document.getElementById("blueGreenTemplate").innerText;
					var isNewTemplate = document.getElementById("isNewTemplate").innerText;
					var linkLabelTemplate = document.getElementById("linkLabelTemplate").innerText;
					var functionButtonTemplate = document.getElementById("functionButtonTemplate").innerText;
					scope.gridOptions = {
						data: 'DocumentData',
						enableColumnMenus: false,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableFullRowSelection: true,
						enableRowHeaderSelection: false,
						enableHorizontalScrollbar: 0,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: false,
						useExternalPagination: false,
						enablePaginationControls: false,
						columnDefs: [{
								name: 'documentType',
								displayName: $translate.instant('worktable.DOCUMENT'),
								field: 'documentTypeName',
								minWidth: '100',
								enableCellEdit: false,
								cellTemplate: blueGreenTemplate
							}, {
								name: 'isNew',
								displayName: "",
								field: 'documentStatus',
								width: '60',
								minWidth: '60',
								enableCellEdit: false,
								cellTemplate: isNewTemplate
							},
							{
								name: 'documentVersion',
								displayName: $translate.instant('worktable.LASTEST_VERSION'),
								field: 'documentName',
								minWidth: '100',
								enableCellEdit: false,
								cellTemplate: linkLabelTemplate
							},
							{
								name: 'season',
								displayName: $translate.instant('documentlibrary.SEASON'),
								field: 'season',
								enableCellEdit: false
							},
							{
								name: 'batchDate',
								displayName: "Batch Date",
								field: 'orderDate',
								enableCellEdit: false
							},
							{
								name: 'resource',
								displayName: $translate.instant('documentlibrary.RESOURCE'),
								field: 'source',
								enableCellEdit: false
							},
							{
								name: 'updateTime',
								displayName: $translate.instant('worktable.UPDATE_TIME'),
								field: 'utcUpdate',
								minWidth: '100',
								enableCellEdit: false,
							},
							{
								name: 'uploadType',
								displayName: "",
								field: 'uploadType',
								minWidth: '220',
								enableCellEdit: false,
								cellTemplate: functionButtonTemplate
							}
						],
						onRegisterApi: function(gridApi) {
							scope.gridApi0 = gridApi;
							scope.gridApi0.core.on.sortChanged(scope, function(grid, sortColumns) {
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
							scope.gridApi0.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
							});
						}
					};
				};

				this.initGripOptionTwo = function(scope, i, gridData) {
					var _this = this;
					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverPercentTemplate = document.getElementById("hoverPercentTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;
					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "customerforecast", true, 150);

					var status = null;
					var param = {
						orderType: "2"
					};
					switch(i) {
						case 2:
							status = "0,3";
							break;
						case 3:
							status = "2";
							break;
						case 7:
							status = "4";
							break;
						case 8:
							status = "5";
							break;
						case 9:
							{
								status = "5";
								param['in_new_factory'] = 'BYS**BYG**BVN**BCA';
								break;
							}
					}
					param['status'] = status;
					var url = "cpo/api/worktable/query_assignment_result_filter?";

					scope['gridOptions' + i] = {
						data: gridData,
						paginationPageSizes: [10, 20, 50, 100, 200, 500, 1000, 2000],
						enableColumnMenus: true,
						enableGridMenu: true,
						showLoading: false,
						paginationPageSize: 100,
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
						columnDefs: staticColumns,

						onRegisterApi: function(gridApi) {
							scope['gridApi' + i] = gridApi;
							gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {

								sortParams(sortColumns, function(sortKeyParam, orderParam) {
									scope.sortKey = sortKeyParam ? sortKeyParam : null;
									scope.order = orderParam ? orderParam : null;
									if(i == 2) {
										_this.getAssignFactoryResult(scope, '2', '0,3', scope.page2, 1, true);
									} else {
										_this.getAssignFactoryResult(scope, '2', 2, scope.page3, 2, true);
									}
								});

							});
							gridApi.selection.on.rowSelectionChanged(scope, function(row, event) {
							});

							gridApi.expandable.on.rowExpandedStateChanged(scope, function(row) {
								if(row.isExpanded) {
									row.entity.subGridOptions = {
										enableColumnMenus: true,
										rowEditWaitInterval: -1,
										enableRowSelection: false,
										enableRowHeaderSelection: false,
										enableFullRowSelection: false,
										enableHorizontalScrollbar: 1,
										gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
										enableVerticalScrollbar: 0,
										columnDefs: [{
												name: 'LAST_MFC_VERSION',
												displayName: $translate.instant('worktable.LAST_MFC_VERSION'),
												field: 'documentName',
												minWidth: '100',
												enableCellEdit: false
											},
											{
												name: 'forecast_quantity',
												displayName: $translate.instant('worktable.FORECAST_QUANTITY'),
												field: 'forecastQty',
												minWidth: '100',
												enableCellEdit: false
											},
											{
												name: 'order_quantity',
												displayName: $translate.instant('worktable.ORDER_QUANTITY'),
												field: 'totalQty',
												minWidth: '100',
												enableCellEdit: false
											},
											{
												name: 'open_forecast_quantity',
												displayName: $translate.instant('worktable.OPEN_FORECAST_QUANTITY'),
												field: 'openForecastQty',
												minWidth: '100',
												enableCellEdit: false
											},
											{
												name: 'suggFactory',
												displayName: $translate.instant('worktable.SYSTEM_RESULT'),
												field: 'suggFactory',
												minWidth: '100',
												enableCellEdit: false
											},
											{
												name: 'lastProdFactory',
												displayName: $translate.instant('worktable.LAST_PRODUCTION'),
												field: 'lastProdFactory',
												minWidth: '100',
												enableCellEdit: false
											},
											{
												name: 'aSource',
												displayName: $translate.instant('worktable.A_SOURCE'),
												field: 'aSource',
												minWidth: '100',
												enableCellEdit: false
											},
											{
												name: 'finalConfirmation',
												displayName: $translate.instant('worktable.FINAL_CONFIRMATION'),
												field: 'confirmFactory',
												minWidth: '100',
												enableCellEdit: false
											},
											{
												name: 'updateTime',
												displayName: $translate.instant('worktable.UPDATE_TIME'),
												field: 'utcUpdate',
												minWidth: '100',
												enableCellEdit: false,
											},
										]
									};
									row.entity.subGridOptions.data = row.entity.preOrders;
								}
							});

							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {

								scope['page' + i].curPage = newPage;
								scope['page' + i].pageSize = pageSize;

								switch(i) {
									case 2:
										{
											_this.getAssignFactoryResult(scope, '2', '0,3', scope.page2, false);
											break;
										}
									case 3:
										{
											_this.getAssignFactoryResult(scope, '2', 2, scope.page3, false);
											break;
										}
									case 7:
										{
											_this.getTransitOrder(scope, scope.page7, 4, false,5);
											break;
										}
									case 8:
										{
											_this.getTransitOrder(scope, scope.page8, 5, false,6);
											break;
										}
									case 9:
										{
											_this.getTransitOrder(scope, scope.page9, '4,5', false,7);
											break;
										}
								}
							});

							gridApi.core.on.filterChanged(scope, function(col) {

								if(angular.isDefined(scope.filterTimeout)) {
									$timeout.cancel(scope.filterTimeout);
								}
								var __this = this;
								scope.filterTimeout = $timeout(function() {
									var grid = __this.grid;
									var newsearchKey = CommonService.getFilterParams(grid);

									if(i == 2) {
										if(!angular.equals(searchKey2, newsearchKey)) {
											searchKey2 = newsearchKey;
											_this.getAssignFactoryResult(scope, '2', '0,3', scope.page2, true);
										}
									} else if(i == 3) {
										if(!angular.equals(searchKey3, newsearchKey)) {
											searchKey3 = newsearchKey;
											_this.getAssignFactoryResult(scope, '2', 2, scope.page3, true);
										}
									} else if(i == 7) {
										searchKey7 = newsearchKey;
										_this.getTransitOrder(scope, scope.page7, 4, true,5);
									} else if(i == 8) {
										searchKey8 = newsearchKey;
										_this.getTransitOrder(scope, scope.page8, 5, true,6);
									} else if(i == 9) {
										searchKey9 = newsearchKey;
										_this.getTransitOrder(scope, scope.page9, '4,5', true,7);
									}

								}, 800);
							});
						}

					};

				};

				this.initGripOptionFour = function(scope) {
					var _this = this;

					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverPercentTemplate = document.getElementById("hoverPercentTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;

					scope.gridOptions4 = {
						data: 'sltStyleList',
						paginationPageSizes: [10, 20, 50, 100, 200, 500, 1000, 2000],
						paginationPageSize: 100,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						useExternalPagination: true,
						zsColumnFilterRequestUrl: "/cpo/api/worktable/query_slt_result_filter?",
						zsColumnFilterRequestParam: {},
						columnDefs: workTableCommonService.constructeAssignmentStaticColumns(scope, "slt_working_no", false, 150),

						onRegisterApi: function(gridApi) {
							scope.gridApi4 = gridApi;
							gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
								if(sortColumns.length !== 0) {
									if(sortColumns[0].sort.direction === 'asc') {
										scope.page4.sortDirection = true;
									}
									if(sortColumns[0].sort.direction === 'desc') {
										scope.page4.sortDirection = false;
									}
									scope.page4.sortColumn = sortColumns[0].displayName;
								}
							});
							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page4.curPage = newPage;
								scope.page4.pageSize = pageSize;
								_this.getSLTStyle(scope);
							});

							gridApi.core.on.filterChanged(scope, function(col) {

								var __this = this;
								var grid = __this.grid;
								searchKey4 = CommonService.getFilterParams(grid);

								_this.getSLTStyle(scope, 4);

							});
						}
					};

				}

				this.initGripOptionFive = function(scope) {
					var _this = this;
					scope.gridOptions5 = {
						data: 'sltSummaryReport',
						paginationPageSizes: [10, 20, 50, 100, 200, 500, 1000, 2000],
						paginationPageSize: 100,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: true,
						useExternalPagination: true,
						enablePaginationControls: true,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: workTableCommonService.constructeAssignmentStaticColumns(scope, "slt_summary_report", false, 150),
						onRegisterApi: function(gridApi) {
							scope.gridApi5 = gridApi;
							gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
								if(sortColumns.length !== 0) {
									if(sortColumns[0].sort.direction === 'asc') {
										scope.page5.sortDirection = true;
									}
									if(sortColumns[0].sort.direction === 'desc') {
										scope.page5.sortDirection = false;
									}
									scope.page5.sortColumn = sortColumns[0].displayName;
								}
							});
							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {});
							gridApi.core.on.filterChanged(scope, function(col) {

								if(angular.isDefined(scope.filterTimeout)) {
									$timeout.cancel(scope.filterTimeout);
								}
								var __this = this;
								scope.filterTimeout = $timeout(function() {
									var grid = __this.grid;
									var newsearchKey = {};
									angular.forEach(grid.columns, function(column, index) {

										if(column.filters && column.filters[0].term && column.filters[0].term.length > 0) {
											newsearchKey[column.field] = column.filters[0].term;
										}
									});
									if(!angular.equals(searchKey5, newsearchKey)) {
										searchKey5 = newsearchKey;
										//   _this.getAssignFactoryResult(scope, '2', '0,3', scope.page2, 1);
										_this.getSLTSummaryReport(scope);
									}

								}, 800);
							});
						}
					};

				}

				this.initGripOptionSix = function(scope) {
					var _this = this;
					scope.gridOptions6 = {
						data: 'sltSummaryReportByWorkingNo',
						paginationPageSizes: [10, 20, 50, 100, 200, 500, 1000, 2000],
						paginationPageSize: 100,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						showLoading: true,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: true,
						useExternalPagination: true,
						enablePaginationControls: true,
						zsColumnFilterRequestUrl: "/cpo/api/worktable/query_slt_report_by_working_no_filter?",
						zsColumnFilterRequestParam: {},
						columnDefs: workTableCommonService.constructeAssignmentStaticColumns(scope, "slt_working_no_by_summary_report", false, 150),
						onRegisterApi: function(gridApi) {
							scope.gridApi6 = gridApi;
							gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
								if(sortColumns.length !== 0) {
									if(sortColumns[0].sort.direction === 'asc') {
										scope.page6.sortDirection = true;
									}
									if(sortColumns[0].sort.direction === 'desc') {
										scope.page6.sortDirection = false;
									}
									scope.page6.sortColumn = sortColumns[0].displayName;
								}
							});

							gridApi.core.on.filterChanged(scope, function(col) {
								var __this = this;
								var grid = __this.grid;
								searchKey6 = CommonService.getFilterParams(grid);
								_this.getSLTSummaryReportByWorkingNo(scope);
							});
						}
					};;
				}
				this.getAllHistoryOrder = function(scope) {
					var _this = this;
					GLOBAL_Http($http, "/cpo/api/document/query_order_document?", 'GET', {
						orderType: "2"
					}, function(data) {

						if(data.status == 0) {
							if(!data.output) {
								data.output = [];
							}
							scope.documentTypes = data.output.map(function(item, index) {
								return {
									index: index,
									id: item.documentType,
									label: item.documentTypeName,
									documents: item.documents.map(function(item2, index2) {
										return {
											id: item2.documentId,
											label: item2.documentOldName + " (" + new Date(item2.utcCreate).toLocaleDateString() + ")"
										}
									})
								}
							});
							var index = 0;
							var utcCreate = 0;
							angular.forEach(data.output, function(item, i) {
								if(item.documents.length > 0) {
									var doc = item.documents[0];
									if(utcCreate < doc.utcCreate) {
										utcCreate = doc.utcCreate;
										index = i;
									}
								}
							});
							scope.selectDocumentType = scope.documentTypes[index];
							_this.selectDocumentTypeChanged(scope);

						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {

						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}
				this.selectDocumentTypeChanged = function(scope) {
					var _this = this;
					setTimeout(function() {
						scope.selectDoc = scope.documentTypes[scope.selectDocumentType.index].documents[0];
						_this.selectDocumentChanged(scope);
					}, 800);

				}
				this.selectDocumentChanged = function(scope) {
					if(scope.selectDoc && scope.selectDoc.id) {
						scope.gridOptions2.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
						scope.gridOptions3.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
						scope.gridOptions7.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
						scope.gridOptions8.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
						scope.gridOptions9.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
					} else {
						delete scope.gridOptions2.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions3.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions7.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions8.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions9.zsColumnFilterRequestParam.eq_document_id;
					}
					this.clearFilterParams(scope);
					if(scope.selectDoc && scope.selectDoc.id) {

						this.refreshAll(scope);
					} else {

						this.clearAll(scope);
					}

				}
				this.clearAll = function(scope) {
					scope.gridOptions2.data = [];
					scope.gridOptions3.data = [];
					scope.gridOptions7.data = [];
					scope.gridOptions8.data = [];
					scope.gridOptions9.data = [];
				}
				this.clearFilterParams = function(scope) {

					scope.gridOptions2.zsFilter = {};
					scope.gridOptions3.zsFilter = {};
					scope.gridOptions7.zsFilter = {};
					scope.gridOptions8.zsFilter = {};
					scope.gridOptions9.zsFilter = {};

					searchKey2 = {};
					searchKey3 = {};
					searchKey7 = {};
					searchKey8 = {};
					searchKey9 = {};
				}
				this.refreshAll = function(scope) {
					this.getSLTStyle(scope);
					this.getSLTSummaryReportByWorkingNo(scope);
					this.getAssignFactoryResult(scope, '2', '0,3', scope.page2, true);
					this.getAssignFactoryResult(scope, '2', 2, scope.page3, true);
					this.getTransitOrder(scope, scope.page7, 4, true,5);
					this.getTransitOrder(scope, scope.page8, 5, true,6);
					this.getTransitOrder(scope, scope.page9, '4,5', true,7);

				}
				this.getDailyOrder = function(scope, type) {
					var _this = this;
					this.getAllHistoryOrder(scope);
					var param = {
						'orderType': type
					}
					GLOBAL_Http($http, "cpo/api/worktable/query_orders?", 'GET', param, function(data) {

						if(data.output && data.output.length > 0) {

							scope.docs = [].concat(
								data.output.filter(function(item) {
									return item.documentId
								}).map(function(item) {
									return {
										id: item.documentId ? item.documentId : "",
										label: (item.documentTypeName ? item.documentTypeName : "") + "-" + (item.documentName ? item.documentName : "")
									}
								})).sort(function(a, b) {
								return b.id - a.id
							});
							scope.selectDoc = scope.docs[0];

							_this.refreshAll(scope);
						} else {
							scope.docs = [{
								id: "",
								label: "No Document"
							}];
							scope.selectDoc = scope.docs[0];
						}

						if(data.output) {
							scope.DocumentData = translateData(data.output);
							var documentIdList = [];
							var contains1 = false;
							var contains3 = false;
							var height = (scope.DocumentData.length * 30) + 36;
							$("#grip2").css('height', height + 'px');
							angular.forEach(scope.DocumentData, function(currentValue) {
								currentValue['uploadHtml'] = '<i class="fa fa-upload"></i> Upload ';
								currentValue['Uploading'] = false;
								currentValue['Deleting'] = false;
								if(currentValue['documentStatus'] == 1) {
									contains1 = true;
								}
								if(currentValue['documentStatus'] == 3) {
									contains3 = true;
								}
								if(currentValue.documentStatus == "3") {
									documentIdList.push(currentValue['documentId']);
								}
							});;
							scope.documentIds = stringListToString(documentIdList);
							if(contains1) {
								scope.stepNumber = 2;
							} else if(contains3) {
								scope.stepNumber = 3;
								scrollGuild('#customerForecastFlowGuild', 690);
							} else {
								scope.stepNumber = 1;
							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}
				this.toUpload = function(scope, entity) {
					// var modalInstance =
					//   $uibModal.open({
					//     animation: true,
					//     ariaLabelledBy:"modal-header",
					//     templateUrl: 'app/worktable/refreshordermodal.html',
					//     controller: 'refreshOrderCtrl'
					//
					//   });
					// modalInstance.resolve = function(resutl){
					// }
					// return;
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'uploadFileModal',
						controller: 'UploadFileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: entity.documentType,
									special: {
										showOrderDate: true
									}
								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {
						if(returnData) {

							if(entity.documentType == "202") {

								setTimeout(function() {
									angular.element("#customerForecast2>a").click();
									_this.getSLTStyle(scope);
								}, 200);
								_this.getDailyOrder(scope, 2);

							} else if(entity.documentType = "2") {
								_this.getDailyOrder(scope, 2);
							} else {
								_this.getDailyOrder(scope, 2);
							}

						}
					}, function() {});
				}
				this.waitCustomerForecastDataImporting = function(finishCallBack, time) {
					var _this = this;
					var param = {
						in_code: 'ASYNCHRONOUSCUS'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {

						time++;

						if(data.ASYNCHRONOUSCUS[0].label == "YES") {
							setTimeout(function() {
								_this.waitCustomerForecastDataImporting(finishCallBack, time);
							}, 2000);
						} else {
							if(finishCallBack) {
								finishCallBack();
							}
						}
					}, function(data) {
						if(finishCallBack) {
							finishCallBack();
						}
					});

				}
				this.getSeasonList = function(scope) {
					var _this = this;
					GLOBAL_Http($http, "cpo/api/worktable/query_season?", 'GET', {}, function(data) {
						if(data.output) {
							scope.seasonList = data.output.map(function(item) {
								return {
									id: item.label,
									label: item.label
								}
							})
							scope.idPropertyModel = [];
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.deleteDom = function(scope, entity) {

					if(!entity.documentId) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.NO_ORDER_FILE'), null);
						return;
					}

					var alertStr = $translate.instant('errorMsg.CONFIRM_DELETE_DOCUMENT');
					alertStr = alertStr.replace('{0}', entity.source);
					var _this = this;
					modalAlert(CommonService, 0, alertStr, function() {
						var modal = $uibModal.open({
							templateUrl: "loadingpage",
							controller: 'loadingController',
							backdrop: 'static',
							size: 'sm'
						});

						entity.Deleting = true;
						var param = {
							"documentIds": entity.documentId
						};
						GLOBAL_Http($http, "cpo/api/document/delete_document", 'POST', param, function(data) {
							entity.Deleting = false;
							if(data.status == 0) {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.DELETE_SUCCESS'), null);
								_this.getDailyOrder(scope, 2);
								_this.refreshAll(scope);
							} else {
								modalAlert(CommonService, 2, data.message, null);
							}
						}, function(data) {
							entity.Deleting = false;
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					});
				};

				this.buildGridData = function(scope, gridIndex, data, navIndex) {
					var gridOptions = scope['gridOptions' + gridIndex];
					gridOptions.data = translateData(data.output);
					scope['page' + gridIndex].totalNum = data.total;
					gridOptions.totalItems = scope['page' + gridIndex].totalNum;
					scope.navList[navIndex].count = data.totalCount ? data.totalCount : "0";

					if(scope.selectDocumentType.id == '11') {
						gridOptions.columnDefs = workTableCommonService.constructeAssignmentStaticColumns(scope, "customerforecast", true, 150);
						workTableCommonService.cusorderDynamicColumnsForAChinaBuyPlan(data.sizeListCount, gridOptions);
						var chinaBuyPlanQuantity={
								"displayName": "China Buy Plan Quantity",
								"field": "totalQty",
								"minWidth": '100',
								"special": {
								"thousands": true
								}
							};
						for(var i=0;i<gridOptions.columnDefs.length;i++){
							if(gridOptions.columnDefs[i].field=='pvQuantity'){
								gridOptions.columnDefs.splice(i,0,chinaBuyPlanQuantity);
								break;
							}
						}


						if(gridOptions.data && gridOptions.data.length > 0) {
							for(var index in gridOptions.data) {
								var item = gridOptions.data[index];
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
				}

				this.getTransitOrder = function(scope, page, status, shouldPageNumberReset,selectIndex) {
					scope.disableReleaseOrderButton = false;

					var param = {
						orderType: "2",
						status: status,
						pageSize: page.pageSize,
						pageNo: page.curPage
					};
					if(scope.selectDoc && scope.selectDoc.id) {
						param.eq_document_id = scope.selectDoc.id;
					}
					if(shouldPageNumberReset) {
						page.curPage = 1;
						param.pageNo = page.curPage;
					}

					if(selectIndex == 5) {
						for(var attr in searchKey7) {
							if(searchKey7[attr]) {
								param[attr] = urlCharTransfer(searchKey7[attr]);
							}
						}
					} else if(selectIndex == 6) {
						for(var attr in searchKey8) {
							if(searchKey8[attr]) {
								param[attr] = urlCharTransfer(searchKey8[attr]);
							}
						}
					} else {
						param['in_new_factory']='BYS**BVG**BCA**BVN';
						for(var attr in searchKey9) {
							if(searchKey9[attr]) {
								param[attr] = urlCharTransfer(searchKey9[attr]);
							}
						}
					}

					if(scope.sortKey && scope.order) {
						param['sort'] = scope.sortKey;
						param['order'] = scope.order;
					}
					var _this = this;

					if(selectIndex == 5) {
						scope.gridOptions7.showLoading = true;
						scope.navList[5].loading = true;
					} else if(selectIndex == 6) {
						scope.gridOptions8.showLoading = true;
						scope.navList[6].loading = true;
					} else if(selectIndex == 7) {
						scope.gridOptions9.showLoading = true;
						scope.navList[7].loading = true;
					}

					GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

						scope.showLoading = false;
						if(selectIndex == 5) {
							scope.gridOptions7.showLoading = false;
							scope.navList[5].loading = false;
						} else if(selectIndex == 6) {
							scope.gridOptions8.showLoading = false;
							scope.navList[6].loading = false;
						} else if(selectIndex == 7) {
							scope.gridOptions9.showLoading = false;
							scope.navList[7].loading = false;
						}
						if(data.status == 0) {
							if(data.output) {
								if(selectIndex == 5) {
									_this.buildGridData(scope, 7, data, 5);
								} else if(selectIndex == 6) {
									_this.buildGridData(scope, 8, data, 6);
								} else if(selectIndex == 7) {
									_this.buildGridData(scope, 9, data, 7);
								}
							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {

						if(selectIndex == 5) {
							scope.gridOptions7.showLoading = false;
						} else if(selectIndex == 6) {
							scope.gridOptions8.showLoading = false;
						} else if(selectIndex == 7) {
							scope.gridOptions9.showLoading = false;
						}
						scope.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

				this.assignFactory = function(scope) {

					var _this = this;

					var _this = this;
					var modalInstance =
						$uibModal.open({
							animation: true,
							ariaLabelledBy: "modal-header",
							templateUrl: 'app/worktable/assignFactory.html',
							controller: 'assignFactoryCtrl'
						});
					modalInstance.resolve = function(result) {
						var param = {
							criteriaVersionId: scope.version.id,
							documentType: 2,
							isAssignByFactoryId:result.isAssignByFactoryId
						}
						_this.assigningStatus(scope);
						GLOBAL_Http($http, "cpo/api/worktable/assign_factory?", 'GET', param, function(data) {
							_this.assignedStatus(scope);
							if(data.status == 0) {

								if(data.tips && data.tips != "0") {
									modalAlert(CommonService, 2, "Assign Successfully with factory adjustment rules.", null);
								} else {
									modalAlert(CommonService, 2, $translate.instant('worktable.SUCCESS_ASSIGN'), null);

								}

								_this.refreshAll(scope);
								_this.getDailyOrder(scope, 2);
							} else if(data.status == 9) {
								modalAlert(CommonService, 2, data.tips, null);
							} else {
								modalAlert(CommonService, 3, data.message, null);
							}
						}, function(data) {
							_this.assignedStatus(scope);
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					}
				}

				this.getAssignFactoryResult = function(scope, type, status, page, shouldPageNumberReset) {
					scope.disableReleaseOrderButton = false;
					if(status == '0,3') {
						scope.navList[0].loading = true;
					} else if(status == 2) {
						scope.navList[1].loading = true;
					}
					var param = {
						orderType: type,
						status: status,
						pageSize: page.pageSize,
						pageNo: page.curPage
					};

					if(shouldPageNumberReset) {
						page.curPage = 1;
						param.pageNo = page.curPage;
					}

					if(scope.selectDoc && scope.selectDoc.id) {
						param.eq_document_id = scope.selectDoc.id;
					}
					if(scope.tabIndex == 0) {
						for(var attr in searchKey2) {
							if(searchKey2[attr]) {
								param[attr] = urlCharTransfer(searchKey2[attr]);
							}
						}
					} else {
						for(var attr in searchKey3) {
							if(searchKey3[attr]) {
								param[attr] = urlCharTransfer(searchKey3[attr]);
							}
						}
					}

					if(scope.sortKey && scope.order) {
						param['sort'] = scope.sortKey;
						param['order'] = scope.order;
					}

					var _this = this;
					scope.showLoading = true;
					if(scope.tabIndex == 0) {
						scope.gridOptions2.showLoading = true;
					} else {
						scope.gridOptions3.showLoading = true;
					}
					GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

						scope.showLoading = false;

						if(scope.tabIndex == 0) {
							scope.gridOptions2.showLoading = false;
						} else {
							scope.gridOptions3.showLoading = false;
						}

						if(data.output) {
							if(status == '0,3') {
								scope.navList[0].loading = false;
							} else if(status == 2) {
								scope.navList[1].loading = false;
							}
							switch(status) {
								case '0,3':
									{
										_this.buildGridData(scope, 2, data, 0);
										scope.tabStatus.tabIndex1 = true;
										break;
									}
								case 2:
									{
										_this.buildGridData(scope, 3, data, 1);
										scope.tabStatus.tabIndex2 = true;
										break;
									}
							}

						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						if(scope.tabIndex == 0) {
							scope.gridOptions2.showLoading = false;
						} else {
							scope.gridOptions3.showLoading = false;
						}
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.adjustFactoryAssignment = function(scope, mode, tab) {
					var _this = this;
					var selectedRows = "";
					if(scope.tabIndex == 0) {
						selectedRows = scope.gridApi2.selection.getSelectedRows();

					} else if(scope.tabIndex == 2) {
						selectedRows = scope.gridApi4.selection.getSelectedRows();

					}
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
					var workingNos = [];
					if(mode == 1) {
						for(var i = 0; i < selectedRows.length; i++) {
							if(selectedRows[i].suggFactory != selectedRows[i].lastProdFactory) {
								var w = {
									"workingNo": selectedRows[i].workingNo,
									"lastProductionFactory": selectedRows[i].suggFactory
								}
								workingNos.push(w);
							}
						}
					} else if(mode == 2) {
						for(var i = 0; i < selectedRows.length; i++) {
							if(selectedRows[i].lastProdFactory == "" || selectedRows[i].lastProdFactory == null) {
								modalAlert(CommonService, 2, $translate.instant('errorMsg.LAST_PRODUCTION_FACTORY_IS_NULL'), null);
								return;
							}
						}
					} else if(mode == 3) {
						for(var i = 0; i < selectedRows.length; i++) {
							if(selectedRows[i].aSource == "" || selectedRows[i].aSource == null) {
								modalAlert(CommonService, 2, $translate.instant('errorMsg.A_SOURCE_IS_NULL'), null);
								return;
							}
						}
						for(var i = 0; i < selectedRows.length; i++) {
							var w = {
								"workingNo": selectedRows[i].workingNo,
								"lastProductionFactory": selectedRows[i].aSource
							}
							workingNos.push(w);
						}
					}
					//增加AChina Buy Plan 数量为0的单改厂名提示
					if(scope.selectDocumentType&&scope.selectDocumentType.id=='11'){
						var isExistZeroOrder=false;
						for(var i = 0; i < selectedRows.length; i++) {
							if(selectedRows[i].totalQty ==0) {
								isExistZeroOrder=true;
								break;
							}
						}
						if(isExistZeroOrder){
							var flag=false;
							modalAlert(CommonService, 0, 'Some orders‘s quantity is 0 , do you confirm to change factory ?', function() {
								flag=true;
							});
							if(flag==false){
								return;
							}
						}
					}

					var param = {
						"ids": listToString(selectedRows, 'assignResultId'),
						"workingNos": workingNos,
						"mode": mode,
						"orderType": "2"
					}
					GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function(data) {
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							_this.refreshAll(scope);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {

						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.adjustFactoryAssignment2 = function(scope, mode, confirmFactory) {
					var _this = this;
					var selectedRows = "";
					if(scope.tabIndex == 0) {
						selectedRows = scope.gridApi2.selection.getSelectedRows();

					} else if(scope.tabIndex == 1) {
						selectedRows = scope.gridApi3.selection.getSelectedRows();

					} else if(scope.tabIndex == 2) {
						selectedRows = scope.gridApi4.selection.getSelectedRows();

					} else if(scope.tabIndex == 4) {
						selectedRows = scope.gridApi6.selection.getSelectedRows();

					} else if(scope.tabIndex == 5) {
						selectedRows = scope.gridApi7.selection.getSelectedRows();
					} else if(scope.tabIndex == 6) {
						selectedRows = scope.gridApi8.selection.getSelectedRows();
					} else if(scope.tabIndex == 7) {
						selectedRows = scope.gridApi9.selection.getSelectedRows();
					}
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}

					if(scope.tabIndex == 0) {
						var param = {
							"ids": listToString(selectedRows, 'assignResultId'),
							"workingNos": [],
							"mode": mode,
							"confirmFactory": confirmFactory,
							"orderType": "2"
						}
						GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function(data) {
							if(data.status == 0) {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
								_this.refreshAll(scope);
							} else {
								modalAlert(CommonService, 2, data.message, null);
							}
						}, function(data) {
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
						return;
					}

					var modalInstance =
						$uibModal.open({
							animation: true,
							ariaLabelledBy: "modal-header",
							templateUrl: 'app/factorymaster/transferReason.html',
							controller: 'transferReasonCtrrl'

						});
					modalInstance.resolve = function(result) {
						var param = {
							"ids": listToString(selectedRows, 'assignResultId'),
							"workingNos": [],
							"mode": mode,
							"confirmFactory": confirmFactory,
							"orderType": "2",
							"transferReason": result.reason,
							"transferRemark": result.remark,
							"isFactoryAdjustment": 'YES'
						}

						if(scope.tabIndex == 2) {
							param["sltWorkingNoIds"] = listToString(selectedRows, 'sltWorkingNoIds');
						}
						if(scope.tabIndex == 4) {
							param.isSLTSummaryReport = "YES";
							param["sltWorkingNoIds"] = listToString(selectedRows, 'sltWorkingNoIds');

						}

						GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function(data) {
							if(data.status == 0) {

								modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
								_this.refreshAll(scope);
							} else {

								modalAlert(CommonService, 2, data.message, null);
							}
						}, function(data) {

							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					}
				}
				this.assigningStatus = function(scope) {
					scope.assignHtml = '<span>' + $translate.instant('worktable.ASSIGNING') + '</span>';
					scope.assigning = true;
				};
				this.assignedStatus = function(scope) {
					scope.assignHtml = '<span>' + $translate.instant('worktable.SNED_TO_ASSIGN') + '</span>';
					scope.assigning = false;
				};
				this.selectTab = function(scope, index) {
					scope.tabIndex = index;
					if(index == 2) {
						this.getSLTStyle(scope);
					} else if(index == 3) {
						this.getSLTSummaryReport(scope);
					} else if(index == 4) {
						this.getSLTSummaryReportByWorkingNo(scope);
					}
				}
				this.selectTab2 = function(scope, index) {
					scope.tabIndex2 = index;
				}
				this.releaseTransitOrder = function(scope) {

					var _this = this;
					scope.disableReleaseOrderButton = true;

					var selectedRows = "";

					if(scope.tabIndex == 5) {
						selectedRows = scope.gridApi7.selection.getSelectedRows();
					} else if(scope.tabIndex == 6) {
						selectedRows = scope.gridApi8.selection.getSelectedRows();
					} else if(scope.tabIndex == 7) {
						selectedRows = scope.gridApi9.selection.getSelectedRows();
					}

					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						scope.disableReleaseOrderButton = false;
						return;
					}
					var documentId = null;

					if(scope.tabIndex == 5) {
						documentId = scope.gridOptions7.data[0].documentId;
					} else if(scope.tabIndex == 6) {
						documentId = scope.gridOptions8.data[0].documentId;
					} else if(scope.tabIndex == 7) {
						documentId = scope.gridOptions9.data[0].documentId;
					}

					var param = {
						"documentIds": documentId,
						"status": "5",
						"assignResultIds": listToString(selectedRows, 'assignResultId')
					};
					param.releaseTo365='0';
					GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
						scope.disableReleaseOrderButton = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);

							_this.refreshAll(scope);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.disableReleaseOrderButton = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.getSLTStyle = function(scope, filterTab) {
					var param = {
						pageSize: scope.page4.pageSize,
						pageNo: scope.page4.curPage
					}
					if(filterTab) {
						for(var attr in searchKey4) {
							if(searchKey4[attr]) {
								param[attr] = urlCharTransfer(searchKey4[attr]);
							}
						}
					}

					scope.showLoading = true;
					scope.navList[2].loading = true;
					GLOBAL_Http($http, "cpo/api/worktable/query_slt_result?", 'GET', param, function(data) {
						scope.showLoading = false;
						scope.navList[2].loading = false;
						if(data) {
							scope.sltStyleList = data.output;
							scope.page4.totalNum = data.total;
							scope.navList[2].count = data.total ? data.total : "0";
							scope.gridOptions4.totalItems = scope.page4.totalNum;
						} else {
							var message = data.message;
							if(message) {
								modalAlert(CommonService, 3, message, null);
							}
						}
					}, function(data) {
						scope.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.getSLTSummaryReport = function(scope) {
					var param = {};
					var param = {};

					var season = "";

					if(scope.idPropertyModel && scope.idPropertyModel.length) {
						param.in_season = scope.idPropertyModel.map(function(item) {
							return item.id
						}).join(",");

					}
					//;

					scope.gridOptions5.showLoading = true;

					// for (var attr in searchKey5) {
					//   if (searchKey5[attr]) {
					//     param['like_' + attr] = urlCharTransfer(searchKey5[attr]);
					//   }
					// }
					scope.navList[3].loading = true;
					GLOBAL_Http($http, "cpo/api/worktable/query_slt_report?", 'GET', param, function(data) {
						scope.gridOptions5.showLoading = false;
						scope.navList[3].loading = false;
						if(data.output) {
							scope.sltSummaryReport = data.output;
							scope.gridOptions5.totalItems = data.output.length;
							scope.navList[3].count = data.output.length ? data.output.length : "0";
							var monthlyQuantity = [];
							for(var i = 0; i < scope.sltSummaryReport.length; i++) {
								for(var month in scope.sltSummaryReport[i].sltReportMonthlyReport) {
									if(monthlyQuantity.indexOf(month) < 0) {
										monthlyQuantity.push(month);
									}
								}
							}
							monthlyQuantity.sort();
							for(var i = 0; i < scope.sltSummaryReport.length; i++) {
								var sltSummary = scope.sltSummaryReport[i];
								for(var j = 0; j < monthlyQuantity.length; j++) {
									var month = monthlyQuantity[j];
									sltSummary[month] = sltSummary.sltReportMonthlyReport[month] ? sltSummary.sltReportMonthlyReport[month] : 0;
								}
							}
							scope.gridOptions5.columnDefs = scope.gridOptions5.columnDefs.slice(0, 6);
							for(var i = 0; i < monthlyQuantity.length; i++) {
								var month = monthlyQuantity[i];
								var monthlyQty = {
									name: month,
									displayName: month,
									field: month,
									width: 120,
									enableCellEdit: false
								}
								scope.gridOptions5.columnDefs.push(monthlyQty);
							}

						} else {
							var message = data.message;
							if(message) {
								modalAlert(CommonService, 3, message, null);
							}
						}
					}, function(data) {
						scope.gridOptions5.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.getSLTSummaryReportByWorkingNo = function(scope) {
					var param = {};
					var season = "";

					if(scope.idPropertyModel && scope.idPropertyModel.length) {
						param.in_season = scope.idPropertyModel.map(function(item) {
							return item.id
						}).join(",");

					}

					if($("#searchWorkingNo").val()) {
						param.like_workingNo = $("#searchWorkingNo").val();
					}

					scope.showLoading = true;
					for(var attr in searchKey6) {
						if(searchKey6[attr]) {
							param[attr] = urlCharTransfer(searchKey6[attr]);
						}
					}
					scope.gridOptions6.showLoading = true;
					scope.navList[4].loading = true;
					GLOBAL_Http($http, "cpo/api/worktable/query_slt_report_by_working_no?", 'GET', param, function(data) {
						scope.gridOptions6.showLoading = false;
						if(data.output) {

							scope.sltSummaryReportByWorkingNo = data.output;

							scope.gridOptions6.totalItems = data.output.length;
							scope.navList[4].count = data.totalCount ? data.totalCount : "0";
							scope.navList[4].loading = false;
							var monthlyQuantity = [];
							for(var i = 0; i < scope.sltSummaryReportByWorkingNo.length; i++) {
								for(var month in scope.sltSummaryReportByWorkingNo[i].sltReportMonthlyReport) {
									if(monthlyQuantity.indexOf(month) < 0) {
										monthlyQuantity.push(month);
									}
								}
							}
							monthlyQuantity.sort();
							for(var i = 0; i < scope.sltSummaryReportByWorkingNo.length; i++) {
								var sltSummary = scope.sltSummaryReportByWorkingNo[i];
								for(var j = 0; j < monthlyQuantity.length; j++) {
									var month = monthlyQuantity[j];
									sltSummary[month] = sltSummary.sltReportMonthlyReport[month] ? sltSummary.sltReportMonthlyReport[month] : 0;
								}
							}
							scope.gridOptions6.columnDefs = scope.gridOptions6.columnDefs.slice(0, 6);
							for(var i = 0; i < monthlyQuantity.length; i++) {
								var month = monthlyQuantity[i];
								var monthlyQty = {
									name: month,
									displayName: month,
									field: month,
									width: 120,
									enableCellEdit: false
								}
								scope.gridOptions6.columnDefs.push(monthlyQty);
							}

						} else {
							var message = data.message;
							if(message) {
								modalAlert(CommonService, 3, message, null);
							}
						}
					}, function(data) {
						scope.gridOptions6.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化

					var _this = this;
					scope.showLoading = true;
					scope.sltStyleList = [];
					scope.sltSummaryReport = [];
					scope.sltSummaryReportByWorkingNo = [];
					scope.searchWorkingNo = "";
					searchKey2 = {};
					searchKey3 = {};
					searchKey4 = {};
					searchKey7 = {};
					searchKey8 = {};
					searchKey9 = {};
					scope.idPropertySettings = {
						enableSearch: false,
						showUncheckAll: false,
						showCheckAll: false,
						smartButtonMaxItems: 100,
						smartButtonTextConverter: function(itemText, originalItem) {
							return itemText;
						},
					};
					scope.navList = //['New Pending', 'New Order', 'SLT Working No.', 'SLT Summary Report', 'SLT Summary Report By Working No','Transit Pending', 'Transit Order'];
						[{
								name: "New Pending",
								count: 0
							},
							{
								name: "New Order",
								count: 0
							},
							{
								name: "SLT Working No.",
								count: 0
							},
							{
								name: "SLT Summary Report",
								count: 0
							},
							{
								name: "SLT Summary Report By Working No.",
								count: 0
							},
							{
								name: "Transit Pending",
								count: 0
							},
							{
								name: "Transit Order",
								count: 0
							},
							{
								name: "Retransit Order",
								count: 0
							}
						];
					scope.loadingList = ['Factory Capacity & Fill Rate', 'Special Process Capacity & Fill Rate'];
					scope.stepNumber = 2;
					scope.steps = [{
						content: "1.Upload File",
						on: "#4774C1 ",
						off: "lightgray"
					}, {
						content: "2.Start To Assign",
						on: "#4ABDB8",
						off: "lightgray"
					}, {
						content: "3.Confirm Pending",
						on: "#4BB467",
						off: "lightgray"
					}, {
						content: "4.Confirm Assignment",
						on: "#75AB4D",
						off: "lightgray"
					}];
					scope.allCapData = {
						factoryCapData: [],
						processCapData: []
					};
					scope.tabStatus = {
						tabIndex1: false,
						tabIndex2: false
					}
					scope.viewCap = 2;
					_this.assignedStatus(scope);
					scope.scrlTabsApi = {};
					scope.scrlTabsApi2 = {};
					scope.tabIndex = 0;
					scope.tabIndex2 = 0;
					scope.TimeModel = new Date().Format("yyyy-MM");
					scope.backGroundTemplate = document.getElementById("blueGreenTemplate").innerText;
					scope.isNewTemplate = document.getElementById("isNewTemplate").innerText;
					_this.getSeasonList(scope);
					scope.season = "";
					scope.page2 = {
						curPage: 1,
						pageSize: 100,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.page3 = {
						curPage: 1,
						pageSize: 100,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.page4 = {
						curPage: 1,
						pageSize: 100,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.page6 = {
						curPage: 1,
						pageSize: 100,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.page7 = {
						curPage: 1,
						pageSize: 100,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.page8 = {
						curPage: 1,
						pageSize: 100,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.page9 = {
						curPage: 1,
						pageSize: 100,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.$on('detailPage.close', function(data) {
						scope.showDetailView = '';
					});
					scope.$on('workTableDetail.init', function(event, data) {
						scope.$broadcast('workTableDetail.afterInit', scope.factoryAssingmentResultDetail);
					});
					scope.dailyDocumentData = [];
					this.initGripOptionZero(scope);
					this.initGripOptionTwo(scope, 2, 'customerForecastNewPending');
					this.initGripOptionTwo(scope, 3, 'customerForecastNewOrder');
					this.initGripOptionTwo(scope, 7, 'customerForecastTransitPending');
					this.initGripOptionTwo(scope, 8, 'customerForecastTransitOrder');
					this.initGripOptionTwo(scope, 9, 'customerForecastReTransitOrder');

					this.initGripOptionFour(scope);
					this.initGripOptionFive(scope);
					this.initGripOptionSix(scope);
					this.initGripOptionTen(scope);

					_this.getDailyOrder(scope, 2);
					_this.getSLTStyle(scope);
					this.getSelectedData(scope);
					for(var i = 2; i < 3; i++) {
						if(i == 4) continue;
						for(var j = 0; j < scope['gridOptions' + i].columnDefs.length; j++) {
							if(scope['gridOptions' + i].columnDefs[j].name == 'finalConfirmation') {
								scope['gridOptions' + i].columnDefs.splice(j, 1);
							}
						}
					}
					_this.getSLTSummaryReport(scope);
					_this.getSLTSummaryReportByWorkingNo(scope);

				};

				this.initGripOptionTen = function(scope) {
					scope.gridOptions10 = {
						data: 'items',
						paginationPageSizes: [10, 20, 50, 100, 200, 500, 1000, 2000],
						paginationPageSize: 100,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: false,
						useExternalPagination: false,
						enablePaginationControls: false,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [{
								name: 'factoryCode',
								displayName: $translate.instant('factory.FACTORY_CODE'),
								field: 'factoryCode',
								minWidth: '140',
								enableCellEdit: false
							},
							{
								name: 'factSimpName',
								displayName: $translate.instant('factory.FACTORY_SIMP_NAME'),
								field: 'factSimpName',
								minWidth: '140',
								enableCellEdit: false
							},
							{
								name: 'processCode',
								displayName: $translate.instant('processmaster.PROCESS_NO'),
								field: 'processCode',
								minWidth: '140',
								enableCellEdit: false
							},
							{
								name: 'processName',
								displayName: $translate.instant('processmaster.PROCESS_NAME'),
								field: 'processName',
								minWidth: '140',
								enableCellEdit: false
							}
						],
						onRegisterApi: function(gridApi) {
							scope.gridApi10 = gridApi;
							gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {

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
							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;

							});
						}
					};

					var year = new Date().getFullYear();
					var month = new Date().getMonth() + 1;
					for(var i = 0; i < 4; i++) {
						var capacity = {
							name: 'capacity' + i,
							displayName: $translate.instant('factoryProcess.CAPACITY') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
							field: 'capacity' + i,
							minWidth: '140',
							enableCellEdit: false
						}
						var fillRate = {
							name: 'fillRate' + i,
							displayName: $translate.instant('factoryProcess.FILL_RATE') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
							field: 'fillRate' + i,
							minWidth: '140',
							enableCellEdit: false,
							cellTemplate: "<div class=\"container-flex-center-center\" style=\"width: 100%;height: 100%;\" ng-class=\"{'background-red':row.entity.fillRate" + i + ">= 90}\"><div ng-bind=\"row.entity.fillRate" + i + "\"></div><span ng-if=\"row.entity.fillRate" + i + "\">%</span></div>"
						}
						scope.gridOptions10.columnDefs.push(capacity);
						scope.gridOptions10.columnDefs.push(fillRate);
					}
				}

				this.toggleFilterRow = function(scope) {
					switch(scope.tabIndex) {
						case 0:
							{
								scope.gridOptions2.enableFiltering = !scope.gridOptions2.enableFiltering;
								scope.gridApi2.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
								break;
							}
						case 1:
							{
								scope.gridOptions3.enableFiltering = !scope.gridOptions3.enableFiltering;
								scope.gridApi3.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
								break;
							}
						case 2:
							{
								scope.gridOptions4.enableFiltering = !scope.gridOptions4.enableFiltering;
								scope.gridApi4.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
								break;
							}
						case 3:
							{
								scope.gridOptions5.enableFiltering = !scope.gridOptions5.enableFiltering;
								scope.gridApi5.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
								break;
							}
						case 4:
							{
								scope.gridOptions6.enableFiltering = !scope.gridOptions6.enableFiltering;
								scope.gridApi6.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
								break;
							}
					}
				}
				this.releaseOrder = function(scope) {

					if(scope.gridOptions2.data.length > 0) {
						modalAlert(CommonService, 2, $translate.instant('worktable.PLEASE_CONFIRM_THE_PENDING_ORDER'), null);
						return;
					}
					if(scope.gridOptions3.data.length == 0) {
						modalAlert(CommonService, 2, $translate.instant('worktable.NO_NEW_ORDER_CAN_RELEASE'), null);
						return;
					}

					var _this = this;
					var documentid = null;
					if(scope.selectDoc && scope.selectDoc.id) {
						documentid = scope.selectDoc.id;
					} else {
						documentid = scope.documentIds;
					}
					if(!documentid) {
						modalAlert(CommonService, 2, $translate.instant('worktable.NO_DOCUMENT_NEED_TO_RELEASE'), null);
						return;
					}
					var param = {
						"documentIds": documentid,
						"status": "4"
					};

					param.releaseTo365='0';
					scope.disableReleaseOrderButton = true;
					GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
						scope.disableReleaseOrderButton = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);
							_this.refreshAll(scope);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.disableReleaseOrderButton = false;

						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.exportFile = function(scope) {
					var param = null;

					if(scope.tabIndex == 2) {
						param = {
							documentType: 401
						}
					} else if(scope.tabIndex == 3) {
						param = {
							documentType: 209
						}

					} else if(scope.tabIndex == 4) {
						param = {
							documentType: 210
						}

						if(scope.idPropertyModel && scope.idPropertyModel.length) {
							param.in_season = scope.idPropertyModel.map(function(item) {
								return item.id
							}).join(",");

						}
						if($("#searchWorkingNo").val()) {
							param.like_workingNo = $("#searchWorkingNo").val();
						}

					} else {
						param = {
							pageSize: 1000000,
							pageNo: 1,
							orderType: '2'
						};
						param['documentType'] = scope.selectDocumentType.id;

						switch(scope.selectDocumentType.id) {
							case '2':
								param['documentType'] = "202";
								break;
							case '15':
								param['documentType'] = "207";
								break;
						}
						switch(scope.tabIndex) {
							case 0:
								{
									// param['documentType'] = '202';
									param['status'] = '0,2,3';
									break;
								}
							case 1:
								{
									//  param['documentType'] = '202';
									param['status'] = '0,2,3';
									break;
								}
							case 5:
								{
									//   param['documentType'] = '202';
									param['status'] = '4';
									break;
								}
							case 6:
								{
									//   param['documentType'] = '202';
									param['status'] = '5';
									break;
								}
						}
					}

					if(scope.selectDoc && scope.selectDoc.id) {
						param.eq_document_id = scope.selectDoc.id;
					} else {
						param.eq_document_id = 0;
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

				}

				this.adjustSLTStyle = function(scope, factory) {
					var _this = this;
					var selectedRows = scope.gridApi4.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
					var param = {
						'sltStyleIds': listToString(selectedRows, 'sltStyleId'),
						'sltStyles': selectedRows,
						'factory': factory
					}
					GLOBAL_Http($http, "cpo/api/worktable/adjust_slt_style?", 'post', param, function(data) {

						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							_this.getSLTStyle(scope);
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

				this.importFactoryTuning = function(scope) {
					var _this = this;

					var modalInstance = $uibModal.open({
						templateUrl: 'uploadFileModal',
						controller: 'UploadFileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: '301',
									showSeasonSelect: 1
								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {
						if(returnData) {
							_this.refreshAll(scope);
						}
					}, function() {});
				}

				this.setSeason = function(scope) {
					var _this = this;
					var ids = new Array();
					var selectedRows = null; //scope.gridApi5.selection.getSelectedRows();
					if(scope.tabIndex == 0) {
						selectedRows = scope.gridApi2.selection.getSelectedRows();
					} else if(scope.tabIndex == 1) {
						selectedRows = scope.gridApi3.selection.getSelectedRows();
					} else if(scope.tabIndex == 5) {
						selectedRows = scope.gridApi7.selection.getSelectedRows();
					}

					if(selectedRows.length < 1) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}

					for(var index in selectedRows) {
						var row = selectedRows[index];
						ids.push(row.factAssignId);
						// if ( row.season ) {
						//   var text = "No need to set season for article(" + row.articleNo + ") since it is exists.";
						//   modalAlert(CommonService , 2 , text , null);
						//   return;
						// }else{
						//   ids.push(row.factAssignId);
						// }
					}

					GLOBAL_Http($http, "cpo/api/worktable/query_season?", 'GET', {}, function(data) {
						if(data.output && data.output.length > 0) {

							scope.seasons = data.output.map(function(item) {
								return {
									id: item.value,
									label: item.value
								}

							});
							var topScope = scope;
							var modalInstance = $uibModal.open({
								animation: true,
								ariaLabelledBy: 'modal-title',
								ariaDescribedBy: 'modal-body',
								templateUrl: 'set-season.html',
								size: "sm",
								controller: function($scope, $uibModalInstance) {

									$scope.seasons = topScope.seasons;
									$scope.selectSeason = $scope.seasons[0];

									$scope.submit = function() {

										$uibModalInstance.resolve({
											season: $scope.selectSeason.id
										});
										$uibModalInstance.dismiss();
									};
									$scope.dismiss = function() {
										$uibModalInstance.dismiss();
									}

								}

							});

							modalInstance.resolve = function(result) {

								var season = result.season;

								var param = {
									orderType: 2,
									season: season,
									ids: ids.join(",")
								};
								GLOBAL_Http($http, "cpo/api/worktable/set_season", 'POST', param, function(data) {
									if(data.status == 0) {
										modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
										_this.refreshAll(scope);
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

						modalAlert(CommonService, 3, data.message, null);
					});
				}



				this.releaseToBUERP = function(scope) {
					var param={
						 "interfaceType":"TRIGGER_BU_ERP_IMPORT",
						 "systemType":"FR"
					}
					scope.disableReleaseERPButton=true;
					GLOBAL_Http($http, "cpo/api/schedule/do_schedule?", 'GET', param, function(data) {
						scope.disableReleaseERPButton=false;
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);
					}, function(data) {
						scope.disableReleaseERPButton=false;
						modalAlert(CommonService, 3, data.message, null);
					});
				}


				this.refreshBno = function(scope, entity) {

					if(scope.gridOptions7.data.length == 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.NO_DATA_REFRESH'), null);
						return;
					}
					var _this = this;
					var documentId = scope.gridOptions7.data[0].documentId;
					scope.disableRefreshBNoButton = true;
					var param = {
						"documentId": documentId
					};

					GLOBAL_Http($http, "cpo/api/worktable/refreshBNo?", 'GET', param, function(data) {
						scope.disableRefreshBNoButton = false;
						if(data.status == 0) {

							_this.getTransitOrder(scope, scope.page7, 4, true,5);

							modalAlert(CommonService, 2, data.tips + $translate.instant('notifyMsg.REFRESH_DATA_SUCCESS'), null);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.disableRefreshBNoButton = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

				this.refreshCountryCode = function(scope, entity) {

					if(scope.gridOptions7.data.length == 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.NO_DATA_REFRESH'), null);
						return;
					}
					var _this = this;
					var documentId = scope.gridOptions7.data[0].documentId;
					scope.disableRefreshCountryCodeButton = true;
					var param = {
						"documentId": documentId
					};

					GLOBAL_Http($http, "cpo/api/worktable/refreshCountryCode?", 'GET', param, function(data) {
						scope.disableRefreshCountryCodeButton = false;
						if(data.status == 0) {

							_this.getTransitOrder(scope, scope.page7, 4, true,5);

							modalAlert(CommonService, 2, data.tips + $translate.instant('notifyMsg.REFRESH_DATA_SUCCESS'), null);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.disableRefreshCountryCodeButton = false;
						modalAlert(CommonService, 3, data.message, null);
					});

				}
				this.setup = function(scope) {
					var modalInstance = $uibModal.open({
						animation: true,
						ariaLabelledBy: "modal-header",
						templateUrl: 'app/worktable/cussetup.html',
						controller: 'CusSetupCtrl'

					});
				}
				this.reAssign = function(scope, param) {

					var param = {
						orderType: "2",
						status: "0,2,3",
						pageSize: 1,
						pageNo: 1
					};
					if(scope.selectDoc && scope.selectDoc.id) {
						param.eq_document_id = scope.selectDoc.id;
					} else {
						modalAlert(CommonService, 3, $translate.instant('notifyMsg.NO_DATA_REASSIGN'), null);
						return;
					}
					var _this = this;
					_this.assigningStatus(scope);
					workTableCommonService.reAssignAll(scope, param, function(scope) {
						_this.assignedStatus(scope);
						_this.refreshAll(scope)
					})
				}

				this.checkOrderInfo=function(scope){
					var _this = this;
					if(!scope.selectDoc){
						modalAlert(CommonService, 3, 'Please Select Document', null);
						return;
					}
					var modalInstance =
						$uibModal.open({
							animation: true,
							ariaLabelledBy: "modal-header",
							templateUrl: 'app/worktable/orderinfochecking.html',
							controller: 'OrderInfoCheckingCtrl',
							openedClass:'dynamic-template-modal-window',
							size:"lg",
							resolve: {
								parameter: function() {
									return {
										eq_document_id:scope.selectDoc.id,
										interfaceName:'checkFCInfo?'
									};
								}
							}
						});
				}
			}
		])
		.controller('CustomerForecastCtrl', ['$scope', 'CustomerForecastService', 'FilterInGridService',
			function($scope, CustomerForecastService, FilterInGridService) {

				$scope.refreshAll = function() {
					CustomerForecastService.refreshAll($scope);
				}
				$scope.adjustFactoryAssignment = function(mode, tab) {
					CustomerForecastService.adjustFactoryAssignment($scope, mode, tab);
				};
				$scope.adjustFactoryAssignment2 = function(mode, confirmFactory) {
					CustomerForecastService.adjustFactoryAssignment2($scope, mode, confirmFactory);
				};
				$scope.toUpload = function(entity) {
					CustomerForecastService.toUpload($scope, entity);
				};

				$scope.selectTab = function(index) {
					CustomerForecastService.selectTab($scope, index);
				}
				$scope.setupScrollableTabSet = function(length, index) {
					if(length >= index + 1) {
						if($scope.scrlTabsApi.doRecalculate) {
							$scope.scrlTabsApi.doRecalculate();
						}
					}
				};
				$scope.selectTab2 = function(index) {
					CustomerForecastService.selectTab2($scope, index);
				}
				$scope.setupScrollableTabSet2 = function(length, index) {
					if(length >= index + 1) {
						if($scope.scrlTabsApi2.doRecalculate) {
							$scope.scrlTabsApi2.doRecalculate();
						}
					}
				};
				$scope.assignFactory = function() {
					CustomerForecastService.assignFactory($scope);
				}
				$scope.importFactoryTuning = function() {
					CustomerForecastService.importFactoryTuning($scope);
				}
				$scope.releaseOrder = function(type) {
					CustomerForecastService.releaseOrder($scope, type);
				}
				$scope.releaseTransitOrder = function(type) {
					CustomerForecastService.releaseTransitOrder($scope, type);
				}
				$scope.viewCapacity = function(type) {
					CustomerForecastService.viewCapacity($scope, type);
				}
				$scope.refreshBno = function(entity) {
					CustomerForecastService.refreshBno($scope, entity);
				}
				$scope.refreshCountryCode = function(entity) {
					CustomerForecastService.refreshCountryCode($scope, entity);
				}
				$scope.exportFile = function() {
					CustomerForecastService.exportFile($scope);
				}
				$scope.adjustSLTStyle = function(factory) {
					CustomerForecastService.adjustSLTStyle($scope, factory);
				}
				$scope.deleteDom = function(entity) {
					CustomerForecastService.deleteDom($scope, entity);
				};
				$scope.toggleFilterRow = function() {
					CustomerForecastService.toggleFilterRow($scope);
				};
				$scope.setup = function() {
					CustomerForecastService.setup($scope);
				}
				$scope.reAssign = function() {
					FilterInGridService.clearAllNotification();
					CustomerForecastService.reAssign($scope);
				}
				$scope.sltReportSearch = function() {
					if($scope.tabIndex == 3) {
						CustomerForecastService.getSLTSummaryReport($scope);
					} else if($scope.tabIndex == 4) {
						CustomerForecastService.getSLTSummaryReportByWorkingNo($scope);
					}
				}
				$scope.selectDocument = function() {
					CustomerForecastService.selectDocument($scope);
				}
				$scope.bottomGridHeight = function() {

					if(!$scope.hideTopInfo) {
						return {
							height: "385px"
						}
					} {
						return {
							height: (window.innerHeight - 200) + "px"
						}
					}
				}
				$scope.importFile = function() {
					CustomerForecastService.importFile($scope);
				}
				$scope.setSeason = function() {
					CustomerForecastService.setSeason($scope);
				}
				$scope.releaseToBUERP = function() {
					CustomerForecastService.releaseToBUERP($scope);
				}
				$scope.selectDocumentTypeChanged = function() {
					CustomerForecastService.selectDocumentTypeChanged($scope);
				}
				$scope.selectDocumentChanged = function() {
					CustomerForecastService.selectDocumentChanged($scope);
				}
				$scope.checkOrderInfo = function() {
					CustomerForecastService.checkOrderInfo($scope);
				}
				CustomerForecastService.init($scope);
			}
		])
})();
