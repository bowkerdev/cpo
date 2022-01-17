(function() {
	'use strict';

	angular
		.module('cpo')
		.service('NonTradeCardService', ['$timeout', '$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants', 'workTableCommonService',
			function($timeout, $http, $translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants, workTableCommonService) {
				var searchKey2 = {};
				var searchKey3 = {};
				var searchKey5 = {};
				var searchKey6 = {};
				var searchKey7 = {};
				var searchKey8 = {};

				this.disableReleaseOrderButton = false;

				this.getAllHistoryOrder = function(scope) {
					var _this = this;
					GLOBAL_Http($http, "/cpo/api/document/query_order_document?", 'GET', {
						orderType: "6"
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
									console.log(doc.utcCreate);
									if(utcCreate < doc.utcCreate) {
										utcCreate = doc.utcCreate;
										index = i;
									}
								}
							});
							scope.selectDocumentType = scope.documentTypes[index];
							scope.gridOptions7.zsColumnFilterRequestParam.documentType = scope.selectDocumentType.id;
							//  scope.selectDocumentType = scope.documentTypes[ 0 ];
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
					this.clearFilterParams(scope);

					if(scope.selectDoc && scope.selectDoc.id) {
						scope.gridOptions2.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
						scope.gridOptions3.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
						scope.gridOptions5.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
						scope.gridOptions6.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
						scope.gridOptions7.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
						scope.gridOptions8.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
					} else {
						delete scope.gridOptions2.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions3.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions5.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions6.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions7.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions8.zsColumnFilterRequestParam.eq_document_id;
					}

					if(scope.selectDoc && scope.selectDoc.id) {
						this.refreshAll(scope);
					} else {
						this.clearAll(scope);
					}

				}
				this.clearAll = function(scope) {
					scope.gridOptions2.data = [];
					scope.gridOptions3.data = [];
					scope.gridOptions5.data = [];
					scope.gridOptions6.data = [];
					scope.gridOptions7.data = [];
					scope.gridOptions8.data = [];
				}
				this.clearFilterParams = function(scope) {
					scope.gridOptions2.zsFilter = {};
					scope.gridOptions3.zsFilter = {};
					scope.gridOptions5.zsFilter = {};
					scope.gridOptions6.zsFilter = {};
					scope.gridOptions7.zsFilter = {};
					scope.gridOptions8.zsFilter = {};

					searchKey2 = {};
					searchKey3 = {};
					searchKey5 = {};
					searchKey6 = {};
					searchKey7 = {};
					searchKey8 = {};
				};
				this.generateBatchNo = function(scope) {
					var __this = this;

					var documentId = "";

					if(scope.NewPending.length > 0) {
						documentId = scope.NewPending[0].documentId;
					} else if(scope.NewOrder.length > 0) {
						documentId = scope.NewOrder[0].documentId;
					} else {

					}
					if(!documentId) {
						modalAlert(CommonService, 3, "No document", null);
						return;
					}
					scope.generateBatchNoButtonDisabled = true;
					GLOBAL_Http($http, "cpo/api/worktable/generate_batch_no?", 'GET', {
						document_id: documentId
					}, function(data) {
						scope.generateBatchNoButtonDisabled = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							__this.refreshAll(scope);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.generateBatchNoButtonDisabled = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}
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

				this.calClass = function(List) {
					var ClassList = ["bowker-dashboard-card-forgive-green", "bowker-dashboard-card-violet", "bowker-dashboard-card-forgive-green", "bowker-dashboard-card-violet"];
					if(List) {
						var preClass = "col-md-3 col-sm-6 col-xs-12 bowker-dashboard-card ";
						for(var i = 0; i < List.length; i++) {
							List[i].itClass = preClass + ClassList[i % ClassList.length];
						}
					}
				};

				this.initGripOptionZero = function(scope) {
					var blueGreenTemplate = document.getElementById("blueGreenTemplate").innerText;
					var isNewTemplate = document.getElementById("isNewTemplate").innerText;
					var linkLabelTemplate = document.getElementById("linkLabelTemplate").innerText;
					var functionButtonTemplate = document.getElementById("functionButtonTemplate").innerText;
					scope.gridOptions = {
						data: 'dailyDocumentData',
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
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
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
								width: '30',
								minWidth: '30',
								enableCellEdit: false,
								cellTemplate: isNewTemplate
							},
							{
								name: 'documentVersion',
								displayName: $translate.instant('worktable.LASTEST_VERSION'),
								field: 'documentName',
								minWidth: '60',
								enableCellEdit: false,
								cellTemplate: linkLabelTemplate
							},
							{
								name: 'season',
								displayName: $translate.instant('documentlibrary.SEASON'),
								minWidth: '60',
								field: 'season',
								enableCellEdit: false
							},
							{
								name: 'batchDate',
								displayName: "Batch Date",
								minWidth: '60',
								field: 'orderDate',
								enableCellEdit: false
							},
							{
								name: 'resource',
								displayName: $translate.instant('documentlibrary.RESOURCE'),
								minWidth: '120',
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
								minWidth: '350',
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

				this.initGripOptionFour = function(scope, i, dataName) {

					var _this = this;
					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;

					var columns;
					var canFilter = true; //(i!=7);
					columns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", canFilter, 100);
					var url = "cpo/api/worktable/query_assignment_result_filter?";
					if(i == 8) {
						url = "cpo/api/worktable/get_change_order_filter?";
					} else if(i == 7) {
						url = "cpo/api/worktable/get_confirm_order_filter?";
					}
					var status = "";
					switch(i) {
						case 2:
							status = "0,3";
							break;
						case 3:
							status = "2";
							break;
						case 5:
							status = "4";
							break;
						case 6:
							status = "5";
							break;
					}
					var param = {
						orderType: "6",
						status: status
					};
					if(i == 8 || i == 7) {
						delete param.status;
					}
					if(i == 7) {
						delete param.orderType;
					}
					scope['gridOptions' + i] = {
						data: dataName,
						paginationPageSizes: [10, 20, 50, 100, 200, 500, 1000, 2000, 4000],
						enableColumnMenus: true,
						enableGridMenu: true,
						flatEntityAccess: true,
						fastWatch: true,
						paginationPageSize: 100,
						rowEditWaitInterval: -1,
						showLoading: false,
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
						zsGridName: "bulkorder_grid_" + i,
						useExternalPagination: true,
						enablePaginationControls: true,
						gridopntion1ableRowTemplate: '<div class="sub-ui-grid" ui-grid="row.entity.subGridOptions"></div>',
						gridopntion1ableRowHeight: 150,
						gridopntion1ableRowScope: {
							subGridVariable: 'subGridScopeVariable1'
						},
						columnDefs: columns,

						onRegisterApi: function(gridApi) {
							scope['gridApi' + i] = gridApi;

							gridApi.core.on.filterChanged(scope, function(col) {

								var __this = this;

								var grid = __this.grid;

								var newsearchKey = CommonService.getFilterParams(grid);
								if(i == 2) {
									searchKey2 = newsearchKey;
									_this.getAssignFactoryResult(scope, '6', '0,3', scope.page2, true);

								} else if(i == 3) {
									searchKey3 = newsearchKey;
									_this.getAssignFactoryResult(scope, '6', '2', scope.page2, true);
								} else if(i == 5) {
									searchKey5 = newsearchKey;
									_this.getTransitOrder(scope, scope.page4, '4', true);
								} else if(i == 6) {
									searchKey6 = newsearchKey;
									_this.getTransitOrder(scope, scope.page5, '5', true);
								} else if(i == 7) {
									searchKey7 = newsearchKey;
									_this.getConfimrOrder(scope);
								} else if(i == 8) {
									searchKey8 = newsearchKey;
									_this.getOrderChange(scope);
								}

							});
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
								//  gggg
								switch(i) {
									case 2:
										{
											scope['page' + i].curPage = newPage;
											scope['page' + i].pageSize = pageSize;
											_this.getAssignFactoryResult(scope, "6", '0,3', scope['page' + i], false);
											break;
										}
									case 3:
										{
											scope['page' + i].curPage = newPage;
											scope['page' + i].pageSize = pageSize;
											_this.getAssignFactoryResult(scope, "6", '2', scope['page' + i], false);
											break;

										}
									case 5:
										{
											scope.page4.curPage = newPage;
											scope.page4.pageSize = pageSize;
											_this.getTransitOrder(scope, scope.page4, '4', false);
											break;
										}
									case 6:
										{
											scope.page5.curPage = newPage;
											scope.page5.pageSize = pageSize;
											_this.getTransitOrder(scope, scope.page5, '5', false);
											break;
										}
									case 7:
										{
											scope.page7.curPage = newPage;
											scope.page7.pageSize = pageSize;
											_this.getConfimrOrder(scope);
											break;
										}
									case 8:
										{
											scope.page8.curPage = newPage;
											scope.page8.pageSize = pageSize;
											_this.getOrderChange(scope);
											break;
										}
								}
							});
						}
					};

				};

				this.refreshAll = function(scope) {

					this.getAssignFactoryResult(scope, "6", '0,3', scope.page2, true);
					this.getAssignFactoryResult(scope, "6", '2', scope.page3, true);
					this.getTransitOrder(scope, scope.page4, '4', true);
					this.getTransitOrder(scope, scope.page5, '5', true);
					this.getConfimrOrder(scope);
					this.getOrderChange(scope);

				}
				this.getDailyOrder = function(scope, type, doc, finallyCallback) {
					this.getAllHistoryOrder(scope);
					var _this = this;
					var param = {
						'orderType': type
					}
					// if ( documentType ) {
					//   param[ 'documentType' ] = documentType;
					//   param[ 'value' ] = "6";
					// }
					if(doc) {
						param['documentType'] = doc.documentType;
						param['value'] = "6";
						param['orderDate'] = doc.orderDate;
						param['documentName'] = doc.documentName;
					}
					GLOBAL_Http($http, "cpo/api/worktable/query_orders?", 'GET', param, function(data) {

						// if(data.output&&data.output.length>0){
						//
						//     scope.docs =[].concat(
						//     data.output.filter(function(item){
						//       return item.documentId
						//     }).map(function(item){
						//       return {
						//         id:item.documentId?item.documentId:"",
						//         label:(item.documentTypeName?item.documentTypeName:"")+"-"+(item.documentName?item.documentName:"")
						//       }})).sort(function(a,b){return b.id-a.id});;
						//     scope.selectDoc = scope.docs[0];
						//   _this.refreshAll(scope);
						// }else{
						//   scope.docs =[{id:"",label:"No Document"}];
						//   scope.selectDoc = scope.docs[0];
						// }

						if(finallyCallback) {
							finallyCallback()
						}
						if(data.output) {

							scope.dailyDocumentData = translateData(data.output);
							var documentIdList = [];
							var contains1 = false;
							var contains3 = false;
							var contains5 = false;
							var height = (scope.dailyDocumentData.length * 30) + 36;
							$("#grip3").css('height', height + 'px');
							angular.forEach(scope.dailyDocumentData, function(currentValue) {
								if(currentValue.uploadType == '1') {
									scope.existUploadType = true;
									currentValue['uploadHtml'] = '<i class="fa fa-upload"></i> Upload ';
									currentValue['Uploading'] = false;
									currentValue['Deleting'] = false;
								}
								if(currentValue['documentStatus'] == 1) {
									contains1 = true;
								}
								if(currentValue['documentStatus'] == 3) {
									documentIdList.push(currentValue['documentId']);
									contains3 = true;
								}
								if(currentValue['documentStatus'] == 5) {
									contains5 = true;
								}
							});
							scope.documentIds = stringListToString(documentIdList);
							if(contains5) {
								scope.stepNumber = 5;
								scrollGuild('#bulkOrderFlowGuild', 800);
							} else if(contains3) {
								scope.stepNumber = 3;
								scrollGuild('#bulkOrderFlowGuild', 800);
							} else if(contains1) {
								scope.stepNumber = 2;
							} else {
								scope.stepNumber = 1;
							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						if(finallyCallback) {
							finallyCallback()
						}
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

				this.dynamicColumns = function(number, gridOption) {
					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;
					for(var i = 1; i <= number; i++) {
						var sizeNameItem = {
							name: "SIZENAME_" + i,
							displayName: "Customer Size" + i,
							field: "SIZENAME_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}
						gridOption.columnDefs.push(sizeNameItem);

						var tsItem = {
							name: "TS_" + i,
							displayName: "Techical Size" + i,
							field: "TS_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}
						gridOption.columnDefs.push(tsItem);

						var qutyItem = {
							name: "OQTY_" + i,
							displayName: "Size" + i + " Qty",
							field: "OQTY_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverBigNumberTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}

						gridOption.columnDefs.push(qutyItem);

					}
				}
				this.toUpload = function(scope, entity) {
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
							_this.getDailyOrder(scope, 6);
						}
					}, function() {});
				}
				this.deleteDom = function(scope, entity) {

					if(!entity.documentId) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.NO_ORDER_FILE'), null);
						_this.refreshAll(scope);
						return;
					}
					var _this = this;
					var alertStr = $translate.instant('errorMsg.CONFIRM_DELETE_DOCUMENT');
					alertStr = alertStr.replace('{0}', entity.source);
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
								_this.getDailyOrder(scope, 6);
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
				this.getConfimrOrder = function(scope) {
					var param = {
						documentType: scope.selectDocumentType.id,
						pageSize: scope.page7.pageSize,
						pageNo: scope.page7.curPage
					};
					if(scope.selectDoc && scope.selectDoc.id) {
						param.eq_document_id = scope.selectDoc.id;
					}
					for(var attr in searchKey7) {
						if(searchKey7[attr]) {
							param[attr] = urlCharTransfer(searchKey7[attr]);
						}
					}

					var _this = this;
					scope.navList[4].loading = true;
					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", true, 100);

					scope.gridOptions7.showLoading = true;
					GLOBAL_Http($http, "cpo/api/worktable/get_confirm_order?", 'POST', param, function(data) {
						scope.gridOptions7.showLoading = false;
						scope.navList[4].loading = false;
						scope.navList[4].count = data.total ? data.total : "0";
						if(data.status == 0) {
							if(data.output) {
								scope.gridOptions7.data = translateData(data.output);
								scope.page7.totalNum = data.total;
								scope.gridOptions7.totalItems = scope.page7.totalNum;

							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.gridOptions7.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.getOrderChange = function(scope) {
					var param = {
						orderType: "6",
						pageSize: scope.page8.pageSize,
						pageNo: scope.page8.curPage
					};
					// if ( scope.selectDoc && scope.selectDoc.id ) {
					//   param.eq_document_id = scope.selectDoc.id;
					// }
					var _this = this;
					scope.gridOptions8.showLoading = true;
					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new_order_change", true, 100);

					for(var attr in searchKey8) {
						if(searchKey8[attr]) {
							param[attr] = urlCharTransfer(searchKey8[attr]);
						}
					}

					GLOBAL_Http($http, "cpo/api/worktable/get_change_order?", 'POST', param, function(data) {

						scope.gridOptions8.showLoading = false;

						if(data.status == 0) {
							if(data.output) {
								scope.gridOptions8.data = translateData(data.output);
								scope.gridOptions8.columnDefs = angular.copy(staticColumns);

								workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions8);

								if(scope.gridOptions8.data && scope.gridOptions8.data.length > 0) {

									for(var index in scope.gridOptions8.data) {
										var item = scope.gridOptions8.data[index];
										var manufacturingSize = item.ediOrderSizes;
										if(manufacturingSize) {
											for(var index2 = 0; index2 < manufacturingSize.length; index2++) {
												var xx = manufacturingSize[index2];

												if(xx) {
													item["OQTY_" + (index2 + 1)] = xx.sizeQuantity ? xx.sizeQuantity : "";
													item["TS_" + (index2 + 1)] = xx.manufacturingSize ? xx.manufacturingSize : "";
													item['SIZENAME_' + (index2 + 1)] = xx.sizeName ? xx.sizeName : "";
													item["unitPrice_" + (index2 + 1)] = xx.unitPrice ? xx.unitPrice : "";
												}
											}
										}
									}
								}
								scope.page8.totalNum = data.total;
								scope.navList[5].count = data.total ? data.total : "0";
								scope.gridOptions8.totalItems = scope.page8.totalNum;
								scope.tabStatus.tabIndex1 = true;

							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.gridOptions8.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.getTransitOrder = function(scope, page, status, shouldPageNumberReset) {
					scope.disableReleaseOrderButton = false;
					var param = {
						orderType: "6",
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

					if(scope.tabIndex == 3) {
						for(var attr in searchKey5) {
							if(searchKey5[attr]) {
								param[attr] = urlCharTransfer(searchKey5[attr]);
							}
						}
					} else {
						for(var attr in searchKey6) {
							if(searchKey6[attr]) {
								param[attr] = urlCharTransfer(searchKey6[attr]);
							}
						}

					}
					if(status == '4') {
						scope.gridOptions5.showLoading = true;
						scope.navList[2].loading = true;
					} else if(status == '5') {
						scope.gridOptions6.showLoading = true;
						scope.navList[3].loading = true;
					}
					var _this = this;
					scope.showLoading = true;
					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", true, 100);
					GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

						if(status == '4') {
							scope.gridOptions5.showLoading = false;

						} else if(status == '5') {
							scope.gridOptions6.showLoading = false;

						}

						if(data.status == 0) {
							if(data.output) {
								if(status == '4') {
									scope.gridOptions5.data = translateData(data.output);
									scope.gridOptions5.columnDefs = angular.copy(staticColumns);
									scope.navList[2].count = data.totalCount ? data.totalCount : "0";
									scope.navList[2].loading = false;
									workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions5);

									if(scope.gridOptions5.data && scope.gridOptions5.data.length > 0) {
										for(var index in scope.gridOptions5.data) {
											var item = scope.gridOptions5.data[index];
											var manufacturingSize = item.ediOrderSizes;
											if(manufacturingSize) {
												for(var index2 = 0; index2 < manufacturingSize.length; index2++) {
													var xx = manufacturingSize[index2];

													if(xx) {
														item["OQTY_" + (index2 + 1)] = xx.sizeQuantity ? xx.sizeQuantity : "";
														item["TS_" + (index2 + 1)] = xx.manufacturingSize ? xx.manufacturingSize : "";
														item['SIZENAME_' + (index2 + 1)] = xx.sizeName ? xx.sizeName : "";
														item["unitPrice_" + (index2 + 1)] = xx.unitPrice ? xx.unitPrice : "";
													}
												}
											}
										}
									}
									scope.page4.totalNum = data.total;
									scope.gridOptions5.totalItems = scope.page4.totalNum;
									scope.tabStatus.tabIndex1 = true;
								} else if(status == '5') {
									scope.gridOptions6.data = translateData(data.output);
									scope.gridOptions6.columnDefs = angular.copy(staticColumns);

									workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions6);

									if(scope.gridOptions6.data && scope.gridOptions6.data.length > 0) {
										for(var index in scope.gridOptions6.data) {
											var item = scope.gridOptions6.data[index];
											var manufacturingSize = item.ediOrderSizes;
											if(manufacturingSize) {
												for(var index2 = 0; index2 < manufacturingSize.length; index2++) {
													var xx = manufacturingSize[index2];

													if(xx) {
														item["OQTY_" + (index2 + 1)] = xx.sizeQuantity ? xx.sizeQuantity : "";
														item["TS_" + (index2 + 1)] = xx.manufacturingSize ? xx.manufacturingSize : "";
														item['SIZENAME_' + (index2 + 1)] = xx.sizeName ? xx.sizeName : "";
														item["unitPrice_" + (index2 + 1)] = xx.unitPrice ? xx.unitPrice : "";
													}
												}
											}
										}
									}
									scope.page5.totalNum = data.total;
									scope.navList[3].count = data.totalCount ? data.totalCount : "0";
									scope.navList[3].loading = false;
									scope.gridOptions6.totalItems = scope.page5.totalNum;
									scope.tabStatus.tabIndex1 = true;
								}

							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						if(status == '4') {
							scope.gridOptions5.showLoading = false;
						} else if(status == '5') {
							scope.gridOptions6.showLoading = false;
						}
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

				this.editFactoryCapacity = function(scope) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'factoryCapacityModal',
						controller: 'FactoryCapacityController',
						backdrop: 'static',
						size: 'lg',
						resolve: {
							planGroups: function() {
								return {
									TimeModel: scope.TimeModel
								};
							}
						}
					});
					// modalInstance callback
					modalInstance.result.then(function(returnData) {
						if(returnData) {

						}
					}, function() {
						// dismiss(cancel)
					});
				}

				this.assignFactory = function(scope) {
					var _this = this;
					var param = {
						criteriaVersionId: scope.version.id,
						documentType: 6
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

							//	modalAlert(CommonService, 2, $translate.instant('worktable.SUCCESS_ASSIGN'), null);
							_this.refreshAll(scope);
							_this.getDailyOrder(scope, 6);
						} else {
							modalAlert(CommonService, 3, data.message, null);
						}
					}, function(data) {
						_this.assignedStatus(scope);
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.getAssignFactoryResult = function(scope, type, status, page, shouldPageNumberReset) {
					scope.disableReleaseOrderButton = false;
					var param = {
						orderType: type,
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

					var _this = this;

					if(status == '2') {
						scope.gridOptions3.showLoading = true;
						scope.navList[1].loading = true;

					} else if(status == '0,3') {
						scope.gridOptions2.showLoading = true;
						scope.navList[0].loading = true;
					}

					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", true, 100);;

					GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

						if(status == '2') {
							scope.gridOptions3.showLoading = false;
						} else if(status == '0,3') {
							scope.gridOptions2.showLoading = false;
						};

						if(data.output) {

							switch(status) {
								case '2':
									{
										scope.NewOrder = translateData(data.output);
										scope.gridOptions3.data = scope.NewOrder;
										scope.gridOptions3.columnDefs = angular.copy(staticColumns);

										workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions3);

										if(scope.NewOrder && scope.NewOrder.length > 0) {
											for(var index in scope.NewOrder) {
												var item = scope.NewOrder[index];
												var manufacturingSize = item.ediOrderSizes;
												if(manufacturingSize) {
													for(var index2 = 0; index2 < manufacturingSize.length; index2++) {
														var xx = manufacturingSize[index2];

														if(xx) {
															item["OQTY_" + (index2 + 1)] = xx.sizeQuantity ? xx.sizeQuantity : "";
															item["TS_" + (index2 + 1)] = xx.manufacturingSize ? xx.manufacturingSize : "";
															item['SIZENAME_' + (index2 + 1)] = xx.sizeName ? xx.sizeName : "";
															item["unitPrice_" + (index2 + 1)] = xx.unitPrice ? xx.unitPrice : "";
														}
													}
												}
											}

										}
										scope.page3.totalNum = data.total;
										scope.navList[1].count = data.totalCount ? data.totalCount : "0";
										scope.navList[1].loading = false;
										scope.gridOptions3.totalItems = scope.page3.totalNum;

										scope.tabStatus.tabIndex1 = true;
										break;
									}
								case '0,3':
									{
										scope.NewPending = translateData(data.output);

										scope.gridOptions2.data = scope.NewPending;
										scope.page2.totalNum = data.total;
										scope.gridOptions2.columnDefs = angular.copy(staticColumns);
										workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions2);
										if(scope.NewPending && scope.NewPending.length > 0) {
											for(var index in scope.NewPending) {
												var item = scope.NewPending[index];
												var manufacturingSize = item.ediOrderSizes;
												if(manufacturingSize) {
													for(var index2 = 0; index2 < manufacturingSize.length; index2++) {
														var xx = manufacturingSize[index2];
														if(xx) {
															item["OQTY_" + (index2 + 1)] = xx.sizeQuantity ? xx.sizeQuantity : "";
															item["TS_" + (index2 + 1)] = xx.manufacturingSize ? xx.manufacturingSize : "";
															item['SIZENAME_' + (index2 + 1)] = xx.sizeName ? xx.sizeName : "";
															item["unitPrice_" + (index2 + 1)] = xx.unitPrice ? xx.unitPrice : "";
														}

													}
												}

											}

										}

										scope.gridOptions2.totalItems = scope.page2.totalNum;
										scope.navList[0].count = data.totalCount ? data.totalCount : "0";
										scope.navList[0].loading = false;
										if(data.total > 0) {
											// var height = (20 * 30) + 36;
											// $("#bulk_order_1").css('height', height + 'px');
										}
										scope.tabStatus.tabIndex2 = true;
										break;
									}
							}

						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						if(status == '2') {
							scope.gridOptions3.showLoading = false;
						} else if(status == '0,3') {
							scope.gridOptions2.showLoading = false;
						};
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.adjustFactoryAssignment = function(scope, mode) {
					var _this = this;
					var selectedRows = [];
					var selectedRows1 = [];
					switch(scope.tabIndex) {
						case 0:
							{
								selectedRows1 = scope.gridApi2.selection.getSelectedRows();
								for(var j = 0; j < scope.gridApi2.selection.getSelectedRows().length; j++) {
									if(scope.gridApi2.selection.getSelectedRows()[j].suggFactory.indexOf(",") < 1) {
										selectedRows.push(scope.gridApi2.selection.getSelectedRows()[j]);
									}
								}
								break;
							}
						case 1:
							{
								selectedRows1 = scope.gridApi3.selection.getSelectedRows();
								for(var j = 0; j < scope.gridApi3.selection.getSelectedRows().length; j++) {
									if(scope.gridApi3.selection.getSelectedRows()[j].suggFactory.indexOf(",") < 1) {
										selectedRows.push(scope.gridApi3.selection.getSelectedRows()[j]);
									}
								}
								break;
							}
						case 2:
							{
								selectedRows1 = scope.gridApi4.selection.getSelectedRows();
								selectedRows = scope.gridApi4.selection.getSelectedRows();
								break;
							}
						case 3:
							{
								selectedRows1 = scope.gridApi5.selection.getSelectedRows();
								selectedRows = scope.gridApi5.selection.getSelectedRows();
								break;
							}
						case 4:
							{
								selectedRows1 = scope.gridApi6.selection.getSelectedRows();
								selectedRows = scope.gridApi6.selection.getSelectedRows();
								break;
							}
						case 5:
							{
								selectedRows1 = scope.gridApi7.selection.getSelectedRows();
								selectedRows = scope.gridApi7.selection.getSelectedRows();
								break;
							}
						case 6:
							{
								selectedRows1 = scope.gridApi8.selection.getSelectedRows();
								selectedRows = scope.gridApi8.selection.getSelectedRows();
								break;
							}
					}
					if(selectedRows1.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}

					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.CONFIRM_MORE_THAN_TWO_SYSTEM_ASSIGNED_FACTORIES'), null);
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
					} else if(mode == 5) {
						for(var i = 0; i < selectedRows.length; i++) {
							var w = {
								"workingNo": selectedRows[i].workingNo,
								"lastProductionFactory": selectedRows[i].confirmFactory
							}
							workingNos.push(w);
						}
					}

					var param = {
						"ids": listToString(selectedRows, 'assignResultId'),
						"workingNos": workingNos,
						"mode": mode,
						"orderType": "6"
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

				this.selectTab = function(scope, index) {
					if(index < 2) {
						scope.tabIndex = index;
					} else {
						scope.tabIndex = index + 1;
					}
				}
				this.selectTab2 = function(scope, index) {
					scope.tabIndex2 = index;
				}
				this.assigningStatus = function(scope) {
					scope.assignHtml = '<span>' + $translate.instant('worktable.ASSIGNING') + '</span>';
					scope.assigning = true;
				};
				this.assignedStatus = function(scope) {
					scope.assignHtml = '<span>' + $translate.instant('worktable.SNED_TO_ASSIGN') + '</span>';
					scope.assigning = false;
				};
				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;

					searchKey2 = {};
					searchKey3 = {};
					searchKey5 = {};
					searchKey6 = {};
					scope.stepNumber = 2;
					scope.steps = [{
						content: "1.Upload/Refresh File",
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
					}, {
						content: "5.Revise Assignment",
						on: "#75AB4D",
						off: "lightgray"
					}, {
						content: "6.Final Confirmation",
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
					scope.NewPending = [];
					scope.NewOrder = [];
					//					scope.gridOptions5.data = [];
					scope.scrlTabsApi2 = {};
					scope.tabIndex = 0;
					scope.tabIndex2 = 0;
					scope.TimeModel = new Date().Format("yyyy-MM");
					scope.backGroundTemplate = document.getElementById("blueGreenTemplate").innerText;
					scope.isNewTemplate = document.getElementById("isNewTemplate").innerText;
					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					scope.season = "";
					for(var i = 2; i <= 8; i++) {
						scope['page' + i] = {
							curPage: 1,
							pageSize: 100,
							sortColumn: 'id',
							sortDirection: true,
							totalNum: 0
						};
					}
					//		scope.navList = ['New Pending', 'New Order', 'Transit Pending', 'Transit Order', 'Confirmed Order', 'Order Change'];
					scope.navList = [{
							name: "New Pending",
							count: 0
						},
						{
							name: "New Order",
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
							name: "Confirmed Order",
							count: 0
						}
					];
					scope.loadingList = ['Factory Capacity & Fill Rate', 'Special Process Capacity & Fill Rate'];
					scope.$on('detailPage.close', function(data) {
						scope.showDetailView = '';
					});
					scope.$on('workTableDetail.init', function(event, data) {
						scope.$broadcast('workTableDetail.afterInit', scope.factoryAssingmentResultDetail);
					});
					scope.$on('LC0190.scrollGuild', function(event, data) {
						switch(scope.stepNumber) {
							case 1:
								{
									break;
								}
							case 2:
								{
									break;
								}
							case 3:
								{
									scrollGuild('#bulkOrderFlowGuild', 800);
									break;
								}
							case 4:
								{
									scrollGuild('#bulkOrderFlowGuild', 800);
									break;
								}
						}
					});
					scope.dailyDocumentData = [];
					scope.LC0190DocumentData = [];
					this.initGripOptionZero(scope);

					;

					this.initGripOptionFour(scope, 2, scope.NewPending);
					this.initGripOptionFour(scope, 3, scope.NewOrder);
					this.initGripOptionFour(scope, 5, scope.transitPending);
					this.initGripOptionFour(scope, 6, scope.transitOrder);
					this.initGripOptionFour(scope, 7, scope.confirmOrderData);
					this.initGripOptionFour(scope, 8, scope.ordeerChangeData);

					_this.getDailyOrder(scope, 6);
					this.getSelectedData(scope);

				};

				this.initGripOptionTen = function(scope) {
					scope.gridOptions10 = {
						data: 'items',
						paginationPageSizes: [10, 20, 30, 40, 50],
						paginationPageSize: 10,
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

				this.viewCapacity = function(scope, type) {
					scope.viewCap = type;
					switch(type) {
						case 1:
							{
								var factCap = [];
								for(var i = 0; i < scope.allCapData.factoryCapData.length; i++) {
									var factoryCapacity = scope.allCapData.factoryCapData[i];
									for(var j = 0; j < factoryCapacity.factoryMonthLoadings.length; j++) {
										if(factoryCapacity.factoryMonthLoadings[j].fillRate >= 90) {
											factCap.push(factoryCapacity);
											break;
										}
									}
								}
								scope.factoryCapacityData = factCap;
								var processCap = [];
								for(var i = 0; i < scope.allCapData.processCapData.length; i++) {
									var item = scope.allCapData.processCapData[i];
									for(var j = 0; j < item.factoryProcessLoadings.length; j++) {
										var load = item.factoryProcessLoadings[j];
										if((load.loading / load.capacity * 100) >= 90) {
											processCap.push(item);
											break;
										}
									}
								}
								scope.items = processCap;
								break;
							}
						case 2:
							{
								scope.factoryCapacityData = angular.copy(scope.allCapData.factoryCapData);
								scope.items = angular.copy(scope.allCapData.processCapData);
								break;
							}
					}
				}
				this.adjustFactoryAssignment2 = function(scope, mode, confirmFactory) {
					var _this = this;
					var selectedRows = "";
					if(scope.tabIndex == 0) {
						selectedRows = scope.gridApi2.selection.getSelectedRows();
					} else if(scope.tabIndex == 1) {
						selectedRows = scope.gridApi3.selection.getSelectedRows();
					} else if(scope.tabIndex == 4) {
						selectedRows = scope.gridApi6.selection.getSelectedRows();
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
							transferReason: result.reason,
							transferRemark: result.remark,
							"isFactoryAdjustment": 'YES'
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
				this.releaseAllOrder = function(scope) {

					if(scope.NewPending.length > 0) {
						modalAlert(CommonService, 2, $translate.instant('worktable.PLEASE_CONFIRM_THE_PENDING_ORDER'), null);
						return;
					}
					if(scope.NewOrder.length == 0) {
						modalAlert(CommonService, 2, $translate.instant('worktable.NO_NEW_ORDER_CAN_RELEASE'), null);
						return;
					}

					var _this = this;
					scope.disableReleaseOrderButton = true;
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
				this.releaseOrderChangeOrder = function(scope) {

					var _this = this;
					scope.disableReleaseOrderButton = true;

					var selectedRows = "";
					selectedRows = scope.gridApi8.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						scope.disableReleaseOrderButton = false;
						return;
					}

					var param = {
						"in_status": "4,5",
						"isOrderChange": "YES",
						"assignResultIds": listToString(selectedRows, 'assignResultId')
					};

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
				this.releaseOrder = function(scope) {

					var _this = this;
					scope.disableReleaseOrderButton = true;

					var selectedRows = "";
					selectedRows = scope.gridApi3.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						scope.disableReleaseOrderButton = false;
						return;
					}

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
						"status": "4",
						"assignResultIds": listToString(selectedRows, 'assignResultId')
					};

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
				this.confirmOrder = function(scope) {
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

					var _this = this;
					scope.confirmOrderButtonDisabled = true;

					var selectedRows = "";
					if(scope.tabIndex == 3) {
						selectedRows = scope.gridApi5.selection.getSelectedRows();
					} else {
						selectedRows = scope.gridApi6.selection.getSelectedRows();
					}

					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						scope.confirmOrderButtonDisabled = false;
						return;
					}

					var param = {
						"documentIds": documentid,
						"status": "4",
						"confirmOrder": "YES",
						"assignResultIds": listToString(selectedRows, 'assignResultId')
					};

					GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
						scope.confirmOrderButtonDisabled = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);

							_this.refreshAll(scope);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.confirmOrderButtonDisabled = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.confirmAllOrder = function(scope) {

					if(scope.gridOptions6.data.length == 0) {
						modalAlert(CommonService, 2, $translate.instant('worktable.NO_TRANSIT_ORDER_CAN_CONFIRM'), null);
						return;
					}

					var _this = this;
					scope.confirmOrderButtonDisabled = true;
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
						"status": "4",
						"confirmOrder": "YES"
					};
					GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
						scope.confirmOrderButtonDisabled = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);
							_this.refreshAll(scope);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.confirmOrderButtonDisabled = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.releaseTransitPendingOrder = function(scope) {

					var _this = this;
					scope.disableReleaseOrderButton = true;

					var selectedRows = "";
					var status = null;
					if(scope.tabIndex == 3) {
						selectedRows = scope.gridApi5.selection.getSelectedRows();
						status = "4";
					} else if(scope.tabIndex == 4) {
						selectedRows = scope.gridApi6.selection.getSelectedRows();
						status = "5";
					} else if(scope.tabIndex == 5) {
						selectedRows = scope.gridApi7.selection.getSelectedRows();
						status = "5";
					}
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						scope.disableReleaseOrderButton = false;
						return;
					}
					var documentId;
					if(scope.tabIndex == 3) {
						documentId = scope.gridOptions5.data[0].documentId;
					} else if(scope.tabIndex == 4) {
						documentId = scope.gridOptions6.data[0].documentId;
					} else if(scope.tabIndex == 5) {
						documentId = scope.gridOptions7.data[0].documentId;
					}
					var param = {
						"documentIds": documentId,
						"status": status,
						"assignResultIds": listToString(selectedRows, 'assignResultId'),
						releaseTransit: "YES"
					};
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
				this.holdPendingOrder = function(scope) {

					var _this = this;
					scope.disableReleaseOrderButton = true;

					var selectedRows = "";
					if(scope.tabIndex == 1) {
						selectedRows = scope.gridApi3.selection.getSelectedRows();
					} else {
						selectedRows = scope.gridApi6.selection.getSelectedRows();
					}

					if(selectedRows.length <= 0) {
						scope.disableReleaseOrderButton = false;
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}

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
						"status": "4",
						"assignResultIds": listToString(selectedRows, 'assignResultId')
					};

					GLOBAL_Http($http, "cpo/api/document/hold_pending", 'POST', param, function(data) {
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

				this.refreshBno = function(scope, entity) {

					if(scope.gridOptions5.data.length == 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.NO_DATA_REFRESH'), null);
						return;
					}
					var _this = this;
					var documentId = scope.gridOptions5.data[0].documentId;
					scope.disableRefreshBNoButton = true;
					var param = {
						"documentId": documentId
					};

					GLOBAL_Http($http, "cpo/api/worktable/refreshBNo?", 'GET', param, function(data) {
						scope.disableRefreshBNoButton = false;
						if(data.status == 0) {
							_this.getTransitOrder(scope, scope.page4, '4', true);
							modalAlert(CommonService, 2, data.tips + $translate.instant('notifyMsg.REFRESH_DATA_SUCCESS'), null);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.disableRefreshBNoButton = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}
				this.reAssign = function(scope) {
					var param = {
						orderType: "6",
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
					var _this = this
					workTableCommonService.reAssignAll(scope, param, function(scope) {
						_this.refreshAll(scope)
					})
				}

				this.refreshCountryCode = function(scope, entity) {

					if(scope.gridOptions5.data.length == 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.NO_DATA_REFRESH'), null);
						return;
					}
					var _this = this;
					var documentId = scope.gridOptions5.data[0].documentId;
					scope.disableRefreshCountryCodeButton = true;
					var param = {
						"documentId": documentId
					};

					GLOBAL_Http($http, "cpo/api/worktable/refreshCountryCode?", 'GET', param, function(data) {
						scope.disableRefreshCountryCodeButton = false;
						if(data.status == 0) {

							_this.getTransitOrder(scope, scope.page7, 4, true);

							modalAlert(CommonService, 2, data.tips + $translate.instant('notifyMsg.REFRESH_DATA_SUCCESS'), null);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.disableRefreshCountryCodeButton = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

				this.toggleFilterRow = function(scope) {
					scope['gridOptions' + (scope.tabIndex + 2)].enableFiltering = !scope['gridOptions' + (scope.tabIndex + 2)].enableFiltering;
					scope['gridApi' + (scope.tabIndex + 2)].core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
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
									fileType: "501"

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

				this.exportCSV = function(scope) {
					this.exportFile(scope, 'isCSV');
				}

				this.exportFile = function(scope, isCSV) {

					var param = {
						documentType: 206,
						pageSize: 100000,
						pageNo: 1
					};
					switch(scope.tabIndex) {
						case 0:
							{
								param['orderType'] = '6';
								param['status'] = '0,2,3';
								break;
							}
						case 1:
							{
								param['orderType'] = '6';
								param['status'] = '0,2,3';
								break
							}
						case 2:
							{
								param['orderType'] = '6';
								param['status'] = '4';
								break;
							}
						case 3:
							{
								param['orderType'] = '6';
								param['status'] = '5';
								break
							}
						case 4:
							{
								param = {
									documentType: 212,
									pageSize: 100000,
									pageNo: 1
								};
							}
					}

					if(isCSV) {
						param.isExportCSV = 'YES';
					}

					if(scope.tabIndex != 6 && scope.selectDoc && scope.selectDoc.id) {
						param.eq_document_id = scope.selectDoc.id;
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
				this.refreshOrder = function(scope, entity) {
					var _this = this;
					var modalInstance =
						$uibModal.open({
							animation: true,
							ariaLabelledBy: "modal-header",
							templateUrl: 'app/worktable/refreshordermodal.html',
							controller: 'refreshOrderCtrl',
							resolve: {
								parameter: function() {
									return {
										documentType: entity.documentType,
										orderType: 6
									};
								}
							}

						});
					modalInstance.resolve = function(result) {
						var doc = {};
						doc['documentType'] = entity.documentType;
						doc['orderDate'] = result.orderTime;
						doc['documentName'] = result.documentName;
						doc['orderType'] = 6;
						entity.disableRefreshButton = true;
						GLOBAL_Http($http, "cpo/api/worktable/refresh_order?", 'POST', doc, function(data) {
							if(data.status != 0) {
								modalAlert(CommonService, 2, data.message, null);
							}else{
								_this.getDailyOrder(scope, 3);
							}
							entity.disableRefreshButton = false;
						}, function(data) {
							entity.disableRefreshButton = false;
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					}

				}

				this.setSeason = function(scope) {
					var _this = this;
					var selectedRows = null; //scope.gridApi5.selection.getSelectedRows();
					var ids = new Array();
					if(scope.tabIndex == 0) {
						selectedRows = scope.gridApi2.selection.getSelectedRows();
					} else if(scope.tabIndex == 1) {
						selectedRows = scope.gridApi3.selection.getSelectedRows();
					} else if(scope.tabIndex == 3) {
						selectedRows = scope.gridApi5.selection.getSelectedRows();
					}

					;
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
									orderType: 3,
									season: season,
									ids: ids.join(",")
								}
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

						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.confirmChange = function(scope) {
					var _this = this;
					var selectedRows = scope.gridApi8.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
					var param = {
						"ids": listToString(selectedRows, 'orderMasterId')
					}

					GLOBAL_Http($http, "cpo/api/worktable/confirm_order_change", 'POST', param, function(data) {
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							scope.page8.curPage = 1;
							_this.getOrderChange(scope);
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {

						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
			}
		])
		.controller('NonTradeCardCtrl', ['$scope', 'NonTradeCardService',
			function($scope, NonTradeCardService) {
				$scope.refreshAll = function() {
					NonTradeCardService.refreshAll($scope);
				}

				$scope.confirmOrder = function() {
					NonTradeCardService.confirmOrder($scope);
				}
				$scope.confirmAllOrder = function() {
					NonTradeCardService.confirmAllOrder($scope);
				}

				$scope.selectTab = function(index) {
					NonTradeCardService.selectTab($scope, index);
				}
				$scope.setupScrollableTabSet = function(length, index) {
					if(length >= index + 1) {
						if($scope.scrlTabsApi.doRecalculate) {
							$scope.scrlTabsApi.doRecalculate();
						}
					}
				};
				$scope.selectTab2 = function(index) {
					NonTradeCardService.selectTab2($scope, index);
				}
				$scope.setupScrollableTabSet2 = function(length, index) {
					if(length >= index + 1) {
						if($scope.scrlTabsApi2.doRecalculate) {
							$scope.scrlTabsApi2.doRecalculate();
						}
					}
				};

				$scope.adjustFactoryAssignment = function(mode, tab) {
					NonTradeCardService.adjustFactoryAssignment($scope, mode, tab);
				}
				$scope.releaseOrder = function(type) {
					NonTradeCardService.releaseOrder($scope, type);
				}
				$scope.releaseAllOrder = function(type) {
					NonTradeCardService.releaseAllOrder($scope, type);
				}
				$scope.holdPendingOrder = function(type) {
					NonTradeCardService.holdPendingOrder($scope, type);
				}
				$scope.releaseTransitPendingOrder = function(type) {
					NonTradeCardService.releaseTransitPendingOrder($scope, type);
				};
				$scope.exportFile = function() {
					NonTradeCardService.exportFile($scope);
				}
				$scope.exportCSV = function() {
					NonTradeCardService.exportCSV($scope);
				}
				$scope.toUpload = function(entity) {
					NonTradeCardService.toUpload($scope, entity);
				};
				$scope.editFactoryCapacity = function() {
					NonTradeCardService.editFactoryCapacity($scope);
				}
				$scope.assignFactory = function() {
					NonTradeCardService.assignFactory($scope);
				}
				$scope.viewCapacity = function(type) {
					NonTradeCardService.viewCapacity($scope, type);
				}

				$scope.refreshOrder = function(entity) {
					NonTradeCardService.refreshOrder($scope, entity);
				}
				$scope.refreshBno = function(entity) {
					NonTradeCardService.refreshBno($scope, entity);
				}
				$scope.refreshCountryCode = function(entity) {
					NonTradeCardService.refreshCountryCode($scope, entity);
				}
				$scope.deleteDom = function(entity) {
					NonTradeCardService.deleteDom($scope, entity);
				};
				$scope.toggleFilterRow = function() {
					NonTradeCardService.toggleFilterRow($scope);
				};
				$scope.adjustFactoryAssignment2 = function(mode, confirmFactory) {
					NonTradeCardService.adjustFactoryAssignment2($scope, mode, confirmFactory);
				};
				$scope.importFile = function(mode, confirmFactory) {
					NonTradeCardService.importFile($scope);
				};
				$scope.reAssign = function() {
					NonTradeCardService.reAssign($scope)
				}
				$scope.confirmChange = function() {
					NonTradeCardService.confirmChange($scope)
				}
				$scope.setSeason = function() {
					NonTradeCardService.setSeason($scope);
				}
				$scope.generateBatchNo = function() {
					NonTradeCardService.generateBatchNo($scope);
				}
				$scope.selectDocument = function() {
					NonTradeCardService.selectDocument($scope);
				}
				$scope.selectDocumentTypeChanged = function() {
					NonTradeCardService.selectDocumentTypeChanged($scope);
				}
				$scope.selectDocumentChanged = function() {
					NonTradeCardService.selectDocumentChanged($scope);
				}
				$scope.releaseOrderChangeOrder = function() {
					NonTradeCardService.releaseOrderChangeOrder($scope);
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
				NonTradeCardService.init($scope);
			}
		]);

})();