
(function() {
  'use strict';

  angular.module('cpo').controller('refreshOrderCtrl', function ($uibModalInstance,CommonService,$scope,parameter) {
    $scope.orderTime = null;
		$scope.parameter=parameter;
		$scope.refreshOrderTypes=[{value:'All',label:'All'},{value:'Selection',label:'Selection'}];
		$scope.refreshOrder=$scope.refreshOrderTypes[0];
		$scope.onRefreshingOrderTypeChange=function	(refreshOrder){
			
		}
		
    $scope.submit = function () {
      if(!$scope.orderTime){
        modalAlert(CommonService, 2, "Please enter Batch Date", null);
        return;
      }
      if(!$scope.fileName){
        modalAlert(CommonService, 2, "Document name cannot be empty", null);
        return;
      }

      $uibModalInstance.resolve({documentName:$scope.fileName,orderTime:$scope.orderTime});
      $uibModalInstance.dismiss();
    };
    $scope.dismiss = function(){
      $uibModalInstance.dismiss();
    }

		
//				this.initGripOptionFour = function(scope, i, dataName) {
//
//					var _this = this;
//					var columns;
//					var canFilter = true; //(i!=7);
//					var columns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", canFilter, 100);
//					var url = "cpo/api/worktable/query_assignment_result_filter?";
//					scope['gridOptions' + i] = {
//						data: dataName,
//						paginationPageSizes: [10, 20, 50, 100, 200, 500, 1000, 2000, 4000],
//						enableColumnMenus: true,
//						enableGridMenu: true,
//						flatEntityAccess: true,
//						fastWatch: true,
//						paginationPageSize: 100,
//						rowEditWaitInterval: -1,
//						showLoading: false,
//						enableRowSelection: false,
//						enableRowHeaderSelection: true,
//						enableFullRowSelection: false,
//						enableHorizontalScrollbar: 1,
//						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
//						enableVerticalScrollbar: 0,
//						zsColumnFilterRequestUrl: url,
//						zsColumnFilterRequestParam: param,
//						totalItems: scope.page.totalNum,
//						enablePagination: true,
//						zsGridName: "bulkorder_grid_" + i,
//						useExternalPagination: true,
//						enablePaginationControls: true,
//						gridopntion1ableRowTemplate: '<div class="sub-ui-grid" ui-grid="row.entity.subGridOptions"></div>',
//						gridopntion1ableRowHeight: 150,
//						gridopntion1ableRowScope: {
//							subGridVariable: 'subGridScopeVariable1'
//						},
//						columnDefs: columns,
//
//						onRegisterApi: function(gridApi) {
//							scope['gridApi' + i] = gridApi;
//
//							gridApi.core.on.filterChanged(scope, function(col) {
//
//								var __this = this;
//
//								var grid = __this.grid;
//
//								var newsearchKey = CommonService.getFilterParams(grid);
//
//							});
//							gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
//								if(sortColumns.length !== 0) {
//									if(sortColumns[0].sort.direction === 'asc') {
//										scope['page' + i].sortDirection = true;
//									}
//									if(sortColumns[0].sort.direction === 'desc') {
//										scope['page' + i].sortDirection = false;
//									}
//									scope['page' + i].sortColumn = sortColumns[0].displayName;
//								}
//							});
//							gridApi.selection.on.rowSelectionChanged(scope, function(row, event) {
//								//行选中事件
//								//								_this.rowSelect(scope, row.Entity);
//							});
//
//							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
//							});
//						}
//					};
//
//				};



  });


})();
