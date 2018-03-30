/**
 * Created by mac on 2017/11/17.
 */
(function() {
  'use strict';
  angular
    .module('cpo')
    .controller('baseDataSetupCtrl', ['$scope','$uibModal','CommonService','$http','$translate',
      function($scope,$uibModal,CommonService,$http,$translate) {
        $scope.navList = ['Base Setup', 'B Num',"Season Date Range","Plan Group","Product Update"];
        $scope.tabIndex = 0;
        $scope.importLineSheetData = function(){
            var modalInstance = $uibModal.open({
              templateUrl: 'uploadFileModal',
              controller: 'UploadFileController',
              backdrop: 'static',
              size: 'md',
              resolve: {
                planGroups: function() {
                  return {
                    fileType: "901"
                  };
                }
              }
            });
            modalInstance.result.then(function(returnData) {

            }, function() {});
        }
        $scope.page = {
          curPage: 1,
          pageSize: 100,
          sortColumn: 'id',
          sortDirection: false,
          totalNum: 0
        };
        $scope.search = function(){

            $scope.getBNum($scope.page,true);
        }
        $scope.getBNum = function(page,shouldPageNumberReset) {
          $scope.bNumList =[];
          var param = {
            pageSize:page.pageSize,
            pageNo: page.curPage
          };
          if($("#searchWorkingNo").val()){
            param.like_working_no = $("#searchWorkingNo").val();
          }
          if(shouldPageNumberReset){
            page.curPage = 1;
            param.pageNo = page.curPage;
          }

          GLOBAL_Http($http, "cpo/api/worktable/workingnosizegroup/find?", 'GET', param, function(data) {

            $scope.bNumList = data.rows;
            $scope.page.totalNum = data.total;

            $scope.gridOptions1.totalItems = $scope.page.totalNum;
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        $scope.initBNumGrid = function (scope) {
          var _this = this;

          var hoverTemplate = document.getElementById("hoverTemplate").innerText;
          var hoverPercentTemplate = document.getElementById("hoverPercentTemplate").innerText;
          var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;

          scope.gridOptions1 = {
            data: 'bNumList',
            paginationPageSizes:  [10, 20, 50, 100, 200, 500],
            paginationPageSize: 100,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableColumnMenus: true,
            enableGridMenu: true,
            enableSorting: false,
            enableHorizontalScrollbar: 1,
            enableVerticalScrollbar: 0,
            totalItems: scope.page.totalNum,
            useExternalPagination: true,
            zsColumnFilterRequestUrl:"/cpo/api/worktable/query_slt_result_filter?",
            zsColumnFilterRequestParam:{},
            columnDefs: CommonService.constructeStaticColumnsFromJSON(scope,"bno",false,null,200)
          ,

            onRegisterApi: function (gridApi) {
              scope.gridApi1 = gridApi;

              gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;
                _this.getBNum( scope.page);
              });

            }
          };

        }

        $scope.initBNumGrid($scope);

        $scope.selectTab = function ( index) {
          $scope.tabIndex = index;
          if(index==1){
            $scope.getBNum($scope.page,true);
          }
        }
        $scope.importFile = function(fileType) {
          var _this = this;
          var modalInstance = $uibModal.open({
            templateUrl: 'FileModal',
            controller: 'FileController',
            backdrop: 'static',
            size: 'md',
            resolve: {
              planGroups: function() {
                return {
                  fileType: fileType
                };
              }
            }
          });
          modalInstance.result.then(function(returnData) {

            if(returnData) {
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);

            }
          }, function() {

          });

        }
      }
    ])
})();
