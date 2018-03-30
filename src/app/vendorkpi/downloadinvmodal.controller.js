(function() {
  'use strict';

  angular
    .module('cpo')
    .service('downLoadInvService', ['$http', 'CommonService', '$location', '$translate',
      function($http, CommonService, $location, $translate) {

        var modalScope;
        var gModalInstance;
        /**
         * モーダル設定
         */
        this.getFactoryList=function (scope) {

          var param={
            in_code:"FACTORYCODE"
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
            if(data.FACTORYCODE){
             scope.factoryCodes=data.FACTORYCODE;

              for(var i=0;i<scope.factoryCodes.length;i++){
                scope.factoryCodes[i].id=scope.factoryCodes[i].value;
              }
            }else{
              scope.factoryCodes=[];
            }

          });
        }
        this.setModalScope = function(inScope, inModalInstance) {
          modalScope = inScope;
          gModalInstance = inModalInstance;
        };
        function _joinOrigin(list) {
          var str="";
          list.forEach(function (val) {
            if(str==""){
              str+=val.id;
            }else{
              str+=","+val.id;
            }
          })
          return str;
        }
        this.cancel = function() {
          gModalInstance.dismiss();
        }
        this.exportDOC=function (scope,param) {
          if(scope.origin){
            param.origin=_joinOrigin(scope.origin);
          }
          if(scope.inv){
            param.invOption=scope.inv.value;
          }
          if(scope.selectFacotoryCode&&scope.selectFacotoryCode.length>0){
            param.factoryCode = scope.selectFacotoryCode.sort(function(a,b){return a.id>b.id})
                                     .map(function(item){return item.id})
                                     .join(",");


          }
          if(scope.inputStartTime){
            param.startDate = scope.inputStartTime;
          }
          if(scope.inputEndTime){
            param.endDate = scope.inputEndTime;
          }
          this.cancel();
          exportExcel(param, "cpo/portal/document/export_file?", "_blank");


        }
        this.getOrigin=function (scope) {
          var param={
            in_code:"VENDORKPI"
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
              if(data.VENDORKPI){
                scope.originList=data.VENDORKPI;
                for(var i=0;i<scope.originList.length;i++){
                  scope.originList[i].id=scope.originList[i].value;
                }
                console.log(scope.originList);
               }else{
                scope.originList=[];
              }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.save = function(scope) {

        }
        this.init = function(scope, planGroups) {
          scope.invList=[{
            label:"I",
            value:"I"
          },{
            label:"E",
            value:"E"
          }];
          scope.factoryCodes = [];
          this.getFactoryList(scope);
          scope.selectFacotoryCode = [];
          scope.inv=scope.invList[0];
          scope.originList=[];
          scope.origin=[];
          scope.setting = {
            smartButtonMaxItems: 5,
            template: '{{option.label}}',
            smartButtonTextConverter: function(itemText, originalItem) {
              return itemText;
            }
          };
          scope.buttonTrans = {
            buttonDefaultText:$translate.instant('vendorKpi.ALL_ORIGIN'),
            checkAll: $translate.instant('index.SELECT_ALL'),
            uncheckAll: $translate.instant('index.NOT_SELECT_ALL')
          };
          scope.factorySetting = {
            smartButtonMaxItems: 5,
            template: '{{option.label}}',
            smartButtonTextConverter: function(itemText, originalItem) {
              return itemText;
            }
          };
          scope.factoryButtonTrans = {
            buttonDefaultText:$translate.instant('vendorKpi.ALL_FACTORY_CODE'),
            checkAll: $translate.instant('index.SELECT_ALL'),
            uncheckAll: $translate.instant('index.NOT_SELECT_ALL')
          };
          this.getOrigin(scope);
        };
      }
    ])
    .controller('downLoadInvController', ["$scope", "downLoadInvService", '$uibModalInstance', "fileReader", 'planGroups',
      function($scope, downLoadInvService, $uibModalInstance, fileReader, planGroups) {
        downLoadInvService.setModalScope($scope, $uibModalInstance);
        $scope.cancel = function() {
          downLoadInvService.cancel();
        }
        $scope.exportDOC = function() {
          downLoadInvService.exportDOC($scope,planGroups.param);
        }
        $scope.save = function() {
          downLoadInvService.save($scope);
        }
        downLoadInvService.init($scope);
      }
    ])

})();
