(function() {
	'use strict';
	angular
		.module('cpo')
		.service('assignmentHistoryService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
				this.selectTab = function(scope, Tab) {
					scope.activeTab = Tab;
					switch (Tab){
            case '1':
              this.initGripOptionTwo(scope);
              break;
            case '2':
              this.initGripOptionFour(scope);
              break;
            case '3':

              break;
            case '4'  :

              break;
          }
				};

				this.rowSelect = function(scope, row) {
					scope.showDetailView = 'showDetail';
				}

				this.getSelectedData = function(scope) {
					GLOBAL_Http($http, "cpo/api/criteria/query_criteria_version?", 'GET', {}, function(data) {

						if(data.status == 0) {
							if(data.output) {
								scope.versionList = data.output.criteriaVersions;
								for(var i = 0; i < scope.versionList.length; i++) {
									scope.versionList[i].label = scope.versionList[i].versionName;
									scope.versionList[i].id = scope.versionList[i].criteriaVersionId;
								}
							} else {
								scope.versionList = [];
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

				this.initGripOptionZero = function(scope) {
					var blueGreenTemplate = document.getElementById("blueGreenTemplate").innerText;
					var isNewTemplate = document.getElementById("isNewTemplate").innerText;
					var linkLabelTemplate = document.getElementById("linkLabelTemplate").innerText;
					scope.gridOptions = {
						data: 'dailyDocumentData',
						enableColumnMenus: true,
			            enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableFullRowSelection: true,
						enableRowHeaderSelection: false,
						enableHorizontalScrollbar: 0,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: false,
						useExternalPagination: false,
						enablePaginationControls: false,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [{
								name: 'documentType',
								displayName: $translate.instant('worktable.DOCUMENT'),
								field: 'documentTypeName',
								minWidth: '100',
								enableCellEdit: false,
								cellTemplate: blueGreenTemplate
							}, {
								name: 'isNew',
								displayName: "",
								field: 'documentStatus',
								minWidth: '100',
								enableCellEdit: false,
								cellTemplate: isNewTemplate
							},
							{
								name: 'documentVersion',
								displayName: $translate.instant('worktable.LASTEST_VERSION'),
								field: 'documentName',
								minWidth: '100',
								enableCellEdit: false,
								cellTemplate: linkLabelTemplate
							},
							{
								name: 'updateTime',
								displayName: $translate.instant('worktable.UPDATE_TIME'),
								field: 'utcUpdate',
								minWidth: '100',
								enableCellEdit: false,
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
				};

				this.initGripOptionOne = function(scope) {
					var redLabelTemplate = document.getElementById("redLabelTemplate").innerText;
					scope.gridOptions1 = {
						data: 'factoryCapacityData',
						enableColumnMenus: true,
			enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableFullRowSelection: true,
						enableRowHeaderSelection: false,
						enableHorizontalScrollbar: 0,
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
							scope.gridApi1 = gridApi;
							scope.gridApi1.core.on.sortChanged(scope, function(grid, sortColumns) {
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
							scope.gridApi1.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
							});
						}
					};
					var year=new Date().getFullYear();
					var month=new Date().getMonth()+1;
					for(var i = 0; i < 4; i++) {
						var capacity = {
							name: 'capacity' + i,
							displayName: $translate.instant('worktable.CAPACITY') + " " + year + "0" + Math.floor((month + (i/2)))+"0"+((i%2)+1),
							field: 'capacity' + i,
							minWidth: '140',
							enableCellEdit: false
						}
						var fillRate = {
							name: 'fillRate' + i,
							displayName: $translate.instant('worktable.FILL_RATE') + " " + year + "0" + Math.floor((month + (i/2)))+"0"+((i%2)+1),
							field: 'fillRate' + i,
							minWidth: '140',
							enableCellEdit: false,
							cellTemplate: "<div class=\"container-flex-center-center\" style=\"width: 100%;height: 100%;\" ng-class=\"{'background-red':row.entity.fillRate" + i + ">= 90}\"><div ng-bind=\"row.entity.fillRate" + i + "\"></div><span ng-if=\"row.entity.fillRate" + i + "\">%</span></div>"
						}
						scope.gridOptions1.columnDefs.push(capacity);
						scope.gridOptions1.columnDefs.push(fillRate);
					}
				};

				this.initGripOptionTwo = function(scope) {
					var _this = this;
					scope.gridOptions2 = {
						data: 'DailyListData',
						enableColumnMenus: true,
			enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: false,
						enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						enablePagination: false,
						useExternalPagination: false,
						enablePaginationControls: false,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [{
								name: 'workingNo',
								displayName: $translate.instant('worktable.WORKING_NO'),
								field: 'workingNo',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'bowkerNo',
								displayName: $translate.instant('worktable.BOWKER_NO'),
								field: 'bowkerNo',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'documentCategory',
								displayName: $translate.instant('worktable.DOCUMENT_CATEGORY'),
								field: 'documentCategory',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'documentVersion',
								displayName: $translate.instant('worktable.DOCUMENT_VERSION'),
								field: 'documentVersion',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'orderType',
								displayName: $translate.instant('worktable.ORDER_TYPE'),
								field: 'orderType',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'orderCountry',
								displayName: $translate.instant('worktable.ORDER_COUNTRY'),
								field: 'orderCountry',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'customerNO',
								displayName: $translate.instant('worktable.CUSTOMER_NO'),
								field: 'customerNO',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'QUANTITY',
								displayName: $translate.instant('worktable.QUANTITY'),
								field: 'quantity',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'leftover',
								displayName: $translate.instant('worktable.LEFT_OVER'),
								field: 'leftover',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'systemResult',
								displayName: $translate.instant('worktable.SYSTEM_RESULT'),
								field: 'systemResult',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'lastProduction',
								displayName: $translate.instant('worktable.LAST_PRODUCTION'),
								field: 'lastProduction',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'aSource',
								displayName: $translate.instant('worktable.A_SOURCE'),
								field: 'aSource',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'FR_CONFIRMATION',
								displayName: $translate.instant('worktable.FR_CONFIRMATION'),
								field: 'FR_confirmation',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'FR_DATE',
								displayName: $translate.instant('worktable.FR_DATE'),
								field: 'FR_date',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'PD',
								displayName: $translate.instant('worktable.PD'),
								field: 'PD',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'PSDD',
								displayName: $translate.instant('worktable.PSDD'),
								field: 'PSDD',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'FIRST_PRODUCTION_DATE',
								displayName: $translate.instant('worktable.FIRST_PRODUCTION_DATE'),
								field: 'firstProductionDate',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'PODD',
								displayName: $translate.instant('worktable.PODD'),
								field: 'PODD',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'LAST_PRODUCTION_DATE',
								displayName: $translate.instant('worktable.LAST_PRODUCTION_DATE'),
								field: 'lastProductionDate',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'ACTUAL_PRODUCTION_QTY',
								displayName: $translate.instant('worktable.ACTUAL_PRODUCTION_QTY'),
								field: 'actualProductionQty',
								minWidth: '100',
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
							scope.gridApi.selection.on.rowSelectionChanged(scope, function(row, event) {
								//行选中事件
								_this.rowSelect(scope, row.Entity);
							});
							scope.gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
							});
						}
					};
				};

				this.initGripOptionThree = function(scope) {
					var blueGreenTemplate = document.getElementById("blueGreenTemplate").innerText;
					var linkLabelTemplate = document.getElementById("linkLabelTemplate").innerText;
					var functionButtonTemplate = document.getElementById("functionButtonTemplate").innerText;
					scope.gridOptions3 = {
						data: 'LC0190DocumentData',
						enableColumnMenus: true,
			enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: false,
						enableHorizontalScrollbar: 0,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						enablePagination: false,
						useExternalPagination: false,
						enablePaginationControls: false,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [{
								name: 'documentType',
								displayName: $translate.instant('worktable.DOCUMENT'),
								field: 'documentType',
								minWidth: '100',
								enableCellEdit: false,
								cellTemplate: blueGreenTemplate
							},
							{
								name: 'documentVersion',
								displayName: $translate.instant('worktable.LASTEST_VERSION'),
								field: 'documentVersion',
								minWidth: '100',
								enableCellEdit: false,
								cellTemplate: linkLabelTemplate
							},
							{
								name: 'utcUpdate',
								displayName: $translate.instant('worktable.UPDATE_TIME'),
								field: 'utcUpdate',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'uploadType',
								displayName: "",
								field: 'uploadType',
								minWidth: '100',
								enableCellEdit: false,
								cellTemplate: functionButtonTemplate
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
				};

				this.initGripOptionFour = function(scope) {
					var _this = this;
					scope.gridOptions4 = {
						data: 'LC0190ListData',
						enableColumnMenus: true,
			enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: false,
						enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						enablePagination: false,
						useExternalPagination: false,
						enablePaginationControls: false,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [{
								name: 'workingNo',
								displayName: $translate.instant('worktable.WORKING_NO'),
								field: 'workingNo',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'bowkerNo',
								displayName: $translate.instant('worktable.BOWKER_NO'),
								field: 'bowkerNo',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'MKTFC',
								displayName: $translate.instant('worktable.MKT_FC'),
								field: 'MKTFC',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'CUSFC',
								displayName: $translate.instant('worktable.CUS_FC'),
								field: 'CUSFC',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'LC0190NO',
								displayName: $translate.instant('worktable.LC0190_NO'),
								field: 'LC0190NO',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'orderCountry',
								displayName: $translate.instant('worktable.ORDER_COUNTRY'),
								field: 'orderCountry',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'customerNO',
								displayName: $translate.instant('worktable.CUSTOMER_NO'),
								field: 'customerNO',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'QUANTITY',
								displayName: $translate.instant('worktable.QUANTITY'),
								field: 'quantity',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'leftover',
								displayName: $translate.instant('worktable.LEFT_OVER'),
								field: 'leftover',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'systemResult',
								displayName: $translate.instant('worktable.SYSTEM_RESULT'),
								field: 'systemResult',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'lastProduction',
								displayName: $translate.instant('worktable.LAST_PRODUCTION'),
								field: 'lastProduction',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'aSource',
								displayName: $translate.instant('worktable.A_SOURCE'),
								field: 'aSource',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'FR_CONFIRMATION',
								displayName: $translate.instant('worktable.FR_CONFIRMATION'),
								field: 'FR_confirmation',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'FR_DATE',
								displayName: $translate.instant('worktable.FR_DATE'),
								field: 'FR_date',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'PD',
								displayName: $translate.instant('worktable.PD'),
								field: 'PD',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'FIRST_PRODUCTION_DATE',
								displayName: $translate.instant('worktable.FIRST_PRODUCTION_DATE'),
								field: 'firstProductionDate',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'PSDD',
								displayName: $translate.instant('worktable.PSDD'),
								field: 'PSDD',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'PODD',
								displayName: $translate.instant('worktable.PODD'),
								field: 'PODD',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'LAST_PRODUCTION_DATE',
								displayName: $translate.instant('worktable.LAST_PRODUCTION_DATE'),
								field: 'lastProductionDate',
								minWidth: '100',
								enableCellEdit: false
							},
							{
								name: 'ACTUAL_PRODUCTION_QTY',
								displayName: $translate.instant('worktable.ACTUAL_PRODUCTION_QTY'),
								field: 'actualProductionQty',
								minWidth: '100',
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
							scope.gridApi.selection.on.rowSelectionChanged(scope, function(row, event) {
								//行选中事件
								_this.rowSelect(scope, row.Entity);
							});
							scope.gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
							});
						}
					};
				};
				this.initData = function(scope) {

					scope.DailyListData = [{
						"workingNo": "S160GHTT007",
						"bowkerNo": "BB1234",
						"MKTFC": "NA",
						"CUSFC": "NA",
						"documentCategory": "Presell Sample",
						"documentVersion": "PSFW180611",
						"orderType": "Sample",
						"orderCountry": "EU",
						"customerNO": "512006",
						"quantity":"900",
						"leftover": "600",
						"systemResult": "APU008",
						"lastProduction": "APU008",
						"aSource": "APU005",
						"FR_confirmation":"APU005",
						"FR_date":"2017-6-15",
						"firstProductionDate":"2017-6-15",
						"lastProductionDate":"2017-6-15",
						"PODD":"2017-6-15",
						"PSDD":"2017-6-15",
						"PD":"2017-6-15",
						"actualProductionDate":"2017-6-15",
						"actualProductionQty":"1000"
					}, {
						"workingNo": "T3060301",
						"bowkerNo": "BA2345",
						"MKTFC": "2000",
						"CUSFC": "4000",
						"documentCategory": "Presell Sample",
						"documentVersion": "PSFW180611",
						"orderType": "Sample",
						"orderCountry": "EU",
						"customerNO": "512006",
						"quantity":"320",
						"leftover": "452",
						"systemResult": "APU008",
						"lastProduction": "APU008",
						"aSource": "APU005",
						"FR_confirmation":"APU005",
						"FR_date":"2017-6-15",
						"firstProductionDate":"2017-6-15",
						"lastProductionDate":"2017-6-15",
						"PODD":"2017-6-15",
						"PSDD":"2017-6-15",
						"PD":"2017-6-15",
						"actualProductionDate":"2017-6-15",
						"actualProductionQty":"2000"
					}, {
						"workingNo": "JF1607M812",
						"bowkerNo": "BC123452",
						"MKTFC": "NA",
						"CUSFC": "NA",
						"documentCategory": "Presell Sample",
						"documentVersion": "PSFW180611",
						"orderType": "Sample",
						"orderCountry": "EU",
						"customerNO": "512006",
						"quantity":"2000",
						"leftover": "267",
						"systemResult": "APU008",
						"lastProduction": "APU008",
						"aSource": "APU005",
						"FR_confirmation":"APU005",
						"FR_date":"2017-6-15",
						"firstProductionDate":"2017-6-15",
						"lastProductionDate":"2017-6-15",
						"PODD":"2017-6-15",
						"PSDD":"2017-6-15",
						"PD":"2017-6-15",
						"actualProductionDate":"2017-6-15",
						"actualProductionQty":"1234"
					}, {
						"workingNo": "ARWWF16251",
						"bowkerNo": "BBWF16251",
						"MKTFC": "3000",
						"CUSFC": "5000",
						"documentCategory": "Salesman Sample",
						"documentVersion": "SMSFW180611",
						"orderType": "Sample",
						"orderCountry": "EU",
						"customerNO": "512006",
						"quantity":"763",
						"leftover": "1532",
						"systemResult": "APU008",
						"lastProduction": "APU008",
						"aSource": "APU005",
						"FR_confirmation":"APU005",
						"FR_date":"2017-6-15",
						"firstProductionDate":"2017-6-15",
						"lastProductionDate":"2017-6-15",
						"PODD":"2017-6-15",
						"PSDD":"2017-6-15",
						"PD":"2017-6-15",
						"actualProductionDate":"2017-6-15",
						"actualProductionQty":"5612"
					}, {
						"workingNo": "RTW6011S7",
						"bowkerNo": "B6011S7",
						"MKTFC": "4000",
						"CUSFC": "6000",
						"documentCategory": "Salesman Sample",
						"documentVersion": "SMSFW180611",
						"orderType": "Sample",
						"orderCountry": "EU",
						"customerNO": "512006",
						"quantity":"800",
						"leftover": "49",
						"systemResult": "APU008",
						"lastProduction": "APU008",
						"aSource": "APU005",
						"FR_confirmation":"APU005",
						"FR_date":"2017-6-15",
						"firstProductionDate":"2017-6-15",
						"lastProductionDate":"2017-6-15",
						"PODD":"2017-6-15",
						"PSDD":"2017-6-15",
						"PD":"2017-6-15",
						"actualProductionDate":"2017-6-15",
						"actualProductionQty":"842"
					}];

					scope.LC0190ListData = [{
						"workingNo": "S160GHTT007",
						"bowkerNo": "BB1234",
						"MKTFC": "NA",
						"CUSFC": "NA",
						"LC0190NO": "123456",
						"orderCountry": "EU",
						"customerNO": "512006",
						"quantity":"400",
						"leftover": "521",
						"systemResult": "APU008",
						"lastProduction": "APU008",
						"aSource": "APU005",
						"FR_confirmation":"APU005",
						"FR_date":"2017-6-15",
						"firstProductionDate":"2017-6-15",
						"lastProductionDate":"2017-6-15",
						"PODD":"2017-6-15",
						"PSDD":"2017-6-15",
						"PD":"2017-6-15",
						"actualProductionDate":"2017-6-15",
						"actualProductionQty":"512"
					}, {
						"workingNo": "TMS12-M3445SLD",
						"bowkerNo": "BDM3445SLD",
						"MKTFC": "2000",
						"CUSFC": "4000",
						"LC0190NO": "123456",
						"orderCountry": "EU",
						"customerNO": "512006",
						"quantity":"800",
						"leftover": "1290",
						"systemResult": "APU008",
						"lastProduction": "APU008",
						"aSource": "APU005",
						"FR_confirmation":"APU005",
						"FR_date":"2017-6-15",
						"firstProductionDate":"2017-6-15",
						"lastProductionDate":"2017-6-15",
						"PODD":"2017-6-15",
						"PSDD":"2017-6-15",
						"PD":"2017-6-15",
						"actualProductionDate":"2017-6-15",
						"actualProductionQty":"7124"
					}];

					scope.factoryCapacityData = [{
						"factoryName": "BVN",
						"capacity": "333712",
						"fillRate": 98,
						"fabricType":"knit",
						"productType":"JACKET"
					}, {
						"factoryName": "BVN Sample Room",
						"capacity": "33121",
						"fillRate": 94,
						"fabricType":"knit",
						"productType":"PANTS"
					}, {
						"factoryName": "BVG",
						"capacity": "105755",
						"fillRate": 60,
						"fabricType":"woven",
						"productType":"JACKET"
					},{
						"factoryName": "BVG Sample Room",
						"capacity": "10000",
						"fillRate": 84,
						"fabricType":"woven",
						"productType":"TSHIRT(polo)"
					},{
						"factoryName": "BYS",
						"capacity": "171775",
						"fillRate": 70,
						"fabricType":"knit",
						"productType":"TSHIRT"
					},{
						"factoryName": "BVN Sample Room",
						"capacity": "37766",
						"fillRate": 68,
						"fabricType":"knit",
						"productType":"JACKET"
					},{
						"factoryName": "BYS",
						"capacity": "57766",
						"fillRate": 68,
						"fabricType":"woven",
						"productType":"SHORTS"
					},{
						"factoryName": "BCA",
						"capacity": "302668",
						"fillRate": 68,
						"fabricType":"woven",
						"productType":"SWEATER"
					},{
						"factoryName": "BCA Sample Room",
						"capacity": "36991",
						"fillRate": 60,
						"fabricType":"knit",
						"productType":"JACKET"
					},{
						"factoryName": "BCA Sample Room",
						"capacity": "2409",
						"fillRate": 52,
						"fabricType":"knit",
						"productType":"SWEATER"
					},{
						"factoryName": "BCA Sample Room",
						"capacity": "36991",
						"fillRate": 48,
						"fabricType":"knit",
						"productType":"TSHIRT(polo)"
					},{
						"factoryName": "MI Factory",
						"capacity": "100000",
						"fillRate": 41,
						"fabricType":"woven",
						"productType":"GOLF"
					}];
				}






				this.readEDI = function(scope, type, season) {
					var param = {
					}
					GLOBAL_Http($http, "cpo/api/worktable/readEDI?", 'GET', param, function(data) {

					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

                this.getLoading=function(scope,type){
					var year=new Date().getFullYear();
					var month=new Date().getMonth()+1;
					var months = [year + "0" + month+'01', year + "0" + month + '02', year + "0" + (month + 1)+'01',year + "0" + (month + 1)+'02'];
					var param = {
						'in_month': months,
						pageNo: 1,
						pageSize: 10000
					}
					if(type){
						param.fact_load_type=type;
					}
                	GLOBAL_Http($http, "cpo/api/factory/query_factory_loading?", 'GET', param, function(data) {

						if(data.status == 0) {
							if(data.output){
                            scope.factoryCapacityData=data.output;
                            for(var i=0;i<scope.factoryCapacityData.length;i++){
									var factoryCapacity=scope.factoryCapacityData[i];
									for(var j=0;j<factoryCapacity.factoryMonthLoadings.length;j++){
									factoryCapacity[('capacity'+j)]=factoryCapacity.factoryMonthLoadings[j].capacity;
									factoryCapacity[('fillRate'+j)]=factoryCapacity.factoryMonthLoadings[j].fillRate;
								   }
							}
                            }else{
                            	scope.factoryCapacityData=[];
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
				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;
					scope.activeTab = 1;
					scope.TimeModel = new Date().Format("yyyy-MM");
					scope.showView = 'DailyDocument';
					scope.backGroundTemplate = document.getElementById("blueGreenTemplate").innerText;
					scope.isNewTemplate = document.getElementById("isNewTemplate").innerText;
					scope.page = {
						curPage: 1,
						pageSize: 10,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.dailyDocumentData = [];
					scope.LC0190DocumentData = [];
//					this.readEDI(scope);
					this.initData(scope);
					// this.initGripOptionZero(scope);
					this.initGripOptionOne(scope);
          this.initGripOptionTwo(scope);
					// this.initGripOptionThree(scope);
					// this.initGripOptionFour(scope);
					this.getSelectedData(scope);
					this.getLoading(scope);
				};
			}
		])
		.controller('assignmentHistoryCtrl', ['$scope', 'assignmentHistoryService',
			function($scope, assignmentHistoryService) {
				$scope.selectTab = function(Tab) {
					assignmentHistoryService.selectTab($scope, Tab);
				}
				$scope.getLoading = function(type) {
					assignmentHistoryService.getLoading($scope, type);
				}

				$scope.toUpload = function(file, entity) {
					if(file) {
						assignmentHistoryService.toUpload($scope, file, entity);
					}
				};
				assignmentHistoryService.init($scope);
			}
		])
})();
