/**
 * Created by mac on 2017/11/10.
 */
(function() {
  'use strict';
  angular
    .module('cpo')
    .service('CusSetupService', ['$timeout', '$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants', 'workTableCommonService',
      function($timeout, $http, $translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants, workTableCommonService) {
        var __this = this;
        this.fetchSetupInfo = function(scope){

          GLOBAL_Http($http, "/cpo/api/worktable/get_rate_info?", 'GET', {}, function(data) {

            if(data.output) {
              scope.chinaRate = data.output.chinaRate;
              scope.chinaQuantity = data.output.chinaQuantity;
              scope.euRate = data.output.euRate;
              scope.euQuantity = data.output.euQuantity;


            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {

            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.submit = function(scope){
          var params = {
            chinaRate:scope.chinaRate,
            chinaQuantity:scope.chinaQuantity,
            euRate:scope.euRate,
            euQuantity:scope.euQuantity
          }
          GLOBAL_Http($http, "/cpo/api/worktable/update_rate_info?", 'GET', params, function(data) {

            if(data.status==0) {

              modalAlert(CommonService , 2 , $translate.instant('notifyMsg.SUCCESS_SAVE') , null);
            } else {
              modalAlert(CommonService, 2, data.message, null);
              __this.fetchSetupInfo(scope);
            }
          }, function(data) {

            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

      }
    ])
    .controller('CusSetupCtrl', ['$scope', 'CusSetupService',
      function($scope, CusSetupService) {
        CusSetupService.fetchSetupInfo($scope);

        $scope.submit = function(){
          CusSetupService.submit($scope);
        };
      }
    ])
})();
