/**
 * Created by mac on 2017/11/10.
 */
(function() {
	'use strict';
	angular.module('cpo')
		.service('changeApplicationService', ['$http', '$translate', 'CommonService', '$location',
			function($http, $translate, CommonService, $location) {

				this.getFactoryList = function (scope) {
                    var _this = this;
                    var param = {
                        pageNo: 1,
                        factory_type:0,
                        pageSize: 1000
                    }
                    GLOBAL_Http($http, "portal/factory/find?", 'GET', param, function (data) {
                        scope.siteList = new Array();
                        if (data.rows) {
                             for (var i = 0; i < data.rows.length; i++) {
                                var siteData = {
                                    id: data.rows[i].factoryId,
                                    label: data.rows[i].factSimpName
                                }
                                scope.siteList.push(siteData);
                            }
                            scope.site=scope.siteList[0];
                        } else {
                            modalAlert(CommonService, 2, data.message, null);
                        }
                    }, function (data) {
                        modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
                    });
                }


				this.init = function(scope, parameter) {
                    scope.site={};
					this.getFactoryList(scope);
				}
			}
		])
		.controller('changeApplicationCtrl', ['$uibModalInstance','$scope','changeApplicationService','parameter', function($uibModalInstance, $scope,changeApplicationService, parameter) {
			$scope.submit = function() {
				$uibModalInstance.resolve({
					remark: $scope.remark,
					reason: $scope.reason,
					factory: $scope.site.label
				});
				$uibModalInstance.dismiss();
			};
			$scope.dismiss = function() {
				$uibModalInstance.dismiss();
			}
			changeApplicationService.init($scope, parameter);

		}]);
})();