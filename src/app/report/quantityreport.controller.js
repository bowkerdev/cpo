/**
 * Created by mac on 2017/10/2.
 */
(function () {
  'use strict';
  angular
    .module('cpo')
    .service('tQuantityReportService', ['$http', '$translate', 'CommonService', '$uibModal',
      function ($http, $translate, CommonService, $uibModal) {
        this.search = function ( scope ) {

          if(!scope.searchRequest.orderTime){
            modalAlert(CommonService , 2 , "No document selected." , null);
            return;
          }
          var params = {
            document_id:scope.searchRequest.orderTime.value,
            is_compare_customer_fc:scope.searchRequest.isCompareCustomerFc?"YES":"NO"
          }
          if(scope.searchRequest.field&&scope.searchRequest.field.length>0){
            params.group_by_fields =  scope.searchRequest.field.reduce(function(result,item){if(result){return result+","+item.id}else{return item.id}},"")
          }
          if(scope.searchRequest.fronMonth){
            params.fronMonth = scope.searchRequest.fronMonth
          }
          if(scope.searchRequest.toMonth){
            params.toMonth = scope.searchRequest.toMonth
          }
          if(scope.searchRequest.total !== null){
            params.total = scope.searchRequest.total
          }
          if(scope.searchRequest.total_fc !== null){
            params.total_fc = scope.searchRequest.total_fc
          }
          scope.gridOptions.showLoading = true;
          GLOBAL_Http($http, "cpo/api/quantity_report/query_quantity_report?", 'GET', params, function(data) {
            scope.gridOptions.showLoading = false;
            if(data.jsonExportEntries) {
              var headers = [];
              angular.forEach(data.jsonExportEntries, function(item, index) {
                var obj = {
                  name: (item.headerName ? item.headerName : "") + index,
                  displayName: item.headerName,
                  field: item.jsonObjectKey,
                  width: '150'
                }
                if(item.headerName === 'Total') {
                  obj.enableSorting = true
                }
                if(item.headerName === 'FC Total') {
                  obj.enableSorting = true
                }
                headers.push(obj)
              });

              scope.gridOptions.columnDefs = angular.copy(headers);
            }
            if(data.output) {
              data.output = translateData(data.output);
              scope.customerReportOne = data.output;
            } else {

            }
          }, function(data) {
            scope.gridOptions.showLoading = false;
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
          //cpo/cpo/api/document/query_document?documentType=2


        }



        this.initFirstGrid = function (scope) {
          var _this = this;
          var staticColumns = [];
          scope.gridOptions = {
            data: 'customerReportOne',
            paginationPageSizes: [20, 30, 40, 50, 100],
            paginationPageSize: 20,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableColumnMenus: true,
            enableGridMenu: true,
            enableSorting: false,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            totalItems: scope.page.totalNum,
            useExternalPagination: true,
            columnDefs: staticColumns,
            onRegisterApi: function (gridApi) {
              scope.gridApi = gridApi;


            }
          };

        }
        this.getDocType = function(scope) {
          var param = {
            in_code: 'QUANTITY_REPORT_DOCUMENT_TYPE'
          }
          var _this = this;
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
            if(data.QUANTITY_REPORT_DOCUMENT_TYPE)	scope.docTypes = data.QUANTITY_REPORT_DOCUMENT_TYPE;
            scope.searchRequest.docType = scope.docTypes[0];
            _this.getDocs(scope);
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
          //cpo/cpo/api/document/query_document?documentType=2
        }

        this.getField = function(scope) {
          var param = {
            in_code: 'QUANTITY_REPORT_FIELD'
          }
          var _this = this;

          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
            if(data.QUANTITY_REPORT_FIELD)	{
              scope.fields = data.QUANTITY_REPORT_FIELD.map(function ( item ) {
                return{
                  id:item.value,
                  label:item.label
                }
              })
            }





          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
          //cpo/cpo/api/document/query_document?documentType=2
        };

        this.getDocs =function ( scope ) {
          var _this = this;
          var param = {
            documentType: scope.searchRequest.docType.value,

          }
          GLOBAL_Http($http, "cpo/api/document/query_document?", 'GET', param, function(data) {

            if(data.status == 0) {
              if(data.output.documents) {
                scope.orderTimes =data.output.documents.map(function(item){
                  return {
                    label: item.documentOldName,
                    value:item.documentId
                  }
                });
                scope.searchRequest.orderTime = scope.orderTimes[0];
                _this.search(scope);
              } else {
                scope.items = [];
              }
            } else {
              modalAlert(CommonService, 3, data.message, null);
            }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

        }
        this.exportFile = function ( scope ) {

          if(!scope.searchRequest.orderTime){
            modalAlert(CommonService , 2 , "No document selected." , null);
            return;
          }
          var params = {
            document_id:scope.searchRequest.orderTime.value,
            is_compare_customer_fc:scope.searchRequest.isCompareCustomerFc?"YES":"NO",
            pageSize : 1000000 ,
            pageNo : 1,
            documentType:7002
          }
          if(scope.searchRequest.field&&scope.searchRequest.field.length>0){
            params.group_by_fields =  scope.searchRequest.field.reduce(function(result,item){if(result){return result+","+item.id}else{return item.id}},"")
          }
          if(scope.searchRequest.fronMonth){
            params.fronMonth = scope.searchRequest.fronMonth
          }
          if(scope.searchRequest.toMonth){
            params.toMonth = scope.searchRequest.toMonth
          }
          if(scope.searchRequest.total){
            params.total = scope.searchRequest.total
          }
          if(scope.searchRequest.total_fc){
            params.total_fc = scope.searchRequest.total_fc
          }


          exportExcel(params, "cpo/portal/document/export_file?", "_blank");
        }

        /**
         * init
         */
        this.init = function (scope) {
          // 初期化
          var _this = this;
          scope.isEdit = 'edit';
          scope.docTypes=[]
          scope.idPropertySettings = {
            smartButtonMaxItems: 100,
            smartButtonTextConverter: function(itemText, originalItem) {
              return itemText;
            },
            showCheckAll:false,
            showUncheckAll:false
          };
          scope.searchRequest = {
            docType:null,
            orderTime:null,
            isCompareCustomerFc:false,
            field:[],
            total:null,
            total_fc:null
          }
          scope.headerList = [];
          //					_this.getSeasonList(scope);
          scope.customerReportOne = [];
          _this.initFirstGrid(scope);
          this.getDocType(scope)
          this.getField(scope);

        };
      }
    ])
    .controller('tQuantityReportCtrl', ['$scope', 'tQuantityReportService',
      function ($scope, tQuantityReportService) {
        $scope.fetchInfo = function (index) {

        }
        $scope.search = function (  ) {
          tQuantityReportService.search($scope);
        }
        $scope.exportFile = function(){
          tQuantityReportService.exportFile($scope)
        }
        tQuantityReportService.init($scope);
      }
    ])
})();
