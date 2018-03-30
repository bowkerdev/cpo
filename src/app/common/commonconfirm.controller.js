(function () {
  'use strict';

  angular.module('cpo')

    .service('CommonConfirmService',
      ['$location', '$uibModal', 'CommonService', '$translate',
        function ($location, $uibModal, CommonService, $translate) {

          this.init = function (scope, outputMode, outputMsg) {
            scope.cancelOutputFlag = false;
            scope.cancelButton = $translate.instant('notifyMsg.CONFIRM_MSG_NO');
            if (outputMode === 0) {
              // type_ok: 0
              scope.successButton = $translate.instant('notifyMsg.CONFIRM_MSG_YES');
              scope.cancelOutputFlag = true;
            } else {
              // type_okCancle: 1 2 3
              scope.successButton = $translate.instant('notifyMsg.CONFIRM_MSG_YES');
              scope.cancelOutputFlag = false;
            }
            switch (outputMode) {
              case 0://确认
                scope.color = "blue";
                scope.imgurl = "assets/images/alert_confirm.png";
                scope.outputTitle = $translate.instant('notifyMsg.ALERT_TITLE_CONFIRM');
                break;
              case 1://警告
                scope.color = "yellow";
                scope.imgurl = "assets/images/alert_warning.png";
                scope.outputTitle = $translate.instant('notifyMsg.ALERT_TITLE_WARNING');
                break;
              case 2://温馨提示
                scope.color = "blue";
                scope.imgurl = "assets/images/alert_hint.png";
                scope.outputTitle = $translate.instant('notifyMsg.ALERT_TITLE_HIT');
                break;
              case 3://错误
                scope.color = "red";
                scope.imgurl = "assets/images/alert_error.png";
                scope.outputTitle = $translate.instant('notifyMsg.ALERT_TITLE_ERROR');
                break;
              default:
            }
            scope.outputMsg = outputMsg;
          };
        }])

    .controller('CommonConfirmCtrl',
      ['$scope', '$uibModalInstance', 'CommonConfirmService', 'outputMode', 'outputMsg',
        function ($scope, $uibModalInstance, CommonConfirmService, outputMode, outputMsg) {

          $scope.clickCancel = function () {
            $uibModalInstance.dismiss();
          };
          $scope.clickOK = function () {
            $uibModalInstance.close();
          };

          $scope.init = function () {
            CommonConfirmService.init($scope, outputMode, outputMsg);
          }

          $scope.init();

        }]);

})();
