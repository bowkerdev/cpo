/**
 * Created by mac on 2017/11/10.
 */
(function() {
	'use strict';
	angular.module('cpo')
		.service('OrderInfoCheckingService', ['$http', '$translate', 'CommonService', '$location',
			function($http, $translate, CommonService, $location) {

				this.getOrderInfoChecking=function(scope,param,interfaceName) {
					var _this = this;
					scope.orderInfoCheckingData = [];
          			scope.gridOptions.showLoading = true;
					GLOBAL_Http($http, "cpo/api/worktable/"+interfaceName, 'POST', param, function(data) {
          				scope.gridOptions.showLoading = false;
						var headers = [];
							angular.forEach(data.jsonExportEntries, function(item, index) {
								headers.push({
									name: (item.headerName ? item.headerName : "") + index,
									displayName: item.headerName,
									field: item.jsonObjectKey
								})
							});
						scope.gridOptions.columnDefs = angular.copy(headers);
						scope.orderInfoCheckingData = data.output;

					}, function(data) {
          				scope.gridOptions.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

				this.init = function(scope,parameter) {
					scope.gridOptions = {
						data: 'orderInfoCheckingData',
						rowEditWaitInterval: -1,
						paginationPageSizes: [100000],
						paginationPageSize: 100000,
						enableRowSelection: true,
						flatEntityAccess: true,
						fastWatch: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: true,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						useExternalPagination: false,
						enablePagination: true,
						enableFiltering:true,
						enablePaginationControls: true,
						columnDefs: []
					};
					this.getOrderInfoChecking(scope,parameter,parameter.interfaceName);
				}
			}
		])
		.controller('OrderInfoCheckingCtrl', ['$uibModalInstance','$scope','OrderInfoCheckingService', 'parameter',function($uibModalInstance, $scope,OrderInfoCheckingService,parameter) {
			$scope.submit = function() {
				$uibModalInstance.dismiss();
			};
			$scope.dismiss = function() {
				$uibModalInstance.dismiss();
			}
			OrderInfoCheckingService.init($scope,parameter);

		}]);
})();