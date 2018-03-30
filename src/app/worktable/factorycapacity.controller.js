(function() {
	'use strict';

	angular
		.module('cpo')
		.service('FactoryCapacityService', ['$http', 'CommonService', '$location', '$translate',
			function($http, CommonService, $location, $translate) {

				var modalScope;
				var gModalInstance;
				/**
				 * モーダル設定
				 */
				this.setModalScope = function(inScope, inModalInstance) {
					modalScope = inScope;
					gModalInstance = inModalInstance;
				};

				this.cancel = function() {
					gModalInstance.dismiss();
				}
				this.save = function(scope) {
					var data = judgeDifferent(scope.factoryCapacityData, scope.originLoading, 'factoryId', 'factoryMonthLoadings', 'factoryLoadingId', 'capacity');
					if(data.length == 0) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
						gModalInstance.close();
						return;
					}
					var param = {
						'factoryLoadingExts': data
					};
					GLOBAL_Http($http, "cpo/api/factory/update_capacity?", 'PUT', param, function(data) {

						if(data.status == 0) {
							gModalInstance.close('YES');
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
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
				this.initGripOptionOne = function(scope) {
					scope.gridOptions1 = {
						data: 'factoryCapacityData',
						enableColumnMenus: true,
			enableGridMenu: true,
						rowEditWaitInterval: 1,
						enableRowSelection: true,
						enableFullRowSelection: false,
						enableRowHeaderSelection: false,
						enableHorizontalScrollbar: 0,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						enablePagination: false,
						useExternalPagination: false,
						enablePaginationControls: false,
						columnDefs: [{
								name: 'factoryName',
								displayName: $translate.instant('worktable.FACTORY_NAME'),
								field: 'factoryName',
								minWidth: '70',
								enableCellEdit: false
							},
							{
								name: 'fabricType',
								displayName: $translate.instant('worktable.FABRIC_TYPE'),
								field: 'wovenKnit',
								minWidth: '70',
								enableCellEdit: false
							},
							{
								name: 'productType',
								displayName: $translate.instant('worktable.PRODUCT_TYPE'),
								field: 'productType',
								minWidth: '70',
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
							scope.gridApi.edit.on.afterCellEdit(scope, function(rowEntity, colDef, newValue, oldValue) {
								if(!newValue && newValue !== 0) {
									var colfield = colDef.field;
									rowEntity[colfield] = 0;
									rowEntity.factoryMonthLoadings[colDef.field.slice(8)].capacity = 0;
									scope.$apply();
								} else if(newValue !== oldValue) {
									rowEntity.factoryMonthLoadings[colDef.field.slice(8)].capacity = newValue;
								}
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
							minWidth: '120',
							enableCellEdit: true
						}
						scope.gridOptions1.columnDefs.push(capacity);
					}
				};



				/**
				 * init
				 */
				this.init = function(scope, planGroups) {
					var _this = this;
					scope.originLoading = [];
					scope.errorOutputMsgs = [];
					scope.processDetail = {};
					scope.TimeModel = planGroups.TimeModel;
					_this.initGripOptionOne(scope);


				};
			}
		])
		.controller('FactoryCapacityController', ["$scope", "FactoryCapacityService", '$uibModalInstance', "fileReader", 'planGroups',
			function($scope, FactoryCapacityService, $uibModalInstance, fileReader, planGroups) {
				FactoryCapacityService.setModalScope($scope, $uibModalInstance);
				$scope.cancel = function() {
					FactoryCapacityService.cancel();
				}
				$scope.save = function() {
					FactoryCapacityService.save($scope);
				}
				FactoryCapacityService.init($scope, planGroups);
			}
		])

})();
