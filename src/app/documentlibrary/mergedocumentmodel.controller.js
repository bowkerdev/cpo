/**
 * Created by mac on 2018/1/11.
 */

(function() {
  'use strict';

  angular.module('cpo').controller('mergedocumentCtrl', function ($uibModalInstance,CommonService,$scope,planGroups,$http, $location,$translate) {

    $scope.items = planGroups.items;
    $scope.targeDocument = $scope.items[0];
    $scope.documentIds = planGroups.documentIds;
    setTimeout(function(){
      jQuery("#submitButton").click(function(){

        var param =   {
          document_id:$scope.targeDocument.documentId,
          documentIds:$scope.documentIds
        }
        if( $scope.newFileName){
          param.documentName = $scope.newFileName;
        }
        GLOBAL_Http($http, "cpo/api/worktable/merge_document?", 'POST', param, function(data) {
          if(data.status == 0) {
            modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
            $uibModalInstance.resolve();
            $uibModalInstance.dismiss();
          } else {
            var message = data.message;
            modalAlert(CommonService, 3, message, null);
          }
        }, function(data) {
          // alert error
          modalAlert(CommonService, 3, data, null);
        });
      })
    },1000);

    $scope.dismiss = function(){
      $uibModalInstance.dismiss();
    }

  });


})();
