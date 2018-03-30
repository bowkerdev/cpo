(function() {
  'use strict';

  angular
    .module('cpo')
    .service('WorkingNoSelectService', ["$timeout",'$http','CommonService', '$location', '$translate','uiGridConstants', 'uiGridGroupingConstants',
      function($timeout,$http,CommonService,$location,$translate,uiGridConstants, uiGridGroupingConstants) {
				var searchKey = {};
        var modalScope;
        var gModalInstance;
        /**
         * モーダル設定
         */

        this.setModalScope = function (inScope, inModalInstance) {
          modalScope = inScope;
          gModalInstance = inModalInstance;
        };

        this.cancel = function () {
          gModalInstance.close();
        }

        this.save=function(scope){
          var selectedRows = scope.gridApi.selection.getSelectedRows();
          if(selectedRows.length < 1) {
            modalAlert(CommonService, 2, $translate.instant('criteria.PLEASE_SELECT_WORKING_NO'), null);
            return;
          }
          gModalInstance.close(listToString(selectedRows,'workingNo'));
        }

        this.all=function(scope){
          gModalInstance.close("ALL");
        }
				this.getWorkingNoList = function(scope) {

					var _this = this;
					var param = {
						pageNo: scope.page.curPage,
						pageSize: scope.page.pageSize
					}
					for (var attr in searchKey) {
						if(searchKey[attr]){
                           param['like_'+attr]=urlCharTransfer(searchKey[attr]);
						}
          }
					GLOBAL_Http($http, "cpo/api/workingNo/find?", 'GET', param, function(data) {

						if(data.rows) {
							scope.items = translateData(data.rows);
						} else {
							scope.items=[];
						}
							scope.page.totalNum = data.total;
							scope.gridOptions.totalItems = scope.page.totalNum;
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}



        this.init=function(scope){
          var _this=this;
				  searchKey = {};
          scope.items=[];
         	scope.page = {
						curPage: 1,
						pageSize: 10,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};

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
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [{
								name: 'workingNo',
								displayName: $translate.instant('workingNo.WORKING_NO'),
								field: 'workingNo',
								enableCellEdit: false,
								filters: [{
									condition: searchFilter,
									placeholder: ''
								}]
						   },
							{
								name: 'unit',
								displayName: $translate.instant('workingNo.UNIT'),
								field: 'unit',
                				minWidth: '90',
								enableCellEdit: false,
								filters: [{
									condition: searchFilter,
									placeholder: ''
								}]
							},
							{
								name: 'garmentProductingDay',
								displayName: $translate.instant('workingNo.GARMENT_PRODUCTING_DAY'),
								field: 'garmentProductingDay',
                				minWidth: '160',
								enableCellEdit: false,
								filters: [{
									condition: searchFilter,
									placeholder: ''
								}]
							},
							{
								name: 'adidas_a_source',
								displayName: $translate.instant('workingNo.ADIDAS_A_SOURCE'),
								field: 'adidasASource',
								enableCellEdit: false,
								filters: [{
									condition: searchFilter,
									placeholder: ''
								}]
							},
							{
								name: 'bowker_a_source',
								displayName: $translate.instant('workingNo.BOWKER_A_SOURCE'),
								field: 'bowkerASource',
								enableCellEdit: false,
								filters: [{
									condition: searchFilter,
									placeholder: ''
								}]
							},
							{
								name: 'lastProductionFactory',
								displayName: $translate.instant('workingNo.LAST_PRODUCTION_FACTORY'),
								field: 'lastProductionFactory',
                				minWidth: '180',
								enableCellEdit: false,
								filters: [{
									condition: searchFilter,
									placeholder: ''
								}]
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
              gridApi.core.on.filterChanged(scope, function (col) {

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
                      _this.getWorkingNoList(scope);
                    }


                }, 200);
              });
							scope.gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
								_this.getWorkingNoList(scope);
							});
						}
					};

          _this.getWorkingNoList(scope);
					function searchFilter(searchText, cellValue, row, col) {
						// var field = col.field;
						// if(searchText != searchKey[field]) {
						// 	searchKey[field] = searchText;
						//     scope.page.curPage=1;
						// 	_this.getWorkingNoList(scope);
						// }
						return true;
					}
        }

				this.toggleFilterRow = function(scope, tab) {
					scope.gridOptions.enableFiltering = !scope.gridOptions.enableFiltering;
					scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
				}
      }])
    .controller('WorkingNoSelectController', ['$scope', 'WorkingNoSelectService', '$uibModalInstance',
      function ($scope, WorkingNoSelectService, $uibModalInstance) {


        $scope.cancel = function () {
          WorkingNoSelectService.cancel();
        };

        $scope.save = function () {
          WorkingNoSelectService.save($scope);
        };

				$scope.toggleFilterRow = function() {
					WorkingNoSelectService.toggleFilterRow($scope);
				};

        $scope.init = function () {
          WorkingNoSelectService.init($scope);
        };

        $scope.all = function () {
          WorkingNoSelectService.all($scope);
        };

        WorkingNoSelectService.setModalScope($scope, $uibModalInstance);
        WorkingNoSelectService.init($scope);
      }])

})();
