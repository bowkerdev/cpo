/**
 * Created by mac on 2017/11/10.
 */
(function() {
	'use strict';
	angular.module('cpo')
		.service('orderListFilterService', ['$http', '$translate', 'CommonService', '$location',
			function($http, $translate, CommonService, $location) {


				this.init = function(scope) {
					scope.idPropertySettings = {
						smartButtonMaxItems: 100,
						smartButtonTextConverter: function(itemText, originalItem) {
							return itemText;
						},
						showCheckAll: false,
						showUncheckAll: false
					};
					scope.changeEventSettings={
						onSelectionChanged:function(){
							scope.documentType=[];
							for(var i=0;i<scope.documentTypeList.length;i++){
								scope.documentType.push(scope.documentTypeList[i].id);
							}
						}
					}
					
                    scope.documentTypes=[{label:'MKTFC',value:'MKTFC',id:'MKTFC'},
                    {label:'CUSFC',value:'FC',id:'FC'},
                    {label:'Order',value:'Order',id:'Order'}];
					scope.documentTypeList=angular.copy(scope.documentTypes) ;
					scope.documentType=[];
					for(var i=0;i<scope.documentTypeList.length;i++){
						scope.documentType.push(scope.documentTypeList[i].id);
					}
				}
			}
		])
		.controller('orderListFilterCtrl', ['$uibModalInstance','$scope','orderListFilterService', function($uibModalInstance, $scope,orderListFilterService) {
			$scope.submit = function() {
				var result={};
				if($scope.documentType.indexOf('FC')>-1){
					result['fromPeriod']=$scope.fromPeriod;
					result['toPeriod']=$scope.toPeriod;
				}
				if($scope.documentType.indexOf('Order')>-1){
					result['fromFpd']=$scope.fromFpd;
					result['toFpd']=$scope.toFpd;
				}
				result['documentType']=$scope.documentType.join(',');
				$uibModalInstance.result(result);
				$uibModalInstance.dismiss();
			};
			$scope.dismiss = function() {
				$uibModalInstance.dismiss();
			}
			$scope.checkDocumentType = function(beCheck) {
				return $scope.documentType.indexOf(beCheck);
			}
			orderListFilterService.init($scope);

		}]);
})();