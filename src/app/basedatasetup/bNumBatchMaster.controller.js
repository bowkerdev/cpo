(function () {
  'use strict';
  angular
    .module('cpo')
    .controller('bNumBatchMasterCtrl', ['$scope', '$uibModal', 'CommonService', '$http', '$translate', '$timeout',
      function (scope, $uibModal, CommonService, $http, $translate, $timeout) {
        scope.bNumBatchMasterItems = [];

        scope.formatPaste = function (e, field) {
          var arr = e.originalEvent.clipboardData.getData('text/plain').split(/[,\s]+/g)
          var clipboardData = []
          arr.forEach(function (item) {
            if (!item) { return }
            if (clipboardData.indexOf(item) == -1) {
              clipboardData.push(item)
            }
          })
          $timeout(function () {
            scope[field] = clipboardData.join(',')
          }, 200)
        }

        scope.exportFile = function () {
          var param = {
            'documentType': '995'
          }
          CommonService.showLoadingView("Exporting...");
          GLOBAL_Http($http, "cpo/portal/document/export_file_post?documentType=" + param['documentType'], 'POST', param, function (data) {
            CommonService.hideLoadingView()
            window.open(data.output, '_blank')
          }, function (data) {
            CommonService.hideLoadingView()
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null)
          })
        }

        scope.fetchInfo = function (page, shouldPageNumberReset) {
          scope.bNumList = [];
          var param = {
            pageSize: page.pageSize + '',
            pageNo: page.curPage + ''
          };

          if (shouldPageNumberReset) {
            page.curPage = '1'
            param.pageNo = page.curPage + ''
          }

          if (scope['bNo']) {
            param['in_b_no'] = scope['bNo'].split(',')
          }
          scope.gridOptions.showLoading = true
          GLOBAL_Http($http, "cpo/api/worktable/bnobatch/queryBNoBatch?", 'POST', param, function (data) {
            scope.gridOptions.showLoading = false
            if (data.status == 0) {
              scope.bNumBatchMasterItems = data.output;
              scope.page.totalNum = data.totalPages;
              scope.gridOptions.totalItems = data.total;
            } else {
              modalAlert(CommonService, 3, data.message || 'Exception!', null);
            }
          }, function (data) {
            scope.gridOptions.showLoading = false
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
          data: 'bNumBatchMasterItems',
          paginationPageSizes: [100, 200, 500],
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
          columnDefs: CommonService.constructeStaticColumnsFromJSON(scope, "bNumBatchMaster", false, null, 100, true),
          onRegisterApi: function (gridApi) {
            scope.gridApi1 = gridApi;
            gridApi.selection.setMultiSelect(false);
            gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
              scope.page.curPage = newPage;
              scope.page.pageSize = pageSize;
              scope.fetchInfo(scope.page);
            });
          }
        };
        scope.fetchInfo(scope.page, true);
      }
    ])
})();
