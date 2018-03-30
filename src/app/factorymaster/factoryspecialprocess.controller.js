(function() {
	'use strict';
	angular
		.module('cpo')
		.service('factorySpecialProcessService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {


				this.getFactoryList = function(scope) {
					var _this = this;
					var year=new Date().getFullYear();
					var month=new Date().getMonth()+1;

					var param = {
						pageNo: scope.page.curPage,
						pageSize: scope.page.pageSize,
						fillRate:"YES",
						fromMonth:year+'0'+month+"01",
						toMonth:year+'0'+(month+2)+"02"
					}
					GLOBAL_Http($http, "cpo/api/factory/query_factory_process?", 'GET', param, function(data) {

						if(data.output) {
							scope.items = translateData(data.output.factoryExts);
//							for(var i=0;i<scope.items.length;i++){
//								for(var j=0;j<scope.items[i].factoryProcessLoadings.length;j++){
//									scope.items[i]['capacity'+scope.items[i].factoryProcessLoadings[j].month]=
//									scope.items[i].factoryProcessLoadings[j].capacity;
//									scope.items[i]['fillRate'+scope.items[i].factoryProcessLoadings[j].month]=
//									(scope.items[i].factoryProcessLoadings[j].loading/scope.items[i].factoryProcessLoadings[j].capacity).toFixed(2);
//								}
//							}
							for(var i = 0; i < scope.items.length; i++) {
									var item = scope.items[i];
									for(var j = 0; j < item.factoryProcessLoadings.length; j++) {
										var load=item.factoryProcessLoadings[j];
										item[('capacity' + j)] = load.capacity;
										item[('fillRate' + j)] = (load.loading/load.capacity*100).toFixed(2)+"%";
									}
							}
							scope.page.totalNum = data.output.total;
							scope.gridOptions.totalItems = scope.page.totalNum;
						} else {
							modalAlert(CommonService, 2, data.message, null);
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
					var id = selectedRows[0].factoryProcessId;

					var _this = this;
					scope.errorOutputMsgs = [];
					var modalInstance = $uibModal.open({
						templateUrl: 'factorySpecialProcessDetailModal',
						controller: 'factorySpecialProcessDetailController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									"id": id,
									"Mode":Mode
								};
							}
						}
					});
					// modalInstance callback
					modalInstance.result.then(function(returnData) {
						if(returnData){
							_this.getFactoryList(scope);
						}
					}, function() {
						// dismiss(cancel)
					});
				}



				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;
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
						columnDefs: [
							{
								name: 'factoryCode',
								displayName: $translate.instant('factory.FACTORY_CODE'),
								field: 'factoryCode',
							    minWidth: '140',
								enableCellEdit: false
							},
						    {
								name: 'factSimpName',
								displayName: $translate.instant('factory.FACTORY_SIMP_NAME'),
								field: 'factSimpName',
							    minWidth: '140',
								enableCellEdit: false
							},
							{
								name: 'processCode',
								displayName: $translate.instant('processmaster.PROCESS_NO'),
								field: 'processCode',
							    minWidth: '140',
								enableCellEdit: false
							},
							{
								name: 'processName',
								displayName: $translate.instant('processmaster.PROCESS_NAME'),
								field: 'processName',
							    minWidth: '140',
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
								_this.getFactoryList(scope);
							});
						}
					};

					var year = new Date().getFullYear();
					var month = new Date().getMonth() + 1;
					for(var i = 0; i < 4; i++) {
						var capacity = {
							name: 'capacity' + i,
							displayName: $translate.instant('factoryProcess.CAPACITY') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
							field: 'capacity' + i,
							minWidth: '140',
							enableCellEdit: false
						}
						var fillRate = {
							name: 'fillRate' + i,
							displayName: $translate.instant('factoryProcess.FILL_RATE') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
							field: 'fillRate' + i,
							minWidth: '140',
							enableCellEdit: false
						}
						scope.gridOptions.columnDefs.push(capacity);
						scope.gridOptions.columnDefs.push(fillRate);
					}


                   _this.getFactoryList(scope);
				};
			}
		])
		.controller('factorySpecialProcessCtrl', ['$scope', 'factorySpecialProcessService',
			function($scope, factorySpecialProcessService) {
				$scope.getFactoryList = function() {
					factorySpecialProcessService.getFactoryList($scope);
				}
				$scope.view = function() {
					factorySpecialProcessService.view($scope,'VIEW');
				}
				$scope.edit = function() {
					factorySpecialProcessService.view($scope,'EDIT');
				}
				factorySpecialProcessService.init($scope);
			}
		])
})();
