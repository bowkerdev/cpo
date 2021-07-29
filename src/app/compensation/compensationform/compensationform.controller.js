(function() {
	'use strict';
	angular
		.module('cpo')
		.service('compensationFormService', ['$http', '$translate', 'CommonService', '$uibModal',
			'compensationConfigService',
			function($http, $translate, CommonService, $uibModal, compensationConfigService) {
				// 获取下拉框list
				// TODO ordertype-translate-code
				this.pullSelectList = function(scope) {
					var param = {
						in_code: 'FACTORYLIST'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
						scope.searchFactoryList = data.FACTORYLIST;
						for(var i = 0; i < scope.searchFactoryList.length; i++) {
							scope.searchFactoryList[i].id = scope.searchFactoryList[i].value;
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				// 查询条件
				this.genSearchFormData = function(scope) {
					var res = {}
					// TODO
					var inputMatcher = {
						"searchCompensationNo": "",
						"searchCustomer": "",
						"searchInvoiceNo": "",
						"searchPoNumber": "",
						"searchCreateBy": "",
						"dateStartTime": "",
						"dateEndTime": ""
					}
					for (var key in inputMatcher) {
						if (!scope[key]) { continue }
 						res[inputMatcher[key]] = scope[key]
					}
					// select
					// multi-select
					var MultiSelectMatcher = {
						"searchOrderType": "orderType",
						"searchFactory": "factory",
						"searchStatus": "status"
					}
					for (var key in MultiSelectMatcher) {
						if (!scope[key].length) { continue }
						var resArr = scope[key].map(function(el) {
							return el.id
						})
 						res[MultiSelectMatcher[key]] = resArr.join(',')
					}
					return res
				}
				// 查询接口
				// TODO
				this.pullSummaryList = function(scope) {
					var param = this.genSearchFormData(scope)
					param['pageNo'] = scope.page.curPage
					param['pageSize'] = scope.page.pageSize
					scope.searchLoading = true;
					GLOBAL_Http($http, "cpo/api/process/query_process?", 'GET', param, function(data) {

						if(data.status == 0) {
							scope.summaryItems = translateData(data.output.processExts);
							scope.summaryPage.totalNum = data.output.total;
							scope.summaryGridOptions.totalItems = scope.summaryPage.totalNum;
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
						scope.searchLoading = false;
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						scope.searchLoading = false;
					});
				}
				// TODO
				this.pullDetailList = function(scope) {
					var param = {
						pageNo: scope.detailPage.curPage,
						pageSize: scope.detailPage.pageSize
					}
					GLOBAL_Http($http, "cpo/api/process/query_process?", 'GET', param, function(data) {
				
						if(data.status == 0) {
							scope.summaryItems = translateData(data.output.processExts);
							scope.detailPage.totalNum = data.output.total;
							scope.summaryGridOptions.totalItems = scope.detailPage.totalNum;
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				// 导出
				// TODO
				this.export = function (scope) {
					
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
							_this.pullSummaryList(scope);
						}
					}, function() {
						// dismiss(cancel)
					});
				}

				// 导出
				// TODO
				this.updateInvoiceNo = function (scope) {
					
				}

				/**
				 * init
				 */
				this.init = function(scope) {
					// loading
					scope.searchFactory = []
					scope.searchLoading = false;
					scope.searchDetailLoading = false;
					var _this = this;
					// status 选项
					scope.statusList = compensationConfigService.getCompensationStatusList()
					scope.searchStatus = []
					// Order Type 选项
					scope.orderTypeList = compensationConfigService.getOrderTypeList()
					scope.searchOrderType = []
					// summary table
					scope.summaryPage = {
						curPage: 1,
						pageSize: 10,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.summaryGridOptions = {
						data: 'summaryItems',
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
						totalItems: scope.summaryPage.totalNum,
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
									"name":"COMPLAINT_AMOUNT",
									"displayName":$translate.instant('compensation.COMPLAINT_AMOUNT'),
									"field":"COMPLAINT_AMOUNT",
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
							scope.summaryGridApi = gridApi;
							scope.summaryGridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
								if(sortColumns.length !== 0) {
									if(sortColumns[0].sort.direction === 'asc') {
										scope.summaryPage.sortDirection = true;
									}
									if(sortColumns[0].sort.direction === 'desc') {
										scope.summaryPage.sortDirection = false;
									}
									scope.summaryPage.sortColumn = sortColumns[0].displayName;
								}
							});
							scope.summaryGridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.summaryPage.curPage = newPage;
								scope.summaryPage.pageSize = pageSize;
								_this.pullSummaryList(scope);
							});
						}
					};
					// detail table
					scope.detailPage = {
						curPage: 1,
						pageSize: 10,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.detailGridOptions = {
						data: 'detailItems',
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
						totalItems: scope.detailPage.totalNum,
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
									"name":"CURR",
									"displayName":$translate.instant('compensation.CURR'),
									"field":"CURR",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"COMPLAINT_AMOUNT",
									"displayName":$translate.instant('compensation.COMPLAINT_AMOUNT'),
									"field":"COMPLAINT_AMOUNT",
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
							scope.detailGridApi = gridApi;
							scope.detailGridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
								if(sortColumns.length !== 0) {
									if(sortColumns[0].sort.direction === 'asc') {
										scope.detailPage.sortDirection = true;
									}
									if(sortColumns[0].sort.direction === 'desc') {
										scope.detailPage.sortDirection = false;
									}
									scope.detailPage.sortColumn = sortColumns[0].displayName;
								}
							});
							scope.detailGridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.detailPage.curPage = newPage;
								scope.detailPage.pageSize = pageSize;
								_this.pullDetailList(scope);
							});
						}
					};
					// 获取筛选框数据
					_this.pullSelectList(scope)
					// 首次加载数据
					_this.pullSummaryList(scope);
				};
			}
		])
		.controller('compensationFormCtrl', ['$scope', 'compensationFormService', '$translate',
			function($scope, compensationFormService, $translate) {
				$scope.search = function() {
					compensationFormService.pullSummaryList($scope);
				}
				$scope.export = function() {
					compensationFormService.export($scope);
				}
				$scope.create = function() {
					compensationFormService.create($scope);
				}
				$scope.updateInvoiceNo = function() {
					compensationFormService.updateInvoiceNo($scope);
				}
				// 筛选配置
				$scope.translationTexts = {
					checkAll: $translate.instant('index.SELECT_ALL'),
					uncheckAll: $translate.instant('index.NOT_SELECT_ALL'),
					buttonDefaultText: $translate.instant('index.SELECT')
				}
				$scope.extraSettings = {
					checkBoxes: true,
					smartButtonMaxItems: 100,
					smartButtonTextConverter: function(itemText, originalItem) {
						return itemText;
					},
					scrollableHeight: '200px',
					scrollable: true
				};
				compensationFormService.init($scope);
			}
		])
})();
