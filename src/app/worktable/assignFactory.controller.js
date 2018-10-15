/**
 * Created by mac on 2017/11/10.
 */
(function() {
	'use strict';
	angular.module('cpo')
		.service('assignFactoryService', ['$http', '$translate', 'CommonService', '$location',
			function($http, $translate, CommonService, $location) {


				this.init = function(scope) {
                    scope.assignModes=[{"label":"Normal Assign","value":"NO"},{"label":"Assign By Factory Id","value":"YES"}];
					scope.assignMode=scope.assignModes[0];
				}
			}
		])
		.controller('assignFactoryCtrl', ['$uibModalInstance','$scope','assignFactoryService', function($uibModalInstance, $scope,assignFactoryService) {
			$scope.submit = function() {
				$uibModalInstance.resolve({
					isAssignByFactoryId: $scope.assignMode.value
				});
				$uibModalInstance.dismiss();
			};
			$scope.dismiss = function() {
				$uibModalInstance.dismiss();
			}
			assignFactoryService.init($scope);

		}]);
})();