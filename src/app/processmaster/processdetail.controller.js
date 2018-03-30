(function () {
    'use strict';

    angular
        .module('cpo')
        .service('ProcessDetailService', ['$http', 'CommonService', '$location','$translate',
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
                    scope.processDetail ={};
                    if (planGroups) {
                        var paramObj = {
                            'id':planGroups.id
                        };
                        GLOBAL_Http($http, "cpo/api/process/view?", 'GET',  paramObj, function (data) {
                        	
                            if (data.status == 0) {
                                 scope.processDetail=data.output;
                                 scope.processDetail.updateTime=dateFormat(scope.processDetail.utcUpdate);
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
        .controller('processDetailController', ["$scope", "ProcessDetailService", '$uibModalInstance', "fileReader",'planGroups',
            function ($scope, ProcessDetailService, $uibModalInstance, fileReader,planGroups) {
                ProcessDetailService.init($scope,planGroups);

                ProcessDetailService.setModalScope($scope, $uibModalInstance);
                $scope.cancel = function () {
                    ProcessDetailService.cancel();
                }
            }])

})();
