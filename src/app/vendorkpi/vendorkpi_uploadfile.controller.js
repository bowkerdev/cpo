(function() {
  'use strict';

  angular
    .module('cpo')
    .service('vendorKpiFileService', ['$http', 'CommonService', '$location', '$translate','$uibModal',
      function($http, CommonService, $location, $translate,$uibModal) {

        var modalScope;
        var gModalInstance;
        /**
         * モーダル設定
         */
        this.setModalScope = function(inScope, inModalInstance) {
          modalScope = inScope;
          gModalInstance = inModalInstance;
        };
        function _join(list) {
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
        this.save = function(scope) {

        }
        this.getCountryList=function (scope) {
          var param={
            in_code:"VENDORKPICOUNTRY"
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
            if(data.VENDORKPICOUNTRY){
              scope.countryList=data.VENDORKPICOUNTRY;
              for(var i=0;i<scope.countryList.length;i++){
                scope.countryList[i].id=scope.countryList[i].value;
              }
            }
          });
        }
        this.getDownloadTemplateUrl=function (scope) {
          var url="";
            switch (getEnvironment()){
              case "UAT":
                url="http://bowkercpodev.azurewebsites.net/upload/example/";
                break
              case "PROD":
                url="bowkercpov2.azurewebsites.net/upload/example/";
                break
              case "SIT":
                url="http://112.74.191.64:8080/upload/example/";
                break
              default:
                url="http://112.74.191.64:8080/upload/example/";
                break;
            }
            return url;
        }
        this.downloadTemplate=function (scope, type) {
          var url=this.getDownloadTemplateUrl(scope);
          switch (type) {
            case 1002:
              url+="Data1 - SHP-example.xlsx";
              break;
            case 1001:
              url+="Data2 - INV-example.xlsx";
              break;
            case 1004:
              url+="Data5 - HOL-example.xlsx";
              break;
            case 1005:
              url+="SEA MODE - 3PL - PA document submission timeline.xlsx";
              break;
            case 1006:
              url+="SEA MODE - 3PL - KN document submission timeline.xlsx";
              break;
            case 1007:
              url+="SEA MODE - 3PL - Damco document submission timeline.xlsx";
              break;
            case 1003:
              var param={};
              param.documentType=1003;
              var modalInstance = $uibModal.open({
                templateUrl: 'downLoadInvModal',
                controller: 'downLoadInvController',
                backdrop: 'static',
                animation:true,
                size: 'md',
                resolve: {
                  planGroups: function() {
                    return {
                      param:param
                    };
                  }
                }
              });
              modalInstance.result.then(function(returnData) {
              }, function() {});

              return;
          }
          window.open(url, "_blank");
        }

        /**
         * init
         */
        this.UploadFile=function(scope,file){

          scope.file=file;
          scope.fileName=file.name;
        }


        this.Upload=function(scope){
          if(scope.fileType == 901) {
            if(!scope.season.id) {
              modalAlert(CommonService, 2, $translate.instant('worktable.SELECT_AT_LEAST_A_SEASON'), null);
              return;
            }
          }
          if(!scope.file){
            modalAlert(CommonService, 2, $translate.instant('errorMsg.PLEASE_SELECT_FILE'), null);
            return;
          }
          var _this = this;
          var fileType = getFileType(scope.file.name);
          if(fileType !== 'xlsx' && fileType !== 'xls' && fileType !== 'xlsm' && fileType !== 'xltx' && fileType !== 'xltm' && fileType !== 'xlsb' && fileType !== 'xlam') {
            modalAlert(CommonService, 3, $translate.instant('errorMsg.ERROR_FILE_FORMAT'), null);
            return;
          }
          var fd = new FormData();
          fd.append('file', scope.file);
          fd.append("documentType", scope.fileType);
          if(scope.fileType == 901) {
            fd.append("season", scope.season.label);
          }
          if(scope.criteriaVersionId){
            fd.append("criteriaVersionId", scope.criteriaVersionId);
          }
          if(scope.fileType==1004 &&scope.country&&scope.country.length>0){
            fd.append("country",_join(scope.country));
          }
          scope.uploadHtml = 'Uploading... ';
          scope.Uploading = true;
          GLOBAL_Http_UploadFile($http, "cpo/api/worktable/upload_factory_assignment_document?", fd, function(data) {

            if(data.status == 0) {
              gModalInstance.close("YES");
            } else {
              scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
              scope.Uploading = false;
              modalAlert(CommonService, 3, data.message, null);
            }
          }, function(data) {
            scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
            scope.Uploading = false;
            modalAlert(CommonService, 3, $translate.instant('notifyMsg.UPLOAD_FAIL'), null);
          });
        }
        this.init = function(scope, planGroups) {
          var _this = this;
          scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
          scope.Uploading = false;
          scope.fileName='Please Select File...';
          scope.fileType=planGroups.fileType;
          if(scope.fileType==1004){
            scope.countrySelect=true;
          }
          scope.criteriaVersionId=planGroups.criteriaVersionId;
          scope.season={};
          scope.country=[];
          this.getCountryList(scope);
          scope.countrySetting = {
            smartButtonMaxItems: 5,
            template: '{{option.label}}',
            smartButtonTextConverter: function(itemText, originalItem) {
              return itemText;
            }
          };
          scope.countryButtonTrans = {
            buttonDefaultText:"",
            checkAll: $translate.instant('index.SELECT_ALL'),
            uncheckAll: $translate.instant('index.NOT_SELECT_ALL')
          };
          // if(planGroups.fileType=="1003"){
          //   scope.hideTemplate=true;
          // }else{
          //   scope.hideTemplate=false;
          // }

        };
      }
    ])
    .controller('vendorKpiFileController', ["$scope", "vendorKpiFileService", '$uibModalInstance', "fileReader", 'planGroups',
      function($scope, vendorKpiFileService, $uibModalInstance, fileReader, planGroups) {
        vendorKpiFileService.setModalScope($scope, $uibModalInstance);
        $scope.cancel = function() {
          vendorKpiFileService.cancel();
        }
        $scope.save = function() {
          vendorKpiFileService.save($scope);
        }
        $scope.UploadFile = function(file) {
          if(file){
            vendorKpiFileService.UploadFile($scope,file);
          }
        }
        $scope.downloadTemplate = function() {
          vendorKpiFileService.downloadTemplate($scope,planGroups.fileType);
        }
        $scope.Upload = function() {
          vendorKpiFileService.Upload($scope);
        }
        $scope.onSeasonChange = function(season) {
          vendorKpiFileService.onSeasonChange($scope,season);
        }
        vendorKpiFileService.init($scope, planGroups);
      }
    ])

})();
