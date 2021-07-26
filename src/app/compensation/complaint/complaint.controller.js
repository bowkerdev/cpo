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

				// 获取搜索区域字段
				// TODO 
				this.genSearchFormData = function (scope) {
					var fieldMatcher = {
						"searchComplaintNo": "",
						"searchFactory": "",
						"searchWorkingNo": "",
						"searchArticle": "",
						"searchDefectMainID": "",
						"searchDefectSubID": "",
						"searchCreatedBy": "",
						"searchStatus": "",
						"searchCreateStartTime": "",
						"searchCreateEndTime": "",
						"searchDateStartTime": "",
						"searchDateEndTime": ""
					}
					var res = {}
					for (var key in fieldMatcher) {
						if (scope[key]) { continue }
 						res[fieldMatcher[key]] = scope[key]
					}
					console.log(scope.searchDateStartTime)
					return res
				}

				this.pullList = function(scope) {
					
					var param = this.genSearchFormData(scope)
					param['pageNo'] = scope.page.curPage
					param['pageSize'] = scope.page.pageSize

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
						{ label: 'New', value: 'New' },
						{ label: 'Processing', value: 'Processing' },
						{ label: 'Completed', value: 'Completed' },
						{ label: 'Cancelled', value: 'Cancelled' }
					]

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
								modalAlert(CommonService, 3, $translate.instant('compensation.ALERT_SELECTED_NOT_NEW'), null);
							});
						}
					};
					_this.pullList(scope);
				};
			}
		])
		.controller('complaintCtrl', ['$scope', 'complaintService',
			function($scope, complaintService) {
				$scope.pullList = function() {
					complaintService.pullList($scope);
				}
				$scope.searchList = function() {
					complaintService.pullList($scope);
				}
				$scope.onSearchStatusChange = function () {
					$scope.pullList()
				}
				complaintService.init($scope);
			}
		])
})();
