/**
 * Created by mac on 2017/10/2.
 */
(function () {
  'use strict';
  angular
    .module('cpo')
    .service('transferReportService', ['$http', '$translate', 'CommonService', '$uibModal',
      function ($http, $translate, CommonService, $uibModal) {
        this.tabindex = 1;
        this.getOrderDates = function (scope){
          var _this= this;
          var param = {
            in_code: 'POTRANSFERLC0190DATE'
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
            scope.orderDates = [{id:"",label:"All"}];
            if(data.POTRANSFERLC0190DATE)	{

              scope.orderDates = scope.orderDates.concat(data.POTRANSFERLC0190DATE);

              for ( var i = 0 ; i < scope.orderDates.length ; i++ ) {
                scope.orderDates[ i ].id = scope.orderDates[ i ].value;
                scope.orderDates[ i ].label = scope.orderDates[ i ].label.split(' ')[ 0 ];
              }

            }
            scope.model_orderDate = scope.orderDates[0];
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
            scope.orderDates = [{id:"",label:"All"}];
            scope.model_orderDate = scope.orderDates[0];
          });
        }

        this.resetPageInfo = function (scope) {

          scope.page = {
            curPage: 1,
            pageSize: 20,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.gridOptions.paginationCurrentPage = 1;
        }

        this.fetchTabInfo = function (scope) {
          scope.customerReportOne = [];
          var staticColumns;
          scope.gridOptions.columnDefs = [];
          if (scope.tabindex == 1) {
            staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'po_lo_report', false, null, null);
            this.getData(scope,'cpo/api/worktable/potransfer/find?')
          } else if (scope.tabindex == 2) {
            staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'po_internal_report', false, null, null);
            this.getData(scope,'cpo/api/worktable/potransfer/find?')
          } else if (scope.tabindex == 3) {
            staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'style_lo_report', false, null, null);
            this.getData(scope,'cpo/api/worktable/styletransfer/find?')
          } else if (scope.tabindex == 4) {
            staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'style_internal_report', false, null, null);
            this.getData(scope,'cpo/api/worktable/styletransfer/find?')
          }else if (scope.tabindex == 5) {
            staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'transfered_order_list', false, null, null);
            this.getData(scope,'cpo/api/worktable/factorytransferresult/find?')
          }
          scope.gridOptions.columnDefs = staticColumns;
        }

        this.getData = function (scope, url) {

          var param = {
            pageSize: scope.page.pageSize,
            pageNo: scope.page.curPage
          };

          if(scope.fromDate&&scope.toDate&&Date.parse(new Date(scope.fromDate))>Date.parse(new Date(scope.toDate))){
            modalAlert(CommonService, 2, $translate.instant('factoryCriteria.END_TIME_EARLY_THAN_START_TIME'), null);
            return;
          }

          if (scope.fromDate){
            var value = scope.fromDate+" 00:00:00";//formatStratTime(scope.fromDate);
            if(scope.tabindex==1||scope.tabindex==2){
              param.gte_order_release_date = value;
            }else if(scope.tabindex==3||scope.tabindex==4||scope.tabindex==5){
              param.gte_utc_create = value;
            }
          }
          if(scope.toDate){
            var value = scope.toDate+" 23:59:59";//formatEndTime(scope.toDate);
            if(scope.tabindex==1||scope.tabindex==2){
              param.lte_order_release_date = value;
            }else if(scope.tabindex==3||scope.tabindex==4||scope.tabindex==5){
              param.lte_utc_create = value;
            }
          }
          if (scope.tabindex == 5 && scope.documentType){
            param['documentType'] = scope.documentType.label
          }
          if (scope.tabindex == 5&&scope.workingNo) {
            param['workingNo'] = scope.workingNo;
          }

          if(scope.tabindex==1||scope.tabindex==2){
            if(scope.model_orderDate.id){
              param['lc0190Date'] = scope.model_orderDate.id;
            }
          }
          param['sort'] = "utc_create";
          param['order'] = "desc";

          GLOBAL_Http($http, url, 'GET', param, function (data) {

            if (data.rows) {
              // var height = (scope.page.pageSize * 30) + 36;
              // $("#customerForecastReportOne").css('height', height + 'px');

              scope.page.totalNum = data.total;
              scope.gridOptions.totalItems = scope.page.totalNum;


              var result = translateData(data.rows);

              scope.customerReportOne = result;

            } else {
              scope.customerReportOne=[]
              //  modalAlert(CommonService, 3, data.message, null);
            }
          }, function (data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

        this.editStyleTransfer = function (scope) {
          var selectedRows = scope.gridApi.selection.getSelectedRows();
					if(selectedRows.length !== 1) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.ALERT_CHOOSE_DATA'), null);
						return;
          }
          scope.transferReportData={
            row:selectedRows[0],
            reportType:scope.tabindex===2?'Po':"style"
          }
          scope.$broadcast('transfer.Init', scope.transferReportData);
          scope.isEdit = 'styleTransferEdit';

          // var modalInstance = $uibModal.open({
					// 	templateUrl: 'transferPoEditDetailModal',
					// 	controller: 'transferPoEditDetailController',
					// 	backdrop: 'static',
					// 	size: 'md',
					// 	resolve: {
					// 		planGroups: function() {
					// 			return {
					// 				"row": selectedRows[0]
					// 			};
					// 		}
					// 	}
					// });
					// // modalInstance callback
					// modalInstance.result.then(function(returnData) {}, function() {
					// 	// dismiss(cancel)
					// });
        }
        this.initFirstGrid = function (scope) {
          var _this = this;
          var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope, 'po_lo_report', false, null, null);
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
            //						paginationTemplate: "<div>a</div>",
            // useExternalPagination: true,
            // useExternalSorting: true,
            columnDefs: staticColumns,
            onRegisterApi: function (gridApi) {
              scope.gridApi = gridApi;
              scope.gridApi.core.on.sortChanged(scope, function (grid, sortColumns) {
                if (sortColumns.length !== 0) {
                  if (sortColumns[0].sort.direction === 'asc') {
                    scope.page.sortDirection = true;
                  }
                  if (sortColumns[0].sort.direction === 'desc') {
                    scope.page.sortDirection = false;
                  }
                  scope.page.sortColumn = sortColumns[0].displayName;
                }
              });
              scope.gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;
                _this.fetchTabInfo(scope)
                // if (_this.tabindex == 1) {
                //   _this.gettransferReport(scope);
                // } else if (_this.tabindex == 2) {
                //   _this.getOpenFCSummaryReport(scope);
                // } else if (_this.tabindex == 3) {
                //   _this.getFCSummaryReport(scope);
                // }

              });
            }
          };

        }
        this.getSelectedData = function(scope) {
					var param = {
						in_code: 'DOCUMENTTYPE'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
            if(data.DOCUMENTTYPE)	scope.docTypes = data.DOCUMENTTYPE

					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
        }
        this.exportFile = function ( scope ) {

          if(scope.fromDate&&scope.toDate&&Date.parse(new Date(scope.fromDate))>Date.parse(new Date(scope.toDate))){
            modalAlert(CommonService, 2, $translate.instant('factoryCriteria.END_TIME_EARLY_THAN_START_TIME'), null);
            return;
          }

          var tabValue = "";
          var documentType = '';
          var param = {
          	pageSize:100000,
          	pageNo:1
          };
          switch ( scope.tabindex ) {
            case 1:
              param[ 'documentType' ] = '504';
              break;
            case 2:
              param[ 'documentType' ] = '505';
              break;
            case 3:
              param[ 'documentType' ] = '506';
              break;
            case 4:
              param[ 'documentType' ] = '507';
              break;
            case 5:
              param[ 'documentType' ] = '508';
              break;
            defaults:
              tabValue = Tab;
              break;

          }

          if (scope.fromDate){
            var value = scope.fromDate+" 00:00:00";//formatStratTime(scope.fromDate);
            if(scope.tabindex==1||scope.tabindex==2){
              param.gte_order_release_date = value;
            }else if(scope.tabindex==3||scope.tabindex==4||scope.tabindex==5){
              param.gte_utc_create = value;
            }
          }
          if(scope.toDate){
            var value = scope.toDate+" 23:59:59";//formatEndTime(scope.toDate);
            if(scope.tabindex==1||scope.tabindex==2){
              param.lte_order_release_date = value;
            }else if(scope.tabindex==3||scope.tabindex==4||scope.tabindex==5){
              param.lte_utc_create = value;
            }
          }

          if (scope.tabindex == 5 && scope.documentType){
            param['order_type'] = scope.documentType.label
          }
          if (scope.tabindex == 5&&scope.workingNo) {
            param['working_no'] = scope.workingNo;
          }

          if(scope.tabindex==1||scope.tabindex==2){
            if(scope.model_orderDate.id){
              param['lc0190Date'] = scope.model_orderDate.id;
            }
          }

          GLOBAL_Http($http , "cpo/portal/document/check_record_count?" , 'GET' , param , function ( data ) {
            if ( data.status == 0 ) {
              if ( parseInt(data.message) > 0 ) {
                exportExcel(param , "cpo/portal/document/export_file?" , "_blank");
              } else {
                modalAlert(CommonService , 2 , $translate.instant('notifyMsg.NO_DATA_EXPORT') , null);
              }
            }
          } , function ( data ) {
            modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
          });

          //  exportExcel(param, "cpo/portal/document/export_file?", "_blank");
        }

        /**
         * init
         */
        this.init = function (scope) {
          // 初期化
          var _this = this;
          scope.isEdit = 'edit';
          scope.docTypes=[];
          scope.orderDates = [{id:"",label:"All"}];
          scope.model_orderDate = scope.orderDates[0];
          scope.page = {
            curPage: 1,
            pageSize: 20,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };

          scope.headerList = [];
          //					_this.getSeasonList(scope);
          scope.customerReportOne = [];
          _this.initFirstGrid(scope);
          this.getSelectedData(scope);
          this.getOrderDates(scope);
          scope.$on('page.close', function() {
            scope.isEdit = 'edit'
            _this.fetchTabInfo(scope)
					});

        };
      }
    ])
    .controller('transferReportCtrl', ['$scope', 'transferReportService',
      function ($scope, transferReportService) {
        $scope.fetchInfo = function (index) {
          transferReportService.resetPageInfo($scope);
          $scope.tabindex = index;
          $scope.fromDate =null;
          $scope.toDate =null;
          transferReportService.fetchTabInfo($scope);
        }

        $scope.fillterList = function () {
          transferReportService.fetchTabInfo($scope)
        }
        $scope.editStyleTransfer = function(){
          transferReportService.editStyleTransfer($scope)
        }
        $scope.exportFile = function(){
          transferReportService.exportFile($scope)
        }
        transferReportService.init($scope);
      }
    ])
})();
