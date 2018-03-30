(function() {
  'use strict';
  angular
    .module('cpo')
    .service('customerforecastService', ['$http', '$translate', 'CommonService', '$uibModal',
      function($http, $translate, CommonService, $uibModal) {
        /**
         * init
         */
        this.init = function(scope) {
          // 初期化
          var _this = this;
          scope.gridOptions = {
            data: 'items',
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
            totalItems: scope.page.totalNum,
            useExternalPagination: true,
            columnDefs: [{
              name: 'workingNo',
              displayName: $translate.instant('customerforecast.Brand'),
              field: 'workingNo',
              minWidth:100,
              enableCellEdit: false
            },{
                name: 'productTypes',
                displayName: $translate.instant('customerforecast.FACTORY_ID'),
                field: 'productTypes',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'specialProcess',
                displayName: $translate.instant('customerforecast.FACTORY_FACTORY_NAME'),
                field: 'specialProcess',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'bNos',
                displayName: $translate.instant('customerforecast.COO'),
                field: 'bNos',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'atricleNumbers',
                displayName: $translate.instant('customerforecast.WORKING_NO'),
                field: 'articleNumbers',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'unit',
                displayName: $translate.instant('customerforecast.MODEL_ID'),
                field: 'unit',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'lastProductionFactory',
                displayName: $translate.instant('customerforecast.MODEL_DESC'),
                field: 'lastProductionFactory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'productionFactoryHistory',
                displayName: $translate.instant('customerforecast.ARTICLE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'productionFactoryHistory',
                displayName: $translate.instant('customerforecast.BUSINESS_SEGMENT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'productionFactoryHistory',
                displayName: $translate.instant('customerforecast.SPORTS_CODE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.PRODUCT_TYPE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.SALES_LINE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.CATEGORY_MARKETING_LINE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.CORPORATE_MARKETING_LINE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.GPS_CUSTOMER_CUSTOMER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.GPS_CUSTOMER_DESC'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.ARTICLE_LEAD_TIME'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.SUPPLY_CHAIN_TRACK'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.PERIOD'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.PLANNING_VOLUME_QUANTITY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.FORECAST_QUANTITY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.OPEN_FC_ALL_SCT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.ORDER_QUANTITY_BY_CRD'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('customerforecast.ORDER_QUANTITY_BY_PLAN_DATE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              }
            ],
            onRegisterApi: function(gridApi) {
              scope.gridApi = gridApi;
              scope.gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
                if(sortColumns.length !== 0) {
                  if(sortColumns[0].sort.direction === 'asc') {
                    scope.page.sortDirection = true;
                  }
                  if(sortColumns[0].sort.direction === 'desc') {
                    scope.page.sortDirection = false;
                  }
                  scope.page.sortColumn = sortColumns[0].displayName;
                }
              });
              scope.gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;
                _this.getWorkingNoList(scope);
              });
            }
          };
        };
      }
    ])
    .controller('customerforecastCtrl', ['$scope', 'customerforecastService',
      function($scope, customerforecastService) {
        customerforecastService.init($scope);
      }
    ])
})();
