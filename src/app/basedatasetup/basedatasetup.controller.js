/**
 * Created by mac on 2017/11/17.
 */
(function() {
	'use strict';
	angular
		.module('cpo')
		.controller('baseDataSetupCtrl', ['$scope', '$uibModal', 'CommonService', '$http', '$translate',
			function($scope, $uibModal, CommonService, $http, $translate) {
				$scope.navList = ['Base Setup', 'B Num', "Season Date Range", "Plan Group", "Edi Column Change Setting"];
				$scope.tabIndex = 0;
				$scope.importLineSheetData = function() {
					var modalInstance = $uibModal.open({
						templateUrl: 'uploadFileModal',
						controller: 'UploadFileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: "901"
								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {

					}, function() {});
				}
				$scope.page = {
					curPage: 1,
					pageSize: 100,
					sortColumn: 'id',
					sortDirection: false,
					totalNum: 0
				};
				$scope.search = function() {

					$scope.getBNum($scope.page, true);
				}
				$scope.getBNum = function(page, shouldPageNumberReset) {
					$scope.bNumList = [];
					var param = {
						pageSize: page.pageSize,
						pageNo: page.curPage
					};
					if($("#searchWorkingNo").val()) {
						param.like_working_no = $("#searchWorkingNo").val();
					}
					if($("#searchSeason").val()) {
						param.like_season = $("#searchSeason").val();
					}
					if($("#searchSizeGroup").val()) {
						param.like_size_group = $("#searchSizeGroup").val();
					}
					if($("#searchLikeSize").val()) {
						param.like_size = $("#searchLikeSize").val();
					}
					if($("#searchNotLikeSize").val()) {
						param.nin_size = $("#searchNotLikeSize").val();
					}
					if($("#searchSizeList").val()) {
						param.in_size = $("#searchSizeList").val().split(',');
					}
					if(shouldPageNumberReset) {
						page.curPage = 1;
						param.pageNo = page.curPage;
					}

					GLOBAL_Http($http, "cpo/api/worktable/workingnosizegroup/find?", 'GET', param, function(data) {

						$scope.bNumList = data.rows;
						$scope.page.totalNum = data.total;

						$scope.gridOptions1.totalItems = $scope.page.totalNum;
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				
				$scope.updateBNumber = function() {
					var _this = this;
					var selectedRows = null; //scope.gridApi5.selection.getSelectedRows();
					var ids = new Array();
					selectedRows = $scope.gridApi1.selection.getSelectedRows();
					if(selectedRows.length < 1) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					}
					for(var index in selectedRows) {
						var row = selectedRows[index];
						ids.push(row.workingNoSizeGroupId);
					}
					
					var modalInstance = $uibModal.open({
						animation: true,
						ariaLabelledBy: 'modal-title',
						ariaDescribedBy: 'modal-body',
						templateUrl: 'update-b-number.html',
						size: "md",
						controller: function($scope, $uibModalInstance) {

							debugger;
							$scope.submit = function() {

								$uibModalInstance.resolve({
									bNumber: $scope.bNumber
								});
								$uibModalInstance.dismiss();
							};
							$scope.dismiss = function() {
								$uibModalInstance.dismiss();
							}

						}

					});
					
					modalInstance.resolve = function(result) {

						var bNumber = result.bNumber;

						var param = {
							bNumber: bNumber,
							ids: ids.join(",")
						}
						GLOBAL_Http($http, "cpo/api/worktable/workingnosizegroup/updateList", 'POST', param, function(data) {
							if(data.status == 0) {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
								 _this.search($scope);
							} else {
								modalAlert(CommonService, 2, data.message, null);
							}
						}, function(data) {

							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});

					}
				}
				
				
				$scope.initBNumGrid = function(scope) {
					var _this = this;

					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverPercentTemplate = document.getElementById("hoverPercentTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;

					scope.gridOptions1 = {
						data: 'bNumList',
						paginationPageSizes: [10, 20, 50, 100, 200, 500],
						paginationPageSize: 100,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						useExternalPagination: true,
						zsColumnFilterRequestUrl: "/cpo/api/worktable/query_slt_result_filter?",
						zsColumnFilterRequestParam: {},
						columnDefs: CommonService.constructeStaticColumnsFromJSON(scope, "bno", false, null, 200),

						onRegisterApi: function(gridApi) {
							scope.gridApi1 = gridApi;

							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
								_this.getBNum(scope.page);
							});

						}
					};
				}






				$scope.initLC0190NewDate = function(scope) {
					var _this = this;
			          var param = {
			            in_code : 'LC0190NewOrderDate'
			          }

					GLOBAL_Http($http , "cpo/api/sys/admindict/translate_code?" , 'GET' , param , function ( data ) {
						if(data.LC0190NewOrderDate && data.LC0190NewOrderDate.length > 0) {
							scope.LC0190Date = data.LC0190NewOrderDate[0].label;			
						} else {
							var message = data.message ? data.message : $translate.instant('errorMsg.NO_ARTICLE_SEASON_IN_RANGEE_FOUND');
							modalAlert(CommonService, 2, message, null);
						}
					}, function(data) {

						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}



				$scope.initBNumGrid($scope);
                $scope.initLC0190NewDate($scope);
				$scope.selectTab = function(index) {
					$scope.tabIndex = index;
					if(index == 1) {
						$scope.getBNum($scope.page, true);
					}
				}
				$scope.importFile = function(fileType) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'FileModal',
						controller: 'FileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: fileType
								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {

						if(returnData) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);

						}
					}, function() {

					});

				}
				$scope.importFRCompareData = function(fileType) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'FileModal',
						controller: 'FileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: fileType
								};
							}
						}
					});
					modalInstance.resolve = function(result) {
						if(result) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
							var param = {
								documentType: 30001
							};
							exportExcel(param, "cpo/portal/document/export_file?", "_blank");
						}
					}
				}
				
				
				
				
				$scope.changeLC0190Date = function() {
					 var _this = this;
			          var param = {
			            in_code : 'LC0190NewOrderDateOption'
			          }

					GLOBAL_Http($http , "cpo/api/sys/admindict/translate_code?" , 'GET' , param , function ( data ) {
						if(data.LC0190NewOrderDateOption && data.LC0190NewOrderDateOption.length > 0) {

							$scope.newOrderDates = data.LC0190NewOrderDateOption.map(function(item) {
								return {
									id: item.value,
									label: item.label,
									value:item.value
								}

							});

							var topScope = $scope;
							var modalInstance = $uibModal.open({
								animation: true,
								ariaLabelledBy: 'modal-title',
								ariaDescribedBy: 'modal-body',
								templateUrl: 'set-lc0190-date.html',
								size: "md",
								controller: function($scope, $uibModalInstance) {

									$scope.newOrderDates = topScope.newOrderDates;
									$scope.selectNewOrderDate = $scope.newOrderDates[0];

									$scope.submit = function() {

										$uibModalInstance.resolve({
											value: $scope.selectNewOrderDate.value
										});
										$uibModalInstance.dismiss();
									};
									$scope.dismiss = function() {
										$uibModalInstance.dismiss();
									}

								}

							});

							modalInstance.resolve = function(result) {

								var param = {
									value: result.value
								}
								GLOBAL_Http($http, "cpo/api/worktable/set_lc0190_by_date", 'POST', param, function(data) {
									if(data.status == 0) {
										$scope.initLC0190NewDate($scope);
										modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
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
				
				
				
				
				
				
				
				
				
			}
		])
})();