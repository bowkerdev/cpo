(function () {
  'use strict';

  angular
    .module('cpo')
    .service('EditABGradeInfoService', ['$http', 'CommonService', '$translate',
      function ($http, CommonService, $translate) {

        var modalScope;
        var gModalInstance;
        var _this = this;

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
          return obj['referencePo'].trim() && obj['referenceSize'].trim() && (obj['referenceQty'] !== null)
        }

        this.save = function (scope) {
          // 判断是否填写完毕
          var illegalFlag = scope.infoList.some(function(item) {
            return !_this.isLegalToSubmit(item)
          })
          if (illegalFlag) {
            modalAlert(CommonService, 1, $translate('history.MSG_REQUIRED_NO_FILLED'), null)
            return
          }
          // 数据转换
          var detailList = scope.infoList.map(function(item) {
            return {
              'Reference PO': item['referencePo'],
              'Reference Size': item['referenceSize'],
              'Reference Qty': item['referenceQty'],
              'CPO': scope.po
            }
          })
          var param = {
            origialPo: scope.origialPo,
            detail: detailList
          }
          // TODO 获取历史填写的数据
          CommonService.showLoadingView("Loading...")
          GLOBAL_Http($http, "portal/ediorderreferenceorder/saveOrderReference?", 'POST', param, function (data) {
            CommonService.hideLoadingView();
            if (data.status == 0) {
              _this.close('success')
            } else {
              modalAlert(CommonService, 3, $translate.instant('notifyMsg.FAIL_SAVE'), null);
            }
          }, function (data) {
            CommonService.hideLoadingView();
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          }) 
          
        }

        this.init = function (scope, planGroups) {
          scope.origialPo = planGroups['originalPo'] || ''
          scope.po = planGroups['po'] || ''
          // TODO 获取历史填写的数据
          CommonService.showLoadingView("Loading...")
          GLOBAL_Http($http, "portal/ediorderreferenceorder/find?", 'GET'
          , {original_po : scope.origialPo}
          , function (data) {
            CommonService.hideLoadingView();
            scope.infoList = data && data.rows && data.rows.length? data.rows: []
            if(scope.infoList.length == 0) {
              scope.addInfo()
            }
          }
          , function (data) {
            CommonService.hideLoadingView();
            _this.cancel()
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          })
        }

      }
    ])
    .controller('EditABGradeInfoController', ["$scope", "EditABGradeInfoService", '$uibModalInstance', 'planGroups',
      function ($scope, EditABGradeInfoService, $uibModalInstance, planGroups) {
        $scope.infoList = []
        // 计算表格thead的宽度，为滚动条腾出位置
        $scope.calcTableHeadWidth = function () {
          angular.element('#editABGradeInfoTableHead').css('width', "calc(100% - " + calcScrollBarWidth() +"px)")
        }
        $scope.getAnewInfo = function () {
          return { 'referencePo':'', 'referenceSize':'', 'referenceQty': null }
        }
        $scope.removeInfo = function (index) {
          $scope.infoList.splice(index, 1)
        }
        $scope.addInfo = function () {
          $scope.infoList.push($scope.getAnewInfo())
        }
        $scope.genTrStatus = function (index) {
          var row = $scope.infoList[index]
          return EditABGradeInfoService.isLegalToSubmit(row)
        }

        EditABGradeInfoService.setModalScope($scope, $uibModalInstance)
        $scope.cancel = function () {
          EditABGradeInfoService.cancel()
        }
        $scope.save = function () {
          EditABGradeInfoService.save($scope)
        }

        EditABGradeInfoService.init($scope, planGroups)
      }
    ])

})();