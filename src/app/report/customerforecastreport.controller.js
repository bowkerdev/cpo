(function() {
	'use strict';
	angular
		.module('cpo')
		.service('CustomerForecastReportService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
		  this.selectBatchDate = function ( scope ) {
        if(scope.tabIndex==1){
          this.getCustomerForecastReport(scope);
        }else if(scope.tabIndex==2){
          this.getOpenFCSummaryReport(scope);
        }else if(scope.tabIndex==3){
          this.getFCSummaryReport(scope);
        }
      }
        this.fetchBatchDates = function(scope){
          var _this= this;
          var param = {
            in_code: 'CAPACITYCUSFCREPORTBATCHDATE'
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {

            if(data.CAPACITYCUSFCREPORTBATCHDATE)	{

              scope.cuss = data.CAPACITYCUSFCREPORTBATCHDATE;

              for ( var i = 0 ; i < scope.cuss.length ; i++ ) {
                scope.cuss[ i ].id = scope.cuss[ i ].value;
                scope.cuss[ i ].label = scope.cuss[ i ].label.split(' ')[ 0 ];
              }
              if(scope.searchRequest.cus != null){
              	for(var j = 0 ;j < scope.cuss.length;j++){
              		if(scope.cuss[j].id == scope.searchRequest.cus.id){
              			scope.searchRequest.cus = scope.cuss[ j ] ? scope.cuss[ j ] : null;
              		}
              	}
              }
              if(scope.searchRequest.cus == null){
              	scope.searchRequest.cus = scope.cuss[ 0 ] ? scope.cuss[ 0 ] : null;
              }
              
              _this.selectBatchDate(scope);

            }

          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.exportFile = function (scope) {

          if(!scope.reportItems || scope.reportItems.length==0){
            modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
            return;
          }
          var param = {
          	pageSize:100000,
          	pageNo:1
          };
          if(scope.tabIndex==1){
            param.documentType=501;
            param.document_id=scope.searchRequest.cus.value;
          }else if(scope.tabIndex==2){
            param.documentType=502;
            param.document_id=scope.searchRequest.cus.value;
          }else if(scope.tabIndex==3){
            param.documentType=503;
            param.document_id=scope.searchRequest.cus.value;
          }else if(scope.tabIndex==4){
            param.documentType=2001;
            param.document_id = scope.actualOpenFCSummaryReportDocumentId;
            if(scope.searchRequest.searchWorkingNo){
              param.like_workingNo = scope.searchRequest.searchWorkingNo;
            }
          }

        //  exportExcel(param, "cpo/portal/document/export_file?", "_blank");
          CommonService.showLoadingView("Exporting...");
          GLOBAL_Http($http, "cpo/portal/document/check_record_count?", 'GET', param, function(data) {
            CommonService.hideLoadingView();
            if(data.status == 0) {
              if(parseInt(data.message) > 0) {
                exportExcel(param, "cpo/portal/document/export_file?", "_blank");
              } else {
                modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
              }
            }
          }, function(data) {
            CommonService.hideLoadingView();
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

        }
        this.resetPageInfo = function(scope){

          scope.page = {
            curPage: 1,
            pageSize: 20,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.headerList = new Array();
          scope.gridOptions.paginationCurrentPage =1;
        }

				this.getCustomerForecastReport = function(scope) {

          var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope,'customerforcast_report_1',false,null,null);
          scope.gridOptions.columnDefs = staticColumns;
          scope.reportItems = [];
					var param = {
						pageSize: scope.page.pageSize,
						pageNo: scope.page.curPage
					};
					if(!scope.searchRequest.cus.value){
					  return;
          }
          param.document_id = scope.searchRequest.cus.value;
					if(scope.workingNo){
						param['workingNo']=scope.workingNo;
					}
					if(scope.productType){
						param['productType']=scope.productType;
					}

					GLOBAL_Http($http, "cpo/api/customer_report/query_customer_report?", 'GET', param, function(data) {

						if(data.output) {
              if(scope.tabIndex!=1){
                return;
              }
							// var height = (scope.page.pageSize * 30) + 36;
							// $("#customerForecastReportOne").css('height', height + 'px');
							scope.reportItems = data.output;
							scope.page.totalNum = data.total;
							scope.gridOptions.totalItems = scope.page.totalNum;
              scope.headerList = [];
							if(scope.headerList.length == 0) {
								scope.headerList = data.headerList;
								var headerList = scope.headerList;
								var header = [];
								for(var i = 0; i < headerList.length; i++) {
									var hea = headerList[i];
									if(hea.indexOf("20") > -1) {
										var sub = hea.substring(0, 6);
										if(header.indexOf(sub) < 0) {
											header.push(sub);
										}
									}
								}
								header.sort();
								for(var i = 0; i < header.length; i++) {
									var header1 = header[i] + "  Forecast Quantity";
									var header2 = header[i] + "  Open Forecast Quantity";
									var header3 = header[i] + "  Order Quantity";
									var header4 = header[i] + "  PV Quantity";
									var column1 = {
										name: header1,
										displayName: header1,
										field: header1,
										minWidth: '150',
										enableCellEdit: false
									};
									var column2 = {
										name: header2,
										displayName: header2,
										field: header2,
										minWidth: '150',
										enableCellEdit: false
									};
									var column3 = {
										name: header3,
										displayName: header3,
										field: header3,
										minWidth: '150',
										enableCellEdit: false
									};
									var column4 = {
										name: header4,
										displayName: header4,
										field: header4,
										minWidth: '150',
										enableCellEdit: false
									};
									scope.gridOptions.columnDefs.push(column1);
									scope.gridOptions.columnDefs.push(column2);
									scope.gridOptions.columnDefs.push(column3);
									scope.gridOptions.columnDefs.push(column4);
								}
							}
						} else {
						//	modalAlert(CommonService, 3, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				};
        this.getOpenFCSummaryReport   =  function(scope){
          var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope,'customerforcast_report_2',false,null,null);
          scope.gridOptions.columnDefs = staticColumns;
          scope.reportItems = [];

          var param = {
            pageSize: scope.page.pageSize,
            pageNo: scope.page.curPage
          };

          if(!scope.searchRequest.cus.value){
            return;
          }
          param.document_id = scope.searchRequest.cus.value;

          if(scope.workingNo){
            param['workingNo']=scope.workingNo;
          }
          if(scope.productType){
            param['productType']=scope.productType;
          }

          GLOBAL_Http($http, "cpo/api/customer_report/query_customer_forecast_report_by_working_no_and_sct?", 'GET', param, function(data) {

            if(data.output) {
              if(scope.tabIndex!=2){
                return;
              }
              scope.headerList = data.headerList;

              // var height = (scope.page.pageSize * 30) + 36;
              // $("#customerForecastReportOne").css('height', height + 'px');

              scope.page.totalNum = data.total;
              scope.gridOptions.totalItems = scope.page.totalNum;

              for(var i = 0; i < scope.headerList.length; i++) {
                var header = scope.headerList[i] ;

                var column = {
                  name: header,
                  displayName: header,
                  field: header,
                  minWidth: '150',
                  enableCellEdit: false
                };
                scope.gridOptions.columnDefs.push(column);
              }
              var result = data.output;
              angular.forEach(result, function(item,index,array){

                angular.forEach(item.monthlyQuantities, function(item2,index,array){
                  item[item2.month]= item2.qty;

                })
              })
              scope.reportItems = result;

            } else {
            //  modalAlert(CommonService, 3, data.message, null);
            }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        };
        this.getFCSummaryReport   =  function(scope){
          var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope,'customerforcast_report_3',false,null,null);
          scope.gridOptions.columnDefs = staticColumns;
          scope.reportItems = [];

          var param = {
            pageSize: scope.page.pageSize,
            pageNo: scope.page.curPage
          };
          if(!scope.searchRequest.cus.value){
            return;
          }
          param.document_id = scope.searchRequest.cus.value;

          if(scope.workingNo){
            param['workingNo']=scope.workingNo;
          }
          if(scope.productType){
            param['productType']=scope.productType;
          }
          //
          //
          GLOBAL_Http($http, "cpo/api/customer_report/query_customer_forecast_report_by_working_no?", 'GET', param, function(data) {

            if(data.output) {
              if(scope.tabIndex!=3){
                return;
              }
              scope.headerList = data.headerList;
              // var height = (scope.page.pageSize * 30) + 36;
              // $("#customerForecastReportOne").css('height', height + 'px');

           //   scope.reportItems = data.output;
              scope.page.totalNum = data.total;
              scope.gridOptions.totalItems = scope.page.totalNum;

              for(var i = 0; i < scope.headerList.length; i++) {
                var header = scope.headerList[i] ;

                var column = {
                  name: header,
                  displayName: header,
                  field: header,
                  minWidth: '150',
                  enableCellEdit: false
                };
                scope.gridOptions.columnDefs.push(column);
              }
              var result = data.output;
              angular.forEach(result, function(item,index,array){

                angular.forEach(item.monthlyQuantities, function(item2,index,array){
                  item[item2.month]= item2.qty;

                })
              })
              scope.reportItems = result;

            } else {
           //   modalAlert(CommonService, 3, data.message, null);
            }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        };
        this.getActualOpenFCSummaryReport = function(scope){

          var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope,'actual_open_fc_sumary_report',false,null,null,true);
          scope.gridOptions.columnDefs = staticColumns;
          scope.reportItems = [];
          var param = {
            document_id:scope.actualOpenFCSummaryReportDocumentId
          };
          if(scope.searchRequest.searchWorkingNo){
            param.like_workingNo = scope.searchRequest.searchWorkingNo;
          }

          GLOBAL_Http($http, "cpo/api/customer_report/query_customer_forecast_deduction_report?", 'GET', param, function(data) {
            if(scope.tabIndex!=4){
              return;
            }
            scope.page.totalNum = data.output.length;
            scope.gridOptions.totalItems = scope.page.totalNum;

            scope.reportItems =  data.output;

          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
				this.searchlist = function(scope){
					var _this = this;
					scope.page.pageSize=20;
					scope.page.curPage=1;

					_this.getCustomerForecastReport(scope);
				}
        this.selectDocumentChanged = function(scope){
            scope.actualOpenFCSummaryReportDocumentId = scope.searchRequest.selectDoc.id;

            this.getActualOpenFCSummaryReport(scope);
        }
        this.getCustomerForecastDocuments = function(scope) {
          var _this = this;
          var param={
            in_code:"CUSFCREPORTBYSUMMARY"
          }
          var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope,'actual_open_fc_sumary_report',false,null,null,true);
          scope.gridOptions.columnDefs = staticColumns;
          scope.reportItems = [];
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {

            if(data.CUSFCREPORTBYSUMMARY){
              scope.docs = data.CUSFCREPORTBYSUMMARY;
              for(var i=0;i<scope.docs.length;i++){
                scope.docs[i].id=scope.docs[i].value;
                scope.docs[i].label = scope.docs[i].label.split(' ')[0];
              }
              scope.searchRequest.selectDoc =  scope.docs[0];
              _this.selectDocumentChanged(scope);
            }else{
              scope.docs = [];
            }
          });




        }
				this.initCustomerReport = function(scope) {
					var _this = this;

          var staticColumns = CommonService.constructeStaticColumnsFromJSON(scope,'customerforcast_report_1',false,null,null);
					scope.gridOptions = {
						data: 'reportItems',
						paginationPageSizes: [20, 30, 40, 50, 100],
						paginationPageSize: 20,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
            flatEntityAccess:true,
            fastWatch: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						useExternalPagination: true,
            enablePagination:true,
            enablePaginationControls:true,

						columnDefs: staticColumns,
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

                if(scope.tabIndex==1){
                  _this.getCustomerForecastReport(scope);
                }else if(scope.tabIndex==2){
                  _this.getOpenFCSummaryReport(scope);
                }else if(scope.tabIndex==3){
                  _this.getFCSummaryReport(scope);
                }

							});
						}
					};

				}

				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;
          scope.tabIndex = 1;
          scope.searchRequest = {
            selectDoc:{},
            searchWorkingNo:""
          };
          scope.actualOpenFCSummaryReportDocumentId = 0;
					scope.page = {
						curPage: 1,
						pageSize: 20,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};

					scope.headerList = [];
//					_this.getSeasonList(scope);
					scope.reportItems = [];
					_this.initCustomerReport(scope);
				//	_this.getCustomerForecastReport(scope);
        //  _this.getOpenFCSummaryReport(scope);
				};
			}
		])
		.controller('customerForecastReportCtrl', ['$scope', 'CustomerForecastReportService',
			function($scope, CustomerForecastReportService) {
        $scope.exportFile = function () {
          CustomerForecastReportService.exportFile($scope);

        }
		  $scope.fetchInfo = function(index){
        $scope.tabIndex = index;
        $scope.gridOptions.useExternalPagination = true;
     //   CustomerForecastReportService.tabIndex = index;
        CustomerForecastReportService.resetPageInfo($scope);
       // CustomerForecastReportService.fetchBatchDates($scope);

        if(index!=4){
          CustomerForecastReportService.fetchBatchDates($scope);
        }else if(index==4){
          $scope.gridOptions.useExternalPagination = false;
          CustomerForecastReportService.getCustomerForecastDocuments($scope);
        }

		  //    if(index==1){
         //   CustomerForecastReportService.getCustomerForecastReport($scope);
         // }else if(index==2){
         //   CustomerForecastReportService.getOpenFCSummaryReport($scope);
         // }else if(index==3){
         //   CustomerForecastReportService.getFCSummaryReport($scope);
         // }else if(index==4){
         // //  CustomerForecastReportService.getActualOpenFCSummaryReport($scope);
         //   $scope.gridOptions.useExternalPagination = false;
         //
         //   CustomerForecastReportService.getCustomerForecastDocuments($scope);
         // }
      }
      $scope.searchActualOpenForecast = function(){
        CustomerForecastReportService.resetPageInfo($scope);
        CustomerForecastReportService.getActualOpenFCSummaryReport($scope);
      }
        $scope.selectBatchDate = function() {
          CustomerForecastReportService.selectBatchDate($scope);
        }
				$scope.searchlist = function() {
					CustomerForecastReportService.searchlist($scope);
				}
				$scope.selectDocumentChanged = function(){
          CustomerForecastReportService.selectDocumentChanged($scope);
        }
				CustomerForecastReportService.init($scope);
			}
		])
})();
