(function () {
  'use strict';

  angular
    .module('cpo')
    .service('selectComplaintService', ['$http', 'CommonService', '$translate', 
      'uiGridConstants', 'compensationConfigService',
      function ($http, CommonService, $translate, uiGridConstants, compensationConfigService) {
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
          var selections = scope.gridApi.selection.getSelectedRows()
					if (!selections.length) {
						modalAlert(CommonService, 1, $translate.instant('compensation.ALERT_SELECT_DATAS'), null);
						return 
					}
          gModalInstance.close({
            selected: selections
          })
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
          }, function (data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        // TODO
        this.pullComplaintList = function (scope) {
          var param = {}
          param['pageNo'] = scope.complaintPage.curPage
          param['pageSize'] = scope.complaintPage.pageSize
          // TODO
          if(scope['searchCustomerID']) {
            param['searchCustomerID'] = ''
          }
          var multiSelect = {
            'searchFactory': 'searchFactory',
            'searchOrderType': 'searchOrderType'
          }
          for (var key in multiSelect) {
						if (!scope[key].length) { continue }
						var resArr = scope[key].map(function(el) {
							return el.id
						})
            param[multiSelect[key]] = resArr.join(',')
					}
          scope.searchLoading = true;
          GLOBAL_Http($http, "cpo/api/process/query_process?", 'GET', param, function (data) {

            if (data.status == 0) {
              scope.complaintItems = translateData(data.output.processExts);
              scope.complaintPage.totalNum = data.output.total;
              scope.complaintGridOptions.totalItems = scope.complaintPage.totalNum;
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
            scope.searchLoading = false;
          }, function (data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
            scope.searchLoading = false;
          });
        }

        /**
         * init
         */
        this.init = function (scope, planGroups) {
          // loading
          scope.searchLoading = false;
          // 输入框
          scope.searchOrderTypeList = compensationConfigService.getOrderTypeList()
          scope.searchOrderType = []
          scope.searchFactory = []
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
                "enableCellEdit": false
              },
              {
                "name": "FOB",
                "displayName": $translate.instant('compensation.FOB'),
                "field": "FOB",
                "width": "200",
                "enableCellEdit": false
              },
              {
                "name": "HANDLING_COST",
                "displayName": $translate.instant('compensation.HANDLING_COST'),
                "field": "HANDLING_COST",
                "width": "200",
                "enableCellEdit": false,
                "aggregationType": uiGridConstants.aggregationTypes.sum
              },
              {
                "name": "TOTAL",
                "displayName": $translate.instant('compensation.TOTAL'),
                "field": "TOTAL",
                "width": "200",
                "enableCellEdit": false,
                "aggregationType": uiGridConstants.aggregationTypes.sum
              },
              {
                "name": "TOTAL_INCLUDE_VAT",
                "displayName": $translate.instant('compensation.TOTAL_INCLUDE_VAT'),
                "field": "TOTAL_INCLUDE_VAT",
                "width": "200",
                "enableCellEdit": false,
                "aggregationType": uiGridConstants.aggregationTypes.sum
              },
              {
                "name": "TOTAL_CNY",
                "displayName": $translate.instant('compensation.TOTAL_CNY'),
                "field": "TOTAL_CNY",
                "width": "200",
                "enableCellEdit": false,
                "aggregationType": uiGridConstants.aggregationTypes.sum
              },
              {
                "name": "TOTAL_INCLUDE_VAT_CNY",
                "displayName": $translate.instant('compensation.TOTAL_INCLUDE_VAT_CNY'),
                "field": "TOTAL_INCLUDE_VAT_CNY",
                "width": "200",
                "enableCellEdit": false,
                "aggregationType": uiGridConstants.aggregationTypes.sum
              }
            ],
            onRegisterApi: function (gridApi) {
              scope.gridApi = gridApi;
              scope.gridApi.core.on.sortChanged(scope, function (grid, sortColumns) {
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
          // 获取下拉选项
          this.pullSelectList(scope)
          // Complaint table data
          this.pullComplaintList(scope)
        };
      }
    ])
    .controller('selectComplaintController', ["$scope", "selectComplaintService", '$uibModalInstance', 
      'planGroups', '$translate', 'compensationConfigService',
      function ($scope, selectComplaintService, $uibModalInstance, planGroups, $translate,compensationConfigService ) {
        selectComplaintService.setModalScope($scope, $uibModalInstance);
        $scope.cancel = function () {
          selectComplaintService.cancel();
        }
        $scope.save = function () {
          selectComplaintService.save($scope);
        }
        $scope.searchList = function () {
          selectComplaintService.pullComplaintList($scope);
        }
        // 表格获取行号
        $scope.getRowNo = function (grid, row) {
          return compensationConfigService.genRowNoFn(grid, row)
        }
        // 筛选配置
				$scope.translationTexts = {
					checkAll: $translate.instant('index.SELECT_ALL'),
					uncheckAll: $translate.instant('index.NOT_SELECT_ALL'),
					buttonDefaultText: $translate.instant('index.SELECT')
				}
				$scope.extraSettings = {
					checkBoxes: true,
					smartButtonMaxItems: 100,
					smartButtonTextConverter: function(itemText, originalItem) {
						return itemText;
					},
					scrollableHeight: '200px',
					scrollable: true
				};
        selectComplaintService.init($scope, planGroups);
      }
    ])

})();
