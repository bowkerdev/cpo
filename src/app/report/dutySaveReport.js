(function() {
	'use strict';
	angular
		.module('cpo')
		.service('dutySaveReportService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
				this.getTitle = function(scope,list){
					var columnDefs = []
					for(var i = 0; i < list.length; i++){
						columnDefs.push({
								name: list[i].fieldName,
								displayName: list[i].exportColumnName,
								field: list[i].fieldName,
								minWidth: '120',
								enableCellEdit: false,
								pinnedLeft: true
							})
          }
					return columnDefs
				}


				this.searchlist = function(scope){
					var _this = this;
					scope.page.pageSize=20;
					scope.page.curPage=1;

					_this.getdutySaveReport(scope);
				}

				this.getdutySaveReport = function(scope) {
          // var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope,'customerforcast_report_1',false,null,null);
          // console.log(staticColumns)
          // scope.gridOptionsduty.columnDefs = staticColumns;
					var _this = this
          scope.customerReportOne = [];
					var param = {
						pageSize: scope.page.pageSize,
						pageNo: scope.page.curPage
          };
          if(scope.queryType){
            param.queryType=scope.queryType
          }
				scope.gridOptionsduty.showLoading = true;
					GLOBAL_Http($http, "cpo/api/duty_save_report/query_dutySave_report?", 'GET', param, function(data) {
            scope.gridOptionsduty.showLoading = false;
						if(data.output) {
              var columnDefs = _this.getTitle(scope,data.output[(scope.tabIndex=='EU'?'CAME':scope.tabIndex) +'Header'])
              scope.gridOptionsduty.columnDefs = columnDefs
              scope.fillRateReportData = _this.formateData((scope.tabIndex=='EU'?'CAME':scope.tabIndex),data.output.data)
						} else {
						//	modalAlert(CommonService, 3, data.message, null);
						}
					}, function(data) {
            scope.gridOptionsduty.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				};

        this.initGripOption = function(scope) {
					var _this = this;
          // var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope,'customerforcast_report_1',false,null,null);
          scope.fillRateReportData = []
					scope.gridOptionsduty = {
						data: 'fillRateReportData',
            paginationPageSizes: [10, 20, 30, 40, 50],
						paginationPageSize: 10,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
            enableSorting: false,
            rowHeight: 40,
						enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						useExternalPagination: true,
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
                _this.fetchTabInfo(scope)
                // if (_this.tabindex == 1) {
                //   _this.gettransferReport(scope);
                // } else if (_this.tabindex == 2) {
                //   _this.getOpenFCSummaryReport(scope);
                // } else if (_this.tabindex == 3) {
                //   _this.getFCSummaryReport(scope);
                // }

              });
            }
					};

        }
        this.formateData = function(tabIndex,obj){
          var list = []
          for(var key in obj){
						
							var o = obj[key][tabIndex]
							if(o[0].loading){
								o[0].loading = parseInt(o[0].loading)
							}
							if(o[0].capacity){
								o[0].capacity = parseInt(o[0].capacity)
							}
							if(o[0].totalQty){
								o[0].totalQty = parseInt(o[0].totalQty)
							}
							if(o[0].factoryCountryQuantity){
								o[0].factoryCountryQuantity = parseInt(o[0].factoryCountryQuantity)
							}
							if(o[0].factoryCountryQuantityByFactoryCode){
								o[0].factoryCountryQuantityByFactoryCode = parseInt(o[0].factoryCountryQuantityByFactoryCode)
							}
              list.push(o[0])
					}
          return list
        }
        this.fetchInfo = function(scope,tabIndex,queryType){
          if(tabIndex){
            scope.tabIndex = tabIndex
          }
          if(queryType){
            scope.queryType = queryType
          }
          scope.showLoading=true
          this.getdutySaveReport(scope)
        }

				/**
				 * init
				 */
				this.init = function(scope) {
					scope.showLoading = false
					scope.tabIndex = 'EU'
					// 初期化
					var _this = this;
					scope.page = {
						curPage: 1,
						pageSize: 20,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};

					scope.headerList = [];
//					_this.getSeasonList(scope);
					scope.customerReportOne = [];
					_this.initGripOption(scope)
					_this.getdutySaveReport(scope)
        //  _this.getOpenFCSummaryReport(scope);
				};
			}
		])
		.controller('dutySaveReportCtrl', ['$scope', 'dutySaveReportService',
			function($scope, dutySaveReportService) {
        $scope.exportFile = function () {
          dutySaveReportService.exportFile($scope);
        }
		  $scope.fetchInfo = function(str,querySeason){

        // dutySaveReportService.resetPageInfo($scope);
        dutySaveReportService.fetchInfo($scope,str,querySeason)
				// console.log(str)
		    //  if(str=='EU'){
        //    dutySaveReportService.getdutySaveReport($scope);
        //  }else if(str=='CHINA'){
        //    dutySaveReportService.getOpenFCSummaryReport($scope);
        //  }
      }
				$scope.searchlist = function() {
					dutySaveReportService.searchlist($scope);
				}
				dutySaveReportService.init($scope);
			}
		])
})();
