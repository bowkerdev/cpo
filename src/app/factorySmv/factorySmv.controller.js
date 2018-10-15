/**
 * Created by mac on 2017/11/17.
 */
(function() {
	'use strict';
	angular
		.module('cpo')
		.controller('factorySmvCtrl', ['$scope', '$uibModal', 'CommonService', '$http', '$translate',
			function($scope, $uibModal, CommonService, $http, $translate) {
				$scope.navList = ['Factory SMV'];
				$scope.tabIndex = 1;
				$scope.initDataGrid = function(scope, index, dataName) {
					var _this = this;

					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverPercentTemplate = document.getElementById("hoverPercentTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;
					scope['gridOptions' + index] = {
						data: dataName,
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
						enablePaginationControls: true,
						zsColumnFilterRequestUrl: "/cpo/api/worktable/query_slt_result_filter?",
						zsColumnFilterRequestParam: {},
						onRegisterApi: function(gridApi) {
							scope.gridApi1 = gridApi;

							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope['page' + index].curPage = newPage;
								scope['page' + index].pageSize = pageSize;
								_this.getData(scope, index);
							});

						}
					};

				}

				$scope.selectTab = function(index) {
					$scope.tabIndex = index + 1;
				}
				$scope.getTitle = function(scope, list) {
					var columnDefs = [];
					for(var i = 0; i < list.length; i++) {
						columnDefs.push({
							name: list[i].fieldName,
							displayName: list[i].exportColumnName,
							field: list[i].fieldName,
							minWidth: '120',
							enableCellEdit: false,
							pinnedLeft: true
						})
					}
					return columnDefs
				}

				$scope.getData = function(scope, index) {
					var _this = this;
					scope['data' + index] = [];
					var param = {
						pageSize: scope['page' + index].pageSize,
						pageNo: scope['page' + index].curPage
					};

					switch(index) {
						case '1':
							{
								param['eq_data_type'] = '4';
								if(scope.factorySmvDocument) {
									param['eq_document_id'] = scope.factorySmvDocument.value;
								}
								break;
							}
					}

					GLOBAL_Http($http, "cpo/api/worktable/datalogext/find_list?", 'GET', param, function(data) {
						debugger;
						scope['data' + index] = data.output.data;
						scope['page' + index].totalNum = data.output.total;
						scope['gridOptions' + index].totalItems = data.output.total;
						scope['gridOptions' + index].columnDefs = _this.getTitle(scope, data.output.headers);
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				$scope.fetchDocs = function(scope) {
					var _this = this;
					var param = {
						in_code: 'factorySmvDocuments'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
						scope.factorySmvDocuments = data.factorySmvDocuments;
						if(scope.factorySmvDocuments.length>0){
							scope.factorySmvDocument=data.factorySmvDocuments[0];
						}
						_this.getData(scope, '1');
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				$scope.export = function(index) {
					var scope = $scope;
					var _this = this;
					var param = {
						pageSize: 1000000,
						pageNo: 1
					};
					switch(index) {
						case '1':
							{
								param['eq_data_type'] = '4';
								if(scope.factorySmvDocument) {
									param['eq_document_id'] = scope.factorySmvDocument.value;
								}
								param['documentType'] = 8006;
								break;
							}
					}
					exportExcel(param, "cpo/portal/document/export_file?", "_blank");
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
									fileType: fileType,
									doResolve:"YES"
								};
							}
						}
					});
					modalInstance.resolve = function(result) {
						if(result) {
							debugger;
							$scope.getData($scope, "1");
							modalAlert(CommonService, 2, result.message, null);
						}
					}
				}
				
				$scope.refreshData=function(){
					$scope.getData($scope,$scope.tabIndex+'');
				}
				$scope.init = function(scope) {
					var _this = this;
					for(var i = 1; i < 2; i++) {
						scope['page' + i] = {
							curPage: 1,
							pageSize: 100,
							sortColumn: 'id',
							sortDirection: true,
							totalNum: 0
						};
						_this.initDataGrid($scope, i, 'data' + i);
					}
					_this.fetchDocs(scope);
				}
				$scope.init($scope);
			}
		])
})();