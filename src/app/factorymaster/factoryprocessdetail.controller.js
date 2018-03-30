(function () {
    'use strict';

    angular
        .module('cpo')
        .service('factoryProcessDetailService', ['$http', 'CommonService', '$location','$translate',
            function ($http, CommonService, $location,$translate) {

                var modalScope;
                var gModalInstance;
                /**
                 * モーダル設定
                 */
                this.setModalScope = function (inScope, inModalInstance) {
                    modalScope = inScope;
                    gModalInstance = inModalInstance;
                };

                this.cancel = function () {
                    gModalInstance.dismiss();
                }

                /**
                 * init
                 */
                this.init = function (scope,planGroups) {
                    var _this = this;
                    scope.errorOutputMsgs = [];
                    scope.factoryDetail ={};
                    if (planGroups) {
                        var paramObj = {
                            'factoryProcessId':planGroups.id
                        };
                        GLOBAL_Http($http, "cpo/api/factory/get_factory_process_detail?", 'GET',  paramObj, function (data) {
                        	
                            if (data.status == 0) {
                                 scope.factoryProcessDetail=data.output;
                                 scope.factoryProcessDetail.updateTime=simpleDateFormat(scope.factoryDetail.utcUpdate);
                            } else {
                                var message = data.message;
                                modalAlert(CommonService, 3, message, null);
                            }
                        }, function (data) {
                          modalAlert(CommonService, 3, $translate.instant('errorMsg.REQUSET_DATA_ERROR'), null);
                        });
                    }
                };
            }])
        .controller('factoryProcessDetailController', ["$scope", "factoryProcessDetailService", '$uibModalInstance', "fileReader",'planGroups',
            function ($scope, factoryProcessDetailService, $uibModalInstance, fileReader,planGroups) {
                factoryProcessDetailService.init($scope,planGroups);

                factoryProcessDetailService.setModalScope($scope, $uibModalInstance);
                $scope.cancel = function () {
                    factoryProcessDetailService.cancel();
                }
            }])

})();
