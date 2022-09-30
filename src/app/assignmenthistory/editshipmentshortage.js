(function () {
  'use strict';

  angular
    .module('cpo')
    .service('EditShipmentShortageService', ['$http', 'CommonService', '$translate',
      function ($http, CommonService, $translate) {

        var modalScope;
        var gModalInstance;
        var this_scope = this;

        this.setModalScope = function (inScope, inModalInstance) {
          modalScope = inScope;
          gModalInstance = inModalInstance;
        };
        this.close = function (data) {
          gModalInstance.close(data);
        };
        this.cancel = function () {
          gModalInstance.dismiss();
        }

        this.isLegalToSubmit = function (obj) {
          return (obj['shortageReason'] !== null) && obj['shortageReason'].trim() && (obj['shortageQty'] !== null)
        }

        this.save = function (scope) {
          // 判断是否填写完毕
          var illegalFlag = scope.infoList.some(function(item) {
            return !this_scope.isLegalToSubmit(item)
          })
          if (illegalFlag) {
            modalAlert(CommonService, 1, $translate('history.MSG_REQUIRED_NO_FILLED'), null)
            return
          }
          // 数据转换
          var detailList = scope.infoList.map(function(item) {
            return {
              'CPO': scope.cpo,
              'MO': item['mo'],
              'Shortage Qty': item['shortageQty'],
              'Shortage Reason': item['shortageReason'],
              'Shortage Remark': item['shortageRemark'] || '',
              'Shortage Status': item['shortageStatus']['value'],
            }
          })
          var param = {
            detail: detailList
          }
          CommonService.showLoadingView("Loading...")
          GLOBAL_Http($http, "cpo/api/worktable/ediorderbatch/saveOrderBatch", 'POST', param, function (data) {
            CommonService.hideLoadingView();
            if (data.status == 0) {
              this_scope.close('success')
            } else {
              modalAlert(CommonService, 3, $translate.instant('notifyMsg.FAIL_SAVE'), null);
            }
          }, function (data) {
            CommonService.hideLoadingView();
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          })

        }

        this.init = function (scope, planGroups) {
          var data = angular.copy(planGroups['data'])
          scope.infoList = data['list']
          scope.cpo = data['cpo']
          // 存在值显示现在值,没有值默认选中Confirmed by adidas
          for(var i = 0; i < scope.infoList.length; i++){
            for (var j = 0; j < scope.shortageStatusList.length; j++) {
              var item = scope.shortageStatusList[j]
              if (item['value'] === scope.infoList[i].shortageStatus) {
                scope.infoList[i].shortageStatus = item
                break
              }
            }
            if (typeof data.shortageStatus == 'string') {
              scope.infoList[i].shortageStatus = scope.shortageStatusList[1]
            }
          }
          
        }

      }
    ])
    .controller('editShipmentShortageController', ["$scope", "EditShipmentShortageService", '$uibModalInstance', 'planGroups',
      function ($scope, EditShipmentShortageService, $uibModalInstance, planGroups) {
        EditShipmentShortageService.setModalScope($scope, $uibModalInstance)
        $scope.shortageStatusList = [
          { label: 'Submitted to adidas', value: 'Submitted to adidas' },
          { label: 'Confirmed by adidas', value: 'Confirmed by adidas' }
        ]
        $scope.cancel = function () {
          EditShipmentShortageService.cancel()
        }
        $scope.save = function () {
          EditShipmentShortageService.save($scope)
        }

        $scope.genTrStatus = function (index) {
          var row = $scope.infoList[index]
          return EditShipmentShortageService.isLegalToSubmit(row)
        }

        EditShipmentShortageService.init($scope, planGroups)
      }
    ])

})();