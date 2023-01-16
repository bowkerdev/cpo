(function () {
  'use strict';
  angular
    .module('cpo')
    .controller('ilaMasterCtrl', ['$scope', '$uibModal', 'CommonService', '$http', '$translate', '$timeout',
      function (scope, $uibModal, CommonService, $http, $translate, $timeout) {
        scope.ilaMasterItems = [];
        if(scope.tabIndex == '7'){
          scope.documentType = '1011';
          scope.ilaType = 'Adidas';
          scope.tableType = 'ilaMasterByAdidas';
          scope.documentTypeExport = '11000';
          scope.exportType = 'ILA_MASTER_BY_ADIDAS';
        }else{
          scope.documentType = '1012';
          scope.ilaType = 'Reebok';
          scope.tableType = 'ilaMasterByReebok';
          scope.documentTypeExport = '11001';
          scope.exportType = 'ILA_MASTER_BY_REEBOK';
        }
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

        scope.importFile = function() {
					var modalInstance = $uibModal.open({
            templateUrl : 'FileModal' ,
            controller : 'FileController' ,
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: scope.documentType
								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {
            if ( returnData ) {
              modalAlert(CommonService , 2 , $translate.instant('notifyMsg.UPLOAD_SUCCESS') , null);
              _this.refresh(scope);
            }
					}, function() {});
				}

        scope.exportFile = function () {
          var param = {
            'documentType': scope.documentTypeExport,
            'exportType': scope.exportType
          }
          param.queryParam = {
            'ilaType': scope.ilaType
          };
          if (scope['customerNoAndServiceIdentify']) {
            param.queryParam['in_customer_no_and_service_identify'] = scope['customerNoAndServiceIdentify'].split(',')
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

        scope.save = function(){
          console.log(scope.gridOptions);
        }

        scope.fetchInfo = function (page, shouldPageNumberReset) {
          scope.bNumList = [];
          var param = {
            pageSize: page.pageSize + '',
            pageNo: page.curPage + '',
            ilaType: scope.ilaType
          };

          if (shouldPageNumberReset) {
            page.curPage = '1'
            param.pageNo = page.curPage + ''
          }

          if (scope['customerNoAndServiceIdentify']) {
            param['in_customer_no_and_service_identify'] = scope['customerNoAndServiceIdentify'].split(',')
          }
          scope.gridOptions.showLoading = true
          GLOBAL_Http($http, "cpo/api/worktable/ILAMaster/queryILAMaster?", 'POST', param, function (data) {
            scope.gridOptions.showLoading = false
            if (data.status == 0) {
              scope.ilaMasterItems = data.output;
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
        var commonList = CommonService.constructeStaticColumnsFromJSON(scope, scope.tableType, false, null, 100, true);
        for(var index in commonList){
          commonList[index].enableCellEdit = true;
        }
        console.log(commonList);
        scope.gridOptions = {
          data: 'ilaMasterItems',
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
          columnDefs: commonList,
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
