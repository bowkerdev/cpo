(function() {
	'use strict';
	angular
		.module('cpo')
		.service('MarketingForecastReportService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {

		    this.exportFile = function(scope){

        if(!scope.searchRequest.mkfc){
          modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
          return;
        }
          var param = {
            pageSize:100000,
            pageNo:1,
            document_id:scope.searchRequest.mkfc.value
          };
          switch (scope.tabIndex){
            case 1:
              param.documentType = '4003';
              break;
            case 2:
              param.documentType = '4004';
              break;
            case 3:
              param.documentType = '4005';
              break;
            case 4:
              param.documentType = '4006';
              break;
          }
          exportExcel(param, "cpo/portal/document/export_file?", "_blank");
          // CommonService.showLoadingView("Exporting...");
          // GLOBAL_Http($http, "cpo/portal/document/check_record_count?", 'GET', param, function(data) {
          //   CommonService.hideLoadingView();
          //   if(data.status == 0) {
          //     if(parseInt(data.message) > 0) {
          //       exportExcel(param, "cpo/portal/document/export_file?", "_blank");
          //     } else {
          //       modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
          //     }
          //   }
          // }, function(data) {
          //   CommonService.hideLoadingView();
          //   modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          // });

        //  exportExcel(param, "cpo/portal/document/export_file?", "_blank");
      }
		  this.fetchDocs = function(scope){
		    var _this= this;
        var param = {
          in_code: 'CAPACITYMKTFC'
        }
        GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {

          if(data.CAPACITYMKTFC)	{

            scope.mkfcs = data.CAPACITYMKTFC;

            for ( var i = 0 ; i < scope.mkfcs.length ; i++ ) {
              scope.mkfcs[ i ].id = scope.mkfcs[ i ].value;
              scope.mkfcs[ i ].label = scope.mkfcs[ i ].label.split(' ')[ 0 ];
            }
            scope.searchRequest.mkfc = scope.mkfcs[ 0 ] ? scope.mkfcs[ 0 ] : null;
            _this.fetchInfo(scope,scope.tabIndex);
          }

        }, function(data) {
          modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
        });
      }
        this.fetchInfo = function ( scope,tabIndex ) {
          scope.tabIndex = tabIndex;
          var requestURL = "";
            switch (tabIndex){
              case 1:
                requestURL ="cpo/api/marketing_report/query_marketing_report_by_product?";
                break;
              case 2:
                requestURL ="cpo/api/marketing_report/query_marketing_report_by_product_by_season?";
                break;
              case 3:
                requestURL ="cpo/api/marketing_report/query_marketing_report_by_range_by_factory?";
                break;
              case 4:
                requestURL ="cpo/api/marketing_report/query_marketing_report_by_range_by_season?";
                 break;
            }

          if(!scope.searchRequest.mkfc){
            return;
          }
          var param = {document_id: scope.searchRequest.mkfc.value};
          scope.gridOptions.showLoading = true;
          GLOBAL_Http($http, requestURL, 'GET', param, function(data) {
            scope.gridOptions.showLoading = false;
            if(data.status){

              var headers = [];

              for ( var key in data.headers ) {
                var content = data.headers[ key ];
                var item = {
                  name : key ,
                  displayName : (key.split("S-").length>=2)?key.split("S-")[1]:key ,
                  field : content ,
                  minWidth : '120',
                  visible:!CommonService.columnHasHide( scope.gridOptions.zsGridName,key),
                };
                headers.push(item);
              }
              scope.gridOptions.columnDefs = headers;
              scope.marketingReportGridItems = data.output;
            }

          });

        }

				this.initMarketingReportGrid = function(scope) {
					var _this = this;
					scope.gridOptions = {
						data: 'marketingReportGridItems',
						paginationPageSizes: [1000],
						paginationPageSize: 1000,
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
						columnDefs: [],
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
          scope.searchRequest = {
            mkfc:null
          };
					scope.marketingReportGridItems = [];
          scope.tabIndex = 0;
          this.initMarketingReportGrid(scope);
          this.fetchDocs(scope);

				};

			}
		])
		.controller('marketingForecastReportCtrl', ['$scope', 'MarketingForecastReportService',
			function($scope, MarketingForecastReportService) {
				MarketingForecastReportService.init($scope);
        $scope.changeDoc = function(){
          MarketingForecastReportService.fetchInfo($scope,$scope.tabIndex);
        }
        $scope.fetchInfo = function(tabIndex){

          MarketingForecastReportService.fetchInfo($scope,tabIndex);

        }
        $scope.exportFile = function ( ) {
          MarketingForecastReportService.exportFile($scope);
        }
			}
		])
})();
