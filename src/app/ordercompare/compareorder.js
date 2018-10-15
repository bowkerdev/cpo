(function() {
  'use strict';
  angular
    .module('cpo')
    .service('orderCompareService', ['$http', '$translate', 'CommonService', '$uibModal',
      function($http, $translate, CommonService, $uibModal) {
        /**
         * init
         */
        this.init = function(scope) {
          // 初期化
          var _this = this;
          scope.gridOptions = {
            data: 'items',
            paginationPageSizes: [10, 20, 30, 40, 50],
            paginationPageSize: 10,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableRowHeaderSelection: true,
            enableColumnMenus: true,
						enableGridMenu: true,
            enableSorting: true,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            totalItems: scope.page.totalNum,
            useExternalPagination: true,
            columnDefs: []
          };
        };
        
        this.getCompareOrder = function(scope) {
					var param = {};

					if(scope.selectDoc && scope.selectDoc.id) {
						param.eq_document_id = scope.selectDoc.id;
					}
					for(var attr in searchKey5) {
							if(searchKey5[attr]) {
								param[attr] = urlCharTransfer(searchKey5[attr]);
							}
					}
					var _this = this;
					scope.showLoading = true;
					var staticColumns = workTableCommonService.constructeAssignmentStaticColumns(scope, "bulkorder_new", true, 100);
					GLOBAL_Http($http, "cpo/api/worktable/query_lo_order_compare?", 'POST', param, function(data) {

						if(status == '4') {
							scope.gridOptions5.showLoading = false;
							scope.navList[2].loading = false;
						} else if(status == '5') {
							scope.gridOptions6.showLoading = false;
							scope.navList[3].loading = false;
						}

						if(data.status == 0) {
							if(data.output) {
								if(status == '4') {
									scope.gridOptions5.data = translateData(data.output);
									scope.gridOptions5.columnDefs = angular.copy(staticColumns);
									scope.navList[2].count = data.totalCount ? data.totalCount : "0";
									workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions5);

									if(scope.gridOptions5.data && scope.gridOptions5.data.length > 0) {
										for(var index in scope.gridOptions5.data) {
											var item = scope.gridOptions5.data[index];
											var manufacturingSize = item.ediOrderSizes;
											if(manufacturingSize) {
												for(var index2 = 0; index2 < manufacturingSize.length; index2++) {
													var xx = manufacturingSize[index2];

													if(xx) {
														item["OQTY_" + (index2 + 1)] = xx.sizeQuantity ? xx.sizeQuantity : "";
														item["TS_" + (index2 + 1)] = xx.manufacturingSize ? xx.manufacturingSize : "";
														item['SIZENAME_' + (index2 + 1)] = xx.sizeName ? xx.sizeName : "";
														item["unitPrice_" + (index2 + 1)] = xx.unitPrice ? xx.unitPrice : "";
													}
												}
											}
										}
									}
									scope.page4.totalNum = data.total;
									scope.gridOptions5.totalItems = scope.page4.totalNum;
									scope.tabStatus.tabIndex1 = true;
								} else if(status == '5') {
									scope.gridOptions6.data = translateData(data.output);
									scope.gridOptions6.columnDefs = angular.copy(staticColumns);

									workTableCommonService.bulkorderDynamicColumns(data.sizeListCount, scope.gridOptions6);

									if(scope.gridOptions6.data && scope.gridOptions6.data.length > 0) {
										for(var index in scope.gridOptions6.data) {
											var item = scope.gridOptions6.data[index];
											var manufacturingSize = item.ediOrderSizes;
											if(manufacturingSize) {
												for(var index2 = 0; index2 < manufacturingSize.length; index2++) {
													var xx = manufacturingSize[index2];

													if(xx) {
														item["OQTY_" + (index2 + 1)] = xx.sizeQuantity ? xx.sizeQuantity : "";
														item["TS_" + (index2 + 1)] = xx.manufacturingSize ? xx.manufacturingSize : "";
														item['SIZENAME_' + (index2 + 1)] = xx.sizeName ? xx.sizeName : "";
														item["unitPrice_" + (index2 + 1)] = xx.unitPrice ? xx.unitPrice : "";
													}
												}
											}
										}
									}
									scope.page5.totalNum = data.total;
									scope.navList[3].count = data.totalCount ? data.totalCount : "0";
									scope.gridOptions6.totalItems = scope.page5.totalNum;
									scope.tabStatus.tabIndex1 = true;
								}

							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						if(status == '4') {
							scope.gridOptions5.showLoading = false;
						} else if(status == '5') {
							scope.gridOptions6.showLoading = false;
						}
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}
      }
    ])
    .controller('orderCompareCtrl', ['$scope', 'orderCompareService',
      function($scope, orderCompareService) {
        orderCompareService.init($scope);
      }
    ])
})();
