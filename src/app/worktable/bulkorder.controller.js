(function() {
	'use strict';

	angular
		.module('cpo')
		.service('BulkOrderService', ['$timeout', '$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants', 'workTableCommonService',
			function($timeout, $http, $translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants, workTableCommonService) {
				var searchKey2 = {};
				var searchKey3 = {};
				var searchKey5 = {};
				var searchKey6 = {};
				var searchKey7 = {};
				var searchKey8 = {};
				var searchKey10 = {};
				var searchKey11 = {};

				this.disableReleaseOrderButton = false;
				this.downloadNewOrderInTradeCard = function(scope, entity) {

					var param = {
						pageSize: 100000,
						pageNo: 1
					};
					switch(entity.documentType) {
						case '6':
							param['documentType'] = 603;
							break;
						case '7':
							param['documentType'] = 604;
							break;
						case '8':
							param['documentType'] = 605;
							break;
						case '9':
							param['documentType'] = 606;
							break;
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
						} else {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
						}
					}, function(data) {
						CommonService.hideLoadingView();
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.downloadEmailChecking = function(scope, entity) {
					if(entity.orderQuantity == 0) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
					} else {
						var param = {
							documentType: 10000
						};
						switch(entity.documentType) {
							case '6':
								{
									param['in_order_actual_type'] = 'LC0190,MTF Order,PPC Order';
									break;
								}
							case '7':
								{
									param['in_order_actual_type'] = 'MTF Contract';
									break;
								}
							case '8':
								{
									param['in_order_actual_type'] = 'PPC Contract';
									break;
								}
							case '9':
								{
									param['in_order_actual_type'] = 'SLT Order';
									break;
								}
						}
						exportExcel(param, "cpo/portal/document/export_file?", "_blank");
					}
				}

				this.getAllHistoryOrder = function(scope) {
					var _this = this;
					GLOBAL_Http($http, "/cpo/api/document/query_order_document?", 'GET', {
						orderType: "3"
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
							//  scope.selectDocumentType = scope.documentTypes[ 0 ];
							scope.gridOptions7.zsColumnFilterRequestParam.documentType = scope.selectDocumentType.id;
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
						//  scope.gridOptions8.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
					} else {
						delete scope.gridOptions2.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions3.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions5.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions6.zsColumnFilterRequestParam.eq_document_id;
						delete scope.gridOptions7.zsColumnFilterRequestParam.eq_document_id;
						// delete scope.gridOptions8.zsColumnFilterRequestParam.eq_document_id;
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
					scope.gridOptions9.data = [];
					scope.gridOptions10.data = [];
					scope.gridOptions11.data = [];
				}
				this.clearFilterParams = function(scope) {
					scope.gridOptions2.zsFilter = {};
					scope.gridOptions3.zsFilter = {};
					scope.gridOptions5.zsFilter = {};
					scope.gridOptions6.zsFilter = {};
					scope.gridOptions7.zsFilter = {};
					scope.gridOptions8.zsFilter = {};
					scope.gridOptions9.zsFilter = {};
					scope.gridOptions10.data = [];
					scope.gridOptions11.data = [];

					searchKey2 = {};
					searchKey3 = {};
					searchKey5 = {};
					searchKey6 = {};
					searchKey7 = {};
					searchKey8 = {};
					searchKey10 = {};
					searchKey11 = {};
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
					var selectedRows;
					if(scope.tabIndex == 0) {
						selectedRows = scope.gridApi2.selection.getSelectedRows();
					} else if(scope.tabIndex == 1) {
						selectedRows = scope.gridApi3.selection.getSelectedRows();
					} else if(scope.tabIndex == 3) {
						selectedRows = scope.gridApi5.selection.getSelectedRows();
					} else if(scope.tabIndex == 4) {
						selectedRows = scope.gridApi6.selection.getSelectedRows();
					} else if(scope.tabIndex == 5) {
						selectedRows = scope.gridApi7.selection.getSelectedRows();
					}

          if(!selectedRows || selectedRows.length==0){
            modalAlert(CommonService, 3, "Please Select At Least Record .", null);
            return;
          }


          var param={
            document_id: documentId,
            "assignResultIds": listToString(selectedRows, 'assignResultId')
          }


					scope.generateBatchNoButtonDisabled = true;
					GLOBAL_Http($http, "cpo/api/worktable/generate_batch_no?", 'POST', param, function(data) {
						scope.generateBatchNoButtonDisabled = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							__this.refreshAll(scope,'YES');
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.generateBatchNoButtonDisabled = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});ss

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
					var exportButtonTemplate = document.getElementById("exportButtonTemplate").innerText;
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
								enableCellEdit: false
							},
							{
								name: 'uploadType',
								displayName: "",
								field: 'uploadType',
								minWidth: '350',
								enableCellEdit: false,
								cellTemplate: functionButtonTemplate
							},
							{
								name: 'orderQuantity',
								displayName: $translate.instant('worktable.NEW_ORDER_IN_TRADE_CARD'),
								field: 'orderQuantity',
								minWidth: '350',
								enableCellEdit: false,
								cellTemplate: exportButtonTemplate,
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
					if(i == 8 || i == 9) {
						url = "cpo/api/worktable/get_change_order_filter?";
					} else if(i == 7) {
						url = "cpo/api/worktable/get_confirm_order_filter?";
					}
					var status = "";
          var pageSizeA = [10, 20, 50, 100, 200, 500, 1000, 2000, 4000];
					switch(i) {
						case 2:
							status = "0,3";
              pageSizeA = [100000];
							break;
						case 3:
							status = "2";
              pageSizeA = [100000];
							break;
						case 5:
							status = "4";
              pageSizeA = [100000];
							break;
						case 6:
							status = "5";
              pageSizeA = [100000];
							break;
						case 7:
              pageSizeA = [100000];
							break;
						case 10:
							{
								status = "5";
								break;
							}
						case 11:
							{
								status = "5";
								break;
							}
					}
					var param = {
						orderType: "3",
						status: status
					};
					if(i == 7 || i == 8 || i == 9) {
						delete param.status;
					}
					if(i == 7) {
						delete param.orderType;
					}else if(i==8){
						param['asin_change_status'] = 'NEW**UPDATE'
						param['asin_change_status_org'] = '1**2'
					}else if(i==9){
						param['asin_change_status'] = 'CONFIRM'
						param['asin_change_status_org'] = '3'
					}
					if(i == 10) {
						param['isOrderFactoryChange'] = 'YES';
						param['eq_order_approval_status'] = '1';
					} else if(i == 11) {
						param['isOrderFactoryChange'] = 'YES';
						param['eq_order_approval_status'] = '4';
					}
					scope['gridOptions' + i] = {
						data: dataName,
						paginationPageSizes: pageSizeA,
						enableColumnMenus: true,
						enableGridMenu: true,
						flatEntityAccess: true,
						fastWatch: true,
						paginationPageSize: pageSizeA[0]==100000?100000:100,
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
									_this.getAssignFactoryResult(scope, '3', '0,3', scope.page2, true);

								} else if(i == 3) {
									searchKey3 = newsearchKey;
									_this.getAssignFactoryResult(scope, '3', '2', scope.page3, true);
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
									_this.getOrderChange(scope, 'PENDING');
								} else if(i == 9) {
									searchKey8 = newsearchKey;
									_this.getOrderChange(scope, 'CONFIRMED');
								} else if(i == 10) {
									searchKey10 = newsearchKey;
									_this.getAssignFactoryResult(scope, '3', '5', scope.page10, true, true, '10');
								} else if(i == 11) {
									searchKey11 = newsearchKey;
									_this.getAssignFactoryResult(scope, '3', '5', scope.page11, true, true, '11');
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
											_this.getAssignFactoryResult(scope, '3', '0,3', scope['page' + i], false);
											break;
										}
									case 3:
										{
											scope['page' + i].curPage = newPage;
											scope['page' + i].pageSize = pageSize;
											_this.getAssignFactoryResult(scope, '3', '2', scope['page' + i], false);
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
											_this.getOrderChange(scope, 'PENDING');
											break;
										}
									case 9:
										{
											scope.page9.curPage = newPage;
											scope.page9.pageSize = pageSize;
											_this.getOrderChange(scope, 'CONFIRMED');
											break;
										}
									case 10:
										{
											scope['page' + i].curPage = newPage;
											scope['page' + i].pageSize = pageSize;
											_this.getAssignFactoryResult(scope, '3', '5', scope['page' + i], false, true, '10');
											break;
										}
									case 11:
										{
											scope['page' + i].curPage = newPage;
											scope['page' + i].pageSize = pageSize;
											_this.getAssignFactoryResult(scope, '3', '5', scope['page' + i], false, true, '11');
											break;
										}
								}
							});
						}
					};

				};

				this.refreshAll = function(scope,onlyOrder) {

					this.getAssignFactoryResult(scope, '3', '0,3', scope.page2, true);
					this.getAssignFactoryResult(scope, '3', '2', scope.page3, true);
					this.getTransitOrder(scope, scope.page4, '4', true);
					this.getTransitOrder(scope, scope.page5, '5', true);
					this.getConfimrOrder(scope);
					if('YES'!=onlyOrder){
						this.getOrderChange(scope, 'PENDING');
						this.getOrderChange(scope, 'CONFIRMED');
						this.getAssignFactoryResult(scope, '3', '5', scope.page10, true, true, '10');
						this.getAssignFactoryResult(scope, '3', '5', scope.page11, true, true, '11');
					}

				}
				this.getDailyOrder = function(scope, type, doc, finallyCallback) {
					this.getAllHistoryOrder(scope);
					var _this = this;
					var param = {
						'orderType': type
					}
					// if ( documentType ) {
					//   param[ 'documentType' ] = documentType;
					//   param[ 'value' ] = '3';
					// }
					if(doc) {
						param['documentType'] = doc.documentType;
						param['value'] = '3';
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
							_this.getDailyOrder(scope, 3);
						}
					}, function() {});
				}
				this.deleteDom = function(scope, entity) {
					if(!entity.documentId) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.NO_ORDER_FILE'), null);
						_this.refreshAll(scope,'YES');
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
								_this.getDailyOrder(scope, 3);
								_this.refreshAll(scope,'YES');
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
						pageSize: scope.page7.pageSize.toString(),
						pageNo: scope.page7.curPage.toString()
					};
          if(scope.selectPos){
              param['in_po'] = scope.selectPos.replace(/,/g,'**').replace(/\n/g, '**').replace(/' '/g, '**');
          }else{
            if(scope.selectDoc && scope.selectDoc.id) {
              param.eq_document_id = scope.selectDoc.id;
            }
          }
					for(var attr in searchKey7) {
						if(searchKey7[attr]) {
							param[attr] = urlCharTransfer(searchKey7[attr]);
						}
					}
					var _this = this;
					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", true, 100);

					scope.gridOptions7.showLoading = true;
					scope.navList[4].loading = true;
					GLOBAL_Http($http, "cpo/api/worktable/get_confirm_order?", 'POST', param, function(data) {
						scope.navList[4].loading = false;
						scope.gridOptions7.showLoading = false;
						scope.navList[4].count = data.total ? data.total : "0";
						if(data.status == 0) {
							if(data.output) {
								scope.gridOptions7.data = translateData(data.output);
								scope.page7.totalNum = data.total;
								scope.gridOptions7.totalItems = scope.page7.totalNum;

								scope.gridOptions7.columnDefs = angular.copy(staticColumns);

								workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions7);

								if(scope.gridOptions7.data && scope.gridOptions7.data.length > 0) {
									for(var index in scope.gridOptions7.data) {
										var item = scope.gridOptions7.data[index];
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
							} else {
								modalAlert(CommonService, 2, data.message, null);
							}
						}
					}, function(data) {
						scope.gridOptions7.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.getOrderChange = function(scope, type) {
					if(!type) {
						return
					}
					var page = {}
					var option = {}
					var navIndex = 6
					if(type === 'PENDING') {
						page = scope.page8
						option = scope.gridOptions8
						navIndex = 5
					} else {
						page = scope.page9
						option = scope.gridOptions9
						navIndex = 6
					}
					var param = {
						orderType: "3",
						pageSize: page.pageSize,
						pageNo: page.curPage
					};
					// if ( scope.selectDoc && scope.selectDoc.id ) {
					//   param.eq_document_id = scope.selectDoc.id;
					// }

					var _this = this;
					option.showLoading = true;
					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new_order_change", true, 100);

					for(var attr in searchKey8) {
						if(searchKey8[attr]) {
							param[attr] = urlCharTransfer(searchKey8[attr]);
						}
					}
					if(navIndex === 5) {
						param['in_change_status'] = 'NEW,UPDATE'
						param['in_changeStatusOrg'] = '1**2'
						// param['ne_order_actual_type'] = 'MI Order'
					} else {
						param['in_change_status'] = 'CONFIRM'
						param['in_changeStatusOrg'] = '3'
						// param['ne_order_actual_type'] = 'MI Order'

					}
					scope.navList[navIndex].loading = true;
					GLOBAL_Http($http, "cpo/api/worktable/get_change_order?", 'POST', param, function(data) {
						scope.navList[navIndex].loading = false;
						option.showLoading = false;

						if(data.status == 0) {
							if(data.output) {
								option.data = translateData(data.output);
								option.columnDefs = angular.copy(staticColumns);
								if(navIndex != 5) {
									//add two column at head
									var preHeader = workTableCommonService.constructeAssignmentStaticColumns(scope, "order_change_confirm_tab_first_header", true, 100);
									option.columnDefs = preHeader.concat(option.columnDefs);
								}

								workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, option);

								if(option.data && option.data.length > 0) {

									for(var index in option.data) {
										var item = option.data[index];
										item.orderChangeUpdateTime = dateTimeDetailFormat(item.orderChangeUpdateTime);
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
								page.totalNum = data.total;
								scope.navList[navIndex].count = data.total ? data.total : "0";
								option.totalItems = page.totalNum;
								scope.tabStatus.tabIndex1 = true;

							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						option.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.getTransitOrder = function(scope, page, status, shouldPageNumberReset) {

					switch(status) {
						case '4':
							{
								scope.navList[2].loading = true;
								break;
							}
						case '5':
							{
								scope.navList[3].loading = true;
								break;
							}
					}

					scope.disableReleaseOrderButton = false;
					var param = {
						orderType: "3",
						status: status,
						pageSize: page.pageSize,
						pageNo: page.curPage
					};

          if(scope.selectPos){
              param['in_po'] = scope.selectPos.replace(/,/g,'**').replace(/\n/g, '**').replace(/' '/g, '**');
          }else{
            if(scope.selectDoc && scope.selectDoc.id) {
              param.eq_document_id = scope.selectDoc.id;
            }
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
					} else if(status == '5') {
						scope.gridOptions6.showLoading = true;
					}
					var _this = this;
					scope.showLoading = true;
					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", true, 100);
					GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

						if(status == '4') {
							scope.gridOptions5.showLoading = false;
							scope.navList[2].loading = false;
						} else if(status == '5') {
							scope.gridOptions6.showLoading = false;
							scope.navList[3].loading = false;
						}

						if(data.status == 0) {
							if(data.output) {
								if(status == '4') {
									scope.gridOptions5.data = translateData(data.output);
									scope.gridOptions5.columnDefs = angular.copy(staticColumns);
									scope.navList[2].count = data.totalCount ? data.totalCount : "0";
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

				this.assignFactory = function(scope) {
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
							documentType: 3,
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

								//	modalAlert(CommonService, 2, $translate.instant('worktable.SUCCESS_ASSIGN'), null);
								_this.refreshAll(scope,'YES');
								_this.getDailyOrder(scope, 3);
							} else {
								modalAlert(CommonService, 3, data.message, null);
							}
						}, function(data) {
							_this.assignedStatus(scope);
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					}
				}

				this.getAssignFactoryResult = function(scope, type, status, page, shouldPageNumberReset, isOrderFactoryChange, changeIndex) {

					scope.disableReleaseOrderButton = false;

					switch(status) {
						case '2':
							{
								scope.navList[1].loading = true;
								break;
							}
						case '0,3':
							{
								scope.navList[0].loading = true;
								break;
							}
						case '5':
							{
								if('10' == changeIndex) {
									scope.navList[7].loading = true;
								} else if('11' == changeIndex) {
									scope.navList[8].loading = true;
								}
								break;
							}
					}

					var param = {
						orderType: type,
						status: status,
						pageSize: page.pageSize,
						pageNo: page.curPage
					};

					if('5' != status) {
            if(scope.selectPos){
                param['in_po'] = scope.selectPos.replace(/,/g,'**').replace(/\n/g, '**').replace(/' '/g, '**');
            }else{
              if(scope.selectDoc && scope.selectDoc.id) {
                param.eq_document_id = scope.selectDoc.id;
              }
            }
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
					} else if(scope.tabIndex == 1) {
						for(var attr in searchKey3) {
							if(searchKey3[attr]) {
								param[attr] = urlCharTransfer(searchKey3[attr]);
							}
						}
					} else if(scope.tabIndex == 7) {
						for(var attr in searchKey10) {
							if(searchKey10[attr]) {
								param[attr] = urlCharTransfer(searchKey10[attr]);
							}
						}
					} else if(scope.tabIndex == 8) {
						for(var attr in searchKey11) {
							if(searchKey11[attr]) {
								param[attr] = urlCharTransfer(searchKey11[attr]);
							}
						}
					}

					if(isOrderFactoryChange) {
						param['isOrderFactoryChange'] = 'YES';
						if('10' == changeIndex) {
							param['eq_order_approval_status'] = '1';
						} else if('11' == changeIndex) {
							param['eq_order_approval_status'] = '4';
						}
					}

					var _this = this;

					if(status == '2') {
						scope.gridOptions3.showLoading = true;
					} else if(status == '0,3') {
						scope.gridOptions2.showLoading = true;
					} else if(status == '5') {
						if('10' == changeIndex) {
							scope.gridOptions10.showLoading = true;
						} else if('11' == changeIndex) {
							scope.gridOptions11.showLoading = true;
						}
					}

					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", true, 100);

					GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

						switch(status) {
							case '2':
								{
									scope.navList[1].loading = false;
									break;
								}
							case '0,3':
								{
									scope.navList[0].loading = false;
									break;
								}
							case '5':
								{
									if('10' == changeIndex) {
										scope.navList[7].loading = false;
									} else if('11' == changeIndex) {
										scope.navList[8].loading = false;
									}
									break;
								}
						}

						if(status == '2') {
							scope.gridOptions3.showLoading = false;
						} else if(status == '0,3') {
							scope.gridOptions2.showLoading = false;
						} else if(status == '5') {
							if('10' == changeIndex) {
								scope.gridOptions10.showLoading = false;
							} else if('11' == changeIndex) {
								scope.gridOptions11.showLoading = false;
							}
						}

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
										scope.tabStatus.tabIndex2 = true;
										break;
									}
								case '5':
									{

										var approvePending = workTableCommonService.constructeAssignmentStaticColumns(scope, "approval_pending", true, 100);
										if('10' == changeIndex) {
											scope.approvedPending = translateData(data.output);
											scope.gridOptions10.data = scope.approvedPending;
											scope.page10.totalNum = data.total;
											scope.gridOptions10.columnDefs = angular.copy(staticColumns);
											scope.gridOptions10.columnDefs = approvePending.concat(scope.gridOptions10.columnDefs);
											workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions10);
											if(scope.approvedPending && scope.approvedPending.length > 0) {
												for(var index in scope.approvedPending) {
													var item = scope.approvedPending[index];
													item.orderApprovalCreateTime = dateTimeDetailFormat(item.orderApprovalCreateTime);
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
											scope.gridOptions10.totalItems = scope.page10.totalNum;
											scope.navList[7].count = data.totalCount ? data.totalCount : "0";
										} else if('11' == changeIndex) {

											var approveTransit = workTableCommonService.constructeAssignmentStaticColumns(scope, "approval_transit", true, 100);
											scope.retransitOrder = translateData(data.output);
											scope.gridOptions11.data = scope.retransitOrder;
											scope.page11.totalNum = data.total;
											scope.gridOptions11.columnDefs = angular.copy(staticColumns);
											scope.gridOptions11.columnDefs = approveTransit.concat(scope.gridOptions11.columnDefs);
											scope.gridOptions11.columnDefs = approvePending.concat(scope.gridOptions11.columnDefs);
											workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions11);
											if(scope.retransitOrder && scope.retransitOrder.length > 0) {
												for(var index in scope.retransitOrder) {
													var item = scope.retransitOrder[index];
													item.orderApprovalCreateTime = dateTimeDetailFormat(item.orderApprovalCreateTime);
													item.orderApprovalUpdateTime = dateTimeDetailFormat(item.orderApprovalUpdateTime);
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
											scope.gridOptions11.totalItems = scope.page11.totalNum;
											scope.navList[8].count = data.totalCount ? data.totalCount : "0";
										}
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
						} else if(status == '5') {
							if('10' == changeIndex) {
								scope.gridOptions10.showLoading = false;
							} else if('11' == changeIndex) {
								scope.gridOptions11.showLoading = false;
							}
						}
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
								selectedRows1 = scope.gridApi5.selection.getSelectedRows();
								selectedRows = scope.gridApi5.selection.getSelectedRows();
								break;
							}
						case 3:
							{
								selectedRows1 = scope.gridApi6.selection.getSelectedRows();
								selectedRows = scope.gridApi6.selection.getSelectedRows();
								break;
							}
						case 4:
							{
								selectedRows1 = scope.gridApi7.selection.getSelectedRows();
								selectedRows = scope.gridApi7.selection.getSelectedRows();
								break;
							}
						case 5:
							{
								selectedRows1 = scope.gridApi8.selection.getSelectedRows();
								selectedRows = scope.gridApi8.selection.getSelectedRows();
								break;
							}
						case 6:
							{
								selectedRows1 = scope.gridApi9.selection.getSelectedRows();
								selectedRows = scope.gridApi9.selection.getSelectedRows();
								break;
							}
						case 7:
							{
								selectedRows1 = scope.gridApi10.selection.getSelectedRows();
								selectedRows = scope.gridApi10.selection.getSelectedRows();
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
						"orderType": "3"
					}
					GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function(data) {
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							_this.refreshAll(scope,'YES');
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
					for(var i = 2; i <= 11; i++) {
						scope['page' + i] = {
							curPage: 1,
							pageSize: [2,3,5,6,7].indexOf(i)?100000:100,
							sortColumn: 'id',
							sortDirection: true,
							totalNum: 0
						};
					}
					//		scope.navList = ['New Pending', 'New Order', 'Transit Pending', 'Transit Order', 'Confirmed Order', 'Order Change'];
					scope.navList = [{
							name: "New Pending",
							count: 0,
							loading: false
						},
						{
							name: "New Order",
							count: 0,
							loading: false
						},
						{
							name: "Transit Pending",
							count: 0,
							loading: false
						},
						{
							name: "Transit Order",
							count: 0,
							loading: false
						},
						{
							name: "Confirmed Order",
							count: 0,
							loading: false
						},
						{
							name: "Change Pending",
							count: 0,
							loading: false
						},
						{
							name: "Confirmed Change",
							count: 0,
							loading: false
						},
						{
							name: "Approval Pending",
							count: 0,
							loading: false
						},
						{
							name: "Approval Log",
							count: 0,
							loading: false
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
					this.initGripOptionFour(scope, 2, scope.NewPending);
					this.initGripOptionFour(scope, 3, scope.NewOrder);
					this.initGripOptionFour(scope, 5, scope.transitPending);
					this.initGripOptionFour(scope, 6, scope.transitOrder);
					this.initGripOptionFour(scope, 7, scope.confirmOrderData);
					this.initGripOptionFour(scope, 8, scope.ordeerChangeData);
					this.initGripOptionFour(scope, 9, scope.confirmedChangeData);
					this.initGripOptionFour(scope, 10, scope.approvedPending);
					this.initGripOptionFour(scope, 11, scope.retransitOrder);

					_this.getDailyOrder(scope, 3);
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
					} else if(scope.tabIndex == 3) {
						selectedRows = scope.gridApi5.selection.getSelectedRows();
					} else if(scope.tabIndex == 4) {
						selectedRows = scope.gridApi6.selection.getSelectedRows();
					} else if(scope.tabIndex == 5) {
						selectedRows = scope.gridApi7.selection.getSelectedRows();
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
								_this.refreshAll(scope,'YES');
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
								_this.refreshAll(scope,'YES');
							} else {

								modalAlert(CommonService, 2, data.message, null);
							}
						}, function(data) {

							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					}
				}
        this.checkIfNeedToAddSample = function(scope,isAll) {
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
          	"documentId": documentid
          };
          scope.disableReleaseOrderButton = true;
        	GLOBAL_Http($http, "cpo/api/worktable/checkIfNeedToAddSample", 'POST', param, function(data) {
        		scope.disableReleaseOrderButton = false;
        		if(data.status == 0) {
              if (data.output && data.output.length) {
                _this.openAddSample(scope,data.output);
              } else{
                if (isAll) {
                  _this.releaseAllOrder(scope);
                } else{
                  _this.releaseOrder(scope);
                }
              }
            } else {
        			modalAlert(CommonService, 2, data.message, null);
        		}
        	}, function(data) {
        		scope.disableReleaseOrderButton = false;
        		modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
        	});
        }
        this.openAddSample = function(scope, rows) {
        	var _this = this;
        	var modalInstance =
        		$uibModal.open({
        			animation: true,
        			ariaLabelledBy: "modal-header",
        			templateUrl: 'app/worktable/addSample.html',
        			controller: 'addSampleCtrl',
              size: 'lg',
        			resolve: {
        				parameter: function() {
        					return {
        						rows: rows
        					};
        				}
        			}
        		});
        	modalInstance.resolve = function(result) {

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
							_this.refreshAll(scope,'YES');
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.disableReleaseOrderButton = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.releaseOrderChangeOrder = function(scope, type,system) {
					var gridApi = {}
					if(type === 'PENDING') {
						gridApi = scope.gridApi8
					} else {
						gridApi = scope.gridApi9
					}
					var _this = this;
					scope.disableReleaseOrderButton = true;

					var selectedRows = "";
					selectedRows = gridApi.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						scope.disableReleaseOrderButton = false;
						return;
					}

					var ediOrderChanges = [];
          var changeTypes = [];
					for(var i = 0; i < selectedRows.length; i++) {
						ediOrderChanges.push({
							assignResultId: selectedRows[i].assignResultId,
							orderChangeId: selectedRows[i].orderChangeId
						})
            var changeType=selectedRows[i].changeType;
            if(changeTypes.indexOf(changeType)<0){
              changeTypes.push(changeType);
            }
					}

          if(changeTypes.length>1){
            modalAlert(CommonService, 2, $translate.instant('errorMsg.CANNOT_PROCESS_DEFFERENT_CHANGE_TYPE'), null);
            scope.disableReleaseOrderButton = false;
            return;
          }

					var param = {
						"in_status": "4,5",
						"isOrderChange": "YES",
						"assignResultIds": listToString(selectedRows, 'assignResultId'),
						"orderMasterIds": listToString(selectedRows, 'orderMasterId'),
						"ediOrderChanges": ediOrderChanges
					};

          if(changeTypes[0]=='Order Status Change'){
              var modalInstance =
                $uibModal.open({
                  animation: true,
                  ariaLabelledBy: "modal-header",
                  templateUrl: 'app/worktable/confirmReserveMaterial.html',
                  controller: 'confirmReserveMaterialCtrl',
                  resolve: {}
                });
              modalInstance.resolve = function(result) {
                if("YES"==result){
                  modalAlert(CommonService, 0, $translate.instant('notifyMsg.Reserve_Material'), function(){
                    param.isReserveMaterial='YES';
                    _this.releaseOrderChange(scope,system,param);
                  },function(){
                    scope.disableReleaseOrderButton = false;
                  });
                }else if("Cancel"==result){
                  scope.disableReleaseOrderButton = false;
                }else{
                  modalAlert(CommonService, 0, $translate.instant('notifyMsg.Not_Reserve_Material'), function(){
                    _this.releaseOrderChange(scope,system,param);
                  },function(){
                    scope.disableReleaseOrderButton = false;
                  });
                }
              }
          }else{
            _this.releaseOrderChange(scope,system,param);
          }
				}


        this.releaseOrderChange= function(scope, system,param) {
          var _this = this;
          if('D365'===system){
          	param.releaseTo365='1';
          	param.releaseToFr='0';
          }else if('FR'===system){
          	param.releaseTo365='0';
          	param.releaseToFr='1';
          }

          GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
          	scope.disableReleaseOrderButton = false;
          	if(data.status == 0) {
          		if(data.tips) {
          			modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS') + " , " + data.tips, null);
          		} else {
          			modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);
          		}
          		scope.page8.curPage = 1;
          		scope.page9.curPage = 1;
          		_this.getOrderChange(scope, 'PENDING');
          		_this.getOrderChange(scope, 'CONFIRMED');
          	} else {
          		modalAlert(CommonService, 2, data.message, null);
          	}
          }, function(data) {
          	scope.disableReleaseOrderButton = false;
          	modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }


				this.releaseOrder = function(scope,system) {

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
						// "documentIds": documentid,
						"status": "4",
						"assignResultIds": listToString(selectedRows, 'assignResultId'),
						"orderMasterIds": listToString(selectedRows, 'orderMasterId'),
            documentType:scope.selectDocumentType.id
					};

					if('D365'===system){
						param.releaseTo365='1';
						param.releaseToFr='0';
					}else if('FR'===system){
						param.releaseTo365='0';
						param.releaseToFr='1';
					}

					GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
						scope.disableReleaseOrderButton = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);

							_this.refreshAll(scope,'YES');
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
						// "documentIds": documentid,
						"status": "4",
						"confirmOrder": "YES",
						"releaseTo365": "0",
						"assignResultIds": listToString(selectedRows, 'assignResultId'),
						"orderMasterIds": listToString(selectedRows, 'orderMasterId'),
            documentType:scope.selectDocumentType.id
					};

					GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
						scope.confirmOrderButtonDisabled = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);

							_this.refreshAll(scope,'YES');
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
						"releaseTo365": "0",
						"confirmOrder": "YES"
					};
					GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
						scope.confirmOrderButtonDisabled = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);
							_this.refreshAll(scope,'YES');
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.confirmOrderButtonDisabled = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.releaseTransitPendingOrder = function(scope,system) {

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
						// "documentIds": documentId,
						"status": status,
						"assignResultIds": listToString(selectedRows, 'assignResultId'),
						"orderMasterIds": listToString(selectedRows, 'orderMasterId'),
						releaseTransit: "YES",
            documentType:scope.selectDocumentType.id
					};

					if('D365'===system){
						param.releaseTo365='1';
						param.releaseToFr='0';
					}else if('FR'===system){
						param.releaseTo365='0';
						param.releaseToFr='1';
					}

					GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
						scope.disableReleaseOrderButton = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);

							_this.refreshAll(scope,'YES');
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
							_this.refreshAll(scope,'YES');
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.disableReleaseOrderButton = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.refreshBno = function(scope, entity) {
					var _this = this;
					scope.disableRefreshBNoButton = true;
					var param = {
						"documentId": '-1'
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
						orderType: "3",
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
						_this.refreshAll(scope,'YES')
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
				this.importFile = function(scope,documentType) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'FileModal',
						controller: 'FileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: documentType

								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {

						if(returnData) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
							_this.refreshAll(scope,'YES');
						}
					}, function() {});

				}

				this.exportCSV = function(scope, type) {
					var gridApi = {}
					if(type === 'PENDING') {
						gridApi = scope.gridApi8
					} else {
						gridApi = scope.gridApi9
					}
					var selectedRows = gridApi.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}

					var param = {
						pageSize: 100000,
						pageNo: 1,
						isExportCSV: 'YES',
						documentType: 6,
						orderType: 3,
						isOrderChange: 'YES',
						in_assign_result_id: listToString(selectedRows, 'assignResultId')
					};

					exportExcel(param, "cpo/portal/document/export_file?", "_blank");

				}
				this.exportMTFContractTotalList=function(scope){
					var param = {
						documentType:50001
					};
					exportExcel(param, "cpo/portal/document/export_file?", "_blank");
				}


				this.exportOrderByMO = function(scope) {
          var param = {};
          param.document_id = scope.selectDoc.id;
					param.documentType = "9998";
          exportExcel(param, "cpo/portal/document/export_file?", "_blank");
        }

				this.exportFile = function(scope, isCSV) {

					var param = {
						pageSize: 100000,
						pageNo: 1
					};

					if(isCSV) {
						param.isExportCSV = 'YES';
					}

					switch(scope.tabIndex) {
						case 0:
							{
								//  param[ 'documentType' ] = '203';
								param['orderType'] = '3';
								param['status'] = '0,2,3';
								param['documentType'] = scope.selectDocumentType.id;
								break;
							}
						case 1:
							{
								//param[ 'documentType' ] = '203';
								param['orderType'] = '3';
								param['status'] = '0,2,3';
								param['documentType'] = scope.selectDocumentType.id;
								break;
							}
						case 3:
							{
								// param[ 'documentType' ] = '203';
								param['orderType'] = '3';
								param['status'] = '4';
								param['documentType'] = scope.selectDocumentType.id;
								break;
							}
						case 4:
							{
								// param[ 'documentType' ] = '203';
								param['orderType'] = '3';
								param['status'] = '5';
								param['documentType'] = scope.selectDocumentType.id;
								break;
							}
						case 5:
							{
								param['orderType'] = '3';
								param['documentType'] = "212";
								break;
							}

						case 6:
							{
								param['orderType'] = '3';
								param['documentType'] = "211";
								param['isOrderChange'] = 'YES';
								param['in_change_status'] = 'NEW,UPDATE';
                // param['ne_order_actual_type'] = 'MI Order'
								param['in_changeStatusOrg'] = '1**2';
								for(var attr in searchKey8) {
									if(searchKey8[attr]) {
										param[attr] = urlCharTransfer(searchKey8[attr]);
									}
								}
								break;
							}
						case 7:
							{
								param['orderType'] = '3';
								param['documentType'] = "211";
								param['isOrderChange'] = 'YES';
								param['in_change_status'] = 'CONFIRM';
                // param['ne_order_actual_type'] = 'MI Order'
								param['in_changeStatusOrg'] = '3';
								for(var attr in searchKey8) {
									if(searchKey8[attr]) {
										param[attr] = urlCharTransfer(searchKey8[attr]);
									}
								}
								break;
							}
						case 8:
							{
								param['orderType'] = '3';
								param['documentType'] = scope.selectDocumentType.id;
								param['status'] = '5';
								param['isOrderFactoryChange'] = 'YES';
								param['eq_order_approval_status'] = '1';
								break;
							}
						case 9:
							{
								param['orderType'] = '3';
								param['documentType'] = scope.selectDocumentType.id;
								param['status'] = '5';
								param['isOrderFactoryChange'] = 'YES';
								param['eq_order_approval_status'] = '4';
								break;
							}
					}



					if((scope.tabIndex != 6 || scope.tabIndex != 7) && scope.selectDoc && scope.selectDoc.id) {
						// param.eq_document_id = scope.selectDoc.id;
            if(scope.selectPos){
                param['in_po'] = scope.selectPos.replace(/,/g,'**').replace(/\n/g, '**').replace(/' '/g, '**');
            }else{
              if(scope.selectDoc && scope.selectDoc.id) {
                param.eq_document_id = scope.selectDoc.id;
              }
            }
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
										orderType: 3
									};
								}
							}
						});
					modalInstance.resolve = function(result) {
						var doc = {};
						doc['documentType'] = entity.documentType;
						doc['orderDate'] = result.orderTime;
						doc['documentName'] = result.documentName;
						doc['orderType'] = 3;
						entity.disableRefreshButton = true;
						GLOBAL_Http($http, "cpo/api/worktable/refresh_order?", 'POST', doc, function(data) {
							if(data.status!=0 ) {
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
					} else if(scope.tabIndex == 2) {
						selectedRows = scope.gridApi4.selection.getSelectedRows();
					} else if(scope.tabIndex == 3) {
						selectedRows = scope.gridApi5.selection.getSelectedRows();
					} else if(scope.tabIndex == 4) {
						selectedRows = scope.gridApi6.selection.getSelectedRows();
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
									orderType: 3,
									season: season,
									ids: ids.join(",")
								}
								GLOBAL_Http($http, "cpo/api/worktable/set_season", 'POST', param, function(data) {
									if(data.status == 0) {
										modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
										_this.refreshAll(scope,'YES');
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

				this.changeUnit = function(scope) {
					var _this = this;
					var selectedRows = null; //scope.gridApi5.selection.getSelectedRows();
					var ids = new Array();
					if(scope.tabIndex == 0) {
						selectedRows = scope.gridApi2.selection.getSelectedRows();
					} else if(scope.tabIndex == 1) {
						selectedRows = scope.gridApi3.selection.getSelectedRows();
					}else if(scope.tabIndex == 2) {
						selectedRows = scope.gridApi4.selection.getSelectedRows();
					} else if(scope.tabIndex == 3) {
						selectedRows = scope.gridApi5.selection.getSelectedRows();
					} else if(scope.tabIndex == 4) {
						selectedRows = scope.gridApi6.selection.getSelectedRows();
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

					var request = {
			          	in_code: 'unitTypeList'
			        }
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', request, function(data) {
						if(data.unitTypeList && data.unitTypeList.length > 0) {

							scope.units = data.unitTypeList.map(function(item) {
								return {
									id: item.label,
									label: item.label
								}

							});

							var topScope = scope;
							var modalInstance = $uibModal.open({
								animation: true,
								ariaLabelledBy: 'modal-title',
								ariaDescribedBy: 'modal-body',
								templateUrl: 'set-unit.html',
								size: "md",
								controller: function($scope, $uibModalInstance) {

									$scope.units = topScope.units;
									$scope.selectUnit = $scope.units[0];

									$scope.submit = function() {

										$uibModalInstance.resolve({
											unit: $scope.selectUnit.label,
											unitChangeRate: $scope.unitChangeRate
										});
										$uibModalInstance.dismiss();
									};
									$scope.dismiss = function() {
										$uibModalInstance.dismiss();
									}

								}

							});

							modalInstance.resolve = function(result) {

								var unit = result.unit;
								var unitChangeRate=result.unitChangeRate;

								if(!unit || !unitChangeRate){
									modalAlert(CommonService, 3, 'Please Select Unit and Input Unit Rate.', null);
									return;
								}

								var param = {
									orderType: 3,
									unit: unit,
									unitChangeRate:unitChangeRate,
									ids: ids.join(",")
								}
								GLOBAL_Http($http, "cpo/api/worktable/set_unit", 'POST', param, function(data) {
									if(data.status == 0) {
										modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
										_this.refreshAll(scope,'YES');
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


				this.confirmChange = function(scope, type) {
					var gridApi = {}
					if(type === 'PENDING') {
						gridApi = scope.gridApi8
					} else {
						gridApi = scope.gridApi9
					}
					var _this = this;
					var selectedRows = gridApi.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
					var ediOrderChanges = []
					for(var i = 0; i < selectedRows.length; i++) {
						ediOrderChanges.push({
							orderChangeId: selectedRows[i].orderChangeId,
							status: 3
						})
					}
					var param = {
						"ediOrderChanges": ediOrderChanges
					}

					GLOBAL_Http($http, "cpo/api/worktable/ediorderchange/updateList", 'POST', param, function(data) {
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							scope.page8.curPage = 1;
							scope.page9.curPage = 1;
							_this.getOrderChange(scope, 'PENDING');
							_this.getOrderChange(scope, 'CONFIRMED');
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {

						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.requestFactoryChange = function(scope, tabIndex) {
					var gridApi = {}
					if(tabIndex == '4') {
						gridApi = scope.gridApi6
					} else if(tabIndex == '5') {
						gridApi = scope.gridApi7
					}
					var _this = this;
					var selectedRows = gridApi.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
//					for(var i = 0; i < selectedRows.length; i++) {
//						if('MTF Order' == selectedRows[i].orderActualType ||
//							'PPC Order' == selectedRows[i].orderActualType) {
//							modalAlert(CommonService, 2, 'Can Not Change PPC/MTF Order\'s Factory', null);
//							return;
//						}
//					}

					var modalInstance =
						$uibModal.open({
							animation: true,
							ariaLabelledBy: "modal-header",
							templateUrl: 'app/worktable/changeApplication.html',
							controller: 'changeApplicationCtrl',
							resolve: {
								parameter: function() {
									return {
										showFactorySelect: 1
									};
								}
							}
						});
					modalInstance.resolve = function(result) {
						var ediOrderApprovals = [];
						for(var i = 0; i < selectedRows.length; i++) {
							var ediOrderApproval = {
								assignResultId: selectedRows[i].assignResultId,
								orderMasterId: selectedRows[i].orderMasterId,
								originalPo: selectedRows[i].po,
								fromFactory: selectedRows[i].confirmFactory,
								toFactory: result.factory
							};
							ediOrderApprovals.push(ediOrderApproval);
						}
						var param = {
							ediOrderApprovals: ediOrderApprovals,
							transferReason: result.reason,
							transferRemark: result.remark,
							isNeedApproval: tabIndex == '4' ? "NO" : "YES"
						}
						if(tabIndex == '4') {
							//新单，直接转厂
							CommonService.showLoadingView("Loading...");
							GLOBAL_Http($http, "cpo/api/worktable/orderapproval/release_approval", 'POST', param, function(data) {
								CommonService.hideLoadingView();
								if(data.status == 0) {
									modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
									_this.getTransitOrder(scope, scope.page4, '4', true);
									_this.getTransitOrder(scope, scope.page5, '5', true);
								} else {
									modalAlert(CommonService, 2, data.message, null);
								}
							}, function(data) {
								CommonService.hideLoadingView();
								modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
							});
						} else {
							//实单，request转厂
							CommonService.showLoadingView("Loading...");
							GLOBAL_Http($http, "cpo/api/worktable/orderapproval/request_approval", 'POST', param, function(data) {
								CommonService.hideLoadingView();
								if(data.status == 0) {
									modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
									_this.getAssignFactoryResult(scope, '3', '5', scope.page10, true, true, '10');
									_this.getAssignFactoryResult(scope, '3', '5', scope.page11, true, true, '11');
								} else {
									modalAlert(CommonService, 2, data.message, null);
								}
							}, function(data) {
								CommonService.hideLoadingView();
								modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
							});
						}
					}
				}

				this.approvalFactoryChange = function(scope, tabIndex) {
					scope.disableApprovalButton = true;
					var gridApi = {};
					if(tabIndex == '8') {
						gridApi = scope.gridApi10
					}
					var _this = this;
					var selectedRows = gridApi.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
					var ediOrderApprovals = [];
					for(var i = 0; i < selectedRows.length; i++) {
						var ediOrderApproval = {
							assignResultId: selectedRows[i].assignResultId,
							orderMasterId: selectedRows[i].orderMasterId,
							originalPo: selectedRows[i].po,
							fromFactory: selectedRows[i].confirmFactory,
							toFactory: selectedRows[i].orderApprovalToFactory,
							ediOrderApprovalId: selectedRows[i].ediOrderApprovalId
						};
						ediOrderApprovals.push(ediOrderApproval);
					}
					var param = {
						ediOrderApprovals: ediOrderApprovals
					}
					GLOBAL_Http($http, "cpo/api/worktable/orderapproval/release_approval", 'POST', param, function(data) {
						scope.disableApprovalButton = false;
						if(data.status == 0) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							_this.getAssignFactoryResult(scope, '3', '5', scope.page10, true, true, '10');
							_this.getAssignFactoryResult(scope, '3', '5', scope.page11, true, true, '11');
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.disableApprovalButton = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.refresh168No = function(scope) {
					var _this = this;
					var param = {}
					if(scope.selectDoc && scope.selectDoc.id) {
						param.document_id = scope.selectDoc.id;
					} else {
						modalAlert(CommonService, 2, 'Please select document.', null);
						return;
					}
					scope.refresh68NoButtonDisabled = true;
					GLOBAL_Http($http, "cpo/api/worktable/synchro_as400_168data?", 'GET', param, function(data) {
						scope.refresh68NoButtonDisabled = false;
						if(data.status == 0) {
							if(data.message) {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.REFRESH_DATA_SUCCESS') + ", " + data.message, null);
							} else {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.REFRESH_DATA_SUCCESS'), null);
							}
							_this.refreshAll(scope,'YES');
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.refresh68NoButtonDisabled = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
        this.searchlist = function(scope) {
					var _this = this;
          if(scope.tabIndex == 0) {
            this.getAssignFactoryResult(scope, '3', '0,3', scope.page2, true);
          } else if(scope.tabIndex == 1) {
            this.getAssignFactoryResult(scope, '3', '2', scope.page3, true);
          }else if(scope.tabIndex == 3) {
            this.getTransitOrder(scope, scope.page4, '4', true);
          } else if(scope.tabIndex == 4) {
            this.getTransitOrder(scope, scope.page5, '5', true);
          } else if(scope.tabIndex == 5) {
            this.getConfimrOrder(scope);
          }
          debugger;
        }
				this.splitOrder = function(scope) {
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
					if(selectedRows.length < 1) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
					if(selectedRows.length > 1) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONLY_CAN_SELECT_ONE_DATA'), null);
						return;
					}
					var row = selectedRows[0];
					GLOBAL_Http($http, "cpo/api/worktable/ediordersize/find?", 'GET', {eq_order_master_id: row.orderMasterId}, function(data) {
						if(data.rows && data.rows.length > 0) {
							scope.sizeObjArr = data.rows.map(function(item) {
								return {
									id: item.ediOrderSizeId,
									label: item.manufacturingSize
								}

							});
							var orderMasterId =  data.rows[0].orderMasterId;
							var topScope = scope;
							var modalInstance = $uibModal.open({
								animation: true,
								ariaLabelledBy: 'modal-title',
								ariaDescribedBy: 'modal-body',
								templateUrl: 'set-split-order.html',
								size: "md",
								controller: function($scope, $uibModalInstance) {

									$scope.sizeObjArr = topScope.sizeObjArr;
									$scope.selectedSizeIds = [];
									$scope.submit = function() {
										if(!$scope.batchNo || !$scope.bNo || !$scope.valueOf168No || !$scope.selectedSizeIds.length) {
											modalAlert(CommonService, 2, $translate.instant('errorMsg.THE_STAR_FLAG_IS_REQUIRED'), null);
											return;
										}
										$uibModalInstance.resolve({
											'ediOrderSizeIds': $scope.selectedSizeIds,
											'orderMasterId': orderMasterId,
											'batchNo': $scope.batchNo,
											'bNo': $scope.bNo,
											'valueOf168No': $scope.valueOf168No
										});
										$uibModalInstance.dismiss();
									};
									$scope.dismiss = function() {
										$uibModalInstance.dismiss();
									}
									$scope.idPropertySettings = {
										smartButtonMaxItems: 100,
										smartButtonTextConverter: function(itemText, originalItem) {
											return itemText;
										},
										showCheckAll:false,
										showUncheckAll:false
									};

								}

							});

							modalInstance.resolve = function(result) {

								var param = {};
								if(result.orderMasterId) {
									param['orderMasterId'] = result.orderMasterId;
								}
								if(result.batchNo) {
									param['batchNo'] = result.batchNo;
								}
								if(result.bNo) {
									param['bNo'] = result.bNo;
								}
								if(result.valueOf168No) {
									param['168No'] = result.valueOf168No;
								}
								param['ediOrderSizeIds'] = '';
								param['ediOrderSizes'] ='';
								if(result.ediOrderSizeIds && result.ediOrderSizeIds.length) {
									for(var i = 0; i < result.ediOrderSizeIds.length; i++) {
										param['ediOrderSizeIds'] += result.ediOrderSizeIds[i].id;
										for(var j=0;j<scope.sizeObjArr.length;j++){
											if(scope.sizeObjArr[j].id==result.ediOrderSizeIds[i].id){
												param['ediOrderSizes']+= scope.sizeObjArr[j].label;
												break;
											}
										}
										if(i != result.ediOrderSizeIds.length - 1) {
											param['ediOrderSizeIds'] += ',';
											param['ediOrderSizes']+=',';
										}
									}
								}
								GLOBAL_Http($http, "cpo/api/worktable/split_order", 'POST', param, function(data) {
									if(data.status == 0) {
										modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
										if(scope.tabIndex == 0) {
											_this.getAssignFactoryResult(scope, '3', '0,3', scope.page2, true);
										} else if(scope.tabIndex == 1) {
											_this.getAssignFactoryResult(scope, '3', '2', scope.page3, true);
										} else if(scope.tabIndex == 3) {
											_this.getTransitOrder(scope, scope.page4, '4', true);
										}
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

				this.checkOrderInfo=function(scope){
					var gridApi = scope.gridApi3;
					var _this = this;
					var selectedRows = gridApi.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
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
										assignResultIds: listToString(selectedRows,'assignResultId'),
										poList:listToString(selectedRows,'po'),
										interfaceName:'orderInfoChecking?'
									};
								}
							}
						});
				}

        this.exportPDF = function(scope) {
          var param = {
            documentType: 70010,
            pageSize: 1000000,
            pageNo: 1
          };

          var selectRows = [];
          switch (scope.tabIndex) {
            case 5: {
              selectRows = scope.gridApi7.selection.getSelectedRows();
              break
            }
          }
          var missingBNoPOs=[];
          var missingBatchNoPOs=[];
          for(var index in selectRows){
            var obj=selectRows[index];
            if(obj.bNo.indexOf('Some Size')!=-1){
                missingBNoPOs.push(obj.po);
            }
            if(!obj.batchNo){
                missingBNoPOs.push(obj.po);
            }
          }
          if(missingBNoPOs.length>0){
            modalAlert(CommonService, 2, 'Orders ['+missingBNoPOs.toString()+'] missing BNumber information,Please Check First .' , null);
            return;
          }

          if(missingBatchNoPOs.length>0){
            modalAlert(CommonService, 2, 'Orders ['+missingBatchNoPOs.toString()+'] missing Batch No information,Please Check First .' , null);
            return;
          }

          if (selectRows && selectRows.length > 0) {
            param.in_order_master_id = listToString(selectRows, 'orderMasterId');
          }
          param.document_id = (scope.selectDoc.id == null || scope.selectDoc.id == "") ? 0 : scope.selectDoc.id;
          //					exportExcel(param, "cpo/portal/document/export_file?", "_blank");
          CommonService.showLoadingView("Exporting...");
          GLOBAL_Http($http, "cpo/api/worktable/moPdf?", 'POST', param, function(data) {
            CommonService.hideLoadingView();
            if (data.status != 0) {
              modalAlert(CommonService, 2, data.message, null);
            } else {
              window.open(data.output, "");
            }
          }, function(data) {
            CommonService.hideLoadingView();
            modalAlert(CommonService, 3, data.message, null);
          });



        }


			}
		])
		.controller('BulkOrderCtrl', ['$scope', 'BulkOrderService',
			function($scope, BulkOrderService) {
				$scope.refreshAll = function() {
					BulkOrderService.refreshAll($scope);
				}

				$scope.confirmOrder = function() {
					BulkOrderService.confirmOrder($scope);
				}
				$scope.confirmAllOrder = function() {
					BulkOrderService.confirmAllOrder($scope);
				}

				$scope.selectTab = function(index) {
					BulkOrderService.selectTab($scope, index);
				}
				$scope.setupScrollableTabSet = function(length, index) {
					if(length >= index + 1) {
						if($scope.scrlTabsApi.doRecalculate) {
							$scope.scrlTabsApi.doRecalculate();
						}
					}
				};
				$scope.selectTab2 = function(index) {
					BulkOrderService.selectTab2($scope, index);
				}
				$scope.setupScrollableTabSet2 = function(length, index) {
					if(length >= index + 1) {
						if($scope.scrlTabsApi2.doRecalculate) {
							$scope.scrlTabsApi2.doRecalculate();
						}
					}
				};

				$scope.adjustFactoryAssignment = function(mode, tab) {
					BulkOrderService.adjustFactoryAssignment($scope, mode, tab);
				}
				$scope.releaseOrder = function(system) {
					BulkOrderService.releaseOrder($scope, system);
				}
				$scope.releaseAllOrder = function(type) {
					BulkOrderService.releaseAllOrder($scope, type);
				}

        $scope.checkIfNeedToAddSample = function(isAll) {
        	BulkOrderService.checkIfNeedToAddSample($scope,isAll);
        }
				$scope.holdPendingOrder = function(type) {
					BulkOrderService.holdPendingOrder($scope, type);
				}
				$scope.releaseTransitPendingOrder = function(system) {
					BulkOrderService.releaseTransitPendingOrder($scope,system);
				};
				$scope.exportFile = function() {
					BulkOrderService.exportFile($scope);
				}
				$scope.exportOrderByMO = function() {
					BulkOrderService.exportOrderByMO($scope);
				}
        $scope.exportPDF = function() {
          BulkOrderService.exportPDF($scope);
        }
				$scope.exportCSV = function(type) {
					BulkOrderService.exportCSV($scope, type);
				}
				$scope.toUpload = function(entity) {
					BulkOrderService.toUpload($scope, entity);
				};
				$scope.assignFactory = function() {
					BulkOrderService.assignFactory($scope);
				}
				$scope.viewCapacity = function(type) {
					BulkOrderService.viewCapacity($scope, type);
				}

				$scope.refreshOrder = function(entity) {
					BulkOrderService.refreshOrder($scope, entity);
				}
				$scope.refreshBno = function(entity) {
					BulkOrderService.refreshBno($scope, entity);
				}
				$scope.refreshCountryCode = function(entity) {
					BulkOrderService.refreshCountryCode($scope, entity);
				}
				$scope.deleteDom = function(entity) {
					BulkOrderService.deleteDom($scope, entity);
				};
				$scope.toggleFilterRow = function() {
					BulkOrderService.toggleFilterRow($scope);
				};
				$scope.adjustFactoryAssignment2 = function(mode, confirmFactory) {
					BulkOrderService.adjustFactoryAssignment2($scope, mode, confirmFactory);
				};
				$scope.importFile = function(documentType) {
					BulkOrderService.importFile($scope,documentType);
				};
				$scope.reAssign = function() {
					BulkOrderService.reAssign($scope)
				}
				$scope.confirmChange = function(type) {
					BulkOrderService.confirmChange($scope, type)
				}
				$scope.setSeason = function() {
					BulkOrderService.setSeason($scope);
				}
				$scope.changeUnit = function() {
					BulkOrderService.changeUnit($scope);
				}
				$scope.generateBatchNo = function() {
					BulkOrderService.generateBatchNo($scope);
				}
				$scope.selectDocument = function() {
					BulkOrderService.selectDocument($scope);
				}
				$scope.selectDocumentTypeChanged = function() {
					BulkOrderService.selectDocumentTypeChanged($scope);
				}
				$scope.selectDocumentChanged = function() {
					BulkOrderService.selectDocumentChanged($scope);
				}
				$scope.releaseOrderChangeOrder = function(type,system) {
					BulkOrderService.releaseOrderChangeOrder($scope, type,system);
				}
				$scope.downloadNewOrderInTradeCard = function(entity) {
					BulkOrderService.downloadNewOrderInTradeCard($scope, entity);
				}
				$scope.downloadEmailChecking = function(entity) {
					BulkOrderService.downloadEmailChecking($scope, entity);
				}
				$scope.requestFactoryChange = function(tabIndex) {
					BulkOrderService.requestFactoryChange($scope, tabIndex);
				}
				$scope.approvalFactoryChange = function(tabIndex) {
					BulkOrderService.approvalFactoryChange($scope, tabIndex);
				}
				$scope.refresh168No = function() {
					BulkOrderService.refresh168No($scope);
				}
				$scope.splitOrder = function() {
					BulkOrderService.splitOrder($scope);
				}
				$scope.checkOrderInfo = function() {
					BulkOrderService.checkOrderInfo($scope);
				}
				$scope.exportMTFContractTotalList = function() {
					BulkOrderService.exportMTFContractTotalList($scope);
				}
				$scope.changeFormat = function(v) {
					$scope[v]=$scope[v].replace(/[ ]/g,',');
				}
				$scope.searchlist = function() {
					BulkOrderService.searchlist($scope);
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
				BulkOrderService.init($scope);
			}
		]);

})();
