(function() {
	'use strict';
	angular
		.module('cpo')
		.service('SampleRoomCapacityService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
				this.getLoading = function(scope) {
					var year = new Date().getFullYear();
					var month = new Date().getMonth() + 1;
					var months = [year + "0" + month + '01', year + "0" + month + '02', year + "0" + (month + 1) + '01', year + "0" + (month + 1) + '02'];
					var param = {
						'in_month': months,
						pageNo: 1,
						pageSize: 10000,
						fact_load_type: 1
					}
					GLOBAL_Http($http, "cpo/api/factory/query_factory_loading?", 'GET', param, function(data) {

						if(data.status == 0) {
							if(data.output) {
								scope.factoryCapacityData = data.output;
								for(var i = 0; i < scope.factoryCapacityData.length; i++) {
									var factoryCapacity = scope.factoryCapacityData[i];
									for(var j = 0; j < factoryCapacity.factoryMonthLoadings.length; j++) {
										factoryCapacity[('capacity' + j)] = factoryCapacity.factoryMonthLoadings[j].capacity;
										factoryCapacity[('fillRate' + j)] = factoryCapacity.factoryMonthLoadings[j].fillRate;
									}
								}

							var height = (scope.factoryCapacityData.length * 30) + 36;
							$("#sampleRoomCap").css('height', height + 'px');
							} else {
								scope.factoryCapacityData = [];
							}
						} else {
							var message = data.message;
							if(message) {
								modalAlert(CommonService, 3, message, null);
							}
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.view = function(scope,Mode) {

					var selectedRows = scope.gridApi.selection.getSelectedRows();
					if(selectedRows.length !== 1) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.ALERT_CHOOSE_DATA'), null);
						return;
					}
					// 获取选择条目ID
					var _this = this;
					scope.errorOutputMsgs = [];
					var modalInstance = $uibModal.open({
						templateUrl: 'SampleRoomCapacityDetailModal',
						controller: 'SampleRoomCapacityDetailController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									"data": selectedRows[0],
									"Mode":Mode
								};
							}
						}
					});
					// modalInstance callback
					modalInstance.result.then(function(returnData) {
						if(returnData){
							_this.getLoading(scope);
						}
					}, function() {
						// dismiss(cancel)
					});
				}


				this.initGripOption = function(scope) {
					scope.gridOptions = {
						data: 'factoryCapacityData',
						enableColumnMenus: true,
			enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: false,
						enableFullRowSelection: false,
						enableRowHeaderSelection: true,
						enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: false,
						useExternalPagination: false,
						enablePaginationControls: false,
						columnDefs: [{
								name: 'factoryName',
								displayName: $translate.instant('worktable.FACTORY_NAME'),
								field: 'factoryName',
								minWidth: '120',
								enableCellEdit: false
							},
							{
								name: 'fabricType',
								displayName: $translate.instant('worktable.FABRIC_TYPE'),
								field: 'wovenKnit',
								minWidth: '120',
								enableCellEdit: false
							},
							{
								name: 'productType',
								displayName: $translate.instant('worktable.PRODUCT_TYPE'),
								field: 'productType',
								minWidth: '120',
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
							});
						}
					};
					var year = new Date().getFullYear();
					var month = new Date().getMonth() + 1;
					for(var i = 0; i < 4; i++) {
						var capacity = {
							name: 'capacity' + i,
							displayName: $translate.instant('worktable.CAPACITY') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
							field: 'capacity' + i,
							minWidth: '140',
							enableCellEdit: false
						}
						var fillRate = {
							name: 'fillRate' + i,
							displayName: $translate.instant('worktable.FILL_RATE') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
							field: 'fillRate' + i,
							minWidth: '140',
							enableCellEdit: false
						}
						scope.gridOptions.columnDefs.push(capacity);
						scope.gridOptions.columnDefs.push(fillRate);
					}

				};


				/**
				 * init
				 */
				this.init = function(scope) {

					this.initGripOption(scope);
					this.getLoading(scope);
				};
			}
		])
		.controller('SampleRoomCapacityCtrl', ['$scope', 'SampleRoomCapacityService',
			function($scope, SampleRoomCapacityService) {
				$scope.view = function() {
					SampleRoomCapacityService.view($scope, 'VIEW');
				}
				$scope.edit = function() {
					SampleRoomCapacityService.view($scope, 'EDIT');
				}
				SampleRoomCapacityService.init($scope);
			}
		])
})();
