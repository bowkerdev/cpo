(function () {
    'use strict';

    angular
        .module('cpo')
        .service('workingNoDetailService', ['$http', 'CommonService', '$location','$translate',
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


                  if(!scope.workingNoDetail.garmentProductingDay||
                    isNaN(scope.workingNoDetail.garmentProductingDay)||
                      parseFloat(scope.workingNoDetail.garmentProductingDay)!=parseInt(scope.workingNoDetail.garmentProductingDay)) {
                    modalAlert(CommonService, 2, $translate.instant('factoryCriteria.GARMENT_PRODUCTION_DAY_SHOULD_BE_A_NUMBER'), null);
                    return false;
                  }
                	if(scope.Mode=='VIEW'){
                		 gModalInstance.close();
                		 return;
                	}
                	var param={
                		'workingNoId':scope.workingNoDetail.workingNoId,
                		"bowkerASource":scope.workingNoDetail.bowkerASource,
                		"garmentProductingDay":scope.workingNoDetail.garmentProductingDay
                	};
                	GLOBAL_Http($http, "cpo/api/workingNo/update_working_no?", 'PUT', param, function(data) {

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
                    scope.workingNoDetail ={};
                    scope.Mode=planGroups.mode;
                    if (planGroups) {
                        var paramObj = {
                            'id':planGroups.id
                        };
                        GLOBAL_Http($http, "cpo/api/workingNo/view?", 'GET',  paramObj, function (data) {

                            if (data.status == 0) {
                                 scope.workingNoDetail=data.output;
                                 scope.workingNoDetail.updateTime=simpleDateFormat(scope.workingNoDetail.utcUpdate);
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
        .controller('workingNoDetailController', ["$scope", "workingNoDetailService", '$uibModalInstance', "fileReader",'planGroups',
            function ($scope, workingNoDetailService, $uibModalInstance, fileReader,planGroups) {
                $scope.cancel = function () {
                    workingNoDetailService.cancel();
                }
                $scope.save = function () {
                    workingNoDetailService.save($scope);
                }
                workingNoDetailService.init($scope,planGroups);
                workingNoDetailService.setModalScope($scope, $uibModalInstance);
            }])

})();
