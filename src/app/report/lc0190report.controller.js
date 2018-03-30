(function() {
	'use strict';
	angular
		.module('cpo')
		.service('lc0190ReportService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
				this.tabindex = 1;
				this.exportFile = function(scope, param) {

					if(!scope.customerReportOne || scope.customerReportOne.length == 0) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
						return;
					}

					if(this.tabindex == 1) {
						!param ? param = {
							"documentType": 5001
						} : param.documentType = 5001;
					} else if(this.tabindex == 2) {
						!param ? param = {
							"documentType": 5002
						} : param.documentType = 5002;
					} else
					if(this.tabindex == 3) {
						!param ? param = {
							"documentType": 5003
						} : param.documentType = 5003;
					} else if(this.tabindex == 4) {
						!param ? param = {
							"documentType": 5004
						} : param.documentType = 5004;
					}

					exportExcel(param, "cpo/portal/document/export_file?", "_blank");
				}
				this.getlc0190BulkBySMVReport = function(scope, param) {
					scope.customerReportOne = [];
					scope.gridOptions.columnDefs = [];
					scope.gridOptions.showLoading = true;
					GLOBAL_Http($http, "cpo/api/customer_po_report/query_bulk_order_report_by_smv?", 'GET', param, function(data) {
						if(data.jsonExportEntries) {
							var headers = [];
							angular.forEach(data.jsonExportEntries, function(item, index) {
								headers.push({
									name: (item.headerName ? item.headerName : "") + index,
									displayName: item.headerName,
									field: item.jsonObjectKey,
									width: '150'
								})
							});
							scope.gridOptions.columnDefs = angular.copy(headers);
						}
						if(data.output) {
							data.output = translateData(data.output);
							scope.customerReportOne = data.output;
						} else {

						}
						scope.gridOptions.showLoading = false;
					}, function(data) {
						scope.gridOptions.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.getlc0190BulkByQtyReport = function(scope, param) {
					scope.customerReportOne = [];
					scope.gridOptions.columnDefs = [];
					scope.gridOptions.showLoading = true;

					GLOBAL_Http($http, "cpo/api/customer_po_report/query_bulk_order_report_by_qty?", 'GET', param, function(data) {
						if(data.jsonExportEntries) {
							var headers = [];
							angular.forEach(data.jsonExportEntries, function(item, index) {
								headers.push({
									name: (item.headerName ? item.headerName : "") + index,
									displayName: item.headerName,
									field: item.jsonObjectKey,
									width: '150'
								})
							});
							scope.gridOptions.columnDefs = angular.copy(headers);
						}
						if(data.output) {
							data.output = translateData(data.output);
							scope.customerReportOne = data.output;
						} else {

						}
						scope.gridOptions.showLoading = false;
					}, function(data) {
						scope.gridOptions.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				};
				this.getlc0190ProductByQtyReport = function(scope, param) {
					scope.customerReportOne = [];
					scope.gridOptions.columnDefs = [];
					scope.gridOptions.showLoading = true;

					GLOBAL_Http($http, "cpo/api/customer_po_report/query_bulk_order_report_by_product_by_qty?", 'GET', param, function(data) {
						if(data.jsonExportEntries) {
							var headers = [];
							angular.forEach(data.jsonExportEntries, function(item, index) {
								headers.push({
									name: (item.headerName ? item.headerName : "") + index,
									displayName: item.headerName,
									field: item.jsonObjectKey,
									width: '150'
								})
							});
							scope.gridOptions.columnDefs = angular.copy(headers);
						}
						if(data.output) {
							data.output = translateData(data.output);
							scope.customerReportOne = data.output;
						} else {

						}
						scope.gridOptions.showLoading = false;
					}, function(data) {
						scope.gridOptions.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				};

				this.getlc0190BondingTPULaserOrderReport = function(scope, param) {
					scope.customerReportOne = [];
					scope.gridOptions.columnDefs = [];
					scope.gridOptions.showLoading = true;

					GLOBAL_Http($http, "cpo/api/customer_po_report/query_bulk_order_report_by_process?", 'GET', param, function(data) {
						if(data.jsonExportEntries) {
							var headers = [];
							angular.forEach(data.jsonExportEntries, function(item, index) {
								headers.push({
									name: (item.headerName ? item.headerName : "") + index,
									displayName: item.headerName,
									field: item.jsonObjectKey,
									width: '150'
								})
							});
							scope.gridOptions.columnDefs = angular.copy(headers);
						}
						if(data.output) {
							data.output = translateData(data.output);
							scope.customerReportOne = data.output;
						} else {

						}
						scope.gridOptions.showLoading = false;
					}, function(data) {
						scope.gridOptions.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				};

				this.searchlist = function(scope) {
					var _this = this;
					var param = _this.getDateArray(scope);

					if(null == param) {

					} else {
						if(this.tabindex == 1) {
							_this.getlc0190BulkBySMVReport(scope, param);
						} else if(this.tabindex == 2) {
							_this.getlc0190BulkByQtyReport(scope, param);
						} else if(this.tabindex == 3) {
							_this.getlc0190ProductByQtyReport(scope, param);
						} else if(this.tabindex == 4) {
							_this.getlc0190BondingTPULaserOrderReport(scope, param);
						}
					}
				}

				this.getDateArray = function(scope) {
					var param = new Array();
					if(scope.fromMonth && scope.toMonth) {
						var fromDateArray = scope.fromMonth.split('-');
						var toDateArray = scope.toMonth.split('-');
						var fromYear;
						var fromMonth;
						var toYear;
						var toMonth;
						if(fromDateArray && fromDateArray.length > 1) {
							fromYear = fromDateArray[0];
							fromMonth = fromDateArray[1];
						} else {
							return null;
						}

						if(toDateArray && toDateArray.length > 1) {
							toYear = toDateArray[0];
							toMonth = toDateArray[1];
						} else {
							return null;
						}

						if(fromYear == toYear) {
							for(var month = fromMonth; month <= toMonth && month <= 12; month++) {
								param.push(fromYear.toString() + (month.toString().length <= 1 ? ("0" + month.toString()) : month.toString()));
							}
						} else {
							for(var year = fromYear; year <= toYear; year++) {
								if(year == fromYear) {
									for(var month = fromMonth; month <= 12; month++) {
										param.push(year.toString() + (month.toString().length <= 1 ? ("0" + month.toString()) : month.toString()));
									}
								} else if(year == toYear) {
									for(var month = 1; month <= toMonth && month <= 12; month++) {
										param.push(year.toString() + (month.toString().length <= 1 ? ("0" + month.toString()) : month.toString()));
									}
								} else {
									for(var month = 1; month <= 12; month++) {
										param.push(year.toString() + (month.toString().length <= 1 ? ("0" + month.toString()) : month.toString()));
									}
								}
							}
						}

						if(param && param.length) {
							return {
								"in_month": param.join(',')
							}
						} else {
							return null;
						}
					} else if((!scope.fromMonth && scope.toMonth) || (scope.fromMonth && !scope.toMonth)) {
						return null;
					} else {
						return {};
					}
				}

				this.initCustomerReportOne = function(scope) {
					var _this = this;
					scope.gridOptions = {
						data: 'customerReportOne',
						rowEditWaitInterval: -1,
						enableRowSelection: false,
						enableRowHeaderSelection: false,
						enableColumnMenus: false,
						enableGridMenu: false,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						enableVerticalScrollbar: 1,
						enablePaginationControls: false,
						showLoading: true,
						onRegisterApi: function(gridApi) {
							scope.gridApi = gridApi;
						}
					};

				}

				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;

					scope.customerReportOne = [];
					_this.initCustomerReportOne(scope);
				};
			}
		])
		.controller('lc0190reportCtrl', ['$scope', 'lc0190ReportService',
			function($scope, lc0190ReportService) {
				$scope.exportFile = function() {
					lc0190ReportService.exportFile($scope, lc0190ReportService.getDateArray($scope));
				}
				$scope.fetchInfo = function(index) {
					lc0190ReportService.tabindex = index;
					if(index == 1) {
						lc0190ReportService.getlc0190BulkBySMVReport($scope);
					} else if(index == 2) {
						lc0190ReportService.getlc0190BulkByQtyReport($scope);
					} else if(index == 3) {
						lc0190ReportService.getlc0190ProductByQtyReport($scope);
					} else if(index == 4) {
						lc0190ReportService.getlc0190BondingTPULaserOrderReport($scope);
					}
				}
				$scope.searchlist = function() {
					lc0190ReportService.searchlist($scope);
				}
				lc0190ReportService.init($scope);
			}
		])
})();