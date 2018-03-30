
(function() {
  'use strict';

  angular.module('cpo').controller('refreshOrderCtrl', function ($uibModalInstance,CommonService,$scope) {

    $scope.orderTime = null;

    $scope.submit = function () {
      if(!$scope.orderTime){
        modalAlert(CommonService, 2, "Please enter Batch Date", null);
        return;
      }
      if(!$scope.fileName){
        modalAlert(CommonService, 2, "Document name cannot be empty", null);
        return;
      }

      $uibModalInstance.resolve({documentName:$scope.fileName,orderTime:$scope.orderTime});
      $uibModalInstance.dismiss();
    };
    $scope.dismiss = function(){
      $uibModalInstance.dismiss();
    }

  });


})();
