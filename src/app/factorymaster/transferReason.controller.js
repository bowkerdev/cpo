/**
 * Created by mac on 2017/11/10.
 */
(function() {
  'use strict';

  angular.module('cpo')
  .controller('transferReasonCtrrl', function ($uibModalInstance,$scope) {


    $scope.submit = function () {

      $uibModalInstance.resolve({remark:$scope.remark,reason:$scope.reason});
      $uibModalInstance.dismiss();
    };
    $scope.dismiss = function(){
      $uibModalInstance.dismiss();
    }
  });
})();
