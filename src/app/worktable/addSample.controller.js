/**
 * Created by Aozaki on 2022/10/18.
 */
(function() {
  'use strict';
  angular.module('cpo')
    .service('addSampleService', ['$http', '$translate', 'CommonService', '$location',
      function($http, $translate, CommonService, $location) {

        this.submit = function(scope,finishBlock) {
          if (scope.items && scope.items.length) {
            for (var i = 0; i < scope.items.length; i++) {
              var po = scope.items[i].po;
              if (po.length==10) {
                scope.items[i].originalPo = po.substring(1,10);
              }else{
                modalAlert(CommonService, 3, 'PO must be a string in length of 10', null)
                return;
              }
            }
            scope.submiting = true;
            GLOBAL_Http($http, "cpo/api/worktable/saveBulkSample", 'POST', scope.items, function(data) {
              scope.submiting = false;
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
              if(finishBlock){
                finishBlock();
              }
            }, function(data) {
              scope.submiting = false;
              modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
            });
          }
        }

        this.init = function(scope, parameter) {
          scope.items = [];
          if(parameter.rows && parameter.rows.length){
            scope.items = translateData(parameter.rows)
          }
          scope.submiting = false;
          var addSamplePOTemplate = document.getElementById('addSamplePOTemplate').innerText;
          scope.gridOptions = {
            data: 'items',
            paginationPageSizes: [10000],
            paginationPageSize: 10000,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableColumnMenus: true,
            enableGridMenu: true,
            enableSorting: false,
            enableHorizontalScrollbar: 1,
            enableVerticalScrollbar: 0,
            useExternalPagination: false,
            columnDefs: [
              {
              	name: 'workingNo',
              	displayName: 'Working No',
              	field: 'workingNo',
              	minWidth: '120'
              },
              {
              	name: 'bno',
              	displayName: 'B No',
              	field: 'bno',
              	minWidth: '100'
              },
              {
              	name: 'season',
              	displayName: 'Season',
              	field: 'season',
              	minWidth: '100'
              },
              {
              	name: 'baseSize',
              	displayName: 'Base Size',
              	field: 'baseSize',
              	minWidth: '100'
              },
              {
              	name: 'productName',
              	displayName: 'Product Name',
              	field: 'productName',
              	minWidth: '120'
              },
              {
              	name: 'fabricType',
              	displayName: 'Fabric Type',
              	field: 'fabricType',
              	minWidth: '100'
              },
              {
              	name: 'productType',
              	displayName: 'Product Type',
              	field: 'productType',
              	minWidth: '120'
              },
              {
              	name: 'articleNo',
              	displayName: 'Article',
              	field: 'articleNo',
              	minWidth: '100'
              },
              {
              	name: 'factory',
              	displayName: 'Factory',
              	field: 'factory',
              	minWidth: '100'
              },
              {
              	name: 'colorwayName',
              	displayName: 'Colorway Name',
              	field: 'colorwayName',
              	minWidth: '140'
              },
              {
              	name: 'addSampleQty',
              	displayName: 'Add Sample Qty',
              	field: 'addSampleQty',
              	minWidth: '160'
              },
              {
              	name: 'sampleType',
              	displayName: 'Sample Type',
              	field: 'sampleType',
              	minWidth: '120'
              },
              {
              	name: 'po',
              	displayName: 'PO',
              	field: 'po',
                cellTemplate: addSamplePOTemplate,
              	minWidth: '100'
              },
              {
              	name: 'originalPo',
              	displayName: 'Original PO',
              	field: 'originalPo',
              	minWidth: '100'
              },
              {
              	name: 'utcCreate',
              	displayName: 'Created Date',
              	field: 'utcCreate',
              	minWidth: '120'
              },
              {
              	name: 'createBy',
              	displayName: 'Created By',
              	field: 'createBy',
              	minWidth: '100'
              },
              {
              	name: 'utcUpdate',
              	displayName: 'Updated Date',
              	field: 'utcUpdate',
              	minWidth: '120'
              },
              {
              	name: 'updateBy',
              	displayName: 'Updated By',
              	field: 'updateBy',
              	minWidth: '100'
              },
              {
              	name: 'remark',
              	displayName: 'Remark',
              	field: 'remark',
              	minWidth: '100'
              },
              {
              	name: 'addSampleTime',
              	displayName: 'Add Sample Time',
              	field: 'addSampleTime',
              	minWidth: '180'
              }
            ],
            onRegisterApi: function(gridApi) {
              scope.gridApi = gridApi;

              scope.gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;
              });
            }
          };
        }
      }
    ])
    .controller('addSampleCtrl', ['$uibModalInstance', '$scope', 'addSampleService', 'parameter', function(
      $uibModalInstance, $scope, addSampleService, parameter) {
      $scope.dismiss = function() {
        $uibModalInstance.dismiss();
      }
      $scope.submit = function() {
        addSampleService.submit($scope,function(){
          $uibModalInstance.resolve({});
          $uibModalInstance.dismiss();
        });
      }
      addSampleService.init($scope, parameter);

    }]);
})();
