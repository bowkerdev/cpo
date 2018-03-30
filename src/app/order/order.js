(function() {
  'use strict';
  angular
    .module('cpo')
    .service('orderService', ['$http', '$translate', 'CommonService', '$uibModal',
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
              displayName: $translate.instant('order.FOR_ACCOUNT_OF'),
              field: 'workingNo',
              minWidth:100,
              enableCellEdit: false
            },
              {
                name: 'productTypes',
                displayName: $translate.instant('order.SELLER'),
                field: 'productTypes',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'specialProcess',
                displayName: $translate.instant('order.ASSIGNED_FACTORY'),
                field: 'specialProcess',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'bNos',
                displayName: $translate.instant('order.GPS_FACTORY'),
                field: 'bNos',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'atricleNumbers',
                displayName: $translate.instant('order.PO_NUMBER'),
                field: 'articleNumbers',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'unit',
                displayName: $translate.instant('order.MTFC_PPC_NUMBER'),
                field: 'unit',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'lastProductionFactory',
                displayName: $translate.instant('order.SHIPPEDSTATUS'),
                field: 'lastProductionFactory',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'productionFactoryHistory',
                displayName: $translate.instant('order.CLIENT_NUMBER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'productionFactoryHistory',
                displayName: $translate.instant('order.PURCHASING_GROUP_CODE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'productionFactoryHistory',
                displayName: $translate.instant('order.CONTRACT_NUMBER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.CONTRACT_NUMBER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.CUSTOMER_NUMBER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.SHIP_MODE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.CUSTOMER_ORDER_NUMBER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.CLASS_CODE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.ORDER_TYPE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.RELEASE_STATUS'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.CLASSIFICATION'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.TYPES'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.LAST_UPDATE_DATE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.CUSTOMER_REQUEST_DATE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.PLAN_DATE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.PO_BATCH_DATE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.WORKING_NUMBER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.MODEL_NUMBER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.MODEL_NAME'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.GENDER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.ARTICLE_NUMBER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.ARTICLE_DESCRIPTION'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.BUSINESS_MODEL_ATTRIBUTE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.PSDD'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.PODD'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.FIRST_PRODUCTION_DATE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.LAST_PRODUCTION_DATE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.CONFIRMATION_DELAY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.DELIVERY_DELAY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.MARK_FOR_ADDRESS'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.Total_QTY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.PRICE_PER_UNIT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.TOTAL_MERCHANDISE_AMOUNT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.TOTAL_TAX_AMOUNT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.TOTAL_ADJUSTMENTS'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.TOTAL_DOCUMENT_AMOUNT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.CUSTOMER_SIZE_RUN'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.TECHNICAL_NOTATION'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.CUSTOMER_SIZE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.TECHNICAL_SIZE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.ORDERED_QTY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.SHIPPED_QTY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.DIVSION'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.ORDER_GROUP'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.BRAND'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.WAREHOUSE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.PRIORITY_INDICATOR'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.SUBSIDIARY_SHIP_TO_NUMBER'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.VAS_SHAS_CODE_NON_US'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.SHIPPING_INSTRUCTION'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.REMARK'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.TECHNOLOGY_CONCEPT'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('order.TECHNOLOGY_CONCEPT_DESCRIPTION'),
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
    .controller('orderCtrl', ['$scope', 'orderService',
      function($scope, orderService) {
        orderService.init($scope);
      }
    ])
})();
