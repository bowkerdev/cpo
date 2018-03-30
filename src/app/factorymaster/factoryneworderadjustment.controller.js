/**
 * Created by mac on 2017/11/6.
 */
(function () {
  'use strict';
  angular
    .module('cpo')
    .service('FactoryAdjustmentNewOrderService' , [ '$http' , '$translate' , 'CommonService' , '$uibModal' , 'uiGridConstants' ,'FilterInGridService',
      function ( $http , $translate , CommonService , $uibModal , uiGridConstants ,FilterInGridService) {
        var __this = this;
        this.exportFile = function(scope){
          if(scope.searchRequestByOrder.productType.id.length>0){
            scope.info.eq_product_type_fr = scope.searchRequestByOrder.productType.id;
          }else{
            scope.info.eq_product_type_fr = null;
          }

          if(scope.searchRequestByOrder.fabricType.id.length>0){
            scope.info.eq_fabric_type = scope.searchRequestByOrder.fabricType.id;
          }else{
            scope.info.eq_fabric_type = null;
          }

          if(scope.searchRequestByOrder.workingNo.id.length>0){
            scope.info.eq_working_no = scope.searchRequestByOrder.workingNo.id;
          }else{
            scope.info.eq_working_no = null;
          }
          var params = angular.copy(scope.info);

          if(scope.searchRequestByOrder.site.id.length>0){
            params.eq_confirm_factory = scope.searchRequestByOrder.site.id;
          }

          if(scope.searchRequestByOrder.productType.id.length>0){
            params.eq_product_type_fr = scope.searchRequestByOrder.productType.id;
          }else{
            delete params.eq_product_type_fr;
          }

          if(scope.searchRequestByOrder.fabricType.id.length>0){
            params.eq_fabric_type = scope.searchRequestByOrder.fabricType.id;
          }else{
            delete params.eq_fabric_type;
          }

          if(scope.searchRequestByOrder.workingNo.id.length>0){
            params.eq_working_no = scope.searchRequestByOrder.workingNo.id;
          }else{
            delete params.eq_working_no;
          }

          if(scope.searchRequestByOrder.fromDate&&scope.searchRequestByOrder.fromDate.length>0){
            params.pv_month = scope.searchRequestByOrder.fromDate;
          }else{
            delete params.pv_month;
          }
          if(scope.searchRequestByOrder.toDate&&scope.searchRequestByOrder.toDate.length>0){
            params.to_pv_month = scope.searchRequestByOrder.toDate;
          }else{
            delete params.to_pv_month;
          }

          if(scope.searchRequestByOrder.site.label!="All"){
            params["eq_confirmFactory"] = scope.searchRequestByOrder.site.label;
          }
          for (var key in params){
            if(!params[key]){
              delete params[key]
            }
          }

          params.eq_document_id  =scope.documentId;
          params.eq_document_type  =scope.documentType;
          params.pageSize = 10000 ;
          params.pageNo = 1;
          params.documentType = 903;

          var searchInfo = FilterInGridService.getFilterParams(scope.gridApi1.grid);
          if(searchInfo){
            for(var key in searchInfo){
              params[key] = searchInfo[key];
            }
          }

          if(jQuery("#garmentQty").val()&&jQuery("#garmentQty").val().length){
            var key = scope.searchRequestByOrder.condition.id+"_total_qty";
            params[key] = jQuery("#garmentQty").val();
          }
          if(jQuery("#totalPvQuantitys").val()&&jQuery("#totalPvQuantitys").val().length){
            var key = scope.searchRequestByOrder.condition2.id+"_totalPvQuantitys";
            params[key] = jQuery("#totalPvQuantitys").val();
          }

          if(searchInfo){
            for(var key in searchInfo){
              params[key] = searchInfo[key];
            }
            exportExcel(params, "cpo/portal/document/export_file?", "_blank");
            // CommonService.showLoadingView("Exporting...");
            // GLOBAL_Http($http, "cpo/portal/document/check_record_count?", 'GET', params, function(data) {
            //   CommonService.hideLoadingView();
            //   if(data.status == 0) {
            //     if(parseInt(data.message) > 0) {
            //       exportExcel(params, "cpo/portal/document/export_file?", "_blank");
            //     } else {
            //       modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
            //     }
            //   }
            // }, function(data) {
            //   CommonService.hideLoadingView();
            //   modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
            // });
          }
          var params = angular.copy(scope.info);

          if(scope.searchRequestByOrder.site.id.length>0){
            params.eq_confirm_factory = scope.searchRequestByOrder.site.id;
          }

          if(scope.searchRequestByOrder.productType.id.length>0){
            params.eq_product_type_fr = scope.searchRequestByOrder.productType.id;
          }else{
            delete params.eq_product_type_fr;
          }

          if(scope.searchRequestByOrder.fabricType.id.length>0){
            params.eq_fabric_type = scope.searchRequestByOrder.fabricType.id;
          }else{
            delete params.eq_fabric_type;
          }

          if(scope.searchRequestByOrder.workingNo.id.length>0){
            params.eq_working_no = scope.searchRequestByOrder.workingNo.id;
          }else{
            delete params.eq_working_no;
          }

          if(scope.searchRequestByOrder.fromDate&&scope.searchRequestByOrder.fromDate.length>0){
            params.pv_month = scope.searchRequestByOrder.fromDate;
          }else{
            delete params.pv_month;
          }
          if(scope.searchRequestByOrder.toDate&&scope.searchRequestByOrder.toDate.length>0){
            params.to_pv_month = scope.searchRequestByOrder.toDate;
          }else{
            delete params.to_pv_month;
          }

          if(scope.searchRequestByOrder.site.label!="All"){
            params["eq_confirmFactory"] = scope.searchRequestByOrder.site.label;
          }
          for (var key in params){
            if(!params[key]){
              delete params[key]
            }
          }

          params.eq_document_id  =scope.documentId;
          params.eq_document_type  =scope.documentType;
          params.pageSize = 10000 ;
          params.pageNo = 1;

          var searchInfo = FilterInGridService.getFilterParams(scope.gridApi1.grid);
          if(searchInfo){
            for(var key in searchInfo){
              params[key] = searchInfo[key];
            }
          }

          if(jQuery("#garmentQty").val()&&jQuery("#garmentQty").val().length){
            var key = scope.searchRequestByOrder.condition.id+"_total_qty";
            params[key] = jQuery("#garmentQty").val();
          }
          if(jQuery("#totalPvQuantitys").val()&&jQuery("#totalPvQuantitys").val().length){
            var key = scope.searchRequestByOrder.condition2.id+"_totalPvQuantitys";
            params[key] = jQuery("#totalPvQuantitys").val();
          }

          if(searchInfo){
            for(var key in searchInfo){
              params[key] = searchInfo[key];
            }
          }

        }
        this.search = function(scope){

          if(scope.searchRequestByOrder.productType.id.length>0){
            scope.info.eq_product_type_fr = scope.searchRequestByOrder.productType.id;
          }else{
            scope.info.eq_product_type_fr = null;
          }

          if(scope.searchRequestByOrder.fabricType.id.length>0){
            scope.info.eq_fabric_type = scope.searchRequestByOrder.fabricType.id;
          }else{
            scope.info.eq_fabric_type = null;
          }

          if(scope.searchRequestByOrder.workingNo.id.length>0){
            scope.info.eq_working_no = scope.searchRequestByOrder.workingNo.id;
          }else{
            scope.info.eq_working_no = null;
          }
          FilterInGridService.gridClearAllFilter(scope.gridApi1.grid);
          __this.getTopGridInfo(scope);



        }
        this.rowTemplate = function () {
          return '<div ng-dblclick="grid.appScope.rowDblClick(row)" >' +
            '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
            '</div>';
        }
        this.adjustFactoryAssignment2 = function ( scope , index , confirmFactory ) {
          var _this = this;
          var selectedRows = "";
          selectedRows =  scope.gridApi1.core.getVisibleRows().filter(function(row){
            return row.isSelected;
          }).map(function(row){
            return row.entity
          });
          var shouldEnterTransferReason = false;
          angular.forEach(selectedRows,function(item){
            if(item.confirmFactory){
              shouldEnterTransferReason = true;
            }
          });

          if ( selectedRows.length <= 0 ) {
            modalAlert(CommonService , 2 , $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING') , null);
            return;
          }
          if(!shouldEnterTransferReason){
            var param = {
              "ids" : listToString(selectedRows , 'assignResultIds') ,
              "mode" : 6 ,
              "queryType" : 3 ,
              "assign_source":scope.documentType,
              "confirmFactory" : confirmFactory ,
              "isFactoryAdjustment" : 'YES'
            }
            GLOBAL_Http($http , "cpo/api/worktable/adjust_assign" , 'POST' , param , function ( data ) {
              if ( data.status == 0 ) {
                __this.getTopGridInfo(scope);
              } else {
                modalAlert(CommonService , 2 , data.message , null);
              }
            } , function ( data ) {
              modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
            });
            return;
          }
          var ids = "";

          var modalInstance =
            $uibModal.open({
              animation: true,
              ariaLabelledBy:"modal-header",
              templateUrl: 'app/factorymaster/transferReason.html',
              controller: 'transferReasonCtrrl'
            });
          modalInstance.resolve =  function(result) {

            var param = {
              "ids" : listToString(selectedRows , 'assignResultIds') ,
              "mode" : 6 ,
              "queryType" : 3 ,
              "assign_source":scope.documentType,
              "confirmFactory" : confirmFactory ,
              "isFactoryAdjustment" : 'YES',
              transferReason: result.reason  ,
              transferRemark:result.remark
            }

            GLOBAL_Http($http , "cpo/api/worktable/adjust_assign" , 'POST' , param , function ( data ) {
              if ( data.status == 0 ) {

                __this.getTopGridInfo(scope);


              } else {

                modalAlert(CommonService , 2 , data.message , null);
              }
            } , function ( data ) {

              modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
            });
          }
        }
        this.filterRequest = function ( scope,field , shouldNumber , resultBlock ) {
          var params = { "field" : field , "queryType" : 1 };
          if(scope.searchRequestByOrder.orderTime.id) {
            params[ "eq_document_id" ] = scope.searchRequestByOrder.orderTime.id;
          }
          GLOBAL_Http($http , "cpo/api/factory_adjustment/query_adjustment_data_filter?" , 'GET' , params , function ( data ) {
            var result = [];
            if ( data.output ) {
              result = data.output.filter(function ( item ) {
                return item.hasOwnProperty("field")
              }).map(function ( item ) {
                if ( shouldNumber ) {
                  return {
                    id : item.field ? item.field : "" ,
                    label : (item.field ? item.field : "[Empty]") + " ( " + item.fieldCount + " )"
                  }
                } else {
                  return {
                    id : item.field ? item.field : "" ,
                    label : (item.field ? item.field : "[Empty]")
                  }
                }

              });
            }

            if ( resultBlock ) {
              resultBlock([ { id : "" , label : "All" } ].concat(result));
            }
          } , function ( data ) {

            if ( resultBlock ) {
              resultBlock([ { id : "" , label : "All" } ]);
            }

          });
        }
        this.initGripOption = function ( scope ) {
          // enablePaginationControls: false,
          var redLabelTemplate = document.getElementById("redLabelTemplate").innerText;
          //  scope.factoryCapacityData = null;
          scope.lastSelectRow = null;
          scope.gridOptions1 = {
            data : "FactoryAdjustmentNewOrderData" ,
            enableColumnMenus : true ,
            enableGridMenu : true ,
            multiSelect : true ,
            rowEditWaitInterval : -1 ,
            enableRowSelection : true ,
            enableFullRowSelection : false ,
            enableRowHeaderSelection : true ,
            enableHorizontalScrollbar : 1 ,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar : 0 ,
            totalItems : scope.page.totalNum ,
            enablePagination : true ,
            useExternalPagination : false ,
            showLoading : true ,
            zsGridName:"factoryAdjustment3",
            paginationPageSizes : [ 10,20,50,100 ] ,
            paginationPageSize : 20 ,
            enablePaginationControls : true ,
            expandableRowTemplate : '<div class="sub-ui-grid capacity-sub-grid" style="height: 230px" ui-grid-pagination ui-grid-selection ui-grid="row.entity.subGridOptions"></div>' ,
            expandableRowHeight : 230 ,
            expandableRowScope : 'row.subGridScope' ,
            columnDefs : [ {
              name : 'factoryName' ,
              displayName : "" ,
              field : '' ,
              minWidth : '140' ,
              enableCellEdit : false ,

            } ] ,
            onRegisterApi : function ( gridApi ) {
              scope.gridApi1 = gridApi;
              gridApi.core.on.filterChanged(scope, function(col) {

                __this.getTopGridInfo(scope);
              });
              gridApi.core.on.columnVisibilityChanged(scope, CommonService.columnVisibilityChanged);
            }
          };



        };
        this.getTopGridInfo = function ( scope ) {
          scope.FactoryAdjustmentNewOrderData = [];
          var params = angular.copy(scope.info);

          if(scope.searchRequestByOrder.site.id.length>0){
            params.eq_confirm_factory = scope.searchRequestByOrder.site.id;
          }

          if(scope.searchRequestByOrder.productType.id.length>0){
            params.eq_product_type_fr = scope.searchRequestByOrder.productType.id;
          }else{
            delete params.eq_product_type_fr;
          }

          if(scope.searchRequestByOrder.fabricType.id.length>0){
            params.eq_fabric_type = scope.searchRequestByOrder.fabricType.id;
          }else{
            delete params.eq_fabric_type;
          }

          if(scope.searchRequestByOrder.workingNo.id.length>0){
            params.eq_working_no = scope.searchRequestByOrder.workingNo.id;
          }else{
            delete params.eq_working_no;
          }

          if(scope.searchRequestByOrder.fromDate&&scope.searchRequestByOrder.fromDate.length>0){
            params.pv_month = scope.searchRequestByOrder.fromDate;
          }else{
            delete params.pv_month;
          }
          if(scope.searchRequestByOrder.toDate&&scope.searchRequestByOrder.toDate.length>0){
            params.to_pv_month = scope.searchRequestByOrder.toDate;
          }else{
            delete params.to_pv_month;
          }

          if(scope.searchRequestByOrder.site.label!="All"){
            params["eq_confirmFactory"] = scope.searchRequestByOrder.site.label;
          }
          for (var key in params){
            if(!params[key]){
              delete params[key]
            }
          }

          params.eq_document_id  =scope.documentId;
          params.eq_document_type  =scope.documentType;

       //   var url = "cpo/api/factory_adjustment/query_adjustment_data_filter?";
         var  url     = "cpo/api/factory_adjustment/query_adjustment_data_by_order_filter?";
          scope.gridOptions1.zsColumnFilterRequestUrl = url;
          scope.gridOptions1.zsColumnFilterRequestParam = angular.copy(params);

          params.pageSize = 10000 ;
          params.pageNo = 1;
          var searchInfo = FilterInGridService.getFilterParams(scope.gridApi1.grid);
          if(searchInfo){
            for(var key in searchInfo){
              params[key] = searchInfo[key];
            }
          }

          if(jQuery("#garmentQty").val()&&jQuery("#garmentQty").val().length){
            var key = scope.searchRequestByOrder.condition.id+"_total_qty";
            params[key] = jQuery("#garmentQty").val();
          }
          if(jQuery("#totalPvQuantitys").val()&&jQuery("#totalPvQuantitys").val().length){
            var key = scope.searchRequestByOrder.condition2.id+"_totalPvQuantitys";
            params[key] = jQuery("#totalPvQuantitys").val();
          }

          if(searchInfo){
            for(var key in searchInfo){
              params[key] = searchInfo[key];
            }
          }
          scope.gridOptions1.showLoading = true;
          GLOBAL_Http($http , "cpo/api/factory_adjustment/query_adjustment_data_by_order?" , 'GET' , params , function ( data ) {

            var headers = [];
            scope.gridOptions1.showLoading = false;
          //  scope.documentType = data.documentType;

            // for ( var key in data.headers ) {
            //   var content = data.headers[ key ];
            //   var item = {
            //     name : content ,
            //     displayName : content ,
            //     visible: !CommonService.columnHasHide( scope.gridOptions1.zsGridName,key),
            //     field : key ,
            //     width : '150',
            //     headerCellTemplate:'app/worktable/filter.html'
            //   };
            //   headers.push(item);
            //
            // }

            var headers = [];
            // angular.forEach(data.output.header,function(item){
            //   headers.push({
            //     name : item.headerName ,
            //     displayName : item.headerName ,
            //     visible: !CommonService.columnHasHide( scope.gridOptions1.zsGridName,item.jsonObjectKey),
            //     field : item.jsonObjectKey ,
            //     width : '150',
            //     headerCellTemplate:'app/worktable/filter.html'
            //   })
            // });

            angular.forEach(data.output.header,function(item,index){
              headers.push({
                name : (item.headerName?item.headerName:"")+index ,
                displayName : item.headerName ,
                visible: !CommonService.columnHasHide( scope.gridOptions1.zsGridName,item.jsonObjectKey),
                field : item.jsonObjectKey ,
                width : '150',
                headerCellTemplate:'app/worktable/filter.html'
              })
            });
            scope.gridOptions1.columnDefs = angular.copy(headers);
            data.output.data = translateData( data.output.data);
            scope.FactoryAdjustmentNewOrderData =  data.output.data;
            scope.page.totalNum = data.output.total;
            scope.gridOptions1.totalItems = scope.page.totalNum;


          } , function ( data ) {
            scope.gridOptions1.showLoading = false;

          });
        }
        this.expand = function ( scope ) {
          scope.showBottom = true;
        }
        this.getFactoryList = function ( scope ) {
          var _this = this;
          var param = {
            pageNo : 1 ,
            pageSize : 1000,
            eq_factory_type:0
          }
          GLOBAL_Http($http , "portal/factory/find?" , 'GET' , param , function ( data ) {

            if ( data.rows ) {
              scope.items = translateData(data.rows);

              scope.siteList = new Array();
              scope.siteList.push( { id : "" , label : "All" });
              for ( var i = 0 ; i < scope.items.length ; i++ ) {
                var siteData = {
                  id : scope.items[ i ].factoryId ,
                  label : scope.items[ i ].factSimpName
                }

                scope.siteList.push(siteData);
                scope.searchRequestByOrder.site = scope.siteList[0];
              }
            } else {
              scope.siteList = [{ id : "" , label : "All" }];
              scope.searchRequestByOrder.site = scope.siteList[0];

              //  modalAlert(CommonService , 2 , data.message , null);
            }
            //
          } , function ( data ) {
            scope.siteList = [{ id : "" , label : "All" }];
            scope.searchRequestByOrder.site = scope.siteList[0];

          });
        }
        this.collapose = function ( scope ) {

          scope.showBottom = false;
        }
        this.init = function ( scope ) {
          ;
          jQuery(".form_date").datetimepicker({
            format : 'yyyymm' ,
            autoclose : true ,//自动关闭
            minView : 3 ,//最精准的时间选择为日期0-分 1-时 2-日 3-月
            maxView : 3 ,
            startView : 3 ,
            weekStart : 0

          });


          scope.searchRequestByOrder = {
            site:{ id : "" , label : "All" },
            workingNo:{ id : "" , label : "All" } ,
            condition:{ label : ">=" , id : "gte" },
            condition2:{ label : ">=" , id : "gte" },
            productType:{ id : "" , label : "All" } ,
            fabricType:{ id : "" , label : "All" } ,
            fromDate:"",
            toDate:"",
            garmentQty:""
          };

          scope.conditions = [
            { label : ">=" , id : "gte" } ,
            { label : "=" , id : "eq" } ,
            { label : ">" , id : "gt" },
            { label : "<" , id : "lt" } ,
            { label : "<=" , id : "lte" } ];
          scope.searchRequestByOrder.condition = scope.conditions[ 0 ];
          scope.searchRequestByOrder.condition2 = scope.conditions[ 0 ];





          scope.selectSettings = {
            enableSearch : false ,
            showUncheckAll : false ,
            showCheckAll : false ,
            scrollable : false ,
            scrollableHeight : '230px' ,
            checkboxes : false ,
            selectionLimit : 1
          };
          scope.fromFactory = [ { id : 1 , label : "David" } , { id : 2 , label : "Jhon" } , {
            id : 3 ,
            label : "Danny"
          } ];
          ;
          scope.fromFactorymodel = {};



          scope.$on('factoryneworderadjustment.afterInit' , function ( event , data ) {

            scope.info = data;
            __this.getFactoryList(scope);

            var index = 0;
              if(scope.info.eq_working_no) {
                for ( var i in scope.workingNos ) {
                  if ( scope.workingNos[ i ].id.toUpperCase() == scope.info.eq_working_no.toUpperCase() ) {
                    index = i;
                    break;
                  }
                }
              }
            scope.searchRequestByOrder.workingNo = scope.workingNos[ index ];
          //  scope.searchRequestByOrder.productType = angular.copy(scope.searchRequest.productType) ;

            index = 0;
            var array =  scope.fabricTypes;
            for (var i in array){
              if ( array[ i ].id.toUpperCase() == scope.info.eq_fabric_type.toUpperCase() ) {
                index = i;
                break;
              }
            }
            scope.searchRequestByOrder.fabricType = scope.fabricTypes[index];

            index = 0;
            array =  scope.productTypes;
            for (var i in array) {
              if ( array[ i ].id.toUpperCase() == scope.info.eq_product_type_fr.toUpperCase() ) {
                index = i;
                break;
              }
            }
            scope.searchRequestByOrder.productType = scope.productTypes[index];
            __this.getTopGridInfo(scope);

            // scope.searchRequestByOrder = {
            //   site:{ id : "" , label : "All" },
            //   workingNo:angular.copy(scope.searchRequest.workingNo) ,
            //   condition:{ label : ">=" , id : "gte" },
            //   condition2:{ label : ">=" , id : "gte" },
            //   productType:angular.copy(scope.searchRequest.productType) ,
            //   fabricType:angular.copy(scope.searchRequest.fabricType),
            //   fromDate:"",
            //   toDate:"",
            //   garmentQty:""
            // };
            // __this.filterRequest(scope,"workingNo" , false , function ( array ) {
            //
            //   scope.workingNos = array;
            //   var index = 0;
            //   if(scope.info.eq_working_no){
            //     for (var i in array){
            //       if(array[i].id.toUpperCase()==scope.info.eq_working_no.toUpperCase()){
            //         index = i;
            //         break;
            //       }
            //     }
            //   }
            //
            //   scope.searchRequestByOrder.workingNo = scope.workingNos[index];
            //
            //   __this.filterRequest("productTypeFr" , false , function ( array ) {
            //
            //     scope.productTypes = array;
            //
            //     var index = 0;
            //     if(scope.info.eq_product_type_fr) {
            //       for ( var i in array ) {
            //         if ( array[ i ].id.toUpperCase() == scope.info.eq_product_type_fr.toUpperCase() ) {
            //           index = i;
            //           break;
            //         }
            //       }
            //     }
            //
            //     scope.searchRequestByOrder.productType = scope.productTypes[index];
            //
            //     __this.filterRequest("fabricType" , false , function ( array ) {
            //
            //       scope.fabricTypes = angular.copy(array);
            //
            //
            //       var index = 0;
            //       if(scope.info.eq_fabric_type) {
            //         for ( var i in array ) {
            //           if ( array[ i ].id.toUpperCase() == scope.info.eq_fabric_type.toUpperCase() ) {
            //             index = i;
            //             break;
            //           }
            //         }
            //       }
            //
            //       scope.searchRequestByOrder.fabricType = scope.fabricTypes[index];
            //       __this.getTopGridInfo(scope);
            //     });
            //
            //   });
            //
            // });



          });
          scope.page = {
            curPage : 1 ,
            pageSize : 100 ,
            sortColumn : 'id' ,
            sortDirection : false ,
            totalNum : 0
          };

          scope.lastSelectRow = null;
          __this.initGripOption(scope);


        }
      }


    ])

    .controller('FactoryAdjustmentNewOrderCtrl' , [ '$scope' , 'FactoryAdjustmentNewOrderService' ,
      function ( $scope , FactoryAdjustmentNewOrderService ) {
        FactoryAdjustmentNewOrderService.init($scope);
        $scope.example1model = [];
        $scope.example1data = [ { id : 1 , label : "David" } , { id : 2 , label : "Jhon" } , {
          id : 3 ,
          label : "Danny"
        } ];
        $scope.selectSettings = {
          enableSearch : false ,
          showUncheckAll : false ,
          showCheckAll : false ,
          scrollable : false ,
          scrollableHeight : '230px' ,
          checkboxes : false ,
          selectionLimit : 1
        };
        $scope.adjustFactoryAssignment2 = function ( index , confirmFactory ) {
          FactoryAdjustmentNewOrderService.adjustFactoryAssignment2($scope , index , confirmFactory);
        };
        $scope.closePage = function () {
          $scope.$emit('factoryneworderadjustment.close' , null);
        }
        $scope.expand = function () {
          FactoryAdjustmentNewOrderService.expand($scope);
        }
        $scope.collapose = function () {

          FactoryAdjustmentNewOrderService.collapose($scope);
        }
        $scope.exportFile = function(){
          FactoryAdjustmentNewOrderService.exportFile($scope);

        }
        $scope.search = function(){
          FactoryAdjustmentNewOrderService.search($scope);

        }

      } ])
})();
