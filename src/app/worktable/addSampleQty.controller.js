/**
 * Created by mac on 2017/11/10.
 */
(function() {
  'use strict';
  angular.module('cpo')
    .service('addSampleQtyService', ['$http', '$translate', 'CommonService', '$location',
      function($http, $translate, CommonService, $location) {

        this.getOptionList = function(scope, param) {
          var _this = this;
          scope.sizeList = [];
          scope.sampleTypeList = [];
          var request = {
            ids:param.orderMasterId
          }
          GLOBAL_Http($http, "cpo/api/worktable/query_order_size_list", 'POST', request, function(data) {
            scope.sizeList = data && data.output && data.output.length && data.output[0] && data.output[0].ediOrderSizes && data.output[0].ediOrderSizes.length?data.output[0].ediOrderSizes:[];
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

          var request = {
          	in_code: 'SampleTypeList'
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', request, function(data) {
            scope.sampleTypeList = data && data.SampleTypeList && data.SampleTypeList.length?data.SampleTypeList:[];
          }, function(data) {

          });
        }

        this.edit = function(scope, row) {
          row.entity.Edit = true;
          row.entity.dataTemp = angular.copy(row.entity);
        }
        this.cancel = function(scope, row) {
          if (row.entity && row.entity.dataTemp) {
            for (var key in row.entity.dataTemp) {
              if (key == 'Edit') {
                row.entity[key] = false;
                continue;
              }
              row.entity[key] = row.entity.dataTemp[key];
            }
          }
        }
        this.delete = function(scope, row) {
          for (var i = 0; i < scope.items.length; i++) {
            if (scope.items[i].$$hashKey == row.entity.$$hashKey) {
              scope.items.splice(i, 1);
            }
          }
        }
        this.add = function(scope) {
          var obj = new Object();
          obj.size = "";
          obj.sampleType = "";
          obj.sampleQty = "";
          obj.Edit = true;
          obj.isNew = true;
          scope.items.unshift(obj);
        }
        this.submit = function(scope,finishBlock) {
          if (scope.items && scope.items.length) {
            var param = {
              'order_master_id':scope.orderMasterId,
              'sample_info':scope.items.map(function(rowEntity){
                return (typeof(rowEntity.size) == 'object'?rowEntity.size.manufacturingSize:rowEntity.size) + '::' + (typeof(rowEntity.sampleType) == 'object'?rowEntity.sampleType.label:rowEntity.sampleType) + '::' + rowEntity.sampleQty
              }).join(',')
            }
            scope.submiting = true;
            GLOBAL_Http($http, "cpo/api/worktable/update_add_sample_info", 'POST', param, function(data) {
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
          if(parameter.sampleInfo){
            scope.items = parameter.sampleInfo.split(',').map(function(arrayElement){
              var temp = arrayElement.split('::');
              return {
                size: temp&&temp.length>0?temp[0]:'',
                sampleType:temp&&temp.length>1?temp[1]:'',
                sampleQty:temp&&temp.length>2?temp[2]:''
              }
            })
          }
          scope.po = parameter.po;
          scope.workingNo = parameter.workingNo;
          scope.articleNo = parameter.articleNo;
          scope.orderMasterId = parameter.orderMasterId;

          scope.submiting = false;

          var addSampleQtySizeTemplate = document.getElementById('addSampleQtySizeTemplate').innerText;
          var addSampleQtyTypeTemplate = document.getElementById('addSampleQtyTypeTemplate').innerText;
          var addSampleQtyInputTemplate = document.getElementById('addSampleQtyInputTemplate').innerText;
          var addSampleQtyOperationTemplate = document.getElementById('addSampleQtyOperationTemplate').innerText;
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
            columnDefs: [{
                name: 'size',
                displayName: 'Size',
                field: 'size',
                cellTemplate:addSampleQtySizeTemplate,
                minWidth: 150
              },{
                name: 'sampleType',
                displayName: 'Sample Type',
                field: 'sampleType',
                cellTemplate:addSampleQtyTypeTemplate,
                minWidth: 150
              },{
                name: 'sampleQty',
                displayName: 'Sample Qty',
                field: 'sampleQty',
                cellTemplate:addSampleQtyInputTemplate,
                minWidth: 150
              },
              {
                name: 'operation',
                displayName: "operation",
                field: 'operation',
                headerCellTemplate: '<div class="templatestyle">' +
                  '<i class="fa fa-plus fa-lg" ng-click="grid.appScope.add()">' + '</i>' + '</div>',
                cellTemplate: addSampleQtyOperationTemplate,
                minWidth: 150
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
          this.getOptionList(scope, parameter);
        }
      }
    ])
    .controller('addSampleQtyCtrl', ['$uibModalInstance', '$scope', 'addSampleQtyService', 'parameter', function(
      $uibModalInstance, $scope, addSampleQtyService, parameter) {
      $scope.dismiss = function() {
        $uibModalInstance.dismiss();
      }
      $scope.edit = function(row) {
        addSampleQtyService.edit($scope,row);
      }
      $scope.cancel = function(row) {
        addSampleQtyService.cancel($scope,row);
      }
      $scope.add = function() {
        addSampleQtyService.add($scope);
      }
      $scope.delete = function(row) {
        addSampleQtyService.delete($scope,row);
      }
      $scope.submit = function() {
        addSampleQtyService.submit($scope,function(){
          $uibModalInstance.resolve({});
          $uibModalInstance.dismiss();
        });
      }
      addSampleQtyService.init($scope, parameter);

    }]);
})();
