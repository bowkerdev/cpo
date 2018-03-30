(function() {
	'use strict';
	angular
		.module('cpo')
		.service('factoryMasterService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {


				this.getFactoryList = function(scope) {
					var _this = this;
					var param = {
						pageNo: scope.page.curPage,
						pageSize: scope.page.pageSize
					}
					GLOBAL_Http($http, "portal/factory/find?", 'GET', param, function(data) {

						if(data.rows) {
							scope.items = translateData(data.rows);
							scope.page.totalNum = data.total;
							scope.gridOptions.totalItems = scope.page.totalNum;
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.exportFile =function(scope){
					var params={
						documentType:1
					}
          CommonService.showLoadingView("Exporting...");
          GLOBAL_Http($http, "cpo/portal/document/check_record_count?", 'GET', params, function(data) {
            CommonService.hideLoadingView();
            if(data.status == 0) {
              if(parseInt(data.message) > 0) {
                exportExcel(params, "cpo/portal/document/export_file?", "_blank");
              } else {
                modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
              }
            }
          }, function(data) {
            CommonService.hideLoadingView();
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
				}
				this.view = function(scope) {
					var selectedRows = scope.gridApi.selection.getSelectedRows();
					if(selectedRows.length !== 1) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.ALERT_CHOOSE_DATA'), null);
						return;
					}
					// 获取选择条目ID
					var id = selectedRows[0].factoryId;

					var _this = this;
					scope.errorOutputMsgs = [];
					var modalInstance = $uibModal.open({
						templateUrl: 'factoryDetailModal',
						controller: 'factoryDetailController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									"id": id
								};
							}
						}
					});
					// modalInstance callback
					modalInstance.result.then(function(returnData) {}, function() {
						// dismiss(cancel)
					});
				}



				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;
					scope.page = {
						curPage: 1,
						pageSize: 10,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};

					scope.gridOptions = {
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
						useExternalPagination: true,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [
							{
								name: 'factoryCode',
								displayName: $translate.instant('factory.FACTORY_CODE'),
								field: 'factoryCode',
                width:"270",
								enableCellEdit: false
							},
						    {
								name: 'factSimpName',
								displayName: $translate.instant('factory.FACTORY_SIMP_NAME'),
								field: 'factSimpName',
                  width:"270",
								enableCellEdit: false
							},
							{
								name: 'factoryName',
								displayName: $translate.instant('factory.FACTORY_NAME'),
								field: 'factoryName',
                width:"270",
								enableCellEdit: false
							}
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
								_this.getFactoryList(scope);
							});
						}
					};
                   _this.getFactoryList(scope);
				};
			}
		])
		.controller('factoryMasterCtrl', ['$scope', 'factoryMasterService',
			function($scope, factoryMasterService) {
				$scope.getFactoryList = function() {
					factoryMasterService.getFactoryList($scope);
				}
				$scope.view = function() {
					factoryMasterService.view($scope);
				}
				$scope.exportFile = function() {
					factoryMasterService.exportFile($scope);
				}
				factoryMasterService.init($scope);
			}
		])
})();
