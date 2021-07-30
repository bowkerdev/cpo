(function () {
  'use strict';

  angular
    .module('cpo')
    .service('compensationCreateFormService', ['$http', 'CommonService', '$translate', 
      'uiGridConstants', 'compensationConfigService', '$uibModal',
      function ($http, CommonService, $translate, uiGridConstants, 
        compensationConfigService, $uibModal
      ) {

        var gModalInstance;
        var modalScope;
        this.setModalScope = function (inScope, inModalInstance) {
          modalScope = inScope;
          gModalInstance = inModalInstance;
        };

        this.cancel = function () {
          gModalInstance.dismiss();
        }

        this.save = function (scope) {
          gModalInstance.close()
        }

        this.addComplaint = function (scope) {
          // param
					var modalInstance = $uibModal.open({
						templateUrl: 'selectComplaintModal',
						controller: 'selectComplaintController',
						backdrop: 'static',
						size: 'lg',
						resolve: {
							planGroups: function() {
								return {
									
								}
							}
						}
					});
					modalInstance.result.then(function(returnData) {
						if(returnData) {
							condition.applicationWorkingNo = returnData;
						}
					}, function() {});
        }

        // 获取下拉框list
        this.pullSelectList = function (scope) {
          var param = {
            in_code: 'FACTORYLIST'
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function (data) {
            scope.searchFactoryList = data.FACTORYLIST;
            for (var i = 0; i < scope.searchFactoryList.length; i++) {
              scope.searchFactoryList[i].id = scope.searchFactoryList[i].value;
            }
            // TODO工厂默认值
            scope.inputForm.factory = scope.searchFactoryList[0]
          }, function (data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        // TODO
        this.pullComplaintList = function (scope) {
          var param = {}
          param['pageNo'] = scope.complaintPage.curPage
          param['pageSize'] = scope.complaintPage.pageSize
          scope.searchComplaintLoading = true;
          GLOBAL_Http($http, "cpo/api/process/query_process?", 'GET', param, function (data) {

            if (data.status == 0) {
              scope.complaintItems = translateData(data.output.processExts);
              scope.complaintPage.totalNum = data.output.total;
              scope.complaintGridOptions.totalItems = scope.complaintPage.totalNum;
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
            scope.searchComplaintLoading = false;
          }, function (data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
            scope.searchComplaintLoading = false;
          });
        }

        /**
         * init
         */
        this.init = function (scope, planGroups) {
          // TODO  InvoiceNo
          scope.thisInvoiceNo = ''
          // loading
          scope.searchComplaintLoading = false;
          scope.searchClaimLoading = false;
          // 输入框
          scope.inputForm = {
            "compenstionID": "",
            "date": simpleDateFormat(new Date().getTime(), "yyyy-MM-dd"), //default current date
            "custimerID": "",
            "customerName": "",
            "factory": "", //(pull-down, from Factory & Site, display and retrieve English Name)
            "orderType": "", //pull-down, "Dometic" / "Export"
            "invoiceNo": "",
            "status": "", // non-editable, "Saved" / "Submitted" / "Approved" / "Completed"
            "remark": "",
            "currency": "USD" //editable, default "USD", from CPO
          }
          // Order Type 选项
          scope.orderTypeList = compensationConfigService.getOrderTypeList()
          scope.inputForm.orderType = scope.orderTypeList[0]
          // TODO Customer ID 选项
          scope.custimerIDList = []
          // scope.inputForm.custimerID = scope.custimerIDList[0]
          // Complaint table
          scope.complaintPage = {
            curPage: 1,
            pageSize: 100,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.complaintGridOptions = {
            data: 'complaintItems',
            paginationPageSizes: [10, 20, 30, 40, 50],
            paginationPageSize: 10,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableColumnMenus: true,
            showGridFooter: true,
            showColumnFooter: true,
            enableGridMenu: true,
            enableSorting: false,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            totalItems: scope.complaintPage.totalNum,
            useExternalPagination: true,
            columnDefs: [{
                "name": "NO",
                "displayName": $translate.instant('compensation.NO'),
                "field": "NO",
                "width": "80",
                "cellTemplate": compensationConfigService.getRowNoTemplate(),
                "enableCellEdit": false
              },
              {
                "name": "COMPLAINT_NO",
                "displayName": $translate.instant('compensation.COMPLAINT_NO'),
                "field": "COMPLAINT_NO",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "COMPLAINT_DATE",
                "displayName": $translate.instant('compensation.COMPLAINT_DATE'),
                "field": "COMPLAINT_DATE",
                "width": "200",
                "cellClass": "text-right",
                "enableCellEdit": false
              },
              {
                "name": "PO_NUMBER",
                "displayName": $translate.instant('compensation.PO_NUMBER'),
                "field": "PO_NUMBER",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "WORKING_NO",
                "displayName": $translate.instant('compensation.WORKING_NO'),
                "field": "WORKING_NO",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "ARTICLE",
                "displayName": $translate.instant('compensation.ARTICLE'),
                "field": "ARTICLE",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "QUANTITY",
                "displayName": $translate.instant('compensation.QUANTITY'),
                "field": "QUANTITY",
                "width": "200",
                "cellClass": "text-right",
                "enableCellEdit": false
              },
              {
                "name": "FOB",
                "displayName": $translate.instant('compensation.FOB'),
                "field": "FOB",
                "width": "200",
                "cellClass": "text-right",
                "enableCellEdit": false
              },
              {
                "name": "HANDLING_COST",
                "displayName": $translate.instant('compensation.HANDLING_COST'),
                "field": "HANDLING_COST",
                "width": "200",
                "cellClass": "text-right",
                "enableCellEdit": false,
                "aggregationType": uiGridConstants.aggregationTypes.sum
              },
              {
                "name": "TOTAL",
                "displayName": $translate.instant('compensation.TOTAL'),
                "field": "TOTAL",
                "width": "200",
                "cellClass": "text-right",
                "enableCellEdit": false,
                "aggregationType": uiGridConstants.aggregationTypes.sum
              },
              {
                "name": "TOTAL_INCLUDE_VAT",
                "displayName": $translate.instant('compensation.TOTAL_INCLUDE_VAT'),
                "field": "TOTAL_INCLUDE_VAT",
                "width": "200",
                "cellClass": "text-right",
                "enableCellEdit": false,
                "aggregationType": uiGridConstants.aggregationTypes.sum
              },
              {
                "name": "TOTAL_CNY",
                "displayName": $translate.instant('compensation.TOTAL_CNY'),
                "field": "TOTAL_CNY",
                "width": "200",
                "cellClass": "text-right",
                "enableCellEdit": false,
                "aggregationType": uiGridConstants.aggregationTypes.sum
              },
              {
                "name": "TOTAL_INCLUDE_VAT_CNY",
                "displayName": $translate.instant('compensation.TOTAL_INCLUDE_VAT_CNY'),
                "field": "TOTAL_INCLUDE_VAT_CNY",
                "width": "200",
                "enableCellEdit": false,
                "cellClass": "text-right",
                "aggregationType": uiGridConstants.aggregationTypes.sum
              }
            ],
            onRegisterApi: function (gridApi) {
              scope.complaintGridApi = gridApi;
              scope.complaintGridApi.core.on.sortChanged(scope, function (grid, sortColumns) {
                if (sortColumns.length !== 0) {
                  if (sortColumns[0].sort.direction === 'asc') {
                    scope.complaintPage.sortDirection = true;
                  }
                  if (sortColumns[0].sort.direction === 'desc') {
                    scope.complaintPage.sortDirection = false;
                  }
                  scope.complaintPage.sortColumn = sortColumns[0].displayName;
                }
              });
            }
          };
          // detail table
          scope.claimPage = {
            curPage: 1,
            pageSize: 10,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.claimGridOptions = {
            data: 'claimItems',
            paginationPageSizes: [10, 20, 30, 40, 50],
            paginationPageSize: 10,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableColumnMenus: true,

            enableGridMenu: true,
            enableSorting: false,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            totalItems: scope.claimPage.totalNum,
            useExternalPagination: true,
            columnDefs: [{
                "name": "NO",
                "displayName": $translate.instant('compensation.NO'),
                "field": "NO",
                "width": "80",
                "cellTemplate": compensationConfigService.getRowNoTemplate(),
                "enableCellEdit": false
              },
              {
                "name": "CLAIM_PO_NUMBER",
                "displayName": $translate.instant('compensation.CLAIM_PO_NUMBER'),
                "field": "CLAIM_PO_NUMBER",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "MO",
                "displayName": $translate.instant('compensation.MO'),
                "field": "MO",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "DELIVERY_DATE",
                "displayName": $translate.instant('compensation.DELIVERY_DATE'),
                "field": "DELIVERY_DATE",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "ORDER_QTY",
                "displayName": $translate.instant('compensation.ORDER_QTY'),
                "field": "ORDER_QTY",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "CUSTOMER_NO",
                "displayName": $translate.instant('compensation.CUSTOMER_NO'),
                "field": "CUSTOMER_NO",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "TOTAL_AMOUNT",
                "displayName": $translate.instant('compensation.TOTAL_AMOUNT'),
                "field": "TOTAL_AMOUNT",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "TOTAL_CNY",
                "displayName": $translate.instant('compensation.TOTAL_CNY'),
                "field": "TOTAL_CNY",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "TOTAL_INCLUDE_VAT_CNY",
                "displayName": $translate.instant('compensation.TOTAL_INCLUDE_VAT_CNY'),
                "field": "TOTAL_INCLUDE_VAT_CNY",
                "width": "200",
                "enableCellEdit": false
              }
            ],
            onRegisterApi: function (gridApi) {
              scope.claimGridApi = gridApi;
              scope.claimGridApi.core.on.sortChanged(scope, function (grid, sortColumns) {
                if (sortColumns.length !== 0) {
                  if (sortColumns[0].sort.direction === 'asc') {
                    scope.claimPage.sortDirection = true;
                  }
                  if (sortColumns[0].sort.direction === 'desc') {
                    scope.claimPage.sortDirection = false;
                  }
                  scope.claimPage.sortColumn = sortColumns[0].displayName;
                }
              });
            }
          };
          // 获取下拉选项
          this.pullSelectList(scope)
          // Complaint table data
          this.pullComplaintList(scope)
        };
      }
    ])
    .controller('compensationCreateFormController', ["$scope", "compensationCreateFormService", 
      '$uibModalInstance', 'planGroups', 'compensationConfigService',
      function ($scope, compensationCreateFormService, $uibModalInstance, planGroups, compensationConfigService) {
        compensationCreateFormService.setModalScope($scope, $uibModalInstance);
        // 表格获取行号
        $scope.getRowNo = function (grid, row) {
          return compensationConfigService.genRowNoFn(grid, row)
        }
        // 
        $scope.cancel = function () {
          compensationCreateFormService.cancel();
        }
        $scope.save = function () {
          compensationCreateFormService.save($scope);
        }
        $scope.addComplaint = function () {
          compensationCreateFormService.addComplaint($scope);
        }
       
        $scope.removeComplaint = function () {

        }
        $scope.addClaim = function () {


        }
        $scope.removeClaim = function () {

        }
        $scope.reOpenCompensation = function() {

        }
        $scope.completeCompensation = function() {
          
        }
        $scope.saveCompensation = function () {
          
        }
        $scope.submitCompensation = function () {
          
        }
        $scope.approveCompensation = function () {
          
        }
        $scope.cancelCompensation = function () {
          
        }
        $scope.deleteCompensation = function () {
          
        }
        
        compensationCreateFormService.init($scope, planGroups);
      }
    ])

})();
