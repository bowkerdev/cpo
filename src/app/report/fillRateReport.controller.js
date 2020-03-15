(function () {
  'use strict';
  angular
    .module('cpo')
    .service('fillRateReportService' , [ '$http' , '$translate' , 'CommonService' , '$uibModal' , 'uiGridConstants' , '$compile' ,
      function ( $http , $translate , CommonService , $uibModal , uiGridConstants , $compile ) {
        var _this = this;
        this.type = 0;
        this.showFactioryDetail = false;
        this.export = function ( scope ) {
          if(scope.searchRequest.queryType.id =="MKT_CUS_LC0190"){

            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              modalAlert(CommonService , 2 , "Please select Customer Forecast" , null);
              return;
            }
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              modalAlert(CommonService , 2 , "Please select LCO190" , null);
              return;
            }
            if ( !scope.searchRequest.mkfc || !scope.searchRequest.mkfc.id ) {
              modalAlert(CommonService , 2 , "Please select Marketing Forecast" , null);
              return;
            }
          }
          else if ( scope.searchRequest.queryType.id == "CUS_LC0190" ) {

            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              modalAlert(CommonService , 2 , "Please select Customer Forecast" , null);
              return;
            }
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              modalAlert(CommonService , 2 , "Please select LCO190" , null);
              return;
            }
          } else if ( scope.searchRequest.queryType.id == 'MKT' ) {
            if ( !scope.searchRequest.mkfc || !scope.searchRequest.mkfc.id ) {
              modalAlert(CommonService , 2 , "Please select Marketing Forecast" , null);
              return;
            }
          } else if ( scope.searchRequest.queryType.id == 'CUS' ) {
            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              modalAlert(CommonService , 2 , "Please select Customer Forecast" , null);
              return;
            }
          } else if ( scope.searchRequest.queryType.id == 'LC0190' ) {
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              modalAlert(CommonService , 2 , "Please select LCO190" , null);
              return;
            }
          }


          var param = {
            pageSize : 1000000 ,
            pageNo : 1
          };
          param.type = scope.type;

          if ( scope.fillType == "PT" ) {
            switch ( scope.type ) {
              case '1':
                param.documentType = 3001;
                break;
              case '2':
                param.documentType = 3002;
                break;
              case '3':
                param.documentType = 3003;
                break;
            }
          } else if ( scope.fillType == "PRO" ) {
            switch ( scope.type ) {
              case '1':
                param.documentType = 3004;
                break;
              case '2':
                param.documentType = 3005;
                break;
              case '3':
                param.documentType = 3006;
                break;
            }
          }
          param.queryType = scope.searchRequest.queryType.id;
          if ( scope.searchRequest.queryType.id == "MKT_CUS_LC0190" ) {
            param.isDeduction = scope.searchRequest.deduction ? 'YES' : 'NO';
            param.cusfcDocId = scope.searchRequest.cus.id;
            param.cuspoDocId = scope.searchRequest.lco190.id;
            param.mktfcDocId = scope.searchRequest.mkfc.id;
          }
          else if ( scope.searchRequest.queryType.id == "CUS_LC0190" ) {
            param.isDeduction = scope.searchRequest.deduction ? 'YES' : 'NO';
            param.cusfcDocId = scope.searchRequest.cus.id;
            param.cuspoDocId = scope.searchRequest.lco190.id;
          } else if ( scope.searchRequest.queryType.id == 'MKT' ) {

            param.mktfcDocId = scope.searchRequest.mkfc.id;
          } else if ( scope.searchRequest.queryType.id == 'CUS' ) {

            param.cusfcDocId = scope.searchRequest.cus.id;
          } else if ( scope.searchRequest.queryType.id == 'LC0190' ) {
            param.cuspoDocId = scope.searchRequest.lco190.id;

          }
          param.isHalfMonth = scope.searchRequest.monthType.id;
          var in_month  = getMonths(scope.searchRequest.fromMonth,scope.searchRequest.toMonth);
          if(in_month){
            param.in_month = in_month;
          }
          CommonService.showLoadingView("Exporting...");
          GLOBAL_Http($http , "cpo/portal/document/check_record_count?" , 'GET' , param , function ( data ) {
            CommonService.hideLoadingView();
            if ( data.status == 0 ) {
              if ( parseInt(data.message) > 0 ) {
                exportExcel(param , "cpo/portal/document/export_file?" , "_blank");
              } else {
                modalAlert(CommonService , 2 , $translate.instant('notifyMsg.NO_DATA_EXPORT') , null);
              }
            }
          } , function ( data ) {
            CommonService.hideLoadingView();
            modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
          });

        }
        
        this.exportOrderList=function(scope){
        	
					var modalInstance =
						$uibModal.open({
							animation: true,
							ariaLabelledBy: "modal-header",
							templateUrl: 'app/report/orderListFilter.html',
							controller: 'orderListFilterCtrl'
						});
					modalInstance.result = function(result) {
	        	var param = {
	            pageSize : 1000000 ,
	            pageNo : 1
	          };
	          if(result.fromPeriod){
	          	param.fromPeriod=result.fromPeriod;
	          }
	          if(result.toPeriod){
	          	param.toPeriod=result.toPeriod;
	          }
	          if(result.fromFpd){
	          	param.fromFpd=result.fromFpd;
	          }
	          if(result.toFpd){
	          	param.toFpd=result.toFpd;
	          }
	          if(result.documentType){
	          	param.orderRange=result.documentType;
	          }
	          if(result.exportCancelOrder){
	          	param.exportCancelOrder=result.exportCancelOrder;
	          }
	          param.documentType=7001;
						debugger;
	        	exportExcel(param , "cpo/portal/document/export_file?" , "_blank");
					}
        }
        
        
        this.search = function ( scope ) {

          scope.fillRateReportData = [];
          if(scope.searchRequest.queryType.id =="MKT_CUS_LC0190"){

            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              modalAlert(CommonService , 2 , "Please select Customer Forecast" , null);
              return;
            }
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              modalAlert(CommonService , 2 , "Please select LCO190" , null);
              return;
            }
            if ( !scope.searchRequest.mkfc || !scope.searchRequest.mkfc.id ) {
              modalAlert(CommonService , 2 , "Please select Marketing Forecast" , null);
              return;
            }
          }
          else if ( scope.searchRequest.queryType.id == "CUS_LC0190" ) {

            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              modalAlert(CommonService , 2 , "Please select Customer Forecast" , null);
              return;
            }
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              modalAlert(CommonService , 2 , "Please select LCO190" , null);
              return;
            }
          } else if ( scope.searchRequest.queryType.id == 'MKT' ) {
            if ( !scope.searchRequest.mkfc || !scope.searchRequest.mkfc.id ) {
              modalAlert(CommonService , 2 , "Please select Marketing Forecast" , null);
              return;
            }
          } else if ( scope.searchRequest.queryType.id == 'CUS' ) {
            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              modalAlert(CommonService , 2 , "Please select Customer Forecast" , null);
              return;
            }
          } else if ( scope.searchRequest.queryType.id == 'LC0190' ) {
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              modalAlert(CommonService , 2 , "Please select LCO190" , null);
              return;
            }
          }
          this.refresh(scope);
        }
        this.dealWithTopColumns = function ( scope , data ) {
          scope.gridOptions1.rowHeight = 120
          scope.titleData = data.header ? data.header : data.message;
          scope.gridOptions1.columnDefs = [ {
            name : 'factoryName' ,
            displayName : (scope.type == 1) ? $translate.instant('worktable.FACTORY_NAME') : $translate.instant('worktable.PRODUCT_TYPE') ,
            field : 'factoryName' ,
            minWidth : '120' ,
            enableCellEdit : false ,
            pinnedLeft : true
          } ];
          var resultColumn = {
            name : ('attributeName') ,
            displayName : "Attributes" ,
            field : "attributeName" ,
            minWidth : '150' ,
            enableCellEdit : false ,
            pinnedLeft : true ,
            cellTemplate : '<div  class="cell-divider2 height-20">Capacity(SMV)</div><div class="height-20 cell-text-bolder" >FPD Loading(SMV)</div><div class="height-20 cell-text-bolder" >Fill rate</div> <div class="height-20 cell-text-bolder" >Capacity(PCS)</div> <div  class="cell-divider2 height-20">FPD loading by PCS</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

          }


          scope.gridOptions1.columnDefs.push(resultColumn);
          for ( var key in scope.titleData ) {
            var dyLoadingText = '&nbsp;{{row.entity.capacity' + scope.titleData[ key ] + '|quantityFilter}}';
            var dyculLoadingText = '&nbsp;{{row.entity.loading' + scope.titleData[ key ] + '|quantityFilter}}';
            var dyculLoadingClassContent = "{true:'text-color-red',false:'text-color-normal'}[100<row.entity.fill"+scope.titleData[ key ]+'.replace("%","")]';
            var dycapacityText = '&nbsp;{{row.entity.fill' + scope.titleData[ key ] + '|percentFilter}}';
            var capacityPcsText = '&nbsp;{{row.entity.capacityPcs' + scope.titleData[ key ] + '|quantityFilter}}';
            var loadingPcsText = '&nbsp;{{row.entity.loadingPcs' + scope.titleData[ key ] + '|quantityFilter}}';
            var fillRateText = '&nbsp;{{row.entity.fillRate' + scope.titleData[ key ] + '|percentFilter}}';
            var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[100<row.entity.fillRate"+scope.titleData[ key ]+'.replace("%","")]';
            var dyfillRateText = '<div class="height-20 cell-text-bolder" ng-class=' + fillRatengClassContent + '>&nbsp;{{row.entity.capacityPcs' + scope.titleData[ key ] + '|quantityFilter}}';

            var column = {
              name : ('fillrate' + key) ,
              displayName : scope.titleData[ key ] ,
              field : 'fillRate' + scope.titleData[ key ] ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : false ,
              cellTemplate : '<div  class="cell-divider2 height-20">' + dyLoadingText
              + '</div> <div class="height-20 cell-text-bolder">' + dyculLoadingText
              + '</div> <div  class="cell-divider2 height-20" ng-class=' + dyculLoadingClassContent + '>'  + dycapacityText + '</div>'
              + '<div  class="cell-divider2 height-20">' + capacityPcsText + '</div>'
              + '<div  class="cell-divider2 height-20">' + loadingPcsText + '</div>'
              + '<div  class="cell-divider2 height-20" ng-class=' + fillRatengClassContent + '>' + fillRateText + '</div>'
            }

            scope.gridOptions1.columnDefs.push(column);


          }


        }
        this.dealWithTopColumnsToPro = function ( scope , data ) {
          scope.gridOptions1.rowHeight = 60
          scope.titleData = data.header ? data.header : data.message;
          scope.gridOptions1.columnDefs = [ {
            name : 'factoryName' ,
            displayName : (scope.type == 1) ? $translate.instant('worktable.FACTORY_NAME') : "Process" ,
            field : 'factoryName' ,
            minWidth : '120' ,
            enableCellEdit : false ,
            pinnedLeft : true
          } ];
          var resultColumn = {
            name : ('attributeName') ,
            displayName : "Attributes" ,
            field : "attributeName" ,
            minWidth : '150' ,
            enableCellEdit : false ,
            pinnedLeft : true ,
            cellTemplate : '<div class="height-20 cell-text-bolder" >Capacity(PCS)</div> <div  class="cell-divider2 height-20">FPD loading by PCS</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

          }


          scope.gridOptions1.columnDefs.push(resultColumn);
          for ( var key in scope.titleData ) {
            var capacityPcsText = '&nbsp;{{row.entity.capacityPcs' + scope.titleData[ key ] + '|quantityFilter}}';
            var loadingPcsText = '&nbsp;{{row.entity.loadingPcs' + scope.titleData[ key ] + '|quantityFilter}}';
            var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[100<row.entity.fillRate"+scope.titleData[ key ]+'.replace("%","")]';
            var fillRateText = '&nbsp;{{row.entity.fillRate' + scope.titleData[ key ] + '|percentFilter}}';
            var column = {
              name : ('fillrate' + key) ,
              displayName : scope.titleData[ key ] ,
              field : 'fillRate' + scope.titleData[ key ] ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : false ,
              cellTemplate : '<div  class="cell-divider2 height-20">' + capacityPcsText + '</div>'
              + '<div  class="cell-divider2 height-20">' + loadingPcsText + '</div>'
              + '<div  class="cell-divider2 height-20" ng-class=' + fillRatengClassContent + '>' + fillRateText + '</div>'
            }

            scope.gridOptions1.columnDefs.push(column);


          }
        }
        this.ptDetailColumns = function ( scope , data ) {
          // scope.gridOptions1.rowHeight = 480
          scope.titleData = data.header ? data.header : data.message;
          scope.gridOptions1.columnDefs = [ {
            name : 'factoryName' ,
            displayName : $translate.instant('worktable.FACTORY_NAME') ,
            field : 'factoryName' ,
            minWidth : '120' ,
            enableCellEdit : false ,
            pinnedLeft : true,
            cellTemplate : '<div  style="background-color: white;height: 100%" >{{row.entity.factoryName}}</div>'

          } ];
          var productType = {
            name : 'productType' ,
            displayName : "Product Type" ,
            field : "productType" ,
            minWidth : '100' ,
            enableCellEdit : false ,
            pinnedLeft : true ,
            cellTemplate : '<div  class="cell-divider2 height-120 zebra" ng-repeat="obj in row.entity.productTypeList">{{obj}}</div>'
          }
          scope.gridOptions1.columnDefs.push(productType)
          var apGroup = {
            name : 'apGroup' ,
            displayName : "AP Group" ,
            field : "apGroup" ,
            minWidth : '100' ,
            enableCellEdit : false ,
            pinnedLeft : true ,
            cellTemplate : '<div  class="cell-divider2 height-120 zebra" ng-repeat="obj in row.entity.apGroupList">{{obj}}</div>'
          }
          scope.gridOptions1.columnDefs.push(apGroup)

          var resultColumn = {
            name : 'attributeName' ,
            displayName : "Attributes" ,
            field : "attributeName" ,
            minWidth : '150' ,
            enableCellEdit : false ,
            pinnedLeft : true ,
            cellTemplate : '<div ng-repeat="obj in row.entity.productTypeList" class="zebra"><div  class="cell-divider2 height-20">Capacity(SMV)</div><div class="height-20 cell-text-bolder" >FPD Loading(SMV)</div><div class="height-20 cell-text-bolder" >Fill rate</div> <div class="height-20 cell-text-bolder" >Capacity(PCS)</div> <div  class="cell-divider2 height-20">FPD loading by PCS</div><div class="height-20 cell-text-bolder">Fill Rate</div></div>'
          }


          scope.gridOptions1.columnDefs.push(resultColumn);
          for ( var key in scope.titleData ) {
            var dyLoadingText = '&nbsp;{{row.entity[obj].capacity' + scope.titleData[ key ] + '|quantityFilter}}';
            var dyculLoadingText = '&nbsp;{{row.entity[obj].loading' + scope.titleData[ key ] + '|quantityFilter}}';
            var dyculLoadingClassContent = "{true:'text-color-red',false:'text-color-normal'}[100<row.entity[obj].fill"+scope.titleData[ key ]+'.replace("%","")]';

            var dycapacityText = '&nbsp;{{row.entity[obj].fill' + scope.titleData[ key ] + '|percentFilter}}';
            var capacityPcsText = '&nbsp;{{row.entity[obj].capacityPcs' + scope.titleData[ key ] + '|quantityFilter}}';
            var loadingPcsText = '&nbsp;{{row.entity[obj].loadingPcs' + scope.titleData[ key ] + '|quantityFilter}}';
            var fillRateText = '&nbsp;{{(row.entity[obj].fillRate' + scope.titleData[ key ] + ')}}';
            var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[100<row.entity[obj].fillRate"+scope.titleData[ key ]+'.replace("%","")]';
            var resultColumn = {
              name : ('fillrate' + key) ,
              displayName : scope.titleData[ key ] ,
              field : 'fillRate' + scope.titleData[ key ] ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : false ,
              cellTemplate : '<div ng-repeat=\"obj in row.entity.productTypeList\" class="zebra">'
              + '<div class=\"cell-divider2 height-20\">' + dyLoadingText + '</div>'
              + '<div class=\"height-20 cell-text-bolder\">' + dyculLoadingText + '</div>'
              + '<div  class=\"cell-divider2 height-20\" ng-class=' + dyculLoadingClassContent + '>' + dycapacityText + '</div>'
              + '<div  class=\"cell-divider2 height-20\">' + capacityPcsText + '</div>'
              + '<div  class=\"cell-divider2 height-20\">' + loadingPcsText + '</div>'
              + '<div  class=\"cell-divider2 height-20\" ng-class=' + fillRatengClassContent + '>' + fillRateText + '</div></div>'
            }

            scope.gridOptions1.columnDefs.push(resultColumn);


          }


        }
        this.proDetailColumns = function ( scope , data ) {
          scope.titleData = data.header ? data.header : data.message;
          scope.gridOptions1.columnDefs = [ {
            name : 'factoryName' ,
            displayName : $translate.instant('worktable.FACTORY_NAME') ,
            field : 'factoryName' ,
            minWidth : '120' ,
            enableCellEdit : false ,
            pinnedLeft : true,
            cellTemplate : '<div  style="background-color: white;height: 100%" >{{row.entity.factoryName}}</div>'
          } ];
          var productType = {
            name : 'productType' ,
            displayName : "Process" ,
            field : "productType" ,
            minWidth : '100' ,
            enableCellEdit : false ,
            pinnedLeft : true ,
            cellTemplate : '<div  class="cell-divider2 height-60 zebra" ng-repeat="obj in row.entity.productTypeList">{{obj}}</div>'
          }
          scope.gridOptions1.columnDefs.push(productType)

          var resultColumn = {
            name : 'attributeName' ,
            displayName : "Attributes" ,
            field : "attributeName" ,
            minWidth : '150' ,
            enableCellEdit : false ,
            pinnedLeft : true ,
            cellTemplate : '<div ng-repeat="obj in row.entity.productTypeList" class="zebra"><div class="height-20 cell-text-bolder" >Capacity(PCS)</div> <div  class="cell-divider2 height-20">FPD loading by PCS</div><div class="height-20 cell-text-bolder">Fill Rate</div></div>'
          }


          scope.gridOptions1.columnDefs.push(resultColumn);
          for ( var key in scope.titleData ) {
            var capacityPcsText = '&nbsp;{{row.entity[obj].capacityPcs' + scope.titleData[ key ] + '|quantityFilter}}';
            var loadingPcsText = '&nbsp;{{row.entity[obj].loadingPcs' + scope.titleData[ key ] + '|quantityFilter}}';
            var fillRateText = '&nbsp;{{row.entity[obj].fillRate' + scope.titleData[ key ] + '|percentFilter}}';
            var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[100<row.entity[obj].fillRate"+scope.titleData[ key ]+'.replace("%","")]';
            var column = {
              name : ('fillrate' + key) ,
              displayName : scope.titleData[ key ] ,
              field : 'fillRate' + scope.titleData[ key ] ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : false ,
              cellTemplate : '<div ng-repeat=\"obj in row.entity.productTypeList\" class="zebra">'
              + '<div  class=\"cell-divider2 height-20\">' + capacityPcsText + '</div>'
              + '<div  class=\"cell-divider2 height-20\">' + loadingPcsText + '</div>'
              + '<div  class=\"cell-divider2 height-20\" ng-class=' + fillRatengClassContent + '>' + fillRateText + '</div></div>'
            }

            scope.gridOptions1.columnDefs.push(column);

          }
        }
        this.getTopSearch = function ( scope ) {
          var _this = this;
          scope.queryTypes = [
           {
            id : 'CUS_LC0190' ,
            label : 'CUS FC & LC0190'
          } , {
            id : 'MKT' ,
            label : 'MKT FC'
          } , {
            id : 'CUS' ,
            label : 'CUS FC'
          } , {
            id : 'LC0190' ,
            label : 'LC0190'
          }, {
              id : 'MKT_CUS_LC0190' ,
              label : 'MKT & CUS FC & LC0190'
            }
          ];
          scope.monthTypes = [ {
            id : "NO" ,
            label : "Month"
          } , {
            id : "YES" ,
            label : "Half Month"
          } ];

          scope.searchRequest = {
            fromMonth:null,
            toMonth:null,
            mkfc : null ,
            cus : null ,
            lco190 : null ,

            deduction : true ,
            monthType : scope.monthTypes[ 0 ] ,
            queryType : scope.queryTypes[ 0 ]
          };
          var param = {
            in_code : "CAPACITYMKTFC,CAPACITYCUSTOMERPO,CAPACITYCUSTOMERFORECAST"
          }
          GLOBAL_Http($http , "cpo/api/sys/admindict/translate_code?" , 'GET' , param , function ( data ) {
            if ( data.CAPACITYMKTFC ) {
              scope.mkfcs = data.CAPACITYMKTFC;

              for ( var i = 0 ; i < scope.mkfcs.length ; i++ ) {
                scope.mkfcs[ i ].id = scope.mkfcs[ i ].value;
                scope.mkfcs[ i ].label = scope.mkfcs[ i ].label.split(' ')[ 0 ];
              }

              scope.searchRequest.mkfc = scope.mkfcs[ 0 ] ? scope.mkfcs[ 0 ] : null;

            } else {
              scope.mkfcs = [];
            }

            if ( data.CAPACITYCUSTOMERPO ) {
              scope.lco190s = data.CAPACITYCUSTOMERPO;

              for ( var i = 0 ; i < scope.lco190s.length ; i++ ) {
                scope.lco190s[ i ].id = scope.lco190s[ i ].value;
                scope.lco190s[ i ].label = scope.lco190s[ i ].label.split(' ')[ 0 ];
              }
              scope.searchRequest.lco190 = scope.lco190s[ 0 ] ? scope.lco190s[ 0 ] : null;
            } else {
              scope.lco190s = [];
            }
            if ( data.CAPACITYCUSTOMERFORECAST ) {
              scope.cuss = data.CAPACITYCUSTOMERFORECAST;

              for ( var i = 0 ; i < scope.cuss.length ; i++ ) {
                scope.cuss[ i ].id = scope.cuss[ i ].value;
                scope.cuss[ i ].label = scope.cuss[ i ].label.split(' ')[ 0 ];
              }
              scope.searchRequest.cus = scope.cuss[ 0 ] ? scope.cuss[ 0 ] : null;


            } else {
              scope.cuss = [];
            }
            _this.getLoading(scope , scope.type , scope.fillType);
          });
        }
        this.init = function ( scope ) {

          this.getTopSearch(scope);

          scope.titleData = [];
          scope.forecastType = "All";
          scope.fillType = "PT"
          scope.type = 1
          scope.smartButtonTextProviderModel = [];
          this.initGripOption(scope);
          //  this.getLoading(scope, scope.type, scope.fillType)

        };

        this.toggleFilterRow = function ( scope ) {
          scope.gridOptions1.enableFiltering = !scope.gridOptions1.enableFiltering;
          scope.gridApi1.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        }
        this.refresh = function ( scope ) {
          _this.getLoading(scope , scope.type , scope.fillType);
        };
        this.upload = function ( scope ) {

          var _this = this;
          var fileType = "";

          if ( scope.type == 0 ) {
            fileType = "402";
          } else if ( scope.type == 1 ) {
            fileType = "401";
          } else if ( scope.type == 2 ) {
            fileType = "403";
          }

          var modalInstance = $uibModal.open({
            templateUrl : 'FileModal' ,
            controller : 'FileController' ,
            backdrop : 'static' ,
            size : 'md' ,
            resolve : {
              planGroups : function () {
                return {
                  fileType : fileType
                };
              }
            }
          });
          modalInstance.result.then(function ( returnData ) {

            if ( returnData ) {
              modalAlert(CommonService , 2 , $translate.instant('notifyMsg.UPLOAD_SUCCESS') , null);
              _this.refresh(scope);
            }
          } , function () {
          });

        }
        this.lastRow = null;
        this.getLoading = function ( scope , type , fillType ) {
          scope.type = type;
          scope.fillType = fillType
          if ( fillType === 'PT' ) {
            this.getPT(scope , type)
          } else if ( fillType === 'PRO' ) {
            this.getPro(scope , type)
          }
        }

        this.getPT = function ( scope , type ) {
          scope.type = type;

          scope.showFactioryDetail = false;
          scope.gridOptions1.columnDefs = [ {
            name : 'none' ,
            displayName : "" ,
            field : 'none' ,
            minWidth : '120' ,
            enableCellEdit : false
          }
          ];
          scope.fillRateReportData = [];

          if ( scope.gridApi1 ) {
            scope.gridApi1.pagination.seek(1);
          }
          if ( scope.gridApi2 ) {
            scope.gridApi2.pagination.seek(1);
          }
          var param = {
            type : type
          }
          param.queryType = scope.searchRequest.queryType.id;
          if ( scope.searchRequest.queryType.id == "MKT_CUS_LC0190" ) {
            param.isDeduction = scope.searchRequest.deduction ? 'YES' : 'NO';
            param.cusfcDocId = scope.searchRequest.cus.id;
            param.cuspoDocId = scope.searchRequest.lco190.id;
            param.mktfcDocId = scope.searchRequest.mkfc.id;
          }
          else if ( scope.searchRequest.queryType.id == "CUS_LC0190" ) {
            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              return;
            }
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              return;
            }
            param.isDeduction = scope.searchRequest.deduction ? 'YES' : 'NO';
            param.cusfcDocId = scope.searchRequest.cus.id;
            param.cuspoDocId = scope.searchRequest.lco190.id;
          } else if ( scope.searchRequest.queryType.id == 'MKT' ) {
            if ( !scope.searchRequest.mkfc || !scope.searchRequest.mkfc.id ) {
              return;
            }
            param.mktfcDocId = scope.searchRequest.mkfc.id;
          } else if ( scope.searchRequest.queryType.id == 'CUS' ) {
            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              return;
            }
            param.cusfcDocId = scope.searchRequest.cus.id;
          } else if ( scope.searchRequest.queryType.id == 'LC0190' ) {
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              return;
            }
            param.cuspoDocId = scope.searchRequest.lco190.id;

          }
          param.isHalfMonth = scope.searchRequest.monthType.id;
          scope.gridOptions1.showLoading = true;
          param.queryType = scope.searchRequest.queryType.id;

          var in_month  = getMonths(scope.searchRequest.fromMonth,scope.searchRequest.toMonth);
          if(in_month){
            param.in_month = in_month;
          }

          GLOBAL_Http($http , "cpo/api/fillrate_report/query_fillrate_by_producttype?" , 'GET' , param , function ( data ) {

            scope.gridOptions1.showLoading = false;
            if ( data.status == 0 ) {
              if ( data.output ) {

                if ( scope.type === '3' ) {
                  scope.fillRateReportData = _this.formateDataToDeatil(scope , data.output.data);
                  _this.ptDetailColumns(scope , data.output)

                } else {
                  _this.dealWithTopColumns(scope , data.output);
                  scope.fillRateReportData = _this.formateData(data.output.data);
                }


              } else {
                scope.fillRateReportData = [];
              }
            } else {
              var message = data.message;
              if ( message ) {
                modalAlert(CommonService , 3 , message , null);
              }
            }
          } , function ( data ) {
            scope.gridOptions1.showLoading = false;
            modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
          });
        }
        this.getPro = function ( scope , type ) {
          scope.type = type;

          // scope.gridOptions2.columnDefs = [];
          // scope.gridOptions2.data = [];
          scope.showFactioryDetail = false;
          scope.gridOptions1.columnDefs = [ {
            name : 'none' ,
            displayName : "" ,
            field : 'none' ,
            minWidth : '6' ,
            enableCellEdit : false
          }
          ];
          scope.fillRateReportData = [];

          if ( scope.gridApi1 ) {
            scope.gridApi1.pagination.seek(1);
          }
          if ( scope.gridApi2 ) {
            scope.gridApi2.pagination.seek(1);
          }

          var param = {
            type : type
          }
          if ( scope.searchRequest.queryType.id == "MKT_CUS_LC0190" ) {
            param.isDeduction = scope.searchRequest.deduction ? 'YES' : 'NO';
            param.cusfcDocId = scope.searchRequest.cus.id;
            param.cuspoDocId = scope.searchRequest.lco190.id;
            param.mktfcDocId = scope.searchRequest.mkfc.id;
          }
         else if ( scope.searchRequest.queryType.id == "CUS_LC0190" ) {
            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              return;
            }
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              return;
            }
            param.isDeduction = scope.searchRequest.deduction ? 'YES' : 'NO';
            param.cusfcDocId = scope.searchRequest.cus.id;
            param.cuspoDocId = scope.searchRequest.lco190.id;
          } else if ( scope.searchRequest.queryType.id == 'MKT' ) {
            if ( !scope.searchRequest.mkfc || !scope.searchRequest.mkfc.id ) {
              return;
            }
            param.mktfcDocId = scope.searchRequest.mkfc.id;
          } else if ( scope.searchRequest.queryType.id == 'CUS' ) {
            if ( !scope.searchRequest.cus || !scope.searchRequest.cus.id ) {
              return;
            }
            param.cusfcDocId = scope.searchRequest.cus.id;
          } else if ( scope.searchRequest.queryType.id == 'LC0190' ) {
            if ( !scope.searchRequest.lco190 || !scope.searchRequest.lco190.id ) {
              return;
            }
            param.cuspoDocId = scope.searchRequest.lco190.id;
          }

          param.isHalfMonth = scope.searchRequest.monthType.id;
          scope.gridOptions1.showLoading = true;
          param.queryType = scope.searchRequest.queryType.id;
          var in_month  = getMonths(scope.searchRequest.fromMonth,scope.searchRequest.toMonth);
          if(in_month){
            param.in_month = in_month;
          }
          GLOBAL_Http($http , "cpo/api/fillrate_report/query_fillrate_by_process?" , 'GET' , param , function ( data ) {
            scope.gridOptions1.showLoading = false;
            if ( data.status == 0 ) {
              if ( data.output ) {

                if ( scope.type === '3' ) {
                  scope.fillRateReportData = _this.formateDataToDeatil(scope , data.output.data);
                  _this.proDetailColumns(scope , data.output)

                } else {
                  _this.dealWithTopColumnsToPro(scope , data.output);
                  scope.fillRateReportData = _this.formateData(data.output.data);
                }
              } else {
                scope.fillRateReportData = [];
              }
            } else {
              var message = data.message;
              if ( message ) {
                modalAlert(CommonService , 3 , message , null);
              }
            }
          } , function ( data ) {
            scope.gridOptions1.showLoading = false;
            modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
          });
        }

        this.formateData = function ( data ) {
          var item = []
          for ( var i = 0 ; i < data.length ; i++ ) {
            var obj = {}
            obj.factoryName = data[ i ].name

            for ( var j in data[ i ].data ) {
              var nameKey = ""

              switch ( j ) {
                case 'smvCap':
                  nameKey = "capacity"
                  break;
                case 'smvLoading':
                  nameKey = "loading"
                  break;
                case 'smvRate':
                  nameKey = "fill"
                  break;
                case 'pcsCap':
                  nameKey = "capacityPcs"
                  break;
                case 'pcsLoading':
                  nameKey = "loadingPcs"
                  break;
                case 'pcsRate':
                  nameKey = "fillRate"
                  break;
              }
              for ( var key in data[ i ].data[ j ] ) {
                obj[ nameKey + key ] = data[ i ].data[ j ][ key ]
              }
            }
            item.push(obj)
          }

          return item
        }
        this.formateDataToDeatil = function ( scope , data ) {
          var item = []

          for ( var i = 0 ; i < data.length ; i++ ) {
            var obj = {}
            obj.productTypeList = [];
            obj.apGroupList=[];
            obj.factoryName = data[ i ].name;
            for ( var j = 0 ; j < data[ i ].data.length ; j++ ) {
              obj.productTypeList.push(data[ i ].data[ j ].name);
              obj.apGroupList.push(data[ i ].data[ j ].apGroup);
              obj[ data[ i ].data[ j ].name ] = {};
              var nameKey = "";
              for ( var z in data[ i ].data[ j ].data ) {
                switch ( z ) {
                  case 'smvCap':
                    nameKey = "capacity"
                    break;
                  case 'smvLoading':
                    nameKey = "loading"
                    break;
                  case 'smvRate':
                    nameKey = "fill"
                    break;
                  case 'pcsCap':
                    nameKey = "capacityPcs"
                    break;
                  case 'pcsLoading':
                    nameKey = "loadingPcs"
                    break;
                  case 'pcsRate':
                    nameKey = "fillRate"
                    break;
                }
                for ( var key in data[ i ].data[ j ].data[ z ] ) {
                  obj[ data[ i ].data[ j ].name ][ nameKey + key ] = data[ i ].data[ j ].data[ z ][ key ]
                }
              }

            }
            item.push(obj)
          }
          return item
        }

        this.view = function ( scope , Mode ) {

          if ( !this.lastRow ) {
            modalAlert(CommonService , 2 , $translate.instant('notifyMsg.ALERT_CHOOSE_DATA') , null);
            return;
          }
          return;
          // 获取选择条目ID
          var _this = this;
          scope.errorOutputMsgs = [];
          var modalInstance = $uibModal.open({
            templateUrl : 'SampleRoomCapacityDetailModal' ,
            controller : 'SampleRoomCapacityDetailController' ,
            backdrop : 'static' ,
            size : 'md' ,
            resolve : {
              planGroups : function () {
                return {
                  "data" : selectedRows[ 0 ] ,
                  "Mode" : Mode
                };
              }
            }
          });
          // modalInstance callback
          modalInstance.result.then(function ( returnData ) {
            if ( returnData ) {
              //    _this.getLoading(scope);
            }
          } , function () {
            // dismiss(cancel)
          });
        }

        this.initGripOption = function ( scope ) {
          var _this = this;
          var redLabelTemplate = document.getElementById("redLabelTemplate").innerText;
          scope.lastSelectRow = null;
          scope.gridOptions1 = {
            data : "fillRateReportData" ,
            enableColumnMenus : true ,
            enableGridMenu : true ,
            multiSelect : false ,
            rowEditWaitInterval : -1 ,
            enableRowSelection : true ,
            enableFullRowSelection : true ,
            enableRowHeaderSelection : true ,
            enableHorizontalScrollbar : 1 ,
            gridMenuCustomItems : CommonService.zsZoomGridMenuCustomItems() ,
            enableVerticalScrollbar : 1 ,
            rowTemplate : "<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" " +
            "class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ng-style=\"grid.appScope.getFixHeight(col.name, row.entity, rowRenderIndex)\" ui-grid-cell></div>" ,
            enablePagination : false ,
            useExternalPagination : false ,
            showLoading : false ,
            rowHeight : 120 ,
            paginationPageSizes : [ 10000 ] ,
            paginationPageSize : 10000 ,
            enablePaginationControls : false ,
            expandableRowTemplate : '<div class="sub-ui-grid capacity-sub-grid" style="height: 230px" ui-grid-pagination ui-grid-selection ui-grid="row.entity.subGridOptions"></div>' ,
            expandableRowHeight : 230 ,
            expandableRowScope : 'row.subGridScope' ,
            columnDefs : [ {
              name : 'factoryName' ,
              displayName : $translate.instant('worktable.FACTORY_NAME') ,
              field : 'factoryName' ,
              minWidth : '120' ,
              enableCellEdit : false

            }
            ] ,
            onRegisterApi : function ( gridApi ) {
              scope.gridApi1 = gridApi;
              scope.gridApi1.core.on.sortChanged(scope , function ( grid , sortColumns ) {
                if ( sortColumns.length !== 0 ) {
                  if ( sortColumns[ 0 ].sort.direction === 'asc' ) {
                    scope.page.sortDirection = true;
                  }
                  if ( sortColumns[ 0 ].sort.direction === 'desc' ) {
                    scope.page.sortDirection = false;
                  }
                  scope.page.sortColumn = sortColumns[ 0 ].displayName;
                }
              });
            }
          };

          var bottomColumns = new Array();

          var productTypeColumn = {
            name : 'productType' ,
            displayName : $translate.instant('worktable.PRODUCT_TYPE') ,
            field : 'productType' ,
            minWidth : '120' ,
            enableCellEdit : false
          };
          var wovenKnitColumn = {
            name : 'wovenKnit' ,
            displayName : $translate.instant('worktable.WOVEN_KNIT') ,
            field : 'wovenKnit' ,
            minWidth : '120' ,
            enableCellEdit : false
          };
          bottomColumns.push(productTypeColumn);
          bottomColumns.push(wovenKnitColumn);


          scope.gridOptions2 = {
            data : [] ,
            enableColumnMenus : true ,
            enableGridMenu : true ,
            rowEditWaitInterval : -1 ,
            enableRowSelection : true ,
            enableFullRowSelection : false ,
            enableRowHeaderSelection : true ,
            enableHorizontalScrollbar : 1 ,
            gridMenuCustomItems : CommonService.zsZoomGridMenuCustomItems() ,
            enableVerticalScrollbar : 0 ,
            totalItems : scope.page.totalNum ,
            enablePagination : false ,
            useExternalPagination : false ,
            showLoading : false ,
            rowHeight : 80 ,
            paginationPageSizes : [ 10000 ] ,
            paginationPageSize : 10000 ,
            expandableRowHeight : 230 ,
            expandableRowScope : 'row.subGridScope' ,
            columnDefs : bottomColumns ,
            onRegisterApi : function ( gridApi ) {

              scope.gridApi2 = gridApi;
              gridApi.pagination.on.paginationChanged(scope , function ( newPage , pageSize ) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;
              });
            }
          };
        };

        /**
         * init
         */

      }
    ])
    .filter('quantityFilter' , function () {
      return function ( input ) {

        if ( !isNaN(input) ) {
          var num = new Number(input);
          input = num.toFixed(0);

          var parts = input.toString().split(".");
          parts[ 0 ] = parts[ 0 ].replace(/\B(?=(\d{3})+(?!\d))/g , ",");
          return parts.join(".");

        } else {
          return input;
        }

      }
    })
    .filter('percentFilter' , function () {
      return function ( input ) {

        if ( !isNaN(input) ) {
          var num = new Number(input);
          input = (Math.round(num * 10000) / 100).toFixed(2) + '%'

          var parts = input.toString().split(".");
          parts[ 0 ] = parts[ 0 ].replace(/\B(?=(\d{3})+(?!\d))/g , ",");
          return parts.join(".");

        } else {
          return input;
        }

      }
    })
    .controller('fillRateReportCtrl' , [ '$scope' , 'fillRateReportService' ,
      function ( $scope , fillRateReportService ) {
        fillRateReportService.init($scope);
        $scope.export = function () {
          fillRateReportService.export($scope);
        }
        $scope.exportOrderList = function () {
          fillRateReportService.exportOrderList($scope);
        }
        $scope.view = function () {
          fillRateReportService.view($scope , 'VIEW');
        }
        $scope.edit = function () {
          fillRateReportService.view($scope , 'EDIT');
        }
        $scope.toggleFilterRow = function () {

          fillRateReportService.toggleFilterRow($scope);
        };
        $scope.fetchLoadingInfo = function ( fillType , type ) {

          fillRateReportService.getLoading($scope , type , fillType);

        }
        $scope.refresh = function ( type ) {
          fillRateReportService.refresh($scope);

        }
        $scope.upload = function ( type ) {
          fillRateReportService.upload($scope);

        }
        $scope.forecastTypeSelect = function ( name ) {
          $scope.forecastType = name;
        }

        $scope.getFixHeight = function ( a , b , c ) {
          // if($scope.type !== '3'){
          //   return
          // }
          var num = 120
          if ( $scope.fillType === 'PRO' && $scope.type !== '3' ) {
            return {
              "height" : "60px"
            }
          }
          if ( $scope.fillType === 'PRO' ) {
            num = 60
          }
          if ( b.productTypeList && b.productTypeList.length > 0 ) {
            return {
              "height" : b.productTypeList.length * num + "px"
            }
          } else {
            return
          }

        }
        $scope.search = function () {

          fillRateReportService.search($scope);
          //  fillRateReportService.refresh($scope);
        }
        $scope.adjust = function ( row ) {

          $scope.showAdjustment = 'adjustment';
          setTimeout(function () {

            $scope.$broadcast("factoryadjustment.afterInit" , row.entity);

          } , 1000);

          // $scope.forecastType = name;
        }
      }
    ])
})();
