(function() {
	'use strict';
	angular
		.module('cpo')
		.service('workTableService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
				this.selectTab = function(scope, Tab) {
					scope.activeTab = Tab;
					if(Tab == 1) {
						scope.showView = 'MarketingForecast';
					} else if(Tab == 2) {
						scope.showView = 'CustomerForecast';
					}else if(Tab==3){
						scope.showView = 'LC0190';
						scope.$broadcast('LC0190.scrollGuild', null);
					}else if(Tab==4){
						scope.showView = 'SampleOrder';
					}else if(Tab==5){
						scope.showView = 'MIOrder';
					}else if(Tab==6){
						scope.showView = 'NonTradeCard';
					}
				}
				this.rowSelect = function(scope, row) {

					if(!row.entity.assignResultId){
						return;
					}
          scope.selectRowGridAppScore =  row.grid.appScope;
					scope.factoryAssingmentResultDetail={};
					scope.factoryAssingmentResultDetail.id=row.entity.assignResultId;
					if(row.entity.sltWorkingNoId){
						scope.factoryAssingmentResultDetail.sltWorkingNoId=row.entity.sltWorkingNoId;

					}
          if(row.entity.bNo){
            scope.factoryAssingmentResultDetail.bNo =row.entity.bNo;
          }else{
            scope.factoryAssingmentResultDetail.bNo ="N/A";
          }
					scope.factoryAssingmentResultDetail.assignmentRemark=row.entity.assignmentRemark;
					scope.showDetailView = 'showDetail';
				}

				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
          scope.selectRowGridAppScore = null;
					var _this = this;
					scope.activeTab = 1;
					scope.$on('detailPage.close',function(data){
						scope.showDetailView='';
					});
          scope.$on('detailPage.refreshGrid',function(data){

            scope.selectRowGridAppScore.refreshAll();
          });

					scope.showView = 'MarketingForecast';
					scope.$on('workTableDetail.init', function(event, data) {
						scope.$broadcast('workTableDetail.afterInit', scope.factoryAssingmentResultDetail);
					});
				};
			}
		])
    .filter('quantityFilter',function(){
        return function (input) {

          if(!isNaN(input)){

            var parts = input.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return parts.join(".");

          }else{
            return input;
          }

        }
    })
		.controller('workTableCtrl', ['$scope', 'workTableService',
			function($scope, workTableService) {
				$scope.selectTab = function(Tab) {
					workTableService.selectTab($scope, Tab);
				}
				$scope.rowSelect = function(row) {
					workTableService.rowSelect($scope, row);
				}
				workTableService.init($scope);
			}
		])
})();
