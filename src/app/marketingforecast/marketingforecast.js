(function() {
  'use strict';
  angular
    .module('cpo')
    .service('marketingForecastService', ['$http', '$translate', 'CommonService', '$uibModal',
      function($http, $translate, CommonService, $uibModal) {
        /**
         * init
         */
        this.init = function(scope) {
          // 初期化
          var _this = this;
          scope.hideTopInfo = false;
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
              displayName: $translate.instant('marketingForecast.RCCP_DIVISION'),
              field: 'workingNo',
              minWidth:100,
              enableCellEdit: false
            },
              {
                name: 'productTypes',
                displayName: $translate.instant('marketingForecast.PROJECTED_REFERENCE'),
                field: 'productTypes',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'specialProcess',
                displayName: $translate.instant('marketingForecast.LO'),
                field: 'specialProcess',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'bNos',
                displayName: $translate.instant('marketingForecast.FACTORY_ID'),
                field: 'bNos',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'atricleNumbers',
                displayName: $translate.instant('marketingForecast.FACTORY_DESC'),
                field: 'articleNumbers',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'unit',
                displayName: $translate.instant('marketingForecast.DEVELOPMEN_FACTORY'),
                field: 'unit',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'lastProductionFactory',
                displayName: $translate.instant('marketingForecast.CREATION_CENTER'),
                field: 'lastProductionFactory',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'productionFactoryHistory',
                displayName: $translate.instant('marketingForecast.BUSINESS_SEGMENT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'productionFactoryHistory',
                displayName: $translate.instant('marketingForecast.CAPABILITY_CAPABILITY_NAME'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'productionFactoryHistory',
                displayName: $translate.instant('marketingForecast.OTP_REFERENCE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.RCCP_SEASON'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.DEMAND_TYPE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.MODEL_NO'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.NEW_STYLE_COUNT_SEASONAL_SS18'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.LIKELY_VOLUME_ADJUSTED_FW18'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.LIKELY_VOLUME_201803'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.LIKELY_VOLUME_201804'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.LIKELY_VOLUME_201805'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.LIKELY_VOLUME_201806'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.LIKELY_VOLUME_201807'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.LIKELY_VOLUME_201808'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.DOWNSIDE_VOLUME_TOTAL_FW18'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.DOWNSIDE_VOLUME_ADJUSTED_FW18'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.UPSIDE_VOLUME_TOTAL_FW18'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.UPSIDE_VOLUME_ADJUSTED_FW18'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.DEVELOPER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.PRODUCT_MGR'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.WORKING'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.QUARTER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.SPORTS_CATEGORY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.ALLOC_CAT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.CAT_MKT_LINE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.CORP_MKT_LINE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.SALES_LINE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.AGE_GROUP'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.GENDER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.PRODUCT_SPECIALITY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.TIMELINE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.RETAIL_INTRO'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.RETAIL_EXIT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.FIRST_XFTY_DATE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.LAST_XFTY_DATE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.PRODUCT_TYPE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.PRODUCT_GROUP'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.UNIT_OF_MEASURE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.SALES_UNIT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.CARRY_OVER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.DEV_TYPE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.CORRECTED_SOURCE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.FTY_ID'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.FTY_STATUS'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.FTY_GROUP'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.FTY_GROUP_NAME'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.SEGMENTATION'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.LO2'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.COO'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.COO_REGION'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.TARG_TECH'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.TARGET_MAT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.FLEX_SOURCE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.PRIORITY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.ADJ_P_GRP'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.ADJ_TECH'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.ADJ_MAT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.TOTAL_PT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.ADJ_BU'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.STATUS_MILESTONES'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.OFFERED_CAPACITY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.DEVELOPMENT_CAPACITY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('marketingForecast.FLEX_CHECK'),
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
    .controller('marketingForecastCtrl', ['$scope', 'marketingForecastService',
      function($scope, marketingForecastService) {
        marketingForecastService.init($scope);
      }
    ])
})();
