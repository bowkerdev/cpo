(function () {
    'use strict';

    angular
        .module('cpo')
        .service('factoryDetailService', ['$http', 'CommonService', '$location','$translate',
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
                            'id':planGroups.id
                        };
                        GLOBAL_Http($http, "cpo/api/factory/view?", 'GET',  paramObj, function (data) {

                            if (data.status == 0) {
                                 scope.factoryDetail=data.output;
                                 scope.factoryDetail.updateTime=simpleDateFormat(scope.factoryDetail.utcUpdate);
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
        .controller('factoryDetailController', ["$scope", "factoryDetailService", '$uibModalInstance', "fileReader",'planGroups',
            function ($scope, factoryDetailService, $uibModalInstance, fileReader,planGroups) {
                factoryDetailService.init($scope,planGroups);

                factoryDetailService.setModalScope($scope, $uibModalInstance);
                $scope.cancel = function () {
                    factoryDetailService.cancel();
                }
            }])

})();
