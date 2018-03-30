(function() {
	'use strict';
	angular
		.module('cpo')
		.service('workTableReportService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
				this.selectTab = function(scope, Tab) {
					scope.activeTab = Tab;
					if(Tab == 1) {
						scope.showView = 'MarketingForecast';
					} else if(Tab == 2) {
						scope.showView = 'CustomerForecast';
					}else if(Tab==3){
						scope.showView = 'transfer';
					}else if(Tab==4){
						scope.showView = 'lc0190';
					}else if(Tab==5){
						scope.showView = 'fillRateReport';
					}else if(Tab==6){
						scope.showView = 'dutySaveReport';
					}else if(Tab==7){
            scope.showView = 'quantityReport';
          }

				}
				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;
					scope.activeTab = 1;
					scope.showView = 'MarketingForecast';
				};
			}
		])
		.filter('quantityFilter', function() {
			return function(input) {

				if(!isNaN(input)) {

					var parts = input.toString().split(".");
					parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					return parts.join(".");

				} else {
					return input;
				}

			}
		})
		.controller('workTableReportCtrl', ['$scope', 'workTableReportService',
			function($scope, workTableReportService) {
				$scope.selectTab = function(Tab) {
					workTableReportService.selectTab($scope, Tab);
				}
				$scope.rowSelect = function(row) {
					workTableReportService.rowSelect($scope, row);
				}
				workTableReportService.init($scope);
			}
		])
})();
