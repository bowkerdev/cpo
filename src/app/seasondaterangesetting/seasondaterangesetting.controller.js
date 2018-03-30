(function () {
  'use strict';
  angular.module('cpo')
    .service('seasonSettingService', ['$http', '$translate', 'CommonService', '$uibModal',
      function($http, $translate, CommonService, $uibModal) {
      function formatDate(time) {
        return Date.parse(new Date(time));
      }
        this.edit=function (scope, row) {

          row.entity.Edit=true;
          row.entity.dataTemp=angular.copy(row.entity);
        }
        this.cancel=function (scope, row) {
          if(row.entity&&row.entity.dataTemp){
            for(var key in row.entity.dataTemp){
              if(key=='Edit'){
                row.entity[key]=false;
                continue;
              }
              row.entity[key]=row.entity.dataTemp[key];
            }
          }else{
            for(var i=0;i<scope.items.length;i++){
              if(scope.items[i].$$hashKey==row.entity.$$hashKey){
                scope.items.splice(i,1);
              }
            }
          }
        }
        this.checkParam=function (scope,row) {
            if(!row.entity.documentType&& !row.entity.documentTypeName){
              modalAlert(CommonService, 2, $translate.instant('seasonDRSetting.INPUT_DOCUMENT_TYPE'), null);
              return false;
            }
            if(!row.entity._season &&!row.entity.season){
              modalAlert(CommonService, 2, $translate.instant('seasonDRSetting.INPUT_SEASON'), null);
              return false;
            }
            if(!row.entity.fromDate){
              modalAlert(CommonService, 2, $translate.instant('seasonDRSetting.INPUT_FROM_DATE'), null);
              return false;
            }
            if(!row.entity.toDate){
              modalAlert(CommonService, 2, $translate.instant('seasonDRSetting.INPUT_TO_DATE'), null);
              return false;
            }
            if(!row.entity.validationDate){
              modalAlert(CommonService, 2, $translate.instant('seasonDRSetting.INPUT_VALIDATION_DATE'), null);
              return false;
            }
            if(!row.entity.invalidationDate){
              modalAlert(CommonService, 2, $translate.instant('seasonDRSetting.INPUT_INVALIDATION_DATE'), null);
              return false;
            }

            return true;
        }
        this.confirm=function (scope,row) {
          var _this=this;
         if( !_this.checkParam(scope,row))return;
          var param={};

          if(row.entity.documentType){
            param.documentType=row.entity.documentType.value;
            for(var i=0;i<scope.documentTypeList.length;i++){
              if(scope.documentTypeList[i].value==row.entity.documentType.value){
                param.documentTypeName=scope.documentTypeList[i].label;
              }
            }
          }else{
            param.documentTypeName=row.entity.documentTypeName;
            for(var i=0;i<scope.documentTypeList.length;i++){
              if(scope.documentTypeList[i].label==row.entity.documentTypeName){
                param.documentType=scope.documentTypeList[i].value;
              }
            }
          }
          if(row.entity._season){
            param.season=row.entity._season.value;
          }else{
            param.season=row.entity.season;
          }
          param.fromDate=formatDate(row.entity.fromDate);
          param.toDate=formatDate(row.entity.toDate);
          param.validationDate=formatDate(row.entity.validationDate);
          param.invalidationDate=formatDate(row.entity.invalidationDate);
          param.status=1;
          var url="";
          var method="";
          if(row.entity.isNew){
            url="cpo/api/worktable/seasondaterangesettingExt/create";
            method="post";
          }else{
            url="cpo/api/worktable/seasondaterangesettingExt/update";
            method="put";
            param.seasonDateRangeSettingId=row.entity.seasonDateRangeSettingId;
          }
          GLOBAL_Http($http, url, method, param, function(data) {
              if(data.status==0){
                if(row.entity.isNew){
                  modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_CREATE'), null);
                }else{
                  modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPDATE_SUCCESS'), null);
                }
              }
               _this.findList(scope);
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.delete=function (scope,row) {
        var _this=this;
          var param={
            seasonDateRangeSettingId:row.entity.seasonDateRangeSettingId
          }
          GLOBAL_Http($http, "cpo/api/worktable/seasondaterangesettingExt/remove", 'delete', param, function(data) {
              if(data.status==0){
                modalAlert(CommonService, 2, $translate.instant('notifyMsg.DELETE_SUCCESS'), null);
                _this.findList(scope);
              }else{
                modalAlert(CommonService, 3, $translate.instant('notifyMsg.DELETE_FAIL'), null);
              }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.add=function (scope) {
          var obj=new Object();
            obj.documentTypeName="";
            obj.season="";
            obj.fromDate="";
            obj.toDate="";
            obj.validationDate="";
            obj.invalidationDate="";
            obj.Edit=true;
            obj.isNew=true;
            scope.items.unshift(obj);
            console.log(scope.items);
        }
        this.getDocumentTypeListList = function(scope) {
          var param={
            in_code:'DOCUMENTTYPE'
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
              scope.documentTypeList=data.DOCUMENTTYPE;
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.getSeasonList = function (scope) {
          var param = {
          }
          GLOBAL_Http($http, "cpo/api/worktable/query_season?", 'GET', param, function(data) {
            scope.seasonList = data.output
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        var formatKey_long=[];
        var formatKey_simple=['fromDate','toDate','validationDate','invalidationDate'];
        function formatConversion(list){
          if(typeof list=='object'){
            if(list instanceof Array){
              for(var i=0;i<list.length;i++){
                formatConversion(list[i]);
              }
            }else{
              for(var key in list){
                if(list[key] instanceof Array){
                  for(var i=0;i<list[key].length;i++){
                    formatConversion(list[key][i]);
                  }

                }else{
                  if(formatKey_long.indexOf(key)!=-1&&list[key]){
                    var date=new Date()
                    date.setTime(list[key]);
                    list[key]=date.Format("yyyy-MM-dd hh:mm");
                  }
                  if(formatKey_simple.indexOf(key)!=-1&&list[key]){
                    var date=new Date()
                    date.setTime(list[key]);
                    list[key]=date.Format("yyyy-MM-dd");
                  }
                }
              }
            }
          }
          return list;
        }
        this.findList=function (scope) {
            GLOBAL_Http($http, "cpo/api/worktable/seasondaterangesetting/find?", 'GET', {eq_status:'1',pageSize:100000,pageNo:1}, function(data) {
              if(data.rows){
                scope.items=formatConversion(data.rows);
                scope.page.totalNum=data.rows.length;
                scope.gridOptions.totalItems=scope.page.totalNum;

              }else{
                scope.items=[];
              }
            }, function(data) {
              modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
            });
        }
        this.init = function(scope) {
          // 初期化
          var _this = this;
          scope.page = {
            curPage: 1,
            pageSize: 10,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          _this.getDocumentTypeListList(scope);
          _this.getSeasonList(scope);
          var documentTypeTemplate = document.getElementById('documentTypeTemplate').innerText;
          var seasonTemplate = document.getElementById('seasonTemplate').innerText;
          var fromDateTemplate = document.getElementById('fromDateTemplate').innerText;
          var toDateInputTemplate = document.getElementById('toDateInputTemplate').innerText;
          var validationFromInputTemplate = document.getElementById('validationFromInputTemplate').innerText;
          var validationToInputTemplate = document.getElementById('validationToInputTemplate').innerText;
          var operationTemplate = document.getElementById('operationTemplate').innerText;
          scope.gridOptions = {
            data: 'items',
             paginationPageSizes: [10000],
             paginationPageSize: 10000,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableColumnMenus: true,
            enableGridMenu: true,
            enableSorting: false,
            enableHorizontalScrollbar: 1,

            enableVerticalScrollbar: 0,
            totalItems: scope.page.totalNum,
            useExternalPagination: false,
            columnDefs: [
              {
                name: 'documentTypeName',
                displayName: $translate.instant('seasonDRSetting.DOCUMENT_TYPE'),
                field: 'documentTypeName',
                cellTemplate:documentTypeTemplate,
                width:"150"
              },
              {
                name: 'season',
                displayName: $translate.instant('seasonDRSetting.SEASON'),
                field: 'season',
                cellTemplate:seasonTemplate,
                width:"150"
              },
              {
                name: 'fromDate',
                displayName: $translate.instant('seasonDRSetting.FROMDATE'),
                field: 'fromDate',
                width:"200",
                cellTemplate:fromDateTemplate
              },
              {
                name: 'toDate',
                displayName: $translate.instant('seasonDRSetting.TODATE'),
                field: 'toDate',
                width:"200",
                cellTemplate:toDateInputTemplate
              },
              {
                name: 'validationDate',
                displayName: $translate.instant('seasonDRSetting.VALIDATION_DATE'),
                field: 'validationDate',
                width:"200",
                cellTemplate:validationFromInputTemplate
              },
              {
                name: 'invalidationDate',
                displayName: $translate.instant('seasonDRSetting.INVALIDATION_DATE'),
                field: 'invalidationDate',
                width:"200",
                cellFilter:'timeConvert:\'yyyy-MM-dd\'',
                cellTemplate:validationToInputTemplate
              },
              {
                name: 'operation',
                displayName: "operation",
                field: 'operation',
                headerCellTemplate: '<div class="templatestyle">' + '<i class="fa fa-plus fa-lg" ng-click="grid.appScope.add()">' + '</i>' + '</div>',
                cellTemplate: operationTemplate,
                width: 150
              }
            ],
            onRegisterApi: function(gridApi) {
              scope.gridApi = gridApi;

              scope.gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;
                // _this.getFactoryList(scope);
              });
            }
          };
          _this.findList(scope);
        };
      }
  ])
    .controller('seasonSettingCtrl', ['$scope', 'seasonSettingService',
      function($scope, seasonSettingService) {
        $scope.findList = function() {
          seasonSettingService.findList($scope);
        }
        $scope.view = function() {
          seasonSettingService.view($scope);
        }
        $scope.exportFile = function() {
          seasonSettingService.exportFile($scope);
        }
        $scope.edit = function(row) {
          seasonSettingService.edit($scope,row);
        }
        $scope.cancel = function(row) {
          seasonSettingService.cancel($scope,row);
        }
        $scope.add = function() {
          seasonSettingService.add($scope);
        }
        $scope.delete = function(row) {
          seasonSettingService.delete($scope,row);
        }
        $scope.confirm = function(row) {
          seasonSettingService.confirm($scope,row);
        }
        seasonSettingService.init($scope);
      }
    ])
})();
