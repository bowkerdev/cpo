(function() {
  'use strict';
  angular
    .module('cpo')

    .service('MarketingForecastService', ['$timeout', '$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants', 'factoryCapacityService','workTableCommonService',
      function($timeout, $http, $translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants, factoryCapacityService,workTableCommonService) {
        var searchKey2 = {};
        var searchKey3 = {};
        var searchKey4 = {};
        var searchKey5 = {};

        this.disableReleaseOrderButton = false;
        this.adjustFactoryAssignment2 = function(scope, mode, confirmFactory) {
          var _this = this;
          var selectedRows = "";
          if(scope.tabIndex == 0) {
            selectedRows = scope.gridApi2.selection.getSelectedRows();
          } else if(scope.tabIndex == 1) {
            selectedRows = scope.gridApi3.selection.getSelectedRows();
          }
          if(selectedRows.length <= 0) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
            return;
          }

          if(scope.tabIndex==0){
            var param = {
              "ids": listToString(selectedRows, 'assignResultId'),
              "workingNos": [],
              "mode": mode,
              "confirmFactory": confirmFactory,
              "orderType": "2"
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
            return;
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
              "ids": listToString(selectedRows, 'assignResultId'),
              "workingNos": [],
              "mode": mode,
              "confirmFactory": confirmFactory,
              "orderType": "2",
              "isFactoryAdjustment" : 'YES',
              transferReason: result.reason  ,
              transferRemark:result.remark
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

        this.initGripOptionZero = function(scope) {
          var blueGreenTemplate = document.getElementById("blueGreenTemplate") ? document.getElementById("blueGreenTemplate").innerText : "";
          var isNewTemplate = document.getElementById("isNewTemplate") ? document.getElementById("isNewTemplate").innerText : "";
          var linkLabelTemplate = document.getElementById("linkLabelTemplate") ? document.getElementById("linkLabelTemplate").innerText : "";
          var functionButtonTemplate = document.getElementById("functionButtonTemplate") ? document.getElementById("functionButtonTemplate").innerText : "";
          scope.gridOptions = {
            data: 'DocumentData',
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
            columnDefs: [
              {
                name: 'documentType',
                displayName: $translate.instant('worktable.DOCUMENT'),
                field: 'documentTypeName',
                minWidth: '100',
                enableCellEdit: false,
                cellTemplate: blueGreenTemplate
              }, {
                name: 'isNew',
                displayName: " ",
                field: 'documentStatus',
                width: '60',
                minWidth: '60',
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
                displayName: " ",
                field: 'uploadType',
                minWidth: '220',
                enableCellEdit: false,
                cellTemplate: functionButtonTemplate
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

        this.initGripOptionTwo = function(scope, i, gridData) {
          var _this = this;
          var hoverTemplate = document.getElementById("hoverTemplate").innerText;
          var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;
          var status = null;
          switch(i){
            case 2:
              status = "0,3";
              break;
            case 3:
              status = "2";
              break;
            case 4:
              status = "4";
              break;
            case 5:
              status = "5";
              break;
          }
          var url = "cpo/api/worktable/query_assignment_result_filter?";

          var param = {
            orderType: "1",
            status: status

          };

          var staticColumns =  workTableCommonService.constructeAssignmentStaticColumns(scope,"mkfcOrder",true,100,("mkfc_grid_"+i));


          scope['gridOptions' + i] = {
            data: gridData,
            paginationPageSizes: [10, 20, 50, 100, 200, 500,1000,2000],
            enableColumnMenus: true,
            enableGridMenu: true,
            paginationPageSize: 100,
            rowEditWaitInterval: -1,
            enableRowSelection: false,
            showLoading:false,
            enableRowHeaderSelection: true,
            enableFullRowSelection: false,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            totalItems: scope.page.totalNum,
            enablePagination: true,
            useExternalPagination: true,
            zsColumnFilterRequestUrl:url,
            zsColumnFilterRequestParam:param,
            zsGridName:"mkfc_grid_"+i,
            enablePaginationControls: true,
            expandableRowTemplate: '<div class="sub-ui-grid" ui-grid="row.entity.subGridOptions"></div>',
            expandableRowHeight: 150,
            expandableRowScope: {
              subGridVariable: 'subGridScopeVariable1'
            },
            columnDefs: staticColumns,
            onRegisterApi: function(gridApi) {
              scope['gridApi' + i] = gridApi;

              gridApi.core.on.columnVisibilityChanged( scope, CommonService.columnVisibilityChanged);
              gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
                sortParams(sortColumns, function(sortKeyParam, orderParam) {
                  scope.sortKey = sortKeyParam ? sortKeyParam : null;
                  scope.order = orderParam ? orderParam : null;
                  if(i == 2) {
                    _this.getAssignFactoryResult(scope, '1', '0,3', scope.page2, true);
                  } else {
                    _this.getAssignFactoryResult(scope, '1', 2, scope.page3, true);

                  }
                });
              });
              gridApi.selection.on.rowSelectionChanged(scope, function(row, event) {

              });

              gridApi.core.on.filterChanged(scope, function(col) {

                var grid = this.grid;

                var newsearchKey = CommonService.getFilterParams(grid);

                if(i == 2) {

                  searchKey2 = newsearchKey;
                  _this.getAssignFactoryResult(scope, '1', '0,3', scope.page2, true);

                } else if(i==3) {

                  searchKey3 = newsearchKey;
                  _this.getAssignFactoryResult(scope, '1', 2, scope.page3, true);

                }else if(i==4) {

                  searchKey4 = newsearchKey;
                  _this.getTransitOrder(scope,scope.page4,4,true);

                }else if(i==5) {

                  searchKey5 = newsearchKey;
                  _this.getTransitOrder(scope,scope.page5,5,true);

                }


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
                      field: 'documentName',
                      enableCellEdit: false
                    },
                      {
                        name: 'ORDER_QUANTITY',
                        displayName: $translate.instant('worktable.FORECAST_QUANTITY'),
                        field: 'totalQty',
                        enableCellEdit: false
                      },
                      {
                        name: 'suggFactory',
                        displayName: $translate.instant('worktable.SYSTEM_RESULT'),
                        field: 'suggFactory',
                        enableCellEdit: false
                      },
                      {
                        name: 'lastProdFactory',
                        displayName: $translate.instant('worktable.LAST_PRODUCTION'),
                        field: 'lastProdFactory',
                        enableCellEdit: false
                      },
                      {
                        name: 'aSource',
                        displayName: $translate.instant('worktable.A_SOURCE'),
                        field: 'aSource',
                        enableCellEdit: false
                      },
                      {
                        name: 'finalConfirmation',
                        displayName: $translate.instant('worktable.FINAL_CONFIRMATION'),
                        field: 'confirmFactory',
                        enableCellEdit: false
                      },
                      {
                        name: 'updateDate',
                        displayName: $translate.instant('worktable.UPDATE_DATE'),
                        field: 'utcCreate',
                        enableCellEdit: false
                      }
                    ]
                  };

                  var prOrder = {};
                  for(var i = 0; i < row.entity.preOrders.length; i++) {
                    var documentName = row.entity.preOrders[i].documentName;
                    if(prOrder[documentName]) {
                      prOrder[documentName] += 1;
                      row.entity.preOrders[i].documentName = documentName + "0" + prOrder[documentName];
                    } else {
                      row.entity.preOrders[i].documentName = documentName + "01";
                      prOrder[documentName] = 1;
                    }
                  }

                  row.entity.subGridOptions.data = row.entity.preOrders;
                }
              });

              gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                scope['page' + i].curPage = newPage;
                scope['page' + i].pageSize = pageSize;

                switch(i) {
                  case 2:
                  {
                    _this.getAssignFactoryResult(scope, '1', '0,3', scope.page2,false);
                    break;
                  }
                  case 3:
                  {
                    _this.getAssignFactoryResult(scope, '1', 2, scope.page3,false);
                    break;
                  }
                  case 4:
                  {
                    _this.getTransitOrder(scope,scope.page4,4,false);
                    break;
                  }
                  case 5:
                  {
                    _this.getTransitOrder(scope,scope.page5,5,false);
                    break;
                  }
                }
              });
            }
          };


        };

        this.refreshAll = function(scope) {

          this.getAssignFactoryResult(scope, '1', '0,3', scope.page2,true);
          this.getAssignFactoryResult(scope, '1', 2, scope.page3,true);
          this.getTransitOrder(scope,scope.page4,4,true);
          this.getTransitOrder(scope,scope.page5,5,true);
        };
        this.getDailyOrder = function(scope, type) {
          var param = {
            'orderType': type
          }

          GLOBAL_Http($http, "cpo/api/worktable/query_orders?", 'GET', param, function(data) {
            if(data.output) {
              scope.DocumentData = translateData(data.output);
              var documentIdList = [];
              var contains1 = false;
              var contains3 = false;
              var resourceList = [];
              angular.forEach(scope.DocumentData, function(currentValue) {
                currentValue['uploadHtml'] = '<i class="fa fa-upload"></i> Upload ';
                currentValue['Uploading'] = false;
                currentValue['Deleting'] = false;
                documentIdList.push(currentValue['documentId']);
                resourceList.push(currentValue['source']);
                if(currentValue['documentStatus'] == 1) {
                  contains1 = true;
                }
                if(currentValue['documentStatus'] == 3) {
                  contains3 = true;
                }

              });
              scope.documentIds = stringListToString(documentIdList);
              scope.resource = stringListToString(resourceList);
              if(contains1) {
                scope.stepNumber = 2;
              } else if(contains3) {
                scope.stepNumber = 3;
                scrollGuild('#marketingForecastFlowGuild', 160);
              } else {
                scope.stepNumber = 1;
              }
              var height = (scope.DocumentData.length * 30) + 36;
              $("#grip1").css('height', height + 'px');
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {
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
	                hideSeason: 1,
                  special:{
                    showOrderDate:true
                  }
	              };
	            }
	          }
	        });
	        modalInstance.result.then(function(returnData) {
	          if(returnData) {
	            _this.getDailyOrder(scope, 1);
	          }
	        }, function() {});
        }
        this.deleteDom = function(scope, entity) {
          if(!entity.documentId) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.NO_ORDER_FILE'), null);
            return;
          }

          var alertStr = $translate.instant('errorMsg.CONFIRM_DELETE_DOCUMENT');
          alertStr = alertStr.replace('{0}',scope.resource);
          var _this = this;
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
              // _this.selectDocumentTab(scope, 1);
              _this.getDailyOrder(scope, 1);
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

        this.assignFactory = function(scope) {

          var _this = this;
          var param = {
            criteriaVersionId: scope.version.id,
            documentType: 1
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

              _this.refreshAll(scope);
              _this.getDailyOrder(scope, 1);
            } else {
              modalAlert(CommonService, 3, data.message, null);
            }
          }, function(data) {
            _this.assignedStatus(scope);
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

        this.getAssignFactoryResult = function(scope, type, status, page, shouldPageNumberReset) {
          scope.disableReleaseOrderButton = false;
          var param = {
            orderType: type,
            status: status,
            pageSize: page.pageSize,
            pageNo: page.curPage
          };
          if(shouldPageNumberReset){
            page.curPage = 1;
            param.pageNo = page.curPage;
          }


            if(scope.tabIndex == 0) {
              for(var attr in searchKey2) {
                if(searchKey2[attr]) {
                  param[ attr] = searchKey2[attr];
                }
              }
            } else {
              for(var attr in searchKey3) {
                if(searchKey3[attr]) {
                  param[ attr] = searchKey3[attr];
                }
              }
            }


          if(scope.sortKey && scope.order) {
            param['sort'] = scope.sortKey;
            param['order'] = scope.order;
          }

          var _this = this;

          switch(status) {
            case '0,3':
            {
              scope.gridOptions2.showLoading = true;
              scope.navList[0].loading= true;
              break;
            }
            case 2:
            {
              scope.gridOptions3.showLoading = true;
              scope.navList[1].loading= true;
              break;
            }
          }
          GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

            switch(status) {
              case '0,3':
              {
                scope.gridOptions2.showLoading = false;
                scope.navList[0].count = data.totalCount? data.totalCount:"0";
                scope.navList[0].loading= false;
                break;
              }
              case 2:
              {
                scope.gridOptions3.showLoading = false;
                scope.navList[1].count = data.totalCount? data.totalCount:"0";
                scope.navList[1].loading= false;
                break;
              }
            }

            if(data.output) {
              var monthly = [];
              if(data.message) {
                var complete =  workTableCommonService.constructeAssignmentStaticColumns(scope,"mkfcOrder",true,100);

                scope.gridOptions2.columnDefs = angular.copy( workTableCommonService.constructeAssignmentStaticColumns(scope,"mkfcOrder",true,100,scope.gridOptions2.zsGridName));
                scope.gridOptions3.columnDefs =  angular.copy( workTableCommonService.constructeAssignmentStaticColumns(scope,"mkfcOrder",true,100,scope.gridOptions3.zsGridName));

                var c = false;
                for(var i = 0; i < scope.gridOptions2.columnDefs.length; i++) {
                  if('Abc0' == scope.gridOptions2.columnDefs[i].name) {
                    c = true;
                    break;
                  }
                }
                if(!c) {
                  var hoverTemplate = document.getElementById("hoverTemplate").innerText;
                  var noteStrs = new Array();
                  noteStrs = data.message.split(",");
                  for(var k = 0; k < noteStrs.length; k++) {
                    if(noteStrs[k].indexOf('Likely Volume 20') > -1) {
                      monthly.push(noteStrs[k].substring(14, noteStrs[k].length));
                    }
                  }
                  for(var i = 0; i < monthly.length; i++) {
                    var column = {
                      name: ('Abc' + i),
                      displayName: "Likely Volume "+monthly[i],
                      field: 'likelyVol' + (i + 1),
                      minWidth: '100',
                      enableCellEdit: false
                      //										cellTemplate: hoverTemplate
                    }
                    scope.gridOptions2.columnDefs.push(column);
                    scope.gridOptions3.columnDefs.push(column);
                  }
                }

              }

              switch(status) {
                case '0,3':
                {
                  data.output = translateData(data.output);
                  scope.marketingForecastNewPending = data.output;
                  // for(var i = 0; i < scope.marketingForecastNewPending.length; i++) {
                  // 	scope.marketingForecastNewPending[i].preOrders = translateData(scope.marketingForecastNewPending[i].preOrders);
                  // }
                  scope.gridOptions2.data = scope.marketingForecastNewPending;
                  scope.page2.totalNum = data.total;
                  scope.gridOptions2.totalItems = scope.page2.totalNum;
                  // var height = (20 * 30) + 36;
                  // $("#marketing_forecast_grid1").css('height', height + 'px');
                  scope.tabStatus.tabIndex1 = true;
                  break;
                }
                case 2:
                {
                  data.output = translateData(data.output);
                  scope.marketingForecastNewOrder = data.output;
                  // for(var i = 0; i < scope.marketingForecastNewOrder.length; i++) {
                  // 	scope.marketingForecastNewOrder[i].preOrders = translateData(scope.marketingForecastNewOrder[i].preOrders);
                  // }
                  scope.gridOptions3.data = scope.marketingForecastNewOrder;
                  scope.page3.totalNum = data.total;
                  scope.gridOptions3.totalItems = scope.page3.totalNum;
                  // var height = (20 * 30) + 36;
                  // $("#marketing_forecast_grid2").css('height', height + 'px');
                  scope.tabStatus.tabIndex2 = true;
                  break;
                }
              }

            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {

            switch(status) {
              case '0,3':
              {
                scope.gridOptions2.showLoading = false;
                break;
              }
              case 2:
              {
                scope.gridOptions3.showLoading = false;
                break;
              }
            }

            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

        this.adjustFactoryAssignment = function(scope, mode, tab) {
          var _this = this;
          var selectedRows = [];
          var selectedRows1 = [];
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
                selectedRows1.push(selectedRows[i]);
              }
            }
          } else if(mode == 3) {
            for(var i = 0; i < selectedRows.length; i++) {
              if(selectedRows[i].aSource != "APU002"){
                var w = {
                  "workingNo": selectedRows[i].workingNo,
                  "lastProductionFactory": selectedRows[i].aSource
                }
                workingNos.push(w);
                selectedRows1.push(selectedRows[i]);
              }
            }
          } else if(mode == 4) {
            for(var i = 0; i < selectedRows.length; i++) {
              if(selectedRows[i].correctedSource == "" || selectedRows[i].correctedSource == null) {
                modalAlert(CommonService, 2, $translate.instant('errorMsg.CORRECTED_SROURCE_IS_NULL'), null);
                return;
              }
              selectedRows1.push(selectedRows[i]);
            }
          }

          if(selectedRows.length > 0 && selectedRows1.length == 0){
            modalAlert(CommonService, 2, $translate.instant('notifyMsg.PLEASE_CONFIRM_SEPCIAL_FACTORY'), null);
            return;
          }

          var param = {
            "ids": listToString(selectedRows1, 'assignResultId'),
            "workingNos": workingNos,
            "mode": mode,
            "orderType": "1"
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
        this.getTransitOrder = function(scope, page, status,shouldPageNumberReset) {
          scope.disableReleaseOrderButton = false;
          var param = {
            orderType: "1",
            status: status,
            pageSize: page.pageSize,
            pageNo: page.curPage
          };

          if(shouldPageNumberReset){
            page.curPage = 1;
            param.pageNo = page.curPage;
          }

            if(scope.tabIndex == 2) {
              for(var attr in searchKey4) {
                if(searchKey4[attr]) {
                  param[ attr] = searchKey4[attr];
                }
              }
            } else {
              for(var attr in searchKey5) {
                if(searchKey5[attr]) {
                  param[ attr] = urlCharTransfer(searchKey5[attr]);
                }
              }
            }


          if(scope.sortKey && scope.order) {
            param['sort'] = scope.sortKey;
            param['order'] = scope.order;
          }

          var _this = this;
         // scope.showLoading = true;

          if(status == '4') {
            scope.gridOptions4.showLoading = true;
            scope.navList[2].loading= true;
          } else if(status == '5') {
            scope.gridOptions5.showLoading = true;
            scope.navList[3].loading= true;
          }

          GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {

            if(status == '4') {
              scope.gridOptions4.showLoading = false;
              scope.navList[2].count = data.totalCount? data.totalCount:"0";
              scope.navList[2].loading= false;
            } else if(status == '5') {
              scope.gridOptions5.showLoading = false;
              scope.navList[3].count = data.totalCount? data.totalCount:"0";
              scope.navList[3].loading= false;
            }

            if(data.status == 0) {
              if(data.output) {
                var monthly = [];
                if(data.message) {
                  var complete =  workTableCommonService.constructeAssignmentStaticColumns(scope,"mkfcOrder",true,100);
                  ;
                  scope.gridOptions4.columnDefs = angular.copy(complete);
                  scope.gridOptions5.columnDefs =  angular.copy(complete);

                  var c = false;
                  for(var i = 0; i < scope.gridOptions4.columnDefs.length; i++) {
                    if('Abc0' == scope.gridOptions4.columnDefs[i].name) {
                      c = true;
                      break;
                    }
                  }
                  if(!c) {
                    var hoverTemplate = document.getElementById("hoverTemplate").innerText;
                    var noteStrs = new Array();
                    noteStrs = data.message.split(",");
                    for(var k = 0; k < noteStrs.length; k++) {
                      if(noteStrs[k].indexOf('Likely Volume 20') > -1) {
                        monthly.push(noteStrs[k].substring(14, noteStrs[k].length));
                      }
                    }
                    for(var i = 0; i < monthly.length; i++) {
                      var column = {
                        name: ('Abc' + i),
                        displayName: "Likely Volume "+monthly[i],
                        field: 'likelyVol' + (i + 1),
                        minWidth: '100',
                        enableCellEdit: false
                        //										cellTemplate: hoverTemplate
                      }
                      scope.gridOptions4.columnDefs.push(column);
                      scope.gridOptions5.columnDefs.push(column);
                    }
                  }

                }
                if(status == '4') {
                  scope.gridOptions4.data = translateData(data.output);
                  scope.page4.totalNum = data.total;
                  scope.gridOptions4.totalItems = scope.page4.totalNum;
                  if(data.total > 0) {

                  }
                } else if(status == '5') {
                  scope.gridOptions5.data = translateData(data.output);
                  scope.page5.totalNum = data.total;
                  scope.gridOptions5.totalItems = scope.page5.totalNum;
                  if(data.total > 0) {

                  }
                }
              }
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function(data) {

            if(status == '4') {
              scope.gridOptions4.showLoading = false;
            } else if(status == '5') {
              scope.gridOptions5.showLoading = false;
            }

            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

        }
        this.init = function(scope) {


          // 初期化
          var _this = this;
          searchKey2 = {};
          searchKey3 = {};
          scope.showLoading = true;
          scope.disableReleaseOrderButton = false;
          scope.gridOptions1 = factoryCapacityService.initFactoryCapacityGridOption(scope);

          scope.allCapData = {
            factoryCapData: [],
            processCapData: []
          };
        //  scope.navList //= ['New Pending', 'New Order','Transit Pending', 'Transit Order'];

          scope.navList =[{name:"New Pending",count:0},
            {name:"New Order",count:0},
            {name:"Transit Pending",count:0},
            {name:"Transit Order",count:0}
          ];

          scope.tabStatus = {
            tabIndex1: false,
            tabIndex2: false
          }
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
          scope.backGroundTemplate = document.getElementById("blueGreenTemplate") ? document.getElementById("blueGreenTemplate").innerText : "";
          scope.isNewTemplate = document.getElementById("isNewTemplate") ? document.getElementById("isNewTemplate").innerText : "";
          scope.season = "";
          scope.page2 = {
            curPage: 1,
            pageSize: 100,
            sortColumn: 'id',
            sortDirection: false,
            totalNum: 0
          };
          scope.page3 = {
            curPage: 1,
            pageSize: 100,
            sortColumn: 'id',
            sortDirection: false,
            totalNum: 0
          };
          scope.page4 = {
            curPage: 1,
            pageSize: 100,
            sortColumn: 'id',
            sortDirection: false,
            totalNum: 0
          };
          scope.page5 = {
            curPage: 1,
            pageSize: 100,
            sortColumn: 'id',
            sortDirection: false,
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
          scope.marketingForecastNewOrder = [];
          //					this.initData(scope);
          this.initGripOptionZero(scope);
          //					this.initGripOptionOne(scope);
          this.initGripOptionTwo(scope, 2, 'marketingForecastNewPengding');
          this.initGripOptionTwo(scope, 3, 'marketingForecastNewOrder');
          this.initGripOptionTwo(scope, 4, 'marketingForecastTransitPending');
          this.initGripOptionTwo(scope, 5, 'marketingForecastTransitOrder');

          //					this.initGripOptionTen(scope);

          this.getSelectedData(scope);
          _this.getDailyOrder(scope, 1);
          this.getAssignFactoryResult(scope, '1', '0,3', scope.page2);
          this.getAssignFactoryResult(scope, '1', 2, scope.page3);

          this.getTransitOrder(scope,scope.page4,4);
          this.getTransitOrder(scope,scope.page5,5);

          scope.gridOptions2.data = scope.marketingForecastNewPending;
          scope.gridOptions2.data = scope.marketingForecastNewOrder;

          for(var i = 2; i < 3; i++) {
            if(i == 4) continue;
            for(var j = 0; j < scope['gridOptions' + i].columnDefs.length; j++) {
              if('finalConfirmation' == scope['gridOptions' + i].columnDefs[j].name) {
                scope['gridOptions' + i].columnDefs.splice(j, 1);
              }
            }
          }
          //					this.getCustomerForecastReport(scope);
        };

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
        this.releaseOrder = function(scope) {

          if(scope.marketingForecastNewPending.length > 0) {
            modalAlert(CommonService, 2, $translate.instant('worktable.PLEASE_CONFIRM_THE_PENDING_ORDER'), null);
            return;
          }
          //
          if(scope.marketingForecastNewOrder.length == 0) {
            modalAlert(CommonService, 2, $translate.instant('worktable.NO_NEW_ORDER_CAN_RELEASE'), null);
            return;
          }
          if(!scope.documentIds) {
            modalAlert(CommonService, 2, $translate.instant('worktable.NO_DOCUMENT_NEED_TO_RELEASE'), null);
            return;
          }

          var _this = this;
          var param = {
            "documentIds": scope.documentIds,
            "status": "4"
          };
          scope.disableReleaseOrderButton = true;
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
        this.releaseTransitPendingOrder = function(scope) {

//        if(!scope.documentIds) {
//          modalAlert(CommonService, 2, $translate.instant('worktable.NO_DOCUMENT_NEED_TO_RELEASE'), null);
//          return;
//        }

          var _this = this;
          scope.disableReleaseOrderButton = true;

          var selectedRows = "";
          selectedRows = scope.gridOptions4.data;
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
        this.importFile = function(scope) {
          var _this = this;
          var modalInstance = $uibModal.open({
            templateUrl: 'FileModal',
            controller: 'FileController',
            backdrop: 'static',
            size: 'md',
            resolve: {
              planGroups: function() {
                return {
                  fileType: "502"
                };
              }
            }
          });
          modalInstance.result.then(function(returnData) {

            if(returnData) {
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
              _this.refreshAll(scope);
            }
          }, function() {});

        }
        this.exportFile = function(scope) {

        //  scope.exportButtonDisabled = true;

          var param = {
            documentType: 201,
            pageSize: 100000,
            pageNo: 1
          };
          switch(scope.tabIndex) {
            case 0:
            {
              param['orderType'] = '1';
              param['status'] = '0,2,3';
              break;
            }
            case 1:
            {
              param['orderType'] = '1';
              param['status'] = '0,2,3';
              break
            }
            case 2:
            {
              param['orderType'] = '1';
              param['status'] = '4';
              break;
            }
            case 3:
            {
              param['orderType'] = '1';
              param['status'] = '5';
              break;
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

        this.reAssign = function(scope){
          var param = {
            orderType: "1",
            status: "0,2,3",
            pageSize: 1,
            pageNo: 1
          };
          var _this = this;
          workTableCommonService.reAssignAll(scope,param,function(scope){
            _this.refreshAll(scope)
          })
        }

      }
    ])
    .controller('MarketingForecastCtrl', ['$scope', 'MarketingForecastService',
      function($scope, MarketingForecastService) {

        $scope.dynamicPopover = {
          content: 'Hello, World!',
          title: 'Title'
        };
        $scope.refreshAll = function() {
          MarketingForecastService.refreshAll($scope);
        }
        $scope.adjustFactoryAssignment = function(mode, tab) {
          MarketingForecastService.adjustFactoryAssignment($scope, mode, tab);
        }
        $scope.toUpload = function(entity) {
          MarketingForecastService.toUpload($scope, entity);
        };
        $scope.selectTab = function(index) {
          MarketingForecastService.selectTab($scope, index);
        }
        $scope.setupScrollableTabSet = function(length, index) {
          if(length >= index + 1) {
            if($scope.scrlTabsApi.doRecalculate) {
              $scope.scrlTabsApi.doRecalculate();
            }
          }
        };
        $scope.selectTab2 = function(index) {
          MarketingForecastService.selectTab2($scope, index);
        }
        $scope.setupScrollableTabSet2 = function(length, index) {
          if(length >= index + 1) {
            if($scope.scrlTabsApi2.doRecalculate) {
              $scope.scrlTabsApi2.doRecalculate();
            }
          }
        };

        $scope.exportFile = function() {
          MarketingForecastService.exportFile($scope);
        }
        $scope.importFile = function() {
          MarketingForecastService.importFile($scope);
        }

        $scope.releaseOrder = function(type) {
          MarketingForecastService.releaseOrder($scope, type);
        }
        $scope.releaseTransitPendingOrder = function(type) {
          MarketingForecastService.releaseTransitPendingOrder($scope, type);
        }

        $scope.assignFactory = function() {
          MarketingForecastService.assignFactory($scope);
        }

        $scope.deleteDom = function(entity) {
          MarketingForecastService.deleteDom($scope, entity);
        };
        $scope.toggleFilterRow = function() {
          MarketingForecastService.toggleFilterRow($scope);
        };
        $scope.adjustFactoryAssignment2 = function(mode, confirmFactory) {
          MarketingForecastService.adjustFactoryAssignment2($scope, mode, confirmFactory);
        };
        $scope.reAssign = function(){
          MarketingForecastService.reAssign($scope)
        }

        $scope.bottomGridHeight = function(){

          if(!$scope.hideTopInfo){
            return {height:"385px"}
          }{
            return {height:(window.innerHeight-300)+"px"}
          }

        }

        MarketingForecastService.init($scope);

      }
    ])
})();
