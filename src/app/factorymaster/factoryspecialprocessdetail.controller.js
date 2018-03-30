(function () {
    'use strict';

    angular
        .module('cpo')
        .service('factorySpecialProcessDetailService', ['$http', 'CommonService', '$location','$translate',
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

                this.save = function (scope) {
                	if(scope.Mode=='VIEW'){
                		 gModalInstance.close();
                		 return;
                	}
                	var data=judgeDifferent(scope.factorySpecialProcessDetail.factoryProcessLoadings,scope.originFSPDetail.factoryProcessLoadings,
                	'factProLoadId','capacity');
                	
                	if(data.length==0){
                		 modalAlert(CommonService, 0, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
                		 gModalInstance.dismiss();
                		 return;
                	}
                	var param={
                		'factoryProcessLoadings':data
                	};
                	GLOBAL_Http($http, "cpo/api/factory/update_process_capacity?", 'PUT', param, function(data) {
						
						if(data.status == 0) {
                             modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
                             gModalInstance.close('YES');
						} else {
							var message = data.message;
							if(message) {
								modalAlert(CommonService, 3, message, null);
							}
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
                    
                }

                /**
                 * init
                 */
                this.init = function (scope,planGroups) {
                    var _this = this;
                    scope.errorOutputMsgs = [];
                    scope.factoryDetail ={};
                    scope.Mode=planGroups.Mode;
                    if (planGroups) {
                        var paramObj = {
                            'factoryProcessId':planGroups.id
                        };
                        GLOBAL_Http($http, "cpo/api/factory/get_factory_process_detail?", 'GET',  paramObj, function (data) {
                        	
                            if (data.status == 0) {
                                 scope.factorySpecialProcessDetail=data.output;
                                 scope.factorySpecialProcessDetail.updateTime=simpleDateFormat(scope.factoryDetail.utcUpdate);
                                 scope.originFSPDetail=angular.copy(scope.factorySpecialProcessDetail);
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
        .controller('factorySpecialProcessDetailController', ["$scope", "factorySpecialProcessDetailService", '$uibModalInstance', "fileReader",'planGroups',
            function ($scope, factorySpecialProcessDetailService, $uibModalInstance, fileReader,planGroups) {
                factorySpecialProcessDetailService.setModalScope($scope, $uibModalInstance);
                $scope.cancel = function () {
                    factorySpecialProcessDetailService.cancel();
                }
                 $scope.save = function () {
                    factorySpecialProcessDetailService.save($scope);
                }
                factorySpecialProcessDetailService.init($scope,planGroups);                
            }])

})();
