(function () {
	'use strict';

	angular
		.module('cpo')
		.service('workingNoMasterService', ['$http', '$timeout', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants',
			function ($http, $timeout, $translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants) {
				var searchKey = {};
				var shouldAddFilterChangeEvent = true;
				var _this = this;

				this.importLineSheetData = function (scope) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'uploadFileModal',
						controller: 'UploadFileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function () {
								return {
									fileType: "901"
								};
							}
						}
					});
					modalInstance.result.then(function (returnData) {

						if (returnData) {
							// modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
						}
					}, function () { });

				}

				this.search = function (scope) {
					this.getWorkingNoList(scope, scope.searchWorkingNo);
				}
				this.getSeasonsList = function (scope) {

					GLOBAL_Http($http, "cpo/api/workingNo/query_working_no_master_seasons", 'GET', {}, function (data) {
						//  scope.idPropertyData = [{id:123,value:123}];
						var reuslt = new Array();
						angular.forEach(data.output, function (item) {
							reuslt.push({
								id: item, label: item
							});

						});

						scope.idPropertyData = reuslt;
						if (scope.idPropertyData.length > 1) {
							scope.idPropertyModel = [scope.idPropertyData[2]];
						} else if (scope.idPropertyData.length > 0) {
							scope.idPropertyModel = [scope.idPropertyData[0]];
						} else {
							scope.idPropertyModel = [];
						}
						if (scope.idPropertyModel.length > 0) {
							setTimeout(function () {
								_this.getWorkingNoList(scope);
							}, 1000);

						}
					}, function (data) {

					});

				}
				this.getWorkingNoList = function (scope, searchWorkingNo) {

					scope.gridOptions.showLoading = true;
					var _this = this;
					var param = {
						pageNo: scope.page.curPage,
						pageSize: scope.page.pageSize
					};


					var seasons = $("#workingno-master-season>div>button").text().replace(/\s+/g, "");
					if (seasons) {
						param.seasons = seasons;
					}

					else {
						return;
					}
					if (searchWorkingNo && searchWorkingNo.length > 0) {
						param['like_workingNo'] = searchWorkingNo;
					}
					//具体传参自己调整格式，格式在function searchFilter

					GLOBAL_Http($http, "cpo/api/workingNo/find?", 'GET', param, function (data) {

						var headers = [];
						var redHeaderTexts = ['Silicon Print', 'HD Print', 'Puff Print'];
						var greenHeaders = ['Flock Print', 'Digital Print', 'Embroidery Stitch', 'Snap Button'];
						var orangeHeaders = ['Bonding Qty', 'Laser Cut Qty'];
						for (var key in data.output.header) {
							var content = data.output.header[key];
							var item = {
								name: content.headerName,
								displayName: content.displayName,
								field: content.jsonObjectKey,
								width: '100',
								visible: !CommonService.columnHasHide(scope.gridOptions.zsGridName, key),
								//   headerCellTemplate:'app/worktable/filter.html',
							};
							if(redHeaderTexts.indexOf(content.headerName) != -1){
								item.headerCellClass = 'red-header';
							}
							if(greenHeaders.indexOf(content.headerName) != -1){
								item.headerCellClass = 'green-header';
							}
							if(orangeHeaders.indexOf(content.headerName) != -1){
								item.headerCellClass = 'orange-header';
							}
							headers.push(item);

						}
						scope.gridOptions.columnDefs = angular.copy(headers);
						scope.gridOptions.showLoading = false;

						debugger
						if (data.output && data.output.data) {
							scope.items = translateData(data.output.data);

							angular.forEach(scope.items, function (item) {
								for (var key in item) {
									if (key.indexOf("ReadyDate") != -1) {

										item[key] = new Date(item[key]).toLocaleDateString()
									}
								}
							})

						} else {
							scope.items = [];
						}
						scope.page.totalNum = data.output.total;
						scope.gridOptions.totalItems = scope.page.totalNum;

					}, function (data) {
						scope.gridOptions.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.exportFile = function (scope) {
					var param = {
						documentType: 301
					}
					var seasons = $("#workingno-master-season>div>button").text().replace(/\s+/g, "");
					// var seasons = ""
					// angular.forEach(scope.idPropertyModel,function(item){
					//   seasons += item.id+",";
					// })
					param.seasons = seasons;
					if (seasons.length == 0) {
						modalAlert(CommonService, 2, "Please Select Seasons", null);
						return;
					}

					CommonService.showLoadingView("Exporting...");
					GLOBAL_Http($http, "cpo/portal/document/check_record_count?", 'GET', param, function (data) {
						CommonService.hideLoadingView();
						if (data.status == 0) {
							if (parseInt(data.message) > 0) {
								exportExcel(param, "cpo/portal/document/export_file?", "_blank");
							} else {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
							}
						}
					}, function (data) {
						CommonService.hideLoadingView();
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}
				this.view = function (scope) {
					var selectedRows = scope.gridApi.selection.getSelectedRows();
					if (selectedRows.length !== 1) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.ALERT_CHOOSE_DATA'), null);
						return;
					}
					// 获取选择条目ID
					var id = selectedRows[0].workingNoId;

					var _this = this;
					scope.errorOutputMsgs = [];
					var modalInstance = $uibModal.open({
						templateUrl: 'workingNoDetailModal',
						controller: 'workingNoDetailController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function () {
								return {
									"id": id,
									"mode": "VIEW"
								};
							}
						}
					});
					// modalInstance callback
					modalInstance.result.then(function (returnData) { }, function () {
						// dismiss(cancel)
					});
				}

				this.edit = function (scope) {
					var selectedRows = scope.gridApi.selection.getSelectedRows();
					if (selectedRows.length !== 1) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.ALERT_CHOOSE_DATA'), null);
						return;
					}
					// 获取选择条目ID
					var id = selectedRows[0].workingNoId;

					var _this = this;
					scope.errorOutputMsgs = [];
					var modalInstance = $uibModal.open({
						templateUrl: 'workingNoDetailModal',
						controller: 'workingNoDetailController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function () {
								return {
									"id": id,
									"mode": "EDIT"
								};
							}
						}
					});
					// modalInstance callback
					modalInstance.result.then(function (returnData) {
						if (returnData) {
							_this.getWorkingNoList(scope);
						}
					}, function () {
						// dismiss(cancel)
					});
				}

				this.toggleFilterRow = function (scope, tab) {
					scope.gridOptions.enableFiltering = !scope.gridOptions.enableFiltering;
					scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
				}

				this.importFile = function (scope) {
					debugger
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'FileModal',
						controller: 'FileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function () {
								return {
									fileType: "101"
								};
							}
						}
					});
					modalInstance.result.then(function (returnData) {
						if (returnData) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
							_this.getWorkingNoList(scope);
						}
					}, function () { });
				}
				this.uploadSeason = function (scope) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'FileModal',
						controller: 'FileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function () {
								return {
									fileType: "998"
								};
							}
						}
					});
					modalInstance.result.then(function (returnData) {
						if (returnData) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
						}
					}, function () { });
				}

				this.importWorldCupFile = function (scope) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'uploadFileModal',
						controller: 'UploadFileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function () {
								return {
									fileType: "201"
								};
							}
						}
					});
					modalInstance.result.then(function (returnData) {
						if (returnData) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
							_this.getWorkingNoList(scope);
						}
					}, function () { });
				};
				/**
				 * init
				 */
				this.init = function (scope) {
					// 初期化
					var _this = this;
					searchKey = {};

					scope.seasonSelectSetting = {
						buttonDefaultText: "",
						checkAll: $translate.instant('index.SELECT_ALL'),
						uncheckAll: $translate.instant('index.NOT_SELECT_ALL')
					};
					scope.idPropertyModel = [];
					scope.idPropertyData = [
						{ id: "pvQuantity", label: 'PV' },
						{ id: "openForecastQty", label: 'Open FC' },
						{ id: "newOrderQty", label: 'New Order' },
						{ id: "actualOrderQty", label: 'Actual Qty' }
					];
					scope.idPropertySettings = {
						smartButtonMaxItems: 100,
						smartButtonTextConverter: function (itemText, originalItem) {
							return itemText;
						},
						showCheckAll: false,
						showUncheckAll: false
					};

					scope.page = {
						curPage: 1,
						pageSize: 50,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					_this.getSeasonsList(scope);
					scope.gridOptions = {
						data: 'items',
						paginationPageSizes: [10, 20, 50, 100, 200, 500],
						paginationPageSize: 50,
						rowEditWaitInterval: -1,
						flatEntityAccess: true,
						fastWatch: true,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						showLoading: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						zsGridName: "working_no_master",
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						useExternalPagination: true,
						enablePaginationControls: true,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						expandableRowTemplate: '<div class="sub-ui-grid" ui-grid="row.entity.subGridOptions"></div>',
						expandableRowHeight: 150,
						expandableRowScope: {
							subGridVariable: 'subGridScopeVariable1'
						},
						columnDefs: CommonService.constructeStaticColumnsFromJSON(scope, "working_no_master", false, null, 150),
						onRegisterApi: function (gridApi) {
							scope.gridApi = gridApi;
							scope.gridApi.core.on.sortChanged(scope, function (grid, sortColumns) {
								if (sortColumns.length !== 0) {
									if (sortColumns[0].sort.direction === 'asc') {
										scope.page.sortDirection = true;
									}
									if (sortColumns[0].sort.direction === 'desc') {
										scope.page.sortDirection = false;
									}
									scope.page.sortColumn = sortColumns[0].displayName;
								}
							});
							scope.gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
								_this.getWorkingNoList(scope);
							});
							scope.gridApi.core.on.filterChanged(scope, function (col) {

								//https://stackoverflow.com/questions/27301690/angular-ui-grid-ng-grid-filterchanged-firing-too-frequently

								if (angular.isDefined(scope.filterTimeout)) {
									$timeout.cancel(scope.filterTimeout);
								}
								var __this = this;
								scope.filterTimeout = $timeout(function () {
									var grid = __this.grid;

									var newsearchKey = {};
									angular.forEach(grid.columns, function (column, index) {

										if (column.filters && column.filters[0].term && column.filters[0].term.length > 0) {
											newsearchKey[column.field] = column.filters[0].term;
										}
									});

									if (!angular.equals(searchKey, newsearchKey)) {
										searchKey = newsearchKey;
										_this.getWorkingNoList(scope);
									}

								}, 200);
							});

							gridApi.expandable.on.rowExpandedStateChanged(scope, function (row) {
								if (row.isExpanded) {
									row.entity.subGridOptions = {
										enableColumnMenus: true,
										enableGridMenu: true,
										rowEditWaitInterval: -1,
										enableRowSelection: false,
										enableRowHeaderSelection: false,
										enableFullRowSelection: false,
										enableHorizontalScrollbar: 1,
										gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
										enableVerticalScrollbar: 0,
										columnDefs: CommonService.constructeStaticColumnsFromJSON(scope, "working_no_master_sub", false, null, 170)
									};

									var prOrder = {};
									row.entity.subGridOptions.data = row.entity.workingNoSeasonAttributes;
								}
							});
						}
					};

					//	_this.getWorkingNoList(scope);

					function searchFilter(searchText, cellValue, row, col) {
						return true;

						var field = col.field;

						if (searchText != searchKey[field]) {
							searchKey[field] = searchText;
							scope.page.curPage = 1;
							_this.getWorkingNoList(scope);
						}
						return true;
					}
				};
			}
		])
		.controller('workingNoMasterCtrl', ['$scope', 'workingNoMasterService',
			function ($scope, workingNoMasterService) {
				$scope.importWorldCupFile = function () {
					workingNoMasterService.importWorldCupFile($scope);
				}
				$scope.getWorkingNoList = function () {
					workingNoMasterService.getWorkingNoList($scope);
				}
				$scope.view = function () {
					workingNoMasterService.view($scope);
				}
				$scope.edit = function () {
					workingNoMasterService.edit($scope);
				}
				$scope.exportFile = function () {
					workingNoMasterService.exportFile($scope);
				}
				$scope.importFile = function () {
					workingNoMasterService.importFile($scope);
				}
				$scope.toggleFilterRow = function () {
					workingNoMasterService.toggleFilterRow($scope);
				};
				$scope.search = function () {
					workingNoMasterService.search($scope);
				};
				$scope.uploadSeason = function () {
					workingNoMasterService.uploadSeason($scope);
				}
				$scope.importLineSheetData = function () {
					workingNoMasterService.importLineSheetData($scope);
				}
				workingNoMasterService.init($scope);
			}
		])
})();
