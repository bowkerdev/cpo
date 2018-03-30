(function() {
  'use strict';
  angular
    .module('cpo')
    .service('MIOrderService', ['$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants','factoryCapacityService','workTableCommonService',
      function($http, $translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants,factoryCapacityService,workTableCommonService) {
        var searchKey2 = {};
        var searchKey4 = {};
        var searchKey5 = {};
        this.disableReleaseOrderButton = false;

        this.getTransitOrder = function(scope,page,status,filterTab){
          scope.disableReleaseOrderButton = false;
          var param = {
            orderType: 5,
            status: status,
            pageSize: page.pageSize,
            pageNo: page.curPage
          };

          if ( scope.selectDoc && scope.selectDoc.id ) {
            param.eq_document_id = scope.selectDoc.id;
          }

          if(filterTab) {
            page.curPage = 1;
            param.pageNo = page.curPage;
            if(filterTab == 5) {
              for(var attr in searchKey5) {
                if(searchKey5[attr]) {
                  param[ attr] = urlCharTransfer(searchKey5[attr]);
                }
              }
            }else if(filterTab==4){
              for(var attr in searchKey4) {
                if(searchKey4[attr]) {
                  param[ attr] = urlCharTransfer(searchKey4[attr]);
                }
              }
            }
          }

          var _this = this;
          scope.showLoading = true;
          if(status==4){
            scope.navList[1].loading = true;
          }else{
            scope.navList[2].loading = true;
          }
          GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

            scope.showLoading = false;
            if(data.status==0){

              if(data.output) {

                if(status==5){

                  scope.gridOptions3.data = translateData(data.output);
                  scope.page3.totalNum = data.total;
                  scope.gridOptions3.totalItems = scope.page3.totalNum;
                  scope.navList[2].count =  data.totalCount? data.totalCount:"0";
                  scope.navList[2].loading = false;
                  workTableCommonService.bulkorderDynamicColumnsMI(data.sizeListCount , scope.gridOptions3);

                  if ( scope.gridOptions3.data && scope.gridOptions3.data.length > 0 ) {
                    for ( var index in scope.gridOptions3.data ) {
                      var item = scope.gridOptions3.data[ index ];
                      var manufacturingSize = item.ediOrderSizes;
                      if ( manufacturingSize ) {
                        for ( var index2 = 0 ; index2 < manufacturingSize.length ; index2++ ) {
                          var xx = manufacturingSize[ index2 ];
                          if ( xx ) {
                            item[ "OQTY_" + (index2 + 1) ] = xx.sizeQuantity ? xx.sizeQuantity : "";
                            item[ "TS_" + (index2 + 1) ] = xx.manufacturingSize ? xx.manufacturingSize : "";
                            item[ 'SIZENAME_' + (index2 + 1) ] = xx.sizeName ? xx.sizeName : "";
                            item[ "unitPrice_" + (index2 + 1) ] = xx.unitPrice ? xx.unitPrice : "";
                          }
                        }
                      }
                    }
                  }
                }else if(status==4){
                  scope.gridOptions4.data = translateData(data.output);
                  scope.page4.totalNum = data.total;
                  scope.gridOptions4.totalItems = scope.page4.totalNum;
                  scope.navList[1].count =  data.totalCount? data.totalCount:"0";
                  scope.navList[1].loading = false;
                  workTableCommonService.bulkorderDynamicColumnsMI(data.sizeListCount , scope.gridOptions4);

                  if ( scope.gridOptions4.data && scope.gridOptions4.data.length > 0 ) {
                    for ( var index in scope.gridOptions4.data ) {
                      var item = scope.gridOptions4.data[ index ];
                      var manufacturingSize = item.ediOrderSizes;
                      if ( manufacturingSize ) {
                        for ( var index2 = 0 ; index2 < manufacturingSize.length ; index2++ ) {
                          var xx = manufacturingSize[ index2 ];
                          if ( xx ) {
                            item[ "OQTY_" + (index2 + 1) ] = xx.sizeQuantity ? xx.sizeQuantity : "";
                            item[ "TS_" + (index2 + 1) ] = xx.manufacturingSize ? xx.manufacturingSize : "";
                            item[ 'SIZENAME_' + (index2 + 1) ] = xx.sizeName ? xx.sizeName : "";
                            item[ "unitPrice_" + (index2 + 1) ] = xx.unitPrice ? xx.unitPrice : "";
                          }
                        }
                      }
                    }
                  }
                }


              }
            }else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {
            scope.showLoading = false;
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

        }

        this.adjustFactoryAssignment = function(scope, mode, tab) {
          var _this = this;
          var selectedRows = "";
          selectedRows = scope.gridApi2.selection.getSelectedRows();
          if(selectedRows.length <= 0) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            return;
          }
          var workingNos = [];
          if(mode == 1) {
            for(var i = 0; i < selectedRows.length; i++) {
              if(selectedRows[i].suggFactory != selectedRows[i].lastProdFactory) {
                var w = {
                  "workingNo": selectedRows[i].workingNo,
                  "lastProductionFactory": selectedRows[i].suggFactory
                }
                workingNos.push(w);
              }
            }
          } else if(mode == 2){
            for(var i = 0; i < selectedRows.length; i++) {
              if(selectedRows[i].lastProdFactory == "" || selectedRows[i].lastProdFactory == null){
                modalAlert(CommonService, 2, $translate.instant('errorMsg.LAST_PRODUCTION_FACTORY_IS_NULL'), null);
                return;
              }
            }
          }else if(mode == 3) {
            for(var i = 0; i < selectedRows.length; i++) {
              var w = {
                "workingNo": selectedRows[i].workingNo,
                "lastProductionFactory": selectedRows[i].aSource
              }
              workingNos.push(w);
            }
          }
          var param = {
            "ids": listToString(selectedRows, 'assignResultId'),
            "workingNos": workingNos,
            "mode": mode,
            "orderType":"4"
          }
          GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function(data) {
            if(data.status == 0) {
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
              _this.refreshAll(scope);
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.adjustFactoryAssignment2 = function(scope, mode, confirmFactory) {
          var _this = this;
          var selectedRows = "";
          if(scope.tabIndex==0){
            selectedRows = scope.gridApi2.selection.getSelectedRows();
          }else if(scope.tabIndex==1){
            selectedRows = scope.gridApi3.selection.getSelectedRows();
          }
          if(selectedRows.length <= 0) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            return;
          }
          var param = {
            "ids": listToString(selectedRows, 'assignResultId'),
            "workingNos": [],
            "mode": mode,
            "confirmFactory": confirmFactory,
            "orderType": "2"
          }

          GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function(data) {
            if(data.status == 0) {

              modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
              _this.refreshAll(scope);
            } else {

              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {

            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.reAssign = function(scope){
					var param = {
					  orderType: "5",
					  status: "0,2,3",
					  pageSize: 1,
					  pageNo: 1
					};
					var _this = this
					workTableCommonService.reAssignAll(scope,param,function(scope){
					  _this.refreshAll(scope)
					})
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
                scope.version = scope.versionList[0];
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
        /**
         * 更新new order选中的值
         * @param {*} scope
         */
        this.update = function(scope){
          var selectedRows = scope.gridApi2.selection.getSelectedRows();//获取new order表格选中的的行
          if(selectedRows.length <= 0) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            return;
          }
          var arr = selectedRows.map(function(obj){
              return{
                "assignResultId": obj.assignResultId,
                "stripes":scope.updateObj.stripes,
                "logo":scope.updateObj.logo,
                "sublimationPrinting":scope.updateObj.sblimiation,
                "nAndN":scope.updateObj.nn,
                "hemInsert":scope.updateObj.insert
              }
          })
          var param = {
            "miOrderExts": arr // 选中行的assignResultId
          }
          // return
          this.updateURL(scope,param,function(){
            scope.updateObj.stripes = ""
            scope.updateObj.logo = ""
            scope.updateObj.sblimiation = ""
            scope.updateObj.nn = ""
            scope.updateObj.insert = ""

          })

        }
        this.updateURL = function(scope,param,successFun){
          var _this = this
          GLOBAL_Http($http, "/cpo/api/worktable/update_mi_order_info", 'POST', param, function(data) {
            if(data.status == 0) {
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
              _this.refreshAll(scope);
              if(successFun){
                successFun()
              }
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

        this.selectRow = function(scope,row){
          scope.gridApi2.selection.selectRow(row)
          // console.log(scope.gridApi2.selection.getSelectedRows())
        }

        /**
         * 触发批量更新
         * @param {*} scope
         */
        this.allUpdate = function(scope){
          scope.miOrderEdit = !scope.miOrderEdit
        }

        /**
         * 批量保存
         * @param {*} scope
         */
        this.allSave = function(scope){
          scope.miOrderEdit = !scope.miOrderEdit
          var selectRow = scope.gridApi2.selection.getSelectedRows()
          if(selectRow.length <= 0){
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            return;
          }
          var arr = selectRow.map(function(obj){
            return{
              "assignResultId": obj.assignResultId,
              "stripes":obj.miStripes,
              "logo":obj.miLogo,
              "sublimationPrinting":obj.miPrint,
              "nAndN":obj.miNN,
              "hemInsert":obj.miHemInsert
            }
          })
          var param = {
            "miOrderExts":arr
          }
          this.updateURL(scope,param)
        }

        this.initGripOptionZero = function(scope) {
          var blueGreenTemplate = document.getElementById("blueGreenTemplate").innerText;
          var isNewTemplate = document.getElementById("isNewTemplate").innerText;
          var linkLabelTemplate = document.getElementById("linkLabelTemplate").innerText;
          var functionButtonTemplate = document.getElementById("functionButtonTemplate").innerText;
          scope.gridOptions = {
            data: 'dailyDocumentData',
            enableColumnMenus: false,
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
              width: '30',
              minWidth: '30',
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
                name: 'season',
                displayName: $translate.instant('documentlibrary.SEASON'),
                field: 'season',
                minWidth : '60' ,
                width:"60",
                enableCellEdit: false
              },
              {
                name : 'batchDate' ,
                displayName : "Batch Date" ,
                minWidth : '60' ,
                field : 'orderDate' ,
                enableCellEdit : false
              } ,
              {
                name: 'resource',
                displayName: $translate.instant('documentlibrary.RESOURCE'),
                field: 'source',
                enableCellEdit: false
              },
              {
                name: 'updateTime',
                displayName: $translate.instant('worktable.UPDATE_TIME'),
                field: 'utcUpdate',
                minWidth: '100',
                enableCellEdit: false,
              },
              {
                name: 'uploadType',
                displayName: "",
                field: 'uploadType',
                minWidth: '220',
                enableCellEdit: false,
                cellTemplate: functionButtonTemplate
              },
              {
                name : 'orderQuantity' ,
                displayName : $translate.instant('worktable.NEW_ORDER_IN_TRADE_CARD') ,
                field : 'orderQuantity',
                minWidth : '180' ,
                enableCellEdit : false
              }
            ],
            onRegisterApi: function(gridApi) {
              scope.gridApi0 = gridApi;
              scope.gridApi0.core.on.sortChanged(scope, function(grid, sortColumns) {
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
              scope.gridApi0.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
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
            enableHorizontalScrollbar: 1,
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
              minWidth: '120',
              enableCellEdit: false
            },
              {
                name: 'fabricType',
                displayName: $translate.instant('worktable.FABRIC_TYPE'),
                field: 'wovenKnit',
                minWidth: '120',
                enableCellEdit: false
              },
              {
                name: 'productType',
                displayName: $translate.instant('worktable.PRODUCT_TYPE'),
                field: 'productType',
                minWidth: '120',
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
          var year = new Date().getFullYear();
          var month = new Date().getMonth() + 1;
          for(var i = 0; i < 4; i++) {
            var capacity = {
              name: 'capacity' + i,
              displayName: $translate.instant('worktable.CAPACITY') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
              field: 'capacity' + i,
              minWidth: '140',
              enableCellEdit: false
            }
            var fillRate = {
              name: 'fillRate' + i,
              displayName: $translate.instant('worktable.FILL_RATE') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
              field: 'fillRate' + i,
              minWidth: '140',
              enableCellEdit: false,
              cellTemplate: "<div class=\"container-flex-center-center\" style=\"width: 100%;height: 100%;\" ng-class=\"{'background-red':row.entity.fillRate" + i + ">= 90}\"><div ng-bind=\"row.entity.fillRate" + i + "\"></div><span ng-if=\"row.entity.fillRate" + i + "\">%</span></div>"
            }
            var frFillRate = {
              name: 'frFillRate' + i,
              displayName: $translate.instant('worktable.FR_FILL_RATE') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
              field: 'frFillRate' + i,
              minWidth: '140',
              enableCellEdit: false,
              cellTemplate: "<div class=\"container-flex-center-center\" style=\"width: 100%;height: 100%;\" ng-class=\"{'background-red':row.entity.fillRate" + i + ">= 90}\"><div ng-bind=\"row.entity.fillRate" + i + "\"></div><span ng-if=\"row.entity.fillRate" + i + "\">%</span></div>"
            }
            scope.gridOptions1.columnDefs.push(capacity);
            scope.gridOptions1.columnDefs.push(fillRate);
            scope.gridOptions1.columnDefs.push(frFillRate);
          }

        };

        this.initGripOptionTwo = function(scope, i, gridData) {
          var _this = this;
          var hoverTemplate = document.getElementById("hoverTemplate").innerText;
          var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;
          var status = null;
          if(i==2){
            status = 2;
          }else if(i==3){
            status = 5;
          }else{
            status = 4;
          }
          var url = "cpo/api/worktable/query_assignment_result_filter?";
          var param = {
            orderType : "5" ,
            status : status

          };

          var columnDefs = workTableCommonService.constructeAssignmentStaticColumns(scope,"miorderforecast",true,100,"miorder_grid_"+i)
          scope.stripesTemplate = document.getElementById("stripesTemplate").innerText;
          scope.logoTemplate = document.getElementById("logoTemplate").innerText;
          scope.sublimationTemplate = document.getElementById("sublimationTemplate").innerText;
          scope.nnTemplate = document.getElementById("nnTemplate").innerText;
          scope.MT2FB4HemInsertTemplate = document.getElementById("MT2FB4HemInsertTemplate").innerText;

          if(i==2){
            columnDefs.forEach(function(obj){
              switch(obj.displayName){
                case 'stripes' :
                obj.cellTemplate = scope.stripesTemplate
                break;
                case 'Logo' :
                obj.cellTemplate = scope.logoTemplate
                break;
                case 'Sublimation printing' :
                obj.cellTemplate = scope.sublimationTemplate
                break;
                case 'N&N' :
                obj.cellTemplate = scope.nnTemplate
                break;
                case 'MT2FB4 Hem Insert' :
                obj.cellTemplate = scope.MT2FB4HemInsertTemplate
                break;
              }
            })
          }

          scope['gridOptions' + i] = {
            data: gridData,
            paginationPageSizes: [10, 20, 50, 100, 200, 500,1000,2000],
            enableColumnMenus: true,
            enableGridMenu: true,
            paginationPageSize: 100,
            rowEditWaitInterval: -1,
            enableRowSelection: false,
            enableRowHeaderSelection: true,
            enableFullRowSelection: false,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            totalItems: scope.page.totalNum,
            enablePagination: true,
            useExternalPagination: true,
            enablePaginationControls: true,
            zsGridName:"miorder_grid_"+i,
            zsColumnFilterRequestUrl : url ,
            zsColumnFilterRequestParam : param ,
            expandableRowTemplate: '<div class="sub-ui-grid" ui-grid="row.entity.subGridOptions"></div>',
            expandableRowHeight: 150,
            expandableRowScope: {
              subGridVariable: 'subGridScopeVariable1'
            },

            columnDefs:columnDefs,
            onRegisterApi: function(gridApi) {
              gridApi.core.on.columnVisibilityChanged( scope, CommonService.columnVisibilityChanged);
              scope['gridApi' + i] = gridApi;
              gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
                if(sortColumns.length !== 0) {
                  if(sortColumns[0].sort.direction === 'asc') {
                    scope['page' + i].sortDirection = true;
                  }
                  if(sortColumns[0].sort.direction === 'desc') {
                    scope['page' + i].sortDirection = false;
                  }
                  scope['page' + i].sortColumn = sortColumns[0].displayName;
                }
              });
              gridApi.selection.on.rowSelectionChanged(scope, function(row, event) {

              });

              gridApi.expandable.on.rowExpandedStateChanged(scope, function(row) {
                if(row.isExpanded) {
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
                    columnDefs: [{
                      name: 'LAST_MFC_VERSION',
                      displayName: $translate.instant('worktable.LAST_MFC_VERSION'),
                      field: 'last_mfc_version',
                      minWidth: '100',
                      enableCellEdit: false
                    },
                      {
                        name: 'ORDER_QUANTITY',
                        displayName: $translate.instant('worktable.ORDER_QUANTITY'),
                        field: 'order_quantity',
                        minWidth: '100',
                        enableCellEdit: false
                      },
                      {
                        name: 'updateDate',
                        displayName: $translate.instant('worktable.UPDATE_DATE'),
                        field: 'updateDate',
                        minWidth: '100',
                        enableCellEdit: false
                      }
                    ]
                  };
                  row.entity.subGridOptions.data = row.entity.preOrders;
                }
              });

              gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                scope['page' + i].curPage = newPage;
                scope['page' + i].pageSize = pageSize;
                switch(i) {
                  case 2:
                  {

                    _this.getAssignFactoryResult(scope, '5', 2, scope.page2);
                    break;
                  }
                  case 3:
                  {
                    _this.getTransitOrder(scope,scope.page3,5);
                    break;
                  }
                  case 4:
                  {
                    _this.getTransitOrder(scope,scope.page4,4);
                  }
                }
              });

              gridApi.core.on.filterChanged(scope, function(col) {

                var __this = this;
                var grid = __this.grid;

                var newsearchKey = CommonService.getFilterParams(grid);
                if(i == 2) {
                  searchKey2 = newsearchKey;
                  _this.getAssignFactoryResult(scope, '5', 2, scope.page2, 2);

                } else if(i==3){
                  searchKey5 = newsearchKey;
                  _this.getTransitOrder(scope, scope.page3, 5,5);
                }else if(i==4){
                  searchKey4 = newsearchKey;
                  _this.getTransitOrder(scope, scope.page4, 5,4);
                }

              });

            }
          };



        };
        this.refreshAll = function (scope) {
        	var _this=this;
          scope.page2.curPage   = 1;
          scope.page3.curPage  = 1;

          _this.getAssignFactoryResult(scope, '5', 2, scope.page2);
          _this.getTransitOrder(scope,scope.page3,5);
          _this.getTransitOrder(scope,scope.page4,4);
        }
        this.getDailyOrder = function(scope, type,doc, documentType,finallyCallback) {
        	var _this=this;
        	_this.getAllHistoryOrder(scope);
          var param = {
            'orderType': type
          }
          if(doc){
            param[ 'documentType' ] = doc.documentType;
            param['orderDate'] = doc.orderDate;
            param['documentName'] = doc.documentName;
          }

          GLOBAL_Http($http, "cpo/api/worktable/query_orders?", 'GET', param, function(data) {
            if(finallyCallback){finallyCallback()}
            if(data.output) {
              scope.dailyDocumentData = translateData(data.output);
              var documentIdList = [];
              var contains1 = false;
              var contains3 = false;
              var contains5 = false;
              var height = (scope.dailyDocumentData.length * 30) + 36;
              $("#grip5").css('height', height + 'px');
              angular.forEach(scope.dailyDocumentData, function(currentValue) {
                if(currentValue.uploadType == '1') {
                  scope.existUploadType = true;
                  currentValue['uploadHtml'] = '<i class="fa fa-upload"></i> Upload ';
                  currentValue['Uploading'] = false;
                  currentValue['Deleting'] = false;
                 }
              documentIdList.push(currentValue['documentId']);
              if(currentValue['documentStatus'] == 1) {
                contains1 = true;
              }
              if(currentValue['documentStatus'] == 3) {
                contains3 = true;
              }
              if(currentValue['documentStatus'] == 5) {
                contains5 = true;
              }
              });
              scope.documentIds = stringListToString(documentIdList);
              if(contains5) {
                contains1
                scope.stepNumber = 5;
                scrollGuild('#MIOrderFlowGuild', 800);
              } else if(contains3) {
                scope.stepNumber = 3;
                scrollGuild('#MIOrderFlowGuild', 800);
              } else if(contains1) {
                scope.stepNumber = 2;
              } else {
                scope.stepNumber = 1;
              }
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {
            if(finallyCallback){finallyCallback()}
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

        }
        this.toUpload = function(scope, entity) {
          var _this = this;
          var modalInstance = $uibModal.open({
            templateUrl: 'uploadFileModal',
            controller: 'UploadFileController',
            backdrop: 'static',
            size: 'md',
            resolve: {
              planGroups: function() {
                return {
                  fileType: entity.documentType,
                  special:{
                    showOrderDate:true
                  }
                };
              }
            }
          });
          modalInstance.result.then(function(returnData) {
            if(returnData) {
              _this.getDailyOrder(scope, 5);
            }
          }, function() {});
        }
        this.deleteDom = function(scope, entity) {

          if(!entity.documentId) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.NO_ORDER_FILE'), null);
            return;
          }
          var _this = this;
          var alertStr = $translate.instant('errorMsg.CONFIRM_DELETE_DOCUMENT');
          alertStr = alertStr.replace('{0}',entity.source);
          modalAlert(CommonService, 0,alertStr , function() {
						var modal = $uibModal.open({
							templateUrl: "loadingpage",
							controller: 'loadingController',
							backdrop: 'static',
							size: 'sm'
						});

          entity.Deleting = true;
          var param = {
            "documentIds": entity.documentId
          };
						GLOBAL_Http($http, "cpo/api/document/delete_document", 'POST', param, function(data) {
							entity.Deleting = false;
							if(data.status == 0) {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.DELETE_SUCCESS'), null);
								_this.getDailyOrder(scope, 5);
              _this.refreshAll(scope);
							} else {
								modalAlert(CommonService, 2, data.message, null);
							}
						}, function(data) {
							entity.Deleting = false;
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					});
        };
        this.editFactoryCapacity = function(scope) {
          var _this = this;
          var modalInstance = $uibModal.open({
            templateUrl: 'factoryCapacityModal',
            controller: 'FactoryCapacityController',
            backdrop: 'static',
            size: 'lg',
            resolve: {
              planGroups: function() {
                return {
                  TimeModel: scope.TimeModel
                };
              }
            }
          });
          // modalInstance callback
          modalInstance.result.then(function(returnData) {
            if(returnData) {

            }
          }, function() {
            // dismiss(cancel)
          });
        }

        this.assignFactory = function(scope) {

          var _this = this;
          var param = {
            criteriaVersionId: scope.version.id,
            documentType: 5
          }
          _this.assigningStatus(scope);
          GLOBAL_Http($http, "cpo/api/worktable/assign_factory?", 'GET', param, function(data) {
            _this.assignedStatus(scope);
            if(data.status == 0) {

              if(data.tips&&data.tips!="0"){
                modalAlert(CommonService, 2,"Assign Successfully with factory adjustment rules.", null);
              }else{
                modalAlert(CommonService, 2, $translate.instant('worktable.SUCCESS_ASSIGN'), null);

              }


              _this.getAssignFactoryResult(scope, '5', 2, scope.page2);
              _this.getTransitOrder(scope,scope.page3,5);
              _this.getTransitOrder(scope,scope.page4,4);
              _this.getDailyOrder(scope, 5);
            } else {
              modalAlert(CommonService, 3, data.message, null);
            }
          }, function(data) {
            _this.assignedStatus(scope);
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

        this.getAssignFactoryResult = function(scope, type, status, page, filterTab) {
          var param = {
            orderType: type,
            status: status,
            pageSize: page.pageSize,
            pageNo: page.curPage
          };

          if ( scope.selectDoc && scope.selectDoc.id ) {
            param.eq_document_id = scope.selectDoc.id;
          }

          if(filterTab) {
            page.curPage = 1;
            param.pageNo = page.curPage;
            if(filterTab == 2) {
              for(var attr in searchKey2) {
                if(searchKey2[attr]) {
                  param[ attr] = urlCharTransfer(searchKey2[attr]);
                }
              }
            }
          }
          var _this = this;


            scope.navList[0].loading = true;


          GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {


            if(data.output) {

              switch(status) {
                case 2:
                {
                  scope.newOrderData = translateData(data.output);
                  scope.navList[0].count =  data.totalCount? data.totalCount:"0";

                  scope.gridOptions2.data = scope.newOrderData;
                  scope.page2.totalNum = data.total;
                  scope.gridOptions2.totalItems = scope.page2.totalNum;
                  scope.navList[0].loading = false;
                  workTableCommonService.bulkorderDynamicColumnsMI(data.sizeListCount , scope.gridOptions2);

                  if ( scope.gridOptions2.data && scope.gridOptions2.data.length > 0 ) {
                    for ( var index in scope.gridOptions2.data ) {
                      var item = scope.gridOptions2.data[ index ];
                      var manufacturingSize = item.ediOrderSizes;
                      if ( manufacturingSize ) {
                        for ( var index2 = 0 ; index2 < manufacturingSize.length ; index2++ ) {
                          var xx = manufacturingSize[ index2 ];
                          if ( xx ) {
                            item[ "OQTY_" + (index2 + 1) ] = xx.sizeQuantity ? xx.sizeQuantity : "";
                            item[ "TS_" + (index2 + 1) ] = xx.manufacturingSize ? xx.manufacturingSize : "";
                            item[ 'SIZENAME_' + (index2 + 1) ] = xx.sizeName ? xx.sizeName : "";
                            item[ "unitPrice_" + (index2 + 1) ] = xx.unitPrice ? xx.unitPrice : "";
                          }
                        }
                      }
                    }
                  }
                  break;
                }

              }

            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

        this.adjustFactoryAssignment = function(scope, mode, tab) {
          var _this = this;
          var selectedRows = "";
          selectedRows = scope.gridApi2.selection.getSelectedRows();
          if(selectedRows.length <= 0) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            return;
          }
          var workingNos = [];
          if(mode == 1) {
            for(var i = 0; i < selectedRows.length; i++) {
              if(selectedRows[i].suggFactory != selectedRows[i].lastProdFactory) {
                var w = {
                  "workingNo": selectedRows[i].workingNo,
                  "lastProductionFactory": selectedRows[i].suggFactory
                }
                workingNos.push(w);
              }
            }
          } else if(mode == 2){
            for(var i = 0; i < selectedRows.length; i++) {
              if(selectedRows[i].lastProdFactory == "" || selectedRows[i].lastProdFactory == null){
                modalAlert(CommonService, 2, $translate.instant('errorMsg.LAST_PRODUCTION_FACTORY_IS_NULL'), null);
                return;
              }
            }
          }else if(mode == 3) {
            for(var i = 0; i < selectedRows.length; i++) {
              var w = {
                "workingNo": selectedRows[i].workingNo,
                "lastProductionFactory": selectedRows[i].aSource
              }
              workingNos.push(w);
            }
          }

          var modalInstance =
            $uibModal.open({
              animation: true,
              ariaLabelledBy:"modal-header",
              templateUrl: 'app/factorymaster/transferReason.html',
              controller: 'transferReasonCtrrl'

            });
          modalInstance.resolve =  function(result) {
            var param = {
              "ids" : listToString(selectedRows , 'assignResultId') ,
              "workingNos" : workingNos ,
              "mode" : mode ,
              "orderType" : "5",
              transferReason: result.reason  ,
              transferRemark:result.remark,
              "isFactoryAdjustment" : 'YES'
            }
            GLOBAL_Http($http , "cpo/api/worktable/adjust_assign" , 'POST' , param , function ( data ) {
              if ( data.status == 0 ) {
                modalAlert(CommonService , 2 , $translate.instant('notifyMsg.SUCCESS_SAVE') , null);
                _this.refreshAll(scope);
              } else {
                modalAlert(CommonService , 2 , data.message , null);
              }
            } , function ( data ) {
              modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
            });
          }
        }
        this.assigningStatus = function(scope) {
          scope.assignHtml = '<span>' + $translate.instant('worktable.ASSIGNING') + '</span>';
          scope.assigning = true;
        };
        this.assignedStatus = function(scope) {
          scope.assignHtml = '<span>' + $translate.instant('worktable.SNED_TO_ASSIGN') + '</span>';
          scope.assigning = false;
        };
        /**
         * init
         */
        this.selectTab = function(scope, index) {
          scope.tabIndex = index;
        }
        this.selectTab2 = function(scope, index) {
          scope.tabIndex2 = index;
        }
        this.init = function(scope) {
          // 初期化
          var _this = this;
          searchKey2 = {};
          searchKey5 = {};
          scope.miOrderEdit = false // 触发单条修改
          scope.updateObj = {}
          scope.allCapData = {
            factoryCapData: [],
            processCapData: []
          };
          scope.viewCap = 2;
          scope.navList = //[ 'New Order','Transit Pending','Transit Order'];
          [
            {name:"New Order",count:0},
            {name:"Transit Pending",count:0},
            {name:"Transit Order",count:0}
          ];
          scope.loadingList = ['Factory Capacity & Fill Rate', 'Special Process Capacity & Fill Rate'];

          scope.stepNumber = 2;
          scope.steps = [{
            content: "1.Upload File",
            on: "#4774C1 ",
            off: "lightgray"
          }, {
            content: "2.Start To Assign",
            on: "#4ABDB8",
            off: "lightgray"
          }, {
            content: "3.Confirm Pending",
            on: "#4BB467",
            off: "lightgray"
          }, {
            content: "4.Confirm Assignment",
            on: "#75AB4D",
            off: "lightgray"
          }];

          _this.assignedStatus(scope);
          scope.scrlTabsApi = {};
          scope.scrlTabsApi2 = {};
          scope.tabIndex = 0;
          scope.tabIndex2 = 0;
          scope.TimeModel = new Date().Format("yyyy-MM");
          scope.backGroundTemplate = document.getElementById("blueGreenTemplate").innerText;
          scope.isNewTemplate = document.getElementById("isNewTemplate").innerText;
          scope.season = "";
          scope.page2 = {
            curPage: 1,
            pageSize: 100,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.page3 = {
            curPage: 1,
            pageSize: 100,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.page4 = {
            curPage: 1,
            pageSize: 100,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.$on('detailPage.close', function(data) {
            scope.showDetailView = '';
          });
          scope.$on('workTableDetail.init', function(event, data) {
            scope.$broadcast('workTableDetail.afterInit', scope.factoryAssingmentResultDetail);
          });
          scope.dailyDocumentData = [];
          scope.marketingForecastNewPending = [];
          scope.transitOrderData = [];
          //	this.initData(scope);
          this.initGripOptionZero(scope);
          //  this.initGripOptionOne(scope);
          this.initGripOptionTwo(scope, 2, 'newOrderData');
          this.initGripOptionTwo(scope, 3, 'transitOrderData');
          this.initGripOptionTwo(scope, 4, 'transitOrderPending');
          this.initGripOptionTen(scope);
//        this.getTransitOrder(scope,scope.page3,5);
//        this.getTransitOrder(scope,scope.page4,4);
          scope.gridOptions1= factoryCapacityService.initFactoryCapacityGridOption(scope);

          _this.getDailyOrder(scope, 5);
          this.getSelectedData(scope);
//
//
//        this.getAssignFactoryResult(scope, '5', 2, scope.page2);
//        scope.gridOptions2.data = scope.newOrderData;
//        scope.gridOptions3.data = scope.transitOrderData;
        };



        this.initGripOptionTen = function(scope) {
          scope.gridOptions10 = {
            data: 'items',
            paginationPageSizes: [10, 20, 30, 50, 100],
            paginationPageSize: 100,
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
            enablePagination: false,
            useExternalPagination: false,
            enablePaginationControls: false,
            //						paginationTemplate: "<div>a</div>",
            // useExternalPagination: true,
            // useExternalSorting: true,
            columnDefs: [{
              name: 'factoryCode',
              displayName: $translate.instant('factory.FACTORY_CODE'),
              field: 'factoryCode',
              minWidth: '140',
              enableCellEdit: false
            },
              {
                name: 'factSimpName',
                displayName: $translate.instant('factory.FACTORY_SIMP_NAME'),
                field: 'factSimpName',
                minWidth: '140',
                enableCellEdit: false
              },
              {
                name: 'processCode',
                displayName: $translate.instant('processmaster.PROCESS_NO'),
                field: 'processCode',
                minWidth: '140',
                enableCellEdit: false
              },
              {
                name: 'processName',
                displayName: $translate.instant('processmaster.PROCESS_NAME'),
                field: 'processName',
                minWidth: '140',
                enableCellEdit: false
              }
            ],
            onRegisterApi: function(gridApi) {
              scope.gridApi10 = gridApi;
              gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
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
              gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;

              });
            }
          };

          var year = new Date().getFullYear();
          var month = new Date().getMonth() + 1;
          for(var i = 0; i < 4; i++) {
            var capacity = {
              name: 'capacity' + i,
              displayName: $translate.instant('factoryProcess.CAPACITY') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
              field: 'capacity' + i,
              minWidth: '140',
              enableCellEdit: false
            }
            var fillRate = {
              name: 'fillRate' + i,
              displayName: $translate.instant('factoryProcess.FILL_RATE') + " " + year + "0" + Math.floor((month + (i / 2))) + "0" + ((i % 2) + 1),
              field: 'fillRate' + i,
              minWidth: '140',
              enableCellEdit: false,
              cellTemplate: "<div class=\"container-flex-center-center\" style=\"width: 100%;height: 100%;\" ng-class=\"{'background-red':row.entity.fillRate" + i + ">= 90}\"><div ng-bind=\"row.entity.fillRate" + i + "\"></div><span ng-if=\"row.entity.fillRate" + i + "\">%</span></div>"
            }
            scope.gridOptions10.columnDefs.push(capacity);
            scope.gridOptions10.columnDefs.push(fillRate);
          }
        }

        this.viewCapacity = function(scope, type) {
          scope.viewCap = type;
          switch(type) {
            case 1:
            {
              var factCap = [];
              for(var i = 0; i < scope.allCapData.factoryCapData.length; i++) {
                var factoryCapacity = scope.allCapData.factoryCapData[i];
                for(var j = 0; j < factoryCapacity.factoryMonthLoadings.length; j++) {
                  if(factoryCapacity.factoryMonthLoadings[j].fillRate >= 90) {
                    factCap.push(factoryCapacity);
                    break;
                  }
                }
              }
              scope.factoryCapacityData = factCap;
              var processCap = [];
              for(var i = 0; i < scope.allCapData.processCapData.length; i++) {
                var item = scope.allCapData.processCapData[i];
                for(var j = 0; j < item.factoryProcessLoadings.length; j++) {
                  var load = item.factoryProcessLoadings[j];
                  if((load.loading / load.capacity * 100) >= 90) {
                    processCap.push(item);
                    break;
                  }
                }
              }
              scope.items = processCap;
              break;
            }
            case 2:
            {
              scope.factoryCapacityData = angular.copy(scope.allCapData.factoryCapData);
              scope.items = angular.copy(scope.allCapData.processCapData);
              break;
            }
          }
        }
        this.toggleFilterRow = function(scope) {
          switch(scope.tabIndex) {
            case 0:
            {
              scope.gridOptions2.enableFiltering = !scope.gridOptions2.enableFiltering;
              scope.gridApi2.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
              break;
            }
            case 1:
            {
              scope.gridOptions3.enableFiltering = !scope.gridOptions3.enableFiltering;
              scope.gridApi3.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
              break;
            }
          }
        }
        this.releaseOrderPending = function(scope) {
          var pendingSelect = scope.gridApi4.selection.getSelectedRows()
          if(pendingSelect.length == 0){
            modalAlert(CommonService, 2, $translate.instant('worktable.NO_NEW_ORDER_CAN_RELEASE'), null);
            return;
          }

          var _this = this;
          var param = {
            "documentIds": scope.documentIds,
            "assignResultIds" : listToString(pendingSelect , 'assignResultId'),
            "status": "4"
          };
          scope.disableReleaseOrderButton = true;
          GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
            if(data.status == 0) {
              scope.disableReleaseOrderButton = false;
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);

              _this.refreshAll(scope);
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {
            scope.disableReleaseOrderButton = false;
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.releaseOrder = function(scope) {
          var pendingSelect = scope.gridApi2.selection.getSelectedRows()
          if(pendingSelect.length == 0){
            modalAlert(CommonService, 2, $translate.instant('worktable.NO_NEW_ORDER_CAN_RELEASE'), null);
            return;
          }
          var _this = this;
          var param = {
            "documentIds": scope.documentIds,
            "assignResultIds" : listToString(pendingSelect , 'assignResultId'),
            "status": "4"
          };
          scope.disableReleaseOrderButton = true;
          GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
            if(data.status == 0) {
              scope.disableReleaseOrderButton = false;
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);

              _this.refreshAll(scope);
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {
            scope.disableReleaseOrderButton = false;
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.releaseAllOrder = function ( scope ) {

          var _this = this;
          scope.disableReleaseOrderButton = true;
          var documentid = null;
          if ( scope.selectDoc && scope.selectDoc.id ) {
            documentid = scope.selectDoc.id;
          } else {
            documentid = scope.documentIds;
          }
          if ( !documentid ) {
            modalAlert(CommonService , 2 , $translate.instant('worktable.NO_DOCUMENT_NEED_TO_RELEASE') , null);
            return;
          }
          var param = {
            "documentIds" : documentid ,
            "status" : "4"
          };
          GLOBAL_Http($http , "cpo/api/document/release_document" , 'POST' , param , function ( data ) {
            scope.disableReleaseOrderButton = false;
            if ( data.status == 0 ) {
              modalAlert(CommonService , 2 , $translate.instant('notifyMsg.RELEASE_SUCCESS') , null);
              _this.refreshAll(scope);
            } else {
              modalAlert(CommonService , 2 , data.message , null);
            }
          } , function ( data ) {
            scope.disableReleaseOrderButton = false;
            modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
          });
        }
        this.exportFile = function(scope) {
          var param = {
            documentType: 205,
            pageSize: 1000000,
            pageNo: 1
          };
          switch(scope.tabIndex) {
            case 0:
            {
              param['orderType'] = '5';
              param['status'] = '2';
              break;
            }
            case 1:
            {
              param['orderType'] = '5';
              param['status'] = '4';
              break
            }
            case 2:
            {
              param['orderType'] = '5';
              param['status'] = '5';
              break
            }
          }
          param.eq_document_id = (scope.documentIds==null || scope.documentIds=="")?0:scope.documentIds;
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
        this.refreshOrder = function(scope, entity) {
          var _this = this;
          var modalInstance =
            $uibModal.open({
              animation: true,
              ariaLabelledBy:"modal-header",
              templateUrl: 'app/worktable/refreshordermodal.html',
              controller: 'refreshOrderCtrl'

            });
          modalInstance.resolve = function(result){

            var doc = {};
            doc[ 'documentType' ] = entity.documentType;
            doc['orderDate'] = result.orderTime;
            doc['documentName'] = result.fileName;


            entity.disableRefreshButton = true;
            _this.getDailyOrder(scope , 5 ,doc , function () {
              entity.disableRefreshButton = false;
            });

          }


        }

        this.importFile = function ( scope ) {
          var _this = this;
          var modalInstance = $uibModal.open({
            templateUrl : 'FileModal' ,
            controller : 'FileController' ,
            backdrop : 'static' ,
            size : 'md' ,
            resolve : {
              planGroups : function () {
                return {
                  fileType : "504"

                };
              }
            }
          });
          modalInstance.result.then(function ( returnData ) {

            if ( returnData ) {
              modalAlert(CommonService , 2 , $translate.instant('notifyMsg.UPLOAD_SUCCESS') , null);
              _this.refreshAll(scope);
            }
          } , function () {
          });

        }

        this.releaseTransitPendingOrder = function(scope) {


          var _this = this;
          scope.disableReleaseOrderButton = true;

          var selectedRows = "";
          selectedRows = scope.gridApi4.selection.getSelectedRows();
          if(selectedRows.length <= 0) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            scope.disableReleaseOrderButton = false;
            return;
          }
          var documentId=scope.gridOptions4.data[0].documentId;
          var param = {
            "documentIds": documentId,
            "status": "4",
            "assignResultIds":listToString(selectedRows, 'assignResultId'),
            releaseTransit:"YES"
          };
          GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function(data) {
            scope.disableReleaseOrderButton = false;
            if(data.status == 0) {
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);

              _this.refreshAll(scope);
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {
            scope.disableReleaseOrderButton = false;
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }


        this.getAllHistoryOrder = function ( scope ) {
          var _this = this;
          GLOBAL_Http($http , "/cpo/api/document/query_order_document?" , 'GET' , { orderType : "5" } , function ( data ) {

            if ( data.status == 0 ) {
              if ( !data.output ) {
                data.output = [];
              }
              scope.documentTypes = data.output.map(function ( item , index ) {
                return {
                  index : index ,
                  id : item.documentType ,
                  label : item.documentTypeName ,
                  documents : item.documents.map(function ( item2 , index2 ) {
                    return {
                      id : item2.documentId ,
                      label : item2.documentOldName + " (" + new Date(item2.utcCreate).toLocaleDateString() + ")"
                    }
                  })
                }
              });
              var index = 0;var utcCreate = 0;
              angular.forEach(data.output,function(item,i){
                if(item.documents.length>0){
                  var doc = item.documents[0];
                  if(utcCreate<doc.utcCreate){
                    utcCreate = doc.utcCreate;
                    index = i;
                  }
                }
              });
              scope.selectDocumentType = scope.documentTypes[index];
            //  scope.selectDocumentType = scope.documentTypes[ 0 ];
              _this.selectDocumentTypeChanged(scope);

            } else {
              modalAlert(CommonService , 2 , data.message , null);
            }
          } , function ( data ) {

            modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
          });
        }

        this.selectDocumentTypeChanged = function ( scope ) {
          var _this = this;
          setTimeout(function () {
            scope.selectDoc = scope.documentTypes[ scope.selectDocumentType.index ].documents[ 0 ];
            _this.selectDocumentChanged(scope);
          } , 800);

        }
        this.selectDocumentChanged = function ( scope ) {
          this.clearFilterParams(scope);

          if ( scope.selectDoc && scope.selectDoc.id ) {
            scope.gridOptions2.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
            scope.gridOptions3.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
            scope.gridOptions4.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
          //  scope.gridOptions8.zsColumnFilterRequestParam.eq_document_id = scope.selectDoc.id;
          } else {
            delete scope.gridOptions2.zsColumnFilterRequestParam.eq_document_id;
            delete scope.gridOptions3.zsColumnFilterRequestParam.eq_document_id;
            delete scope.gridOptions4.zsColumnFilterRequestParam.eq_document_id;
           // delete scope.gridOptions8.zsColumnFilterRequestParam.eq_document_id;
          }

          if ( scope.selectDoc && scope.selectDoc.id ) {
            this.refreshAll(scope);
          } else {
            this.clearAll(scope);
          }

        }

        this.clearAll = function ( scope ) {
          scope.gridOptions2.data = [];
          scope.gridOptions3.data = [];
          scope.gridOptions4.data = [];
        }
        this.clearFilterParams = function ( scope ) {
          scope.gridOptions2.zsFilter = {};
          scope.gridOptions3.zsFilter = {};
          scope.gridOptions4.zsFilter = {};

          searchKey2 = {};
          searchKey4 = {};
          searchKey5 = {};
        };

      }
    ])
    .controller('MIOrderCtrl', ['$scope', 'MIOrderService',
      function($scope, MIOrderService) {
        $scope.refreshAll = function () {
          MIOrderService.refreshAll($scope);
        }

        $scope.adjustFactoryAssignment = function(mode, tab) {
          MIOrderService.adjustFactoryAssignment($scope, mode, tab);
        }
        $scope.adjustFactoryAssignment2 = function(mode, confirmFactory) {
          MIOrderService.adjustFactoryAssignment2($scope, mode, confirmFactory);
        };
        $scope.toUpload = function(entity) {
          MIOrderService.toUpload($scope, entity);
        };
        $scope.selectTab = function(index) {
          MIOrderService.selectTab($scope, index);
        }
        $scope.refreshOrder = function(entity) {
          MIOrderService.refreshOrder($scope, entity);
        }
        $scope.setupScrollableTabSet = function(length, index) {
          if(length >= index + 1) {
            if($scope.scrlTabsApi.doRecalculate) {
              $scope.scrlTabsApi.doRecalculate();
            }
          }
        };
        $scope.selectTab2 = function(index) {
          MIOrderService.selectTab2($scope, index);
        }
        $scope.setupScrollableTabSet2 = function(length, index) {
          if(length >= index + 1) {
            if($scope.scrlTabsApi2.doRecalculate) {
              $scope.scrlTabsApi2.doRecalculate();
            }
          }
        };
        $scope.editFactoryCapacity = function() {
          MIOrderService.editFactoryCapacity($scope);
        }
        $scope.viewCapacity = function(type) {
          MIOrderService.viewCapacity($scope, type);
        }
        $scope.exportFile = function() {
          MIOrderService.exportFile($scope);
        }
        $scope.releaseOrder = function(type) {
          MIOrderService.releaseOrder($scope, type);
        }
        $scope.releaseOrderPending = function(type) {
          MIOrderService.releaseOrderPending($scope, type);
        }
        $scope.assignFactory = function() {
          MIOrderService.assignFactory($scope);
        }
        $scope.importFile = function ( mode , confirmFactory ) {
          MIOrderService.importFile($scope);
        };
        $scope.selectDocument = function () {
          MIOrderService.selectDocument($scope);
        }
        $scope.selectDocumentTypeChanged = function () {
          MIOrderService.selectDocumentTypeChanged($scope);
        }
        $scope.selectDocumentChanged = function () {
          MIOrderService.selectDocumentChanged($scope);
        }



        $scope.deleteDom = function(entity) {
          MIOrderService.deleteDom($scope, entity);
        };
        $scope.toggleFilterRow = function() {
          MIOrderService.toggleFilterRow($scope);
        };
        $scope.reAssign = function(){
					MIOrderService.reAssign($scope)
				}
        $scope.bottomGridHeight = function(){
          if(!$scope.hideTopInfo){
            return {height:"385px"}
          }{
            return {height:(window.innerHeight-200)+"px"}
          }
        }

        $scope.update = function(){
          MIOrderService.update($scope)
        }

        $scope.allUpdate = function(){
          MIOrderService.allUpdate($scope)
        }

        $scope.allSave = function(){
          MIOrderService.allSave($scope)
        }

        $scope.releaseAllOrder = function(){
					MIOrderService.releaseAllOrder($scope)
        }

        $scope.selectRow = function(row){
          MIOrderService.selectRow($scope,row)
        }
        MIOrderService.init($scope);
      }
    ])
})();
