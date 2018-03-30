/**
 * Created by mac on 2018/1/15.
 */
(function() {
  'use strict';
  angular
    .module('cpo')
    .service('PoMasterService', ['$http','$timeout', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants',
      function($http, $timeout,$translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants) {
        var searchKey = {};
        var shouldAddFilterChangeEvent = true;
        var _this = this;
        this.exportFile = function(scope) {
          var params = {
            documentType: 100
          }
          CommonService.showLoadingView("Exporting...");
          GLOBAL_Http($http, "cpo/portal/document/check_record_count?", 'GET', params, function(data) {
            CommonService.hideLoadingView();
            if(data.status == 0) {
              if(parseInt(data.message) > 0) {
                exportExcel(params, "cpo/portal/document/export_file?", "_blank");
              } else {
                modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
              }
            }
          }, function(data) {
            CommonService.hideLoadingView();
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

        }
        this.search = function (scope) {
          this.getList(scope);
        }
        this.getList = function(scope) {
          scope.gridOptions.showLoading = true;
          var _this = this;
          var param = {
            pageNo: scope.page.curPage,
            pageSize: scope.page.pageSize
          }


          //具体传参自己调整格式，格式在function searchFilter

          GLOBAL_Http($http, "cpo/api/worktable/get_change_order?", 'GET', param, function(data) {
            scope.gridOptions.showLoading = false;

            if(data.rows) {
              scope.items = translateData(data.rows);
            } else {
              scope.items=[];
            }
            scope.page.totalNum = data.total;
            scope.gridOptions.totalItems = scope.page.totalNum;

          }, function(data) {
            scope.gridOptions.showLoading = false;
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

        }
        this.toggleFilterRow = function(scope, tab) {
          scope.gridOptions.enableFiltering = !scope.gridOptions.enableFiltering;
          scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        }

        this.importFile = function(scope) {
          var _this = this;
          var modalInstance = $uibModal.open({
            templateUrl: 'FileModal',
            controller: 'FileController',
            backdrop: 'static',
            size: 'md',
            resolve: {
              planGroups: function() {
                return {
                  fileType: "100"
                };
              }
            }
          });
          modalInstance.result.then(function(returnData) {
            if(returnData) {
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
              _this.getList(scope);
            }
          }, function() {});
        }

        /**
         * init
         */
        this.init = function(scope) {

          // 初期化
          var _this = this;
          searchKey = {};

          scope.page = {
            curPage: 1,
            pageSize: 10,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          var staticColumns =  CommonService.constructeStaticColumnsFromJSON(scope,"PoMaster",false,null,180);

          scope.gridOptions = {
            data: 'items',
            paginationPageSizes: [10, 20, 30, 40, 50],
            paginationPageSize: 10,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            showLoading:true,
            enableColumnMenus: true,
            enableGridMenu: true,
            enableSorting: false,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            totalItems: scope.page.totalNum,
            useExternalPagination: true,
            enablePaginationControls: true,

            columnDefs:staticColumns,
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
                _this.getList(scope);
              });
              scope.gridApi.core.on.filterChanged(scope, function (col) {

                //https://stackoverflow.com/questions/27301690/angular-ui-grid-ng-grid-filterchanged-firing-too-frequently

                if (angular.isDefined(scope.filterTimeout)) {
                  $timeout.cancel(scope.filterTimeout);
                }
                var __this =this;
                scope.filterTimeout = $timeout(function () {
                  var grid = __this.grid;


                  var newsearchKey  ={};
                  angular.forEach(grid.columns,function(column,index){

                    if(column.filters&&column.filters[0].term&&column.filters[0].term.length>0){
                      newsearchKey[column.field]=column.filters[0].term;
                    }
                  });

                  if(!angular.equals(searchKey,newsearchKey)) {
                    searchKey = newsearchKey;
                    _this.getList(scope);
                  }

                }, 200);
              });


            }
          };
          _this.getList(scope);

          function searchFilter(searchText, cellValue, row, col) {
            return true;

            var field = col.field;

            if(searchText != searchKey[field]) {
              searchKey[field] = searchText;
              scope.page.curPage=1;
              _this.getList(scope);
            }
            return true;
          }
        };
      }
    ])
    .controller('PoMasterCtrl', ['$scope', 'PoMasterService',
      function($scope, PoMasterService) {

        $scope.getList = function() {
          PoMasterService.getList($scope);
        }

        $scope.importFile = function() {
          PoMasterService.importFile($scope);
        }
        $scope.toggleFilterRow = function() {
          PoMasterService.toggleFilterRow($scope);
        };
        $scope.exportFile = function () {
          PoMasterService.exportFile($scope);
        }
        $scope.search = function () {

          PoMasterService.search($scope);
        }

        PoMasterService.init($scope);
      }
    ])
})();
