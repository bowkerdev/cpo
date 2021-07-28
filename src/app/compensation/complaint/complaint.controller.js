(function() {
	'use strict';
	angular
		.module('cpo')
		.service('complaintService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
				// imported FOB  != CPO FOB
				var row_template = " <div ng-repeat='(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name'"
				 + "class='ui-grid-cell ' " 
				 + "ng-class='{ \"ui-grid-row-header-cell\": col.isRowHeader, \"fob-highlight\": (row.entity.fob !== row.entity.tcFob) }' ui-grid-cell></div>"

				// 获取下拉框list
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

				// 获取搜索区域字段
				this.genSearchFormData = function (scope) {
					// input
					var inputMatcher = {
						"searchComplaintNo": "complaintNo",
						"searchPoNumber": "po_no",
						"searchWorkingNo": "workingNo",
						"searchArticle": "articleNo",
						"searchDefectMainID": "defectMainId",
						"searchDefectSubID": "defectSubId",
						"searchCreatedBy": "createBy",
						"searchCreateStartTime": "createStartDate",
						"searchCreateEndTime": "createEndDate",
						"searchDateStartTime": "startDate",
						"searchDateEndTime": "endDate"
					}
					var res = {}
					for (var key in inputMatcher) {
						if (!scope[key]) { continue }
 						res[inputMatcher[key]] = scope[key]
					}
					// multi-select
					var MultiSelectMatcher = {
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
					console.log(res)
					return {}
					return res
				}

				this.importFile = function (scope) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'commonToolsModal',
						controller: 'commonToolsController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									importConfigKey: '/wms/inventory/inventory/import',
									param: JSON.stringify()
								}
							}
						}
					})
					modalInstance.result.then(function(returnData) {
						if(returnData) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
							_this.pullList(scope);
						}
					}, function() {})
				}

				this.convertToCompensation = function (scope) {
					var selections = scope.gridApi.selection.getSelectedRows()
					if (!selections.length) {
						modalAlert(CommonService, 1, $translate.instant('compensation.ALERT_SELECT_DATAS'), null);
						return 
					}
					modalAlert(CommonService, 0, $translate.instant('compensation.ALERT_CONVERT_TO_COMPENSATION'),
						function () {
							// TODO
						}
					)
				}

				this.pullList = function(scope) {
					
					var param = this.genSearchFormData(scope)
					param['pageNo'] = scope.page.curPage
					param['pageSize'] = scope.page.pageSize
					scope.searchLoading = true
					GLOBAL_Http($http, "cpo/api/process/query_process?", 'GET', param, function(data) {

						if(data.status == 0) {
							scope.items = translateData(data.output.processExts);
							scope.page.totalNum = data.output.total;
							scope.gridOptions.totalItems = scope.page.totalNum;
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
						scope.searchLoading = false
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						scope.searchLoading = false
					});
				}


				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					scope.searchFactory = []
					scope.searchCreateEndTime = simpleDateFormat(new Date().getTime(), "yyyy-MM-dd");
          scope.searchCreateStartTime = simpleDateFormat(getDatefromTodayBy(30), "yyyy-MM-dd");
					scope.searchLoading = false
					var _this = this;
					scope.page = {
						curPage: 1,
						pageSize: 10,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					// TODO 显示与取值
					scope.statusList = [
						{ label: 'New', value: 'New', id: 'New' },
						{ label: 'Processing', value: 'Processing', id: 'Processing' },
						{ label: 'Completed', value: 'Completed', id: 'Completed' },
						{ label: 'Cancelled', value: 'Cancelled', id: 'Cancelled' }
					]
					scope.searchStatus = []
					// 
					scope.searchFactoryList = []
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
						rowTemplate: row_template,
						columnDefs: [
							{
									"name":"complaintNo",
									"displayName":$translate.instant('compensation.COMPLAINT_NO'),
									"field":"complaintNo",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"complaintDate",
									"displayName":$translate.instant('compensation.DATE'),
									"field":"complaintDate",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"factoryName",
									"displayName":$translate.instant('compensation.FACTORY'),
									"field":"factoryName",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"poNo",
									"displayName":$translate.instant('compensation.PO_NUMBER'),
									"field":"poNo",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"customer",
									"displayName":$translate.instant('compensation.CUSTOMER'),
									"field":"customer",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"workingNo",
									"displayName":$translate.instant('compensation.WORKING_NO'),
									"field":"workingNo",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"articleNo",
									"displayName":$translate.instant('compensation.ARTICLE'),
									"field":"articleNo",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"defectMainId",
									"displayName":$translate.instant('compensation.DEFECT_MAIN_ID'),
									"field":"defectMainId",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"defectSubId",
									"displayName":$translate.instant('compensation.DEFECT_MAIN_NAME'),
									"field":"defectSubId",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"defectMainName",
									"displayName":$translate.instant('compensation.DEFECT_SUB_ID'),
									"field":"defectMainName",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"defectSubName",
									"displayName":$translate.instant('compensation.DEFECT_SUB_NAME'),
									"field":"defectSubName",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"quantity",
									"displayName":$translate.instant('compensation.QUANTITY'),
									"field":"quantity",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"fob",
									"displayName":$translate.instant('compensation.FOB'),
									"field":"fob",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"handlingCost",
									"displayName":$translate.instant('compensation.HANDLING_COST'),
									"field":"handlingCost",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"complaintValue",
									"displayName":$translate.instant('compensation.COMPAINT_VALUE'),
									"field":"complaintValue",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"totalAmountCny",
									"displayName":$translate.instant('compensation.TOTAL_AMOUNT_CNY'),
									"field":"totalAmountCny",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"totalAmountCnyVat",
									"displayName":$translate.instant('compensation.TOTAL_AMOUNT_CNY_VAT'),
									"field":"totalAmountCnyVat",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"localFlag",
									"displayName":$translate.instant('compensation.LOCAL_FLAG'),
									"field":"localFlag",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"createBy",
									"displayName":$translate.instant('compensation.CREATED_BY'),
									"field":"createBy",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"complaintDate",
									"displayName":$translate.instant('compensation.CREATED_DATE'),
									"field":"complaintDate",
									"width":"200",
									"enableCellEdit":false
							},
							{
									"name":"status",
									"displayName":$translate.instant('compensation.STATUS'),
									"field":"status",
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
							// only Status = "New" can be selected. Else, pop up alert msg
							gridApi.selection.on.rowSelectionChanged(scope,function(row){
								if (!row.isSelected || 
									row.entity['status'] !== "New"
								) { return }
								gridApi.selection.unSelectRow(row.entity)
								modalAlert(CommonService, 1, $translate.instant('compensation.ALERT_SELECTED_NOT_NEW'), null);
							});
						}
					};
					_this.pullSelectList(scope)
					_this.pullList(scope);
				};
			}
		])
		.controller('complaintCtrl', ['$scope', 'complaintService', '$translate',
			function($scope, complaintService, $translate) {
				$scope.searchList = function() {
					complaintService.pullList($scope);
				}
				$scope.importFile = function () {
					complaintService.importFile($scope)
				}
				$scope.convertToCompensation = function () {
					complaintService.convertToCompensation($scope)
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

				complaintService.init($scope);
			}
		])
})();
