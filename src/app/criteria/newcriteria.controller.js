(function() {
  'use strict';

  angular
    .module('cpo')
    .service('NewCriteriaService', ['$http','CommonService', '$location','$translate',
      function($http,CommonService,$location,$translate) {
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
          gModalInstance.close();
        }


        this.save=function(scope){
        	if(!scope.versionName){
        		modalAlert(CommonService, 3, $translate.instant('criteria.PLEASE_INPUT_VERSION_NAME'), null);
        		return;
        	}
          var param={
          	versionId:scope.versionId,
          	versionName:scope.versionName
          }
          GLOBAL_Http($http, "cpo/api/criteria/save_criteria_version?", 'POST', param, function(data) {
            if(data.status == 0) {
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
              gModalInstance.close("1");
            } else {
              var message = data.message;
              modalAlert(CommonService, 3, message, null);
            }
          }, function(data) {
            // alert error
            modalAlert(CommonService, 3, data, null);
          });

        }



        this.init=function(scope,planGroups){
          var _this=this;
          scope.versionName="";
          scope.versionId=planGroups.id;
        };

      }])
    .controller('NewCriteriaModalCtrl', ['$scope', 'NewCriteriaService', '$uibModalInstance','planGroups',
      function ($scope, NewCriteriaService, $uibModalInstance,planGroups) {
        $scope.cancel = function () {
          NewCriteriaService.cancel();
        }
        $scope.save = function () {
          NewCriteriaService.save($scope);
        }
        $scope.init = function () {
          NewCriteriaService.init($scope,planGroups);
        }

        NewCriteriaService.setModalScope($scope, $uibModalInstance);
        NewCriteriaService.init($scope,planGroups);
      }])

})();
