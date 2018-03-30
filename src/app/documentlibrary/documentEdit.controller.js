(function() {
  'use strict';

  angular
    .module('cpo')
    .service('DocumentEditService', ['$http', '$uibModal', '$translate', 'COMMON_CONFIG', 'CommonService', '$location',
      function($http, $uibModal, $translate, COMMON_CONFIG, CommonService, $location) {

        this.closePage = function(scope) {
          scope.$emit("page.close");
        }
        this.Save = function(scope){
          var _this = this;
          var param = {
            documentId:scope.selectDoc.documentId,
            orderDate:scope.selectDoc.orderDate,
          };
          ///cpo/api/document/document/update
          GLOBAL_Http($http , "cpo/api/document/update_document_batch_date?" , 'POST' , param , function ( data ) {
            if ( data.status == 0 ) {

              modalAlert(CommonService , 2 , $translate.instant('notifyMsg.SUCCESS_SAVE') , null);
              _this.closePage(scope);

            } else {

              modalAlert(CommonService , 2 , data.message , null);
            }
          } , function ( data ) {

            modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
          });
        }
        this.init = function(scope) {
          // 初期化
          var _this = this;


        }
      }
    ])
    .controller('DocumentEditController', ['$scope', 'DocumentEditService', 'CommonService', '$translate',
      function($scope, DocumentEditService, CommonService, $translate) {
        $scope.closePage = function() {
          DocumentEditService.closePage($scope);
        }
        $scope.Save = function() {
          DocumentEditService.Save($scope);
        }

        DocumentEditService.init($scope);

      }
    ])
})();
