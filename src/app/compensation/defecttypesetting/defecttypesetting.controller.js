(function() {
	'use strict';
	angular
		.module('cpo')
		.service('defectTypeSettingService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {

				this.pullList = function(scope) {
					var _this = this;
					var param = {
						pageNo: scope.page.curPage,
						pageSize: scope.page.pageSize
					}
					GLOBAL_Http($http, "cpo/api/process/query_process?", 'GET', param, function(data) {

						if(data.status == 0) {
							scope.items = translateData(data.output.processExts);
							scope.page.totalNum = data.output.total;
							scope.gridOptions.totalItems = scope.page.totalNum;
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
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
						columnDefs: [{
								name: 'processNo',
								displayName: $translate.instant('processmaster.PROCESS_NO'),
								field: 'processCode',
              width:"200",
								enableCellEdit: false
							},
							{
								name: 'processName',
								displayName: $translate.instant('processmaster.PROCESS_NAME'),
								field: 'processName',
                width:"200",
								enableCellEdit: false
							},
							{
								name: 'remark',
								displayName: $translate.instant('processmaster.CHINESE_PROCESS_NAME'),
								field: 'note',
                width:"200",
								enableCellEdit: false
							},
							{
								name: 'categoryName',
								displayName: $translate.instant('processmaster.CATEGORY'),
								field: 'categoryName',
                width:"200",
								enableCellEdit: false
							},
							{
								name: 'uploadTime',
								displayName: $translate.instant('processmaster.UPLOAD_TIME'),
								field: 'utcUpdate',
                width:"200",
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
								_this.pullList(scope);
							});
						}
					};
					_this.pullList(scope);
				};
			}
		])
		.controller('defectTypeSettingCtrl', ['$scope', 'defectTypeSettingService',
			function($scope, defectTypeSettingService) {
				$scope.pullList = function() {
					defectTypeSettingService.pullList($scope);
				}
				defectTypeSettingService.init($scope);
			}
		])
})();
