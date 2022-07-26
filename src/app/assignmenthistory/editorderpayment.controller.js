(function () {
  'use strict';

  angular
    .module('cpo')
    .service('EditOrderPaymentService', ['$http', 'CommonService', '$translate',
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
        this.save = function (scope) {
          // 输入值校验
          if (!scope.form['dnNo'].trim() ||
            (scope.form['cancelationQty'] === null) ||
            (scope.form['cancelationCost'] === null)
          ) {
            modalAlert(CommonService, 1, $translate('history.MSG_REQUIRED_NO_FILLED'), null);
            return
          }
          // key: 用户填写表单的key， value: 提交数据到后台的key
          var saveMatch = {
            po: 'CPO',
            dnNo: 'DN Number',
            cancelationQty: 'Cancellation Qty',
            addQty: 'Add Qty',
            cancelationCost: 'Cancellation Cost',
            completeOrNot: 'Payment Complete Or Not'
          }
          var param = {}
          Object.keys(saveMatch).forEach(function (key) {
            var paramKey = saveMatch[key]
            if (key == 'completeOrNot') { //select组件绑定的值为对象
              param[paramKey] = scope.form[key]['value']
            } else {
              param[paramKey] = scope.form[key]
            }
          })
          CommonService.showLoadingView("Loading...")
          GLOBAL_Http($http, "portal/worktableediorderpayment/savePayment", 'POST', param, function (data) {
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
          var data = angular.copy(planGroups['editData'])
          // 存在值显示现在值,没有值默认选中Y
          for (var i = 0; i < scope.completeOrNotList.length; i++) {
            var item = scope.completeOrNotList[i]
            if (item['value'] === data.completeOrNot) {
              data.completeOrNot = item
              break
            }
          }
          if (typeof data.completeOrNot == 'string') {
            data.completeOrNot = scope.completeOrNotList[0]
          }
          scope.form = data || {}
        }

      }
    ])
    .controller('EditOrderPaymentController', ["$scope", "EditOrderPaymentService", '$uibModalInstance', 'planGroups',
      function ($scope, EditOrderPaymentService, $uibModalInstance, planGroups) {
        EditOrderPaymentService.setModalScope($scope, $uibModalInstance);
        $scope.completeOrNotList = [
          { label: 'Y', value: 'Y' },
          { label: 'N', value: 'N' }
        ]
        $scope.cancel = function () {
          EditOrderPaymentService.cancel();
        }
        $scope.save = function () {
          EditOrderPaymentService.save($scope);
        }

        EditOrderPaymentService.init($scope, planGroups);
      }
    ])

})();