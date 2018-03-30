(function() {
	'use strict';
	angular
		.module('cpo')
		.service('documentLibraryService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
        this.edit = function(scope){
          var selectedRows = scope.gridApi.selection.getSelectedRows();
          if(selectedRows.length != 1) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            return;
          }else{
            scope.selectDoc = selectedRows[0];
            scope.showEditPage = true;
          }

        };

        this.mergeDocuments = function(scope){
          var _this = this;
          var selectedRows = scope.gridApi.selection.getSelectedRows();
          if(selectedRows.length <= 0) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            return;
          }
          var param = {
            "documentIds": listToString(selectedRows, 'documentId')
          }

          var items = scope.items.filter(function(item){
            return item.documentId!=param.documentIds
          });
          var modalInstance =
            $uibModal.open({
              animation: true,
              ariaLabelledBy:"modal-header",
              templateUrl: 'app/documentlibrary/mergedocumentmodel.html',
              controller: 'mergedocumentCtrl',
              resolve : {
                planGroups : function () {
                  return {
                    "items" :  items,
                    "documentIds":param.documentIds
                  };
                }
              }

            });
          modalInstance.resolve = function(){
            _this.selectDocumentTab(scope, scope.tabIndex)
          }
        }
				this.selectDocumentTab = function(scope, index) {

					scope.tabIndex = index;

					var param = {
						documentType: scope.documentTypeList[index].value,
						pageNo: scope.page.curPage,
						pageSize: scope.page.pageSize
					}
					GLOBAL_Http($http, "cpo/api/document/query_document?", 'GET', param, function(data) {

						if(data.status == 0) {
							if(data.output.documents) {
								scope.items = data.output.documents;
								for(var i = 0; i < scope.items.length; i++) {
									if(scope.items[i]){
                    scope.items[i].uploadTime = dateTimeFormat(scope.items[i].utcCreate);
                    scope.items[i].createBy = scope.items[i].userName;
                    scope.items[i].orderDate = dateTimeFormat(scope.items[i].orderDate);
                  }

								}
								scope.page.totalNum = data.output.total;
								scope.gridOptions.totalItems = scope.page.totalNum;
							} else {
								scope.items = [];
							}
						} else {
							modalAlert(CommonService, 3, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.getDocumentTypeList = function(scope) {
					var _this = this;
					var param = {
						in_code: 'DOCUMENTTYPE'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
						scope.documentTypeList = data.DOCUMENTTYPE;
						scope.tabIndex = 0;
						_this.selectDocumentTab(scope, scope.tabIndex);
						if(scope.scrlTabsApi.doRecalculate) {
							scope.scrlTabsApi.doRecalculate();
						}

					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.downloadDocument = function(scope) {
					var selectedRows = scope.gridApi.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
					var param = {
						"documentIds": listToString(selectedRows, 'documentId')
					}
					exportExcel(param, "cpo/portal/document/export_document?", "_blank");
				}

				this.deleteDocument = function(scope) {
					var _this = this;
					var selectedRows = scope.gridApi.selection.getSelectedRows();
					if(selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
					modalAlert(CommonService, 0, $translate.instant('errorMsg.PLEASE_CONFIREM_DELETE'), function() {
						var modal = $uibModal.open({
							templateUrl: "loadingpage",
							controller: 'loadingController',
							backdrop: 'static',
							size: 'sm'
						});
						var param = {
							"documentIds": listToString(selectedRows, 'documentId')
						}
						GLOBAL_Http($http, "cpo/api/document/delete_document", 'POST', param, function(data) {
							if(data.status == 0) {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.DELETE_SUCCESS'), null);
								_this.selectDocumentTab(scope, scope.tabIndex);
							} else {
								modalAlert(CommonService, 2, data.message, null);
							}
						}, function(data) {
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					});
				}

				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;
					scope.scrlTabsApi = {};
          scope.$on('page.close', function() {
            scope.showEditPage = false;
            _this.selectDocumentTab(scope, scope.tabIndex)

          });
					scope.page = {
						curPage: 1,
						pageSize: 10,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.items = [];
					scope.tabIndex = "";
					scope.gridOptions = {
						data: 'items',
						paginationPageSizes: [10, 20, 30, 40, 50],
						paginationPageSize: 10,
						enableColumnMenus: true,
            multiSelect:true,
            enableSelectAll:true,
            enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						useExternalPagination: true,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [{
								name: 'versionNo',
								displayName: $translate.instant('documentlibrary.VERSION_NO'),
								field: 'documentName',
                width:"150",
								enableCellEdit: false
							},
							{
								name: 'season',
								displayName: $translate.instant('documentlibrary.SEASON'),
								field: 'season',
                width:"150",
								enableCellEdit: false
							},
              {
                name : 'batchDate' ,
                displayName : "Batch Date" ,
                minWidth : '150' ,
                field : 'orderDate' ,
                enableCellEdit : false
              } ,
							{
								name: 'uploadTime',
								displayName: $translate.instant('documentlibrary.UPLOAD_TIME'),
								field: 'uploadTime',
                width:"150",
								enableCellEdit: false
							},
							{
								name: 'uploadBy',
								displayName: $translate.instant('documentlibrary.UPLOAD_BY'),
								field: 'createBy',
                width:"150",
								enableCellEdit: false
							},
							{
								name: 'resource',
								displayName: $translate.instant('documentlibrary.RESOURCE'),
								field: 'source',
                width:"150",
								enableCellEdit: false
							}
//							,{
//								name: 'remark',
//								displayName: $translate.instant('documentlibrary.REMARK'),
//								field: 'note',
//								enableCellEdit: false
//							}
						],
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
								_this.selectDocumentTab(scope, scope.tabIndex);
							});
						}
					};
					_this.getDocumentTypeList(scope);
				};
			}
		])
		.controller('documentLibraryCtrl', ['$scope', 'documentLibraryService',
			function($scope, documentLibraryService) {
        $scope.edit = function (  ) {
          documentLibraryService.edit($scope);
        }
        $scope.mergeDocuments = function(){
          documentLibraryService.mergeDocuments($scope);
        }
				$scope.selectDocumentTab = function(index) {
					documentLibraryService.selectDocumentTab($scope, index);
				}
				$scope.downloadDocument = function() {
					documentLibraryService.downloadDocument($scope);
				}
				$scope.deleteDocument = function() {
					documentLibraryService.deleteDocument($scope);
				}
				documentLibraryService.init($scope);
			}
		])
})();
