/**
 * Created by mac on 2017/11/10.
 */
(function() {
	'use strict';
	angular.module('cpo')
		.service('confirmReserveMaterialService', ['$http', '$translate', 'CommonService', '$location',
			function($http, $translate, CommonService, $location) {

				this.init = function(scope) {
          scope.reserveList = new Array();
          scope.reserve = {
              id: 'YES',
              label: 'YES'
          }
          var a2 = {
              id: 'NO',
              label: 'NO'
          }
          scope.reserveList.push(scope.reserve);
          scope.reserveList.push(a2);
				}
			}
		])
		.controller('confirmReserveMaterialCtrl', ['$uibModalInstance','$scope','confirmReserveMaterialService', function($uibModalInstance, $scope,confirmReserveMaterialService) {
			$scope.submit = function() {
				$uibModalInstance.resolve($scope.reserve.label);
				$uibModalInstance.dismiss();
			};
			$scope.dismiss = function() {
        $uibModalInstance.resolve('Cancel');
				$uibModalInstance.dismiss();
			}
			confirmReserveMaterialService.init($scope);

		}]);
})();
