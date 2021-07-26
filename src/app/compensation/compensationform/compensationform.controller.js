(function() {
	'use strict';
	angular
		.module('cpo')
		.service('compensationFormService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
				// 查询接口
				this.pullList = function(scope) {
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

				// 创建
				this.create = function (scope) {
					var modalInstance = $uibModal.open({
						templateUrl: 'compensationCreateFormModal',
						controller: 'compensationCreateFormController',
						backdrop: 'static',
						windowClass: 'full-screen-modal',
						size: 'lg',
						resolve: {
							planGroups: function() {
								return {}
							}
						}
					});
					// modalInstance callback
					modalInstance.result.then(function(returnData) {
						if(returnData){
							_this.getLoading(scope);
						}
					}, function() {
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
						columnDefs: [
							{
									"name":"COMPENSATION_NO",
									"displayName":$translate.instant('compensation.COMPENSATION_NO'),
									"field":"COMPENSATION_NO",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"DATE",
									"displayName":$translate.instant('compensation.DATE'),
									"field":"DATE",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"FACTORY",
									"displayName":$translate.instant('compensation.FACTORY'),
									"field":"FACTORY",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"ORDER_TYPE",
									"displayName":$translate.instant('compensation.ORDER_TYPE'),
									"field":"ORDER_TYPE",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"CUSTOMER",
									"displayName":$translate.instant('compensation.CUSTOMER'),
									"field":"CUSTOMER",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"COMPLAINT_PO_NUMBER",
									"displayName":$translate.instant('compensation.COMPLAINT_PO_NUMBER'),
									"field":"COMPLAINT_PO_NUMBER",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"CURR",
									"displayName":$translate.instant('compensation.CURR'),
									"field":"CURR",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"COMPLAINT__AMOUNT",
									"displayName":$translate.instant('compensation.COMPLAINT__AMOUNT'),
									"field":"COMPLAINT__AMOUNT",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"TOTAL_AMOUNT_CNY",
									"displayName":$translate.instant('compensation.TOTAL_AMOUNT_CNY'),
									"field":"TOTAL_AMOUNT_CNY",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"TOTAL_AMOUNT_CNY_VAT",
									"displayName":$translate.instant('compensation.TOTAL_AMOUNT_CNY_VAT'),
									"field":"TOTAL_AMOUNT_CNY_VAT",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"INVOICE_NO",
									"displayName":$translate.instant('compensation.INVOICE_NO'),
									"field":"INVOICE_NO",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"CLAIM_PO_NUMBER",
									"displayName":$translate.instant('compensation.CLAIM_PO_NUMBER'),
									"field":"CLAIM_PO_NUMBER",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"ORDER_QTY",
									"displayName":$translate.instant('compensation.ORDER_QTY'),
									"field":"ORDER_QTY",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"CUSTOMER_NO",
									"displayName":$translate.instant('compensation.CUSTOMER_NO'),
									"field":"CUSTOMER_NO",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"DELIVERY_DATE",
									"displayName":$translate.instant('compensation.DELIVERY_DATE'),
									"field":"DELIVERY_DATE",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"CLAIM_CPO_AMOUNT",
									"displayName":$translate.instant('compensation.CLAIM_CPO_AMOUNT'),
									"field":"CLAIM_CPO_AMOUNT",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"CREATED_BY",
									"displayName":$translate.instant('compensation.CREATED_BY'),
									"field":"CREATED_BY",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"CREATED_DATE",
									"displayName":$translate.instant('compensation.CREATED_DATE'),
									"field":"CREATED_DATE",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"STATUS",
									"displayName":$translate.instant('compensation.STATUS'),
									"field":"STATUS",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"REMARK",
									"displayName":$translate.instant('compensation.REMARK'),
									"field":"REMARK",
									"width":"200",
									"enableCellEdit":false
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
		.controller('compensationFormCtrl', ['$scope', 'compensationFormService',
			function($scope, compensationFormService) {
				$scope.pullList = function() {
					compensationFormService.pullList($scope);
				}
				$scope.create = function() {
					compensationFormService.create($scope);
				}
				compensationFormService.init($scope);
			}
		])
})();
