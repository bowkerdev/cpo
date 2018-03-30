(function() {
  'use strict';
  angular
    .module('cpo')
    .service('StyleTransferService', ['$http', '$translate', 'CommonService', '$uibModal',
      function($http, $translate, CommonService, $uibModal) {
        /**
         * init
         */
       this.init = function(scope) {
          // 初期化
          var _this = this;
          scope.items=[];
          scope.gridOptions = {
            data: 'items',
            paginationPageSizes: [10, 20, 30, 40, 50],
            paginationPageSize: 10,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableColumnMenus: true,
			enableGridMenu: true,
            enableSorting: true,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 1,
            totalItems: scope.page.totalNum,
            useExternalPagination: true,
            columnDefs: [{
              name: 'FIELD_NAME',
              displayName: $translate.instant('styletransfer.FIELD_NAME'),
              field: 'workingNo',
              minWidth:100,
              enableCellEdit: false
            },
              {
                name: 'DIVISION',
                displayName: $translate.instant('styletransfer.DIVISION'),
                field: 'productTypes',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'ALLOCATION_TYPE',
                displayName: $translate.instant('styletransfer.ALLOCATION_TYPE'),
                field: 'specialProcess',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'SOURCING_TYPE',
                displayName: $translate.instant('styletransfer.SOURCING_TYPE'),
                field: 'bNos',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'TRANSFER_REASON',
                displayName: $translate.instant('styletransfer.TRANSFER_REASON'),
                field: 'articleNumbers',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'SEASON',
                displayName: $translate.instant('styletransfer.SEASON'),
                field: 'unit',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'WORKING_NUMBER',
                displayName: $translate.instant('styletransfer.WORKING_NUMBER'),
                field: 'lastProductionFactory',
                minWidth:100,
                enableCellEdit: false
              },
              {
                name: 'GIVING_FACTORY',
                displayName: $translate.instant('styletransfer.GIVING_FACTORY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'RECEIVING_FACTORY',
                displayName: $translate.instant('styletransfer.RECEIVING_FACTORY'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'RECEIVING_FACTORY_LEADTIME',
                displayName: $translate.instant('styletransfer.RECEIVING_FACTORY_LEADTIME'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'TRANSFER_VOLUME',
                displayName: $translate.instant('styletransfer.TRANSFER_VOLUME'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'REQUEST_TRANSFER_MONTH_FROM',
                displayName: $translate.instant('styletransfer.REQUEST_TRANSFER_MONTH_FROM'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'REQUEST_TRANSFER_MONTH_TO',
                displayName: $translate.instant('styletransfer.REQUEST_TRANSFER_MONTH_TO'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CHANGE_A_SOURCE',
                displayName: $translate.instant('styletransfer.CHANGE_A_SOURCE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'GIVING_FACTORY_FOB',
                displayName: $translate.instant('styletransfer.GIVING_FACTORY_FOB'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'GIVING_FACTORY_PRICE_LANDED',
                displayName: $translate.instant('styletransfer.GIVING_FACTORY_PRICE_LANDED'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'RECEIVING_FACTORY_FOB',
                displayName: $translate.instant('styletransfer.RECEIVING_FACTORY_FOB'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'RECEIVING_FACTORY_LANDED',
                displayName: $translate.instant('styletransfer.RECEIVING_FACTORY_LANDED'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'REASON_FOR_PRICE_VARIANCE',
                displayName: $translate.instant('styletransfer.REASON_FOR_PRICE_VARIANCE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('styletransfer.GIVING_FACTORY_PRICE_LANDED'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'CUSTOMER_NUMBER',
                displayName: $translate.instant('styletransfer.REASON_FOR_PRICE_VARIANCE'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'EI_SET_UP_NEEDED',
                displayName: $translate.instant('styletransfer.EI_SET_UP_NEEDED'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'SELLING_REGION_PERCENTAGE_EU',
                displayName: $translate.instant('styletransfer.SELLING_REGION_PERCENTAGE_EU'),
                field: 'productionFactoryHistory',
                minWidth:230,
                enableCellEdit: false
              },{
                name: 'SELLING_REGION_PERCENTAGE_ASIA',
                displayName: $translate.instant('styletransfer.SELLING_REGION_PERCENTAGE_ASIA'),
                field: 'productionFactoryHistory',
                minWidth:230,
                enableCellEdit: false
              },{
                name: 'SELLING_REGION_PERCENTAGE_NAM',
                displayName: $translate.instant('styletransfer.SELLING_REGION_PERCENTAGE_NAM'),
                field: 'productionFactoryHistory',
                minWidth:230,
                enableCellEdit: false
              },{
                name: 'SELLING_REGION_PERCENTAGE_LAM',
                displayName: $translate.instant('styletransfer.SELLING_REGION_PERCENTAGE_LAM'),
                field: 'productionFactoryHistory',
                minWidth:230,
                enableCellEdit: false
              },{
                name: 'SELLING_REGION_PERCENTAGE_CIS',
                displayName: $translate.instant('styletransfer.SELLING_REGION_PERCENTAGE_CIS'),
                field: 'productionFactoryHistory',
                minWidth:230,
                enableCellEdit: false
              },{
                name: 'SELLING_REGION_PERCENTAGE_CHINA',
                displayName: $translate.instant('styletransfer.SELLING_REGION_PERCENTAGE_CHINA'),
                field: 'productionFactoryHistory',
                minWidth:230,
                enableCellEdit: false
              },{
                name: 'LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_EU',
                displayName: $translate.instant('styletransfer.LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_EU'),
                field: 'productionFactoryHistory',
                minWidth:400,
                enableCellEdit: false
              },{
                name: 'LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_ASIA',
                displayName: $translate.instant('styletransfer.LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_ASIA'),
                field: 'productionFactoryHistory',
                minWidth:400,
                enableCellEdit: false
              },{
                name: 'LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_NAM',
                displayName: $translate.instant('styletransfer.LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_NAM'),
                field: 'productionFactoryHistory',
                minWidth:400,
                enableCellEdit: false
              },{
                name: 'LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_LAM',
                displayName: $translate.instant('styletransfer.LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_LAM'),
                field: 'productionFactoryHistory',
                minWidth:400,
                enableCellEdit: false
              },{
                name: 'LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_CIS',
                displayName: $translate.instant('styletransfer.LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_CIS'),
                field: 'productionFactoryHistory',
                minWidth:400,
                enableCellEdit: false
              },{
                name: 'LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_CHINA',
                displayName: $translate.instant('styletransfer.LANDED_PRICE_PER_SELLING_REGION_GIVING_FACTORY_CHINA'),
                field: 'productionFactoryHistory',
                minWidth:400,
                enableCellEdit: false
              },{
                name: 'SKIP_TECHPACK',
                displayName: $translate.instant('styletransfer.SKIP_TECHPACK'),
                field: 'productionFactoryHistory',
                minWidth:100,
                enableCellEdit: false
              },{
                name: 'REMARK',
                displayName: $translate.instant('styletransfer.REMARK'),
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
    .controller('StyleTransferCtrl', ['$scope', 'StyleTransferService',
      function($scope, StyleTransferService) {
        StyleTransferService.init($scope);
      }
    ])
})();
