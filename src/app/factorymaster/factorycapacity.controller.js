(function () {
  'use strict';
  angular
    .module('cpo')
    .service('FactoryCapacityService' , [ '$http' , '$translate' , 'CommonService' , '$uibModal' , 'factoryCapacityService' , 'uiGridConstants' , '$compile' ,'$timeout',
      function ( $http , $translate , CommonService , $uibModal , factoryCapacityService , uiGridConstants , $compile ,$timeout) {
        var _this = this;
        this.type = 0;
        this.showFactioryDetail = false;
        this.refreshSMVOrPCS = function(scope){
          var _this = this;
          if ( scope.lastSelectRow ) {
            scope.lastSelectRow.isSelected = false;
          }
          scope.gridOptions1.showLoading = true;
          scope.showFactioryDetail = false;
          scope.gridOptions1.columnDefs= [{
            name : '' ,
            displayName :"" ,
            field : '???' ,
            minWidth : '120'
          } ];
          $timeout(function(){
            scope.gridOptions1.columnDefs= _this.factoryCapactiyTopColumns(scope);
            scope.gridApi1.core.refresh();

            $timeout(function(){
              scope.gridOptions1.showLoading = false;
            },300);
          },300);

        }
        this.factoryCapactiyTopColumns = function(scope){

          var columns =  [ {
            name : 'factoryName' ,
            displayName : $translate.instant('worktable.FACTORY_NAME') ,
            field : 'factoryName' ,
            minWidth : '120' ,
            enableCellEdit : false ,
            pinnedLeft : true
          } ];
          if(scope.searchFilter.showType.id=="SMV"){
            scope.gridOptions1.rowHeight= 100;
            var resultColumn = {
              name : ('attributeName') ,
              displayName : "Attributes" ,
              field : "attributeName" ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : true ,
              cellTemplate : '<div class="height-20 cell-text-bolder" >FR Loading</div><div  class="cell-divider2 height-20">CPO New Loading</div><div  class="cell-divider2 height-20">CPO Total Loading</div>  <div  class="cell-divider2 height-20">Capacity</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

            }
            columns.push(resultColumn);

            for ( var i = 0 ; i < scope.titleData.length ; i++ ) {
              var dyfrLoadingText =  '&nbsp;{{row.entity.frLoading' + scope.titleData[ i ] + '|quantityFilter}}';
              var dyLoadingText = '&nbsp;{{row.entity.loading' + scope.titleData[ i ] + '|quantityFilter}}';
              var dyculLoadingText = '&nbsp;{{row.entity.curLoading' + scope.titleData[ i ] + '|quantityFilter}}';
              var dycapacityText = '&nbsp;{{row.entity.capacity' + scope.titleData[ i ] + '|quantityFilter}}';
              var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[row.entity.over"+scope.titleData[ i ]+"]";
              var dyfillRateText = '<div  class="height-20 cell-text-bolder" ng-class=' + fillRatengClassContent + '>&nbsp;{{row.entity.fillRate' + scope.titleData[ i ] + '|quantityFilter}}';
              var resultCellTemplate = '<div  class="cell-divider2 height-20">'+ dyfrLoadingText+'</div><div  class="cell-divider2 height-20">' + dyculLoadingText + '</div> <div class="height-20 cell-text-bolder">' + dyLoadingText + '</div> <div  class="cell-divider2 height-20">' + dycapacityText + '</div>' + dyfillRateText + '</div>';

              var resultColumn = {
                name : ('fillrate' + i) ,
                displayName : scope.titleData[ i ] ,
                field : 'fillRate' + scope.titleData[ i ] ,
                minWidth : '120' ,
                enableCellEdit : false ,
                pinnedLeft : false ,
                cellTemplate : resultCellTemplate
              }

              columns.push(resultColumn);

            }
          }else{

            scope.gridOptions1.rowHeight= 80;
            var resultColumn = {
              name : ('attributeName') ,
              displayName : "Attributes" ,
              field : "attributeName" ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : true ,
              cellTemplate : '<div  class="cell-divider2 height-20">CPO New Loading</div><div  class="cell-divider2 height-20">CPO Total Loading</div>  <div  class="cell-divider2 height-20">Capacity</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

            }
            columns.push(resultColumn);
            for ( var i = 0 ; i < scope.titleData.length ; i++ ) {
              var dyLoadingText = '&nbsp;{{row.entity.loadingByPcs' + scope.titleData[ i ] + '|quantityFilter}}';
              var dyculLoadingText = '&nbsp;{{row.entity.curLoadingByPcs' + scope.titleData[ i ] + '|quantityFilter}}';
              var dycapacityText = '&nbsp;{{row.entity.capacityByPcs' + scope.titleData[ i ] + '|quantityFilter}}';
              var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[row.entity.overByPcs"+ scope.titleData[ i ]+"]";
              var dyfillRateText = '<div class="height-20 cell-text-bolder" ng-class=' + fillRatengClassContent + '>&nbsp;{{row.entity.fillRateByPcs' + scope.titleData[ i ] + '|quantityFilter}}';
              var resultCellTemplate = '<div  class="cell-divider2 height-20">' + dyculLoadingText + '</div> <div class="height-20 cell-text-bolder">' + dyLoadingText + '</div> <div  class="cell-divider2 height-20">' + dycapacityText + '</div>' + dyfillRateText + '</div>';

              var resultColumn = {
                name : ('fillrate' + i) ,
                displayName : scope.titleData[ i ] ,
                field : 'fillRate' + scope.titleData[ i ] ,
                minWidth : '120' ,
                enableCellEdit : false ,
                pinnedLeft : false ,
                cellTemplate : resultCellTemplate
              }

              columns.push(resultColumn);

            }
          }


          return columns;
        }

        this.dealWithTopColumns = function ( scope , data ) {

          scope.titleData = data.headerList ? data.headerList : data.message;
          scope.gridOptions2.rowHeight = 80;
          if(scope.type==0){
            scope.gridOptions1.columnDefs = this.factoryCapactiyTopColumns(scope);
          }
          else if ( scope.type == 2 ) {

            scope.gridOptions1.columnDefs = [ {
              name : 'factoryName' ,
              displayName : $translate.instant('worktable.FACTORY_NAME') ,
              field : 'factoryName' ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : true

            } ];


            scope.gridOptions1.rowHeight= 100;
            var resultColumn = {
              name : ('attributeName') ,
              displayName : "Attributes" ,
              field : "attributeName" ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : true ,
              cellTemplate : '<div class="height-20 cell-text-bolder" >FR Loading</div><div  class="cell-divider2 height-20">CPO New Loading</div><div  class="cell-divider2 height-20">CPO Total Loading</div>  <div  class="cell-divider2 height-20">Capacity</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

            }
            scope.gridOptions1.columnDefs.push(resultColumn);

            for ( var i = 0 ; i < scope.titleData.length ; i++ ) {
              var dyfrLoadingText =  '&nbsp;{{row.entity.frLoading' + scope.titleData[ i ] + '|quantityFilter}}';
              var dyLoadingText = '&nbsp;{{row.entity.loading' + scope.titleData[ i ] + '|quantityFilter}}';
              var dyculLoadingText = '&nbsp;{{row.entity.curLoading' + scope.titleData[ i ] + '|quantityFilter}}';
              var dycapacityText = '&nbsp;{{row.entity.capacity' + scope.titleData[ i ] + '|quantityFilter}}';
              var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[row.entity.over"+scope.titleData[ i ]+"]";
              var dyfillRateText = '<div  class="height-20 cell-text-bolder" ng-class=' + fillRatengClassContent + '>&nbsp;{{row.entity.fillRate' + scope.titleData[ i ] + '|quantityFilter}}';
              var resultCellTemplate = '<div  class="cell-divider2 height-20">'+ dyfrLoadingText+'</div><div  class="cell-divider2 height-20">' + dyculLoadingText + '</div> <div class="height-20 cell-text-bolder">' + dyLoadingText + '</div> <div  class="cell-divider2 height-20">' + dycapacityText + '</div>' + dyfillRateText + '</div>';

              var resultColumn = {
                name : ('fillrate' + i) ,
                displayName : scope.titleData[ i ] ,
                field : 'fillRate' + scope.titleData[ i ] ,
                minWidth : '120' ,
                enableCellEdit : false ,
                pinnedLeft : false ,
                cellTemplate : resultCellTemplate
              }


              scope.gridOptions1.columnDefs.push(resultColumn);
            }

          } else {
            scope.gridOptions1.columnDefs = [ {
              name : 'factoryName' ,
              displayName : $translate.instant('worktable.FACTORY_NAME') ,
              field : 'factoryName' ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : true

            } ];
            var resultColumn = {
              name : ('attributeName') ,
              displayName : "Attributes" ,
              field : "attributeName" ,
              minWidth : '120' ,
              enableCellEdit : false ,
              pinnedLeft : true ,
              cellTemplate : '<div  class="cell-divider2 height-20">Existing Loading</div> <div class="height-20 cell-text-bolder" >New Loading</div> <div  class="cell-divider2 height-20">Capacity</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

            }


            scope.gridOptions1.columnDefs.push(resultColumn);

            for ( var i = 0 ; i < scope.titleData.length ; i++ ) {
              var dyLoadingText = '&nbsp;{{row.entity.loading' + scope.titleData[ i ] + '|quantityFilter}}';
              var dyculLoadingText = '&nbsp;{{row.entity.curLoading' + scope.titleData[ i ] + '|quantityFilter}}';
              var dycapacityText = '&nbsp;{{row.entity.capacity' + scope.titleData[ i ] + '|quantityFilter}}';
              var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[row.entity.over"+scope.titleData[ i ]+"]";
              var dyfillRateText = '<div class="height-20 cell-text-bolder" ng-class=' + fillRatengClassContent + '>&nbsp;{{row.entity.fillRate' + scope.titleData[ i ] + '|quantityFilter}}';

              var resultColumn = {
                name : ('fillrate' + i) ,
                displayName : scope.titleData[ i ] ,
                field : 'fillRate' + scope.titleData[ i ] ,
                minWidth : '120' ,
                enableCellEdit : false ,
                pinnedLeft : false ,
                cellTemplate : '<div  class="cell-divider2 height-20">' + dyLoadingText + '</div> <div class="height-20 cell-text-bolder">' + dyculLoadingText + '</div> <div  class="cell-divider2 height-20">' + dycapacityText + '</div>' + dyfillRateText + '</div>'
              }

              scope.gridOptions1.columnDefs.push(resultColumn);


            }
          }


        }

        this.init = function ( scope ) {

          scope.searchFilter = {
            showType : {
              id : "SMV" ,
              label : "SMV"
            },
            fromMonth:"",
            toMonth:""
          };
          scope.monthTypes = [{
            id:"NO",
            label:"Month"
          },{
            id : "YES" ,
            label : "Half Month"
          }];
          scope.showTypes = [{
            id:"SMV",
            label:"SMV"
          },{
            id:"PCS",
            label:"PCS"
          }];
          scope.queryTypes = [{
            id:'CUS_LC0190',
            label:'CUS FC & LC0190'
          },{
            id:'MKT',
            label:'MKT FC'
          },{
            id:'CUS',
            label:'CUS FC'
          },{
            id:'LC0190',
            label:'LC0190'
          },
            {
              id:'ALL',
              label:'MKT & CUS FC & LC0190'
            }
          ];
          scope.searchFilter.queryType = scope.queryTypes[0];
          scope.searchFilter.monthType = scope.monthTypes[0];
          scope.searchFilter.showType = scope.showTypes[0];
          scope.searchFilter.deduction=true;
          scope.titleData = [];
          scope.forecastType = "All";
          scope.smartButtonTextProviderModel = [];


          scope.$on('factoryadjustment.close' , function ( data ) {
            scope.showAdjustment = '';
          });
          this.initGripOption(scope);
          //	this.getLoading(scope, 0);

        };

        this.toggleFilterRow = function ( scope ) {
          scope.gridOptions1.enableFiltering = !scope.gridOptions1.enableFiltering;
          scope.gridApi1.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        }
        this.refresh = function ( scope ) {
          _this.getLoading(scope , scope.type);
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
        this.getLoading = function ( scope , type ) {
          scope.type = type;
          scope.gridOptions1.showLoading = true;
          scope.gridOptions2.columnDefs = [];
          scope.gridOptions2.data = [];
          scope.showFactioryDetail = false;
          scope.gridOptions1.columnDefs = [ {
            name : 'factoryName' ,
            displayName : $translate.instant('worktable.FACTORY_NAME') ,
            field : 'factoryName' ,
            minWidth : '120' ,
            enableCellEdit : false
          }
          ];
          scope.factoryCapacityData = [];

          if ( scope.gridApi1 ) {
            scope.gridApi1.pagination.seek(1);
          }
          if ( scope.gridApi2 ) {
            scope.gridApi2.pagination.seek(1);
          }
          if ( type == 2 ) {
            var param = {

              pageNo : 1 ,
              pageSize : 12000
            }
            param.query_type = scope.searchFilter.queryType.id;
            param.isHalfMonth = scope.searchFilter.monthType.id;
						param.isDeduction = scope.searchFilter.deduction ? 'YES' : 'NO';

            var in_month  = getMonths(scope.searchFilter.fromMonth,scope.searchFilter.toMonth);
            if(in_month){
              param.in_month = in_month;
            }

            GLOBAL_Http($http , "cpo/api/factory/query_factory_process?" , 'GET' , param , function ( data ) {
              scope.gridOptions1.showLoading = false;
              if ( data.status == 0 ) {
                if ( data.output ) {
                  _this.dealWithTopColumns(scope , data);
                  var result = factoryCapacityService.dealWithProcessCapacityData(data);
                  scope.factoryCapacityData = result;


                } else {
                  scope.factoryCapacityData = [];
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
            return;
          }


          var param = {
            // 'in_month': months,
            pageNo : 1 ,
            pageSize : 12000 ,
            factory_type : type
          }
          if(type==0){
            param.query_type = scope.searchFilter.queryType.id;
            param.isHalfMonth = scope.searchFilter.monthType.id;
          }
          param.isDeduction = scope.searchFilter.deduction ? 'YES' : 'NO';

          var in_month  = getMonths(scope.searchFilter.fromMonth,scope.searchFilter.toMonth);
          if(in_month){
            param.in_month = in_month;
          }

          GLOBAL_Http($http , "cpo/api/factory/query_factory_loading?" , 'GET' , param , function ( data ) {
            scope.gridOptions1.showLoading = false;
            if ( data.status == 0 ) {
              if ( data.output ) {
                _this.dealWithTopColumns(scope , data);
                var result = null;


                if ( type == 0 ) {
                  result = factoryCapacityService.dealWithFactoryCapacityData(data);
                } else {
                  result = factoryCapacityService.dealWithSampleRoomCapacityData(data);
                }
                scope.factoryCapacityData = result;

              } else {
                scope.factoryCapacityData = [];
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
          //  scope.factoryCapacityData = null;
          scope.lastSelectRow = null;
          scope.gridOptions2 = {
            paginationPageSize : 4 ,
            paginationPageSizes : [ 4 ] ,
            enablePagination : true ,
            useExternalPagination : false ,
            enablePaginationControls : true ,
            enableColumnMenus : true ,
            enableGridMenu : true ,
            rowEditWaitInterval : -1 ,
            enableRowSelection : true ,
            enableRowHeaderSelection : true ,
            enableFullRowSelection : false ,
            enableSelectAll : true ,
            enableHorizontalScrollbar : 1 ,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar : 0 ,
            columnDefs : [] ,
            onRegisterApi : function ( gridApi ) {

              scope.gridApi2 = gridApi;

              gridApi.pagination.on.paginationChanged(scope , function ( newPage , pageSize ) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;
              });
            }
          };
          scope.gridOptions1 = {
            data : "factoryCapacityData" ,
            enableColumnMenus : true ,
            enableGridMenu : true ,
            multiSelect : false ,

            rowEditWaitInterval : -1 ,
            enableRowSelection : true ,
            enableFullRowSelection : true ,
            enableRowHeaderSelection : true ,
            enableHorizontalScrollbar : 1 ,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar : 0 ,
            // totalItems: scope.page.totalNum,
            enablePagination : true ,
            useExternalPagination : false ,
            showLoading : true ,
            rowHeight : 80 ,
            paginationPageSizes : [ 4 ] ,
            paginationPageSize : 4 ,
            enablePaginationControls : true ,
            expandableRowTemplate : '<div class="sub-ui-grid capacity-sub-grid" style="height: 230px" ui-grid-pagination ui-grid-selection ui-grid="row.entity.subGridOptions"></div>' ,
            expandableRowHeight : 230 ,
            expandableRowScope : 'row.subGridScope' ,
            columnDefs : [ {
              name : 'factoryName' ,
              displayName : $translate.instant('worktable.FACTORY_NAME') ,
              field : 'factoryName' ,
              minWidth : '120' ,
              enableCellEdit : false ,

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


              scope.gridApi1.selection.on.rowSelectionChanged(scope , function ( row ) {
                if ( row.isSelected ) {
                  scope.gridApi2.pagination.seek(1);
                  scope.showFactioryDetail = true;
                  if ( scope.lastSelectRow ) {
                    scope.lastSelectRow.isSelected = false;
                  }


                  scope.lastSelectRow = row;
                  var columns = new Array();

                  if(scope.type==0){

                    var buttonColumn = {
                      name : 'adjust' ,
                      displayName : "" ,
                      field : '' ,
                      minWidth : '70' ,
                      pinnedLeft : true ,
                      enableCellEdit : false ,
                      cellTemplate : '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-info" style="margin-top: 20px;" ng-click="grid.appScope.adjust(row)" >Adjust</button></div>'
                    };
                    var productTypeColumn = {
                      name : 'productType' ,
                      displayName : $translate.instant('worktable.PRODUCT_TYPE') ,
                      field : 'productType' ,
                      minWidth : '120' ,
                      pinnedLeft : true ,
                      enableCellEdit : false
                    };
                    var wovenKnitColumn = {
                      name : 'wovenKnit' ,
                      displayName : $translate.instant('worktable.WOVEN_KNIT') ,
                      field : 'wovenKnit' ,
                      minWidth : '100' ,
                      pinnedLeft : true ,
                      enableCellEdit : false
                    };
                    var planGroup = {
                      name : 'apGroup' ,
                      displayName : "Plan Group" ,
                      field : 'apGroup' ,
                      minWidth : '120' ,
                      pinnedLeft : true ,
                      enableCellEdit : false
                    };
                    columns.push(buttonColumn);
                   // columns.push(productTypeColumn);
                   // columns.push(wovenKnitColumn);
                    columns.push(planGroup);
                    scope.gridOptions2.rowHeight = 80;

                    if(scope.searchFilter.showType.id=="SMV"){
                      scope.gridOptions2.rowHeight= 100;
                      var resultColumn = {
                        name : ('attributeName') ,
                        displayName : "Attributes" ,
                        field : "attributeName" ,
                        minWidth : '120' ,
                        enableCellEdit : false ,
                        pinnedLeft : true ,
                        cellTemplate : '<div class="height-20 cell-text-bolder" >FR Loading</div><div  class="cell-divider2 height-20">CPO New Loading</div><div  class="cell-divider2 height-20">CPO Total Loading</div>  <div  class="cell-divider2 height-20">Capacity</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

                      }
                      columns.push(resultColumn);
                      for ( var i = 0 ; i < scope.titleData.length ; i++ ) {
                        var dyfrLoadingText =  '&nbsp;{{row.entity.frLoading' + scope.titleData[ i ] + '|quantityFilter}}';
                        var dyLoadingText = '&nbsp;{{row.entity.loading' + scope.titleData[ i ] + '|quantityFilter}}';
                        var dyculLoadingText = '&nbsp;{{row.entity.curLoading' + scope.titleData[ i ] + '|quantityFilter}}';
                        var dycapacityText = '&nbsp;{{row.entity.capacity' + scope.titleData[ i ] + '|quantityFilter}}';
                        var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[row.entity.over"+scope.titleData[ i ]+"]";
                        var dyfillRateText = '<div ng-click="grid.appScope.cellAdjust(row,\''+scope.titleData[ i ]+'\')" class="height-20 cell-text-bolder" ng-class=' + fillRatengClassContent + '>&nbsp;{{row.entity.fillRate' + scope.titleData[ i ] + '|quantityFilter}}';
                        var resultCellTemplate = '<div  class="cell-divider2 height-20">'+ dyfrLoadingText+'</div><div  class="cell-divider2 height-20">' + dyculLoadingText + '</div> <div class="height-20 cell-text-bolder">' + dyLoadingText + '</div> <div  class="cell-divider2 height-20">' + dycapacityText + '</div>' + dyfillRateText + '</div>';

                        var resultColumn = {
                          name : ('fillrate' + i) ,
                          displayName : scope.titleData[ i ] ,
                          field : 'fillRate' + scope.titleData[ i ] ,
                          minWidth : '120' ,
                          enableCellEdit : false ,
                          pinnedLeft : false ,
                          cellTemplate : resultCellTemplate
                        }

                        columns.push(resultColumn);

                      }
                    }else {
                      scope.gridOptions2.rowHeight = 80;




                      var resultColumn = {
                        name : ('attributeName') ,
                        displayName : "Attributes" ,
                        field : "attributeName" ,
                        minWidth : '120' ,
                        enableCellEdit : false ,
                        pinnedLeft : true ,
                        cellTemplate : '<div  class="cell-divider2 height-20">CPO New Loading</div><div  class="cell-divider2 height-20">CPO Total Loading</div>  <div  class="cell-divider2 height-20">Capacity</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

                      }
                      columns.push(resultColumn);
                      for ( var i = 0 ; i < scope.titleData.length ; i++ ) {
                        var dyLoadingText = '&nbsp;{{row.entity.loadingByPcs' + scope.titleData[ i ] + '|quantityFilter}}';
                        var dyculLoadingText = '&nbsp;{{row.entity.curLoadingByPcs' + scope.titleData[ i ] + '|quantityFilter}}';
                        var dycapacityText = '&nbsp;{{row.entity.capacityByPcs' + scope.titleData[ i ] + '|quantityFilter}}';
                        var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[row.entity.overByPcs"+ scope.titleData[ i ]+"]";
                        var dyfillRateText = '<div class="height-20 cell-text-bolder" ng-class=' + fillRatengClassContent + '>&nbsp;{{row.entity.fillRateByPcs' + scope.titleData[ i ] + '|quantityFilter}}';
                        var resultCellTemplate = '<div  class="cell-divider2 height-20">' + dyculLoadingText + '</div> <div class="height-20 cell-text-bolder">' + dyLoadingText + '</div> <div  class="cell-divider2 height-20">' + dycapacityText + '</div>' + dyfillRateText + '</div>';

                        var resultColumn = {
                          name : ('fillrate' + i) ,
                          displayName : scope.titleData[ i ] ,
                          field : 'fillRate' + scope.titleData[ i ] ,
                          minWidth : '120' ,
                          enableCellEdit : false ,
                          pinnedLeft : false ,
                          cellTemplate : resultCellTemplate
                        }

                        columns.push(resultColumn);

                      }
                    }
                  }else if(scope.type==1){

                    var buttonColumn = {
                      name : 'adjust' ,
                      displayName : "" ,
                      field : '' ,
                      minWidth : '70' ,
                      pinnedLeft : true ,
                      enableCellEdit : false ,
                      cellTemplate : '<div class="ui-grid-cell-contents"><button type="button" class="btn btn-info" style="margin-top: 20px;" ng-click="grid.appScope.adjust(row)" >Adjust</button></div>' ,
                    };
                    var productTypeColumn = {
                      name : 'productType' ,
                      displayName : $translate.instant('worktable.PRODUCT_TYPE') ,
                      field : 'productType' ,
                      minWidth : '120' ,
                      pinnedLeft : true ,
                      enableCellEdit : false
                    };
                    var wovenKnitColumn = {
                      name : 'wovenKnit' ,
                      displayName : $translate.instant('worktable.WOVEN_KNIT') ,
                      field : 'wovenKnit' ,
                      minWidth : '100' ,
                      pinnedLeft : true ,
                      enableCellEdit : false
                    };
                    var planGroup = {
                      name : 'apGroup' ,
                      displayName : "Plan Group" ,
                      field : 'apGroup' ,
                      minWidth : '120' ,
                      pinnedLeft : true ,
                      enableCellEdit : false
                    };
                    columns.push(buttonColumn);
                  //  columns.push(productTypeColumn);
                   // columns.push(wovenKnitColumn);
                    columns.push(planGroup);
                    var resultColumn = {
                      name : ('attributeName') ,
                      displayName : "Attribute" ,
                      field : "attributeName" ,
                      minWidth : '120' ,
                      enableCellEdit : false ,
                      pinnedLeft : true ,
                      cellTemplate :'<div  class="cell-divider2 height-20">CPO New Loading</div><div  class="cell-divider2 height-20">CPO Total Loading</div>  <div  class="cell-divider2 height-20">Capacity</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

                    }

                    columns.push(resultColumn);

                    for ( var i = 0 ; i < scope.titleData.length ; i++ ) {

                      var dyLoadingText = '&nbsp;{{row.entity.loading' + scope.titleData[ i ] + '|quantityFilter}}';
                      var dyculLoadingText = '&nbsp;{{row.entity.curLoading' + scope.titleData[ i ] + '|quantityFilter}}';
                      var dycapacityText = '&nbsp;{{row.entity.capacity' + scope.titleData[ i ] + '|quantityFilter}}';
                      var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[row.entity.over"+scope.titleData[ i ]+"]";
                      var dyfillRateText = '<div class="height-20 cell-text-bolder" ng-class=' + fillRatengClassContent + '>&nbsp;{{row.entity.fillRate' + scope.titleData[ i ] + '|quantityFilter}}';
                      var full = '<div  class="cell-divider2 height-20">' + dyculLoadingText + '</div> <div class="height-20 cell-text-bolder">' + dyLoadingText  + '</div> <div  class="cell-divider2 height-20">' + dycapacityText + '</div>' + dyfillRateText + '</div>'


                      var resultColumn = {
                        name : ('Attribute') + scope.titleData[ i ] ,
                        displayName : scope.titleData[ i ] ,
                        field : 'fillRate' + scope.titleData[ i ] ,
                        minWidth : '120' ,
                        enableCellEdit : false ,
                        pinnedLeft : false ,
                        cellTemplate : full
                      }
                      columns.push(resultColumn);


                    }
                  }else{
                    var buttonColumn = {
                      name : 'adjust' ,
                      displayName : "" ,
                      field : '' ,
                      minWidth : '70' ,
                      pinnedLeft : true ,
                      enableCellEdit : false ,
                      cellTemplate : '<button type="button" class="btn btn-info" style="margin-top: 20px" ng-click="grid.appScope.adjust(row)">Adjust</button>' ,
                    };
                    var processCodeColumn = {
                      name : 'processCode' ,
                      displayName : "Process Code" ,
                      field : 'processCode' ,
                      minWidth : '120' ,
                      pinnedLeft : true ,
                      enableCellEdit : false
                    };
                    var processNameColumn = {
                      name : 'processName' ,
                      displayName : "Process Name" ,
                      field : 'processName' ,
                      minWidth : '120' ,
                      pinnedLeft : true ,
                      enableCellEdit : false
                    };
                    columns.push(buttonColumn);
                 //   columns.push(processCodeColumn);
                    columns.push(processNameColumn);
                    scope.gridOptions2.rowHeight= 100;
                    var resultColumn = {
                      name : ('attributeName') ,
                      displayName : "Attributes" ,
                      field : "attributeName" ,
                      minWidth : '120' ,
                      enableCellEdit : false ,
                      pinnedLeft : true ,
                      cellTemplate : '<div class="height-20 cell-text-bolder" >FR Loading</div><div  class="cell-divider2 height-20">CPO New Loading</div><div  class="cell-divider2 height-20">CPO Total Loading</div>  <div  class="cell-divider2 height-20">Capacity</div><div class="height-20 cell-text-bolder">Fill Rate</div>'

                    }
                    columns.push(resultColumn);
                    for ( var i = 0 ; i < scope.titleData.length ; i++ ) {
                      var dyfrLoadingText = '&nbsp;{{row.entity.frLoading' + scope.titleData[ i ] + '|quantityFilter}}';
                      var dyLoadingText = '&nbsp;{{row.entity.loading' + scope.titleData[ i ] + '|quantityFilter}}';
                      var dyculLoadingText = '&nbsp;{{row.entity.curLoading' + scope.titleData[ i ] + '|quantityFilter}}';
                      var dycapacityText = '&nbsp;{{row.entity.capacity' + scope.titleData[ i ] + '|quantityFilter}}';
                      var fillRatengClassContent = "{true:'text-color-red',false:'text-color-normal'}[row.entity.over" + scope.titleData[ i ] + "]";
                      var dyfillRateText = '<div class="height-20 cell-text-bolder" ng-click="grid.appScope.cellAdjust(row,\''+scope.titleData[ i ]+'\')" ng-class=' + fillRatengClassContent + '>&nbsp;{{row.entity.fillRate' + scope.titleData[ i ] + '|quantityFilter}}';
                      var resultCellTemplate = '<div  class="cell-divider2 height-20">' + dyfrLoadingText + '</div><div  class="cell-divider2 height-20">' + dyculLoadingText + '</div> <div class="height-20 cell-text-bolder">' + dyLoadingText + '</div> <div  class="cell-divider2 height-20">' + dycapacityText + '</div>' + dyfillRateText + '</div>';

                      var resultColumn = {
                        name : ('fillrate' + i) ,
                        displayName : scope.titleData[ i ] ,
                        field : 'fillRate' + scope.titleData[ i ] ,
                        minWidth : '120' ,
                        enableCellEdit : false ,
                        pinnedLeft : false ,
                        cellTemplate : resultCellTemplate
                      }

                      columns.push(resultColumn);
                    }

                  }

                  scope.gridOptions2.columnDefs = columns;


                  scope.gridOptions2.multiSelect = false;
                  scope.gridOptions2.data = row.entity.items;

                } else {
                  scope.lastSelectRow = null;
                }
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
    .controller('FactoryCapacityCtrl' , [ '$scope' , 'FactoryCapacityService' ,'$timeout',
      function ( $scope , FactoryCapacityService,$timeout ) {
        $scope.adjust = function ( row ) {
          $scope.showAdjustment = 'adjustment';
          setTimeout(function () {
            var selectRowEntity = row.entity;
            selectRowEntity.productType = selectRowEntity.productType?selectRowEntity.productType:"";
            selectRowEntity.wovenKnit = selectRowEntity.wovenKnit?selectRowEntity.wovenKnit:"";
            selectRowEntity.processId = selectRowEntity.processId?selectRowEntity.processId:"";
            $scope.$broadcast("factoryadjustment.afterInit" , selectRowEntity);

          } , 1000);

          // $scope.forecastType = name;
        }
        $scope.cellAdjust = function ( row,date ) {
          $scope.showAdjustment = 'adjustment';
          setTimeout(function () {
            var selectRowEntity = row.entity;
            selectRowEntity.productType = selectRowEntity.productType?selectRowEntity.productType:"";
            selectRowEntity.wovenKnit = selectRowEntity.wovenKnit?selectRowEntity.wovenKnit:"";
            selectRowEntity.processId = selectRowEntity.processId?selectRowEntity.processId:"";
            selectRowEntity.date = date
            $scope.$broadcast("factoryadjustment.afterInit" , selectRowEntity);

          } , 1000);

          // $scope.forecastType = name;
        }
        FactoryCapacityService.init($scope);

        $scope.view = function () {
          FactoryCapacityService.view($scope , 'VIEW');
        }
        $scope.edit = function () {
          FactoryCapacityService.view($scope , 'EDIT');
        }
        $scope.toggleFilterRow = function () {

          FactoryCapacityService.toggleFilterRow($scope);
        };
        $scope.fetchLoadingInfo = function ( type ) {

          FactoryCapacityService.getLoading($scope , type);

        }
        $scope.refresh = function ( type ) {
          FactoryCapacityService.refresh($scope);

        }
        $scope.upload = function ( type ) {
          FactoryCapacityService.upload($scope);

        }
        $scope.refreshSMVOrPCS = function(scope){
          FactoryCapacityService.refreshSMVOrPCS($scope);

        }
        $scope.forecastTypeSelect = function ( name ) {
          $scope.forecastType = name;
        }
        $scope.color  = function(xx){

          if(!xx){

          }
        }
      }
    ])
})();
