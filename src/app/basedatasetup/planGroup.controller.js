/**
 * Created by mac on 2017/11/17.
 */
(function() {
  'use strict';
  angular
    .module('cpo')
    .controller('planGroupCtrl', ['$scope','$uibModal','CommonService','$http','$translate',
      function(scope,$uibModal,CommonService,$http,$translate) {
      scope.planGroupItems = [];

        scope.add = function(){
          var _this = this;
          var modalInstance =
            $uibModal.open({
              animation: true,
              ariaLabelledBy:"modal-header",
              templateUrl: 'app/basedatasetup/planGroupNewOrEdit.html',
              controller: 'planGroupNewOrEditCtrl',
              resolve:{
                info:{
                  type:"add",
                  title: "Add"
                }
              }
            });

          modalInstance.resolve =  function(result) {
            var param = result;
            GLOBAL_Http($http , "cpo/api/factory/factorygroupExt/create" , 'POST' , param , function ( data ) {
              if ( data.status == 0 ) {

                modalAlert(CommonService , 2 , $translate.instant('notifyMsg.SUCCESS_SAVE') , null);
                _this.fetchInfo(scope.page,true);
              } else {

                modalAlert(CommonService , 2 , data.message , null);
              }
            } , function ( data ) {

              modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
            });
          }

        }
        scope.edit = function(){
          var _this = this;
          var selectedRows = this.gridApi1.selection.getSelectedRows();
          if (selectedRows.length !== 1) {
            modalAlert(CommonService, 2, $translate.instant('notifyMsg.ALERT_CHOOSE_DATA'), null);
            return;
          }

          var modalInstance =
            $uibModal.open({
              animation: true,
              ariaLabelledBy:"modal-header",
              templateUrl: 'app/basedatasetup/planGroupNewOrEdit.html',
              controller: 'planGroupNewOrEditCtrl',
              resolve:{
                info:{
                  type:"edit",
                  title: "Edit",
                  select:selectedRows[0]
                }
              }
            });


          modalInstance.resolve =  function(result) {
            var param = result;
            GLOBAL_Http($http , "cpo/api/factory/factorygroupExt/update" , 'PUT' , param , function ( data ) {
              if ( data.status == 0 ) {

                modalAlert(CommonService , 2 , $translate.instant('notifyMsg.SUCCESS_SAVE') , null);
                _this.fetchInfo(scope.page,true);
              } else {

                modalAlert(CommonService , 2 , data.message , null);
              }
            } , function ( data ) {

              modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
            });
          }
        }
        scope.delete = function(){
          var _this = this;
          var selectedRows = this.gridApi1.selection.getSelectedRows();

          if (selectedRows.length <= 0) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            return;
          }
          if (selectedRows.length !== 1) {
            modalAlert(CommonService, 2, $translate.instant('notifyMsg.ALERT_CHOOSE_DATA'), null);
            return;
          }
          var ids = listToString(selectedRows, 'factoryGroupId');
          var param = {
            factoryGroupId:ids
          }
          modalAlert(CommonService, 0, $translate.instant('errorMsg.PLEASE_CONFIREM_DELETE'), function () {
            GLOBAL_Http($http , "cpo/api/factory/factorygroupExt/remove" , 'DELETE' , param , function ( data ) {
              if ( data.status == 0 ) {
                modalAlert(CommonService , 2 , $translate.instant('notifyMsg.SUCCESS_SAVE') , null);
                _this.fetchInfo(scope.page,true);
              } else {
                modalAlert(CommonService , 2 , data.message , null);
              }
            } , function ( data ) {
              modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
            });
          });

        }
        scope.fetchInfo = function(page,shouldPageNumberReset){
          scope.bNumList =[];
          var param = {
            pageSize:page.pageSize,
            pageNo: page.curPage
          };

          if(shouldPageNumberReset){
            page.curPage = 1;
            param.pageNo = page.curPage;
          }

          GLOBAL_Http($http, "cpo/api/factory/factorygroup/find?", 'GET', param, function(data) {

            scope.planGroupItems = data.rows;
            scope.page.totalNum = data.total;
            scope.gridOptions.totalItems = scope.page.totalNum;

          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

        }
        scope.page = {
          curPage: 1,
          pageSize: 100,
          sortColumn: 'id',
          sortDirection: false,
          totalNum: 0
        };
        scope.gridOptions = {
          data: 'planGroupItems',
          paginationPageSizes:  [100, 200, 500],
          paginationPageSize: 100,
          rowEditWaitInterval: -1,
          enableRowSelection: true,
          enableRowHeaderSelection: true,
          enableColumnMenus: false,
          enableGridMenu: false,
          enableSorting: false,
          enableHorizontalScrollbar: 1,
          enableVerticalScrollbar: 0,
          totalItems: scope.page.totalNum,
          useExternalPagination: true,
          columnDefs: CommonService.constructeStaticColumnsFromJSON(scope,"planGroup",false,null,100,true) ,
          onRegisterApi: function (gridApi) {
            scope.gridApi1 = gridApi;
            gridApi.selection.setMultiSelect(false);
            gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
              scope.page.curPage = newPage;
              scope.page.pageSize = pageSize;
              scope.fetchInfo( scope.page);
            });
          }
        };
        scope.fetchInfo(scope.page,true);
      }








    ])
})();
