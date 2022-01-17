/**
 * Created by mac on 2017/11/10.
 */
(function() {
	'use strict';
	angular.module('cpo')
		.service('setReserveMaterialService', ['$http', '$translate', 'CommonService', '$location',
			function($http, $translate, CommonService, $location) {

				this.init = function(scope) {
          scope.target="";
				}
			}
		])
		.controller('setReserveMaterialCtrl', ['$uibModalInstance','$scope','setReserveMaterialService', function($uibModalInstance, $scope,setReserveMaterialService) {
			$scope.submit = function() {
				$uibModalInstance.resolve($scope.target);
				// $uibModalInstance.dismiss();
			};
			$scope.dismiss = function() {
				$uibModalInstance.dismiss();
			}
      $scope.changeFormat = function(v) {
					$scope[v]=$scope[v].replace(/\n/g,';').replace(/\t/g,',');
			}
			setReserveMaterialService.init($scope);

		}]);
})();
