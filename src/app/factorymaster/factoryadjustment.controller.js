/**
 * Created by mac on 2017/11/6.
 */
(function () {
  'use strict';
  angular
    .module('cpo')
    .service('FactoryAdjustmentService', ['$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', '$timeout', 'FilterInGridService',
      function ($http, $translate, CommonService, $uibModal, uiGridConstants, $timeout, FilterInGridService) {
        var __this = this;
        this.showBottomGridLoading = false;
        this.releaseOrder = function (scope) {

          var ids = "";
          if (!scope.showBottom) {

            var selectedRows = scope.gridApi1.core.getVisibleRows().filter(function (row) {
              return row.isSelected;
            }).map(function (row) {
              return row.entity
            });

            if (selectedRows.length <= 0) {
              modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
              return;
            }

            angular.forEach(selectedRows, function (row) {
              if ("1" == scope.documentType) {
                var l = row.assignResultIds.split(",")
                for (var i = 0; i < l.length; i++) {
                  var id = l[i].split("::")[1];
                  ids += id + ","
                }
              } else {
                angular.forEach(row.adjustOrderMonthlyQuantiys, function (monthInfo) {

                  ids += monthInfo.ids + ","
                })
              }
            })
          } else {

            angular.forEach(scope.factoryAdjustmentByWorkingNoData, function (rowData) {

              angular.forEach(rowData.selectKeys, function (key) {
                if (rowData[key]) {
                  ids += rowData.selectIds[key] ? (rowData.selectIds[key] + ",") : "";
                }
              })
            });
            if (ids.length == 0) {
              modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
              return;
            }
          }

          var param = {
            "documentIds": scope.documentId,
            "status": "5",
            "assignResultIds": ids
          };

          scope.disableReleaseOrderButton = true;
          GLOBAL_Http($http, "cpo/api/document/release_document", 'POST', param, function (data) {
            scope.disableReleaseOrderButton = false;
            if (data.status == 0) {
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.RELEASE_SUCCESS'), null);
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
          }, function (data) {
            scope.disableReleaseOrderButton = false;
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

        this.exportFile = function (scope) {

          var select = scope.idPropertyData.filter(function (item) {
            var selected = false;
            angular.forEach(scope.idPropertyModel, function (selectItem) {
              selected = selected || (item.id == selectItem.id);
            })
            return selected;

          })
          var orderQtyType = select.reduce(function (pre, next) {
            return pre + next.label + ","
          }, "")
          var params = null;

          if (scope.showBottom) {

            params = this.getSearchParam(scope);
            params.documentType = 902;
            params.queryType = 2;
            params.pageSize = 100000;
            params.pageNo = 1;


          } else {
            params = {
              documentType: 901,
              pageSize: 100000,
              queryType: 1,
              pageNo: 1
            };

          }
          if (scope.showBottom) {
            // params.eq_working_no  = scope.bottomParams.eq_working_no;

          }
          if (scope.documentId) {
            params.eq_document_id = scope.documentId;
          }

          if (orderQtyType) {
            params.orderQtyType = orderQtyType;
          }
          CommonService.showLoadingView("Exporting...");
          GLOBAL_Http($http, "cpo/portal/document/check_record_count?", 'GET', params, function (data) {
            CommonService.hideLoadingView();
            if (data.status == 0) {
              if (parseInt(data.message) > 0) {
                exportExcel(params, "cpo/portal/document/export_file?", "_blank");
              } else {
                modalAlert(CommonService, 2, $translate.instant('notifyMsg.NO_DATA_EXPORT'), null);
              }
            }
          }, function (data) {
            CommonService.hideLoadingView();
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });

        }
        this.checkboxChange = function (scope, row) {

          var isAllSelect = true;
          angular.forEach(row.entity.selectKeys, function (key) {
            isAllSelect = isAllSelect && row.entity[key];
          })
          row.setSelected(isAllSelect);

        }
        this.search = function (scope) {
          if (!scope.searchRequest.orderTime.id || scope.searchRequest.orderTime.id.length == 0) {
            modalAlert(CommonService, 2, "No " + scope.searchRequest.docType.label + " document founds.", null);
            return;
          }
          FilterInGridService.gridClearAllFilter(scope.gridApi1.grid);
          FilterInGridService.gridClearAllFilter(scope.gridApi2.grid);
          if (scope.searchRequest.productType.id.length > 0) {
            scope.info.productType = scope.searchRequest.productType.id;
          } else {
            scope.info.productType = null;
          }
          if (scope.searchRequest.fabricType.id.length > 0) {
            scope.info.wovenKnit = scope.searchRequest.fabricType.id;
          } else {
            scope.info.wovenKnit = null;
          }
          scope.gridOptions1.zsColumnFilterRequestParam = __this.getSearchParam(scope);
          __this.collapose(scope);
          __this.getTopGridInfo(scope);

          // __this.filterRequest(scope, "workingNo", false, function (array) {

          //   scope.workingNos = array;
          //   // scope.searchRequest.workingNo = scope.workingNos[0];
          //   var index = 0;
          //   for (var i in array) {
          //     if (scope.searchRequest.workingNo && array[i].id.toUpperCase() == scope.searchRequest.workingNo.id.toUpperCase()) {
          //       index = i;
          //       break;
          //     }
          //   }
          //   scope.searchRequest.workingNo = scope.workingNos[index];
          // });
          // __this.filterRequest(scope, "productTypeFr", false, function (array) {
          //   scope.productTypes = array;
          //   var index = 0;
          //   for (var i in array) {
          //     if (scope.info && scope.info.productTyp && array[i].id.toUpperCase() == scope.info.productType.toUpperCase()) {
          //       index = i;
          //       break;
          //     } else if (scope.searchRequest.productType && array[i].id.toUpperCase() == scope.searchRequest.productType.id.toUpperCase()) {
          //       index = i;
          //       break;
          //     }
          //   }
          //   scope.searchRequest.productType = scope.productTypes[index];
          // });
          // __this.filterRequest(scope, "fabricType", false, function (array) {
          //   scope.fabricTypes = angular.copy(array);
          //   var index = 0;
          //   for (var i in array) {
          //     if (scope.info && scope.info.wovenKnit && array[i].id.toUpperCase() == scope.info.wovenKnit.toUpperCase()) {
          //       index = i;
          //       break;
          //     } else if (scope.searchRequest.wovenKnit && array[i].id.toUpperCase() == scope.searchRequest.wovenKnit.id.toUpperCase()) {
          //       index = i;
          //       break;
          //     }
          //   }
          //   scope.searchRequest.fabricType = scope.fabricTypes[index];

          // });


        }
        this.buttonGridRowTemplate = function () {
          return '<div ng-dblclick="grid.appScope.rowDblClick(row,false)" >' +
            '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
            '</div>';
        }
        this.topGridRowTemplate = function () {
          return '<div ng-dblclick="grid.appScope.rowDblClick(row,true)" >' +
            '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
            '</div>';
        }

        this.adjustFactoryAssignment2 = function (scope, index, confirmFactory) {



          var _this = this;
          var selectedRows = "";

          if (!scope.showBottom) {
            //  selectedRows = scope.gridApi1.selection.getSelectedRows();
            selectedRows = scope.gridApi1.core.getVisibleRows().filter(function (row) {
              return row.isSelected;
            }).map(function (row) {
              return row.entity

            });

            if (selectedRows.length <= 0) {
              modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
              return;
            }

            var shouldEnterTransferReason = false;
            angular.forEach(selectedRows, function (item) {
              if (item.confirmFactory) {
                shouldEnterTransferReason = true;
              }
            });
            if (!shouldEnterTransferReason) {
              var ids = "";
              angular.forEach(selectedRows, function (row) {
                if ("1" == scope.documentType) {
                  var l = row.assignResultIds.split(",")
                  for (var i = 0; i < l.length; i++) {
                    var id = l[i].split("::")[1];
                    ids += id + ","
                  }
                } else {
                  angular.forEach(row.adjustOrderMonthlyQuantiys, function (monthInfo) {

                    ids += monthInfo.ids + ","
                  })
                }
              })
                ;

              var param = {
                "ids": ids,//listToString(selectedRows , 'assignResultIds') ,
                "mode": 6,
                "assign_source": scope.documentType,
                "confirmFactory": confirmFactory,
                "isFactoryAdjustment": 'YES'

              }
              CommonService.showLoadingView("", function () {



              });

              GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function (data) {
                CommonService.hideLoadingView();
                if (data.status == 0) {

                  modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
                  __this.getTopGridInfo(scope);

                } else {

                  modalAlert(CommonService, 2, data.message, null);
                }
              }, function (data) {
                CommonService.hideLoadingView();
                modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
              });
              return;
            }
            var modalInstance =
              $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-header",
                templateUrl: 'app/factorymaster/transferReason.html',
                controller: 'transferReasonCtrrl'

              });
            modalInstance.resolve = function (result) {

              var ids = "";
              angular.forEach(selectedRows, function (row) {
                if ("1" == scope.documentType) {
                  var l = row.assignResultIds.split(",")
                  for (var i = 0; i < l.length; i++) {
                    var id = l[i].split("::")[1];
                    ids += id + ","
                  }
                } else {
                  angular.forEach(row.adjustOrderMonthlyQuantiys, function (monthInfo) {

                    ids += monthInfo.ids + ","
                  })
                }
              })
                ;

              var param = {
                "ids": ids,//listToString(selectedRows , 'assignResultIds') ,
                "mode": 6,
                "assign_source": scope.documentType,
                "confirmFactory": confirmFactory,
                "isFactoryAdjustment": 'YES',
                transferReason: result.reason,
                transferRemark: result.remark
              }
              CommonService.showLoadingView("", function () {



              });

              GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function (data) {
                CommonService.hideLoadingView();
                if (data.status == 0) {

                  modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
                  __this.getTopGridInfo(scope);

                } else {

                  modalAlert(CommonService, 2, data.message, null);
                }
              }, function (data) {
                CommonService.hideLoadingView();
                modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
              });




            };


          } else {
            var shouldEnterTransferReason = false;
            var requestids = "";
            angular.forEach(scope.factoryAdjustmentByWorkingNoData, function (rowData) {

              angular.forEach(rowData.selectKeys, function (key) {
                if (rowData[key]) {
                  requestids += rowData.selectIds[key] ? (rowData.selectIds[key] + ",") : "";

                  //有已经排厂的了,需要填写调厂原因
                  if (rowData[key.replace("isSelect", "factory")] && rowData[key.replace("isSelect", "factory")].indexOf("Pending") == -1) {
                    shouldEnterTransferReason = true;
                  }

                }
              })
            })

            if (requestids.length == 0) {
              modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
              return;
            }
            if (!shouldEnterTransferReason) {
              var param = {
                "ids": requestids,
                "mode": 6,
                "assign_source": scope.documentType,
                "isFactoryAdjustment": 'YES',
                "confirmFactory": confirmFactory
              }
              GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function (data) {
                if (data.status == 0) {

                  modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
                  __this.fetchBottomGridInfo(scope);
                  __this.updateSingleLineInfo(scope);
                  scope.shouldUpdateTopGrid = true;

                } else {

                  modalAlert(CommonService, 2, data.message, null);
                }
              }, function (data) {

                modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
              });
              return;
            }
            var modalInstance =
              $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-header",
                templateUrl: 'app/factorymaster/transferReason.html',
                controller: 'transferReasonCtrrl'

              });
            modalInstance.resolve = function (result) {
              var param = {
                "ids": requestids,
                "mode": 6,
                "assign_source": scope.documentType,
                "confirmFactory": confirmFactory,
                "isFactoryAdjustment": 'YES',
                transferReason: result.reason,
                transferRemark: result.remark
              }



              GLOBAL_Http($http, "cpo/api/worktable/adjust_assign", 'POST', param, function (data) {
                if (data.status == 0) {

                  modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
                  __this.fetchBottomGridInfo(scope);
                  __this.updateSingleLineInfo(scope);
                  scope.shouldUpdateTopGrid = true;

                } else {

                  modalAlert(CommonService, 2, data.message, null);
                }
              }, function (data) {

                modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
              });


            }
          }


        }
        this.rowDblClick = function (scope, row, isByWorkingNo) {

          scope.showNewOrder = 'showNewOrder';

          setTimeout(function () {


            var info = {
              eq_product_type_fr: row.entity.productTypeFr,
              eq_fabric_type: row.entity.fabricType,
              eq_working_no: row.entity.workingNo
            }

            if (!isByWorkingNo) {

              info.eq_supply_chain_track = row.entity.supplyChainTrack;
              info.eq_order_country = row.entity.orderCountry;
            }

            scope.$broadcast("factoryneworderadjustment.afterInit", info);

          }, 1000);

        }


        this.filterRequest = function (scope, field, shouldNumber, resultBlock) {
          var params = { "field": field, "queryType": 1 };
          // if (scope.searchRequest.orderTime.id) {
          //   params["eq_document_id"] = scope.searchRequest.orderTime.id;
          // }
          GLOBAL_Http($http, "cpo/api/factory_adjustment/query_adjustment_data_filter?", 'GET', params, function (data) {
            var result = [];
            if (data.output) {
              result = data.output.filter(function (item) {
                return item.hasOwnProperty("field")
              }).map(function (item) {
                if (shouldNumber) {
                  return {
                    id: item.field ? item.field : "",
                    label: (item.field ? item.field : "[Empty]") + " ( " + item.fieldCount + " )"
                  }
                } else {
                  return {
                    id: item.field ? item.field : "",
                    label: (item.field ? item.field : "[Empty]")
                  }
                }

              });
            }

            if (resultBlock) {
              resultBlock([{ id: "", label: "All" }].concat(result));
            }
          }, function (data) {

            if (resultBlock) {
              resultBlock([{ id: "", label: "All" }]);
            }

          });
        }
        this.fetchBottomGridInfo = function (scope) {
          scope.showBottomGridLoading = true;
          scope.factoryAdjustmentByWorkingNoData = [];

          var params = angular.copy(__this.getSearchParam(scope));
          params["eq_working_no"] = scope.singleLineData[0].workingNo;
          params["queryType"] = 2;
          params.pageSize = 100000;
          params.pageNo = 1;
          //        var params = angular.copy(scope.bottomParams);

          var searchKey = FilterInGridService.getFilterParams(scope.gridApi2.grid);
          for (var key in searchKey) {
            params[key] = searchKey[key];
          }
          GLOBAL_Http($http, "cpo/api/factory_adjustment/query_adjustment_data?", 'GET', params, function (data) {
            scope.showBottomGridLoading = false;
            var headers = [];
            for (var key in data.headers) {
              var content = data.headers[key];
              var item = {
                name: content,
                displayName: content,
                field: key,
                width: '120',
                visible: !CommonService.columnHasHide(scope.gridOptions2.zsGridName, key),
                headerCellTemplate: 'app/worktable/filter.html'
              };
              headers.push(item);

            }
            var select = scope.idPropertyData.filter(function (item) {
              var selected = false;
              angular.forEach(scope.idPropertyModel, function (selectItem) {
                selected = selected || (item.id == selectItem.id);
              })
              return selected;

            })
            data.ouput = translateData(data.output);
            if (!data.output) {
              return;
            }
            data.output = translateData(data.output);
            //构造数据

            for (var index in data.output) {
              var item = data.output[index];

              var select = scope.idPropertyData.filter(function (item) {
                var selected = false;
                angular.forEach(scope.idPropertyModel, function (selectItem) {
                  selected = selected || (item.id == selectItem.id);
                })
                return selected;

              })

              item["totalString"] = "";
              for (var index3 in scope.idPropertyModel) {
                var attr = scope.idPropertyModel[index3];

                item["total" + attr.id] = 0;
              }
              for (var index2 in item.adjustOrderMonthlyQuantiys) {
                var monthInfo = item.adjustOrderMonthlyQuantiys[index2];
                var result = "";

                for (var index3 in scope.idPropertyModel) {
                  var attr = scope.idPropertyModel[index3];
                  item["total" + attr.id] += parseInt(monthInfo[attr.id]);
                  result += monthInfo[attr.id] + (index3 == scope.idPropertyModel.length - 1 ? "" : "/");
                }
                item['info' + monthInfo.month] = result;

              }

              item["totalString"] = "";
              for (var index3 in scope.idPropertyModel) {
                var attr = scope.idPropertyModel[index3];
                item["totalString"] += item["total" + attr.id] + (index3 == scope.idPropertyModel.length - 1 ? "" : "/");
              }

            }
            if (select.length > 0) {
              var month = "Total";
              var header = select.reduce(function (total, currentValue, currentIndex, arr) {
                return total + currentValue.label + (currentIndex < arr.length - 1 ? "/" : ")")
              }, month + "(")
              var length = 70 * (select.length) + 30
              var item = {
                name: month,
                displayName: header,
                field: "totalString",
                width: length
              }
              headers.push(item);

            }

            for (var index in data.monthList) {

              var year = data.monthList[index];
              var gramentQuantityModel = 'row.entity.gramentQuantity' + year;
              var numberMessageModel = 'row.entity.info' + year;
              var factoryModel = 'row.entity.factory' + year;
              var isSelectModel = 'row.entity.isSelect' + year;
              var isShowModel = 'row.entity.show' + year;
              //   var cell = "<span><input type='checkbox' ng-model='"+isSelectModel+"' ng-change='grid.appScope.checkboxChange(row)'/> </span><span>{{"+factoryModel+"}}</span><span>&nbsp;,&nbsp;</span><span>{{"+gramentQuantityModel+"}}</span>"
              var cell = "<div style='white-space: nowrap; '><span><input type='checkbox' ng-model='" + isSelectModel + "' ng-change='grid.appScope.checkboxChange(row)'/> </span><span>[{{" + factoryModel + "}}]</span><span>&nbsp;&nbsp;</span><span>({{" + numberMessageModel + "}})</span></div>>"

              cell = "<div ng-if='" + isShowModel + "'>" + cell + "</div>";

              var displayName = select.reduce(function (total, currentValue, currentIndex, arr) {
                return total + currentValue.label + (currentIndex < arr.length - 1 ? "/" : ")")
              }, year + "[Fty](");
              var item = {
                name: year,
                displayName: displayName,
                width: '250',
                cellTemplate: cell
              };

              headers.push(item);
            }
            scope.gridOptions2.columnDefs = angular.copy(headers);

            angular.forEach(data.output, function (item) {
              item.selectKeys = new Array();
              item.selectIds = {};
              angular.forEach(data.monthList, function (month) {

                item["factory" + month] = "Pending ";
                item["gramentQuantity" + month] = "0";
                item["show" + month] = false;
              })

              angular.forEach(item.adjustOrderMonthlyQuantiys, function (monthInfo) {

                item["factory" + monthInfo.month] = monthInfo.factory ? monthInfo.factory : "Pending ";
                item["gramentQuantity" + monthInfo.month] = monthInfo.totalQty ? monthInfo.totalQty : "0";
                item.selectIds["isSelect" + monthInfo.month] = monthInfo.ids ? monthInfo.ids : "";
                item["isSelect" + monthInfo.month] = false;
                item.selectKeys.push("isSelect" + monthInfo.month);
                // item.selectIds["isSelect"+monthInfo.month] = null;

                item["show" + monthInfo.month] = true;
              })

            })

            scope.factoryAdjustmentByWorkingNoData = data.output;
            scope.page2.totalNum = data.total;
            scope.gridOptions2.totalItems = scope.page2.totalNum;
          }, function (data) {
            scope.showBottomGridLoading = false;

          });
        }
        this.getSelectedData = function (scope) {
          var param = {
            in_code: 'PROCESS'
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function (data) {
            var array = [{ id: "", label: "All" }];
            if (data.PROCESS && data.PROCESS.length > 0) {


              array = array.concat(data.PROCESS.map(function (item) {
                return {
                  id: item.value,
                  label: item.label
                }

              }));

              scope.processNameList = angular.copy(array);
              scope.searchRequest.processName = scope.processNameList[0];
              angular.forEach(scope.processNameList, function (item) {
                if (scope.info.processId == item.id) {
                  scope.searchRequest.processName = item;
                }
              });

            }



          }, function (data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }
        this.initGripOption = function (scope) {
          // enablePaginationControls: false,
          var redLabelTemplate = document.getElementById("redLabelTemplate").innerText;
          //  scope.factoryCapacityData = null;
          scope.lastSelectRow = null;



          scope.gridOptions1 = {
            data: "factoryAdjustmentData",
            enableColumnMenus: true,
            enableGridMenu: true,
            multiSelect: true,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableFullRowSelection: false,
            enableRowHeaderSelection: true,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            zsGridName: "factoryAdjustment1",
            totalItems: scope.page.totalNum,

            enablePagination: true,
            useExternalPagination: false,
            showLoading: false,
            rowTemplate: __this.topGridRowTemplate(),
            paginationPageSizes: [10, 20, 50, 100, 200],
            paginationPageSize: 20,
            enablePaginationControls: true,
            expandableRowTemplate: '<div class="sub-ui-grid capacity-sub-grid" style="height: 230px" ui-grid-pagination ui-grid-selection ui-grid="row.entity.subGridOptions"></div>',
            expandableRowHeight: 230,
            expandableRowScope: 'row.subGridScope',
            columnDefs: [{
              name: 'factoryName',
              displayName: "",
              field: '',
              width: '180',
              enableCellEdit: false,

            }],
            onRegisterApi: function (gridApi) {
              scope.gridApi1 = gridApi;
              gridApi.selection.on.rowSelectionChanged(scope, function (row) {

                scope.singleLineData = [row.entity];
                if (row.isSelected) {

                  scope.lastSelectRow = row;


                } else {
                  scope.lastSelectRow = null;
                }
              });
              gridApi.core.on.columnVisibilityChanged(scope, function (column) {
                CommonService.columnVisibilityChanged(column);
                angular.forEach(column.grid.appScope.gridOptionsSingleLine.columnDefs, function (column2) {
                  if (column.field == column2.field) {
                    column2.visible = column.visible;
                  }
                })
              });
              gridApi.core.on.filterChanged(scope, function (col) {

                __this.getTopGridInfo(scope);
              });
            }
          };


          scope.gridOptionsSingleLine = {
            data: "singleLineData",
            enableColumnMenus: false,
            enableGridMenu: false,
            multiSelect: false,
            rowEditWaitInterval: -1,
            enableRowSelection: false,
            enableFullRowSelection: false,
            enableRowHeaderSelection: false,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            // totalItems: scope.page.totalNum,
            enablePagination: false,
            useExternalPagination: false,
            showLoading: true,
            enablePaginationControls: false,

            columnDefs: [],
            onRegisterApi: function (gridApi) {
            }
          };

          scope.gridOptions2 = {
            data: "factoryAdjustmentByWorkingNoData",
            enableColumnMenus: true,
            enableGridMenu: true,
            multiSelect: true,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableFullRowSelection: false,
            enableRowHeaderSelection: true,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            zsGridName: "factoryAdjustment2",
            totalItems: scope.page2.totalNum,
            enablePagination: true,
            rowTemplate: __this.buttonGridRowTemplate(),
            useExternalPagination: false,
            showLoading: true,

            paginationPageSizes: [20],
            paginationPageSize: 20,
            enablePaginationControls: true,
            expandableRowTemplate: '<div class="sub-ui-grid capacity-sub-grid" style="height: 230px" ui-grid-pagination ui-grid-selection ui-grid="row.entity.subGridOptions"></div>',
            expandableRowHeight: 230,
            expandableRowScope: 'row.subGridScope',
            columnDefs: [{
              name: 'factoryName',
              displayName: "",
              field: '',
              width: '180',
              enableCellEdit: false,

            }],
            onRegisterApi: function (gridApi) {

              scope.gridApi2 = gridApi;

              gridApi.core.on.columnVisibilityChanged(scope, CommonService.columnVisibilityChanged);

              gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;
              });
              gridApi.core.on.filterChanged(scope, function (col) {
                __this.fetchBottomGridInfo(scope);
              });

              gridApi.selection.on.rowSelectionChanged(scope, function (row) {
                angular.forEach(row.entity.selectKeys, function (key) {
                  row.entity[key] = row.isSelected;
                })


              });

            }
          };
        };
        this.getSearchParam = function (scope, workingno,isExpand) {

          var params = {
            queryType: 1
          };
          var selectTxt = ""
          var select = scope.idPropertyData.filter(function (item) {
            var selected = false;
            angular.forEach(scope.idPropertyModel, function (selectItem) {
              selected = selected || (item.id == selectItem.id);
            })
            return selected;
          })
          for(var i = 0;i<select.length;i++){
            selectTxt += select[i].label + ","
          }
          // console.log(selectTxt.substr(0,selectTxt.length-1))
          if(selectTxt){
            params.orderQtyType = selectTxt.substr(0,selectTxt.length-1)
          }
          if (scope.info.productType) {
            params.eq_product_type_fr = scope.info.productType;
          }
          if (scope.info.wovenKnit) {
            params.eq_fabric_type = scope.info.wovenKnit;
          }
          if (scope.info.processId) {
            params.eq_process_id = scope.info.processId;
          }
          if (workingno) {
            params.eq_working_no = workingno;
            params.queryType = 2;
          } else {
            params.queryType = 1;
          }
          if (scope.searchRequest.productType.id && scope.searchRequest.productType.id.length > 0) {
            params.eq_product_type_fr = encodeURIComponent(scope.searchRequest.productType.id);
          }

          if (scope.searchRequest.fabricType.id && scope.searchRequest.fabricType.id.length > 0) {
            params.eq_fabric_type = scope.searchRequest.fabricType.id;
          }

          if (scope.searchRequest.workingNo.id && scope.searchRequest.workingNo.id.length > 0) {
            params.eq_working_no = scope.searchRequest.workingNo.id;
          }
          if (scope.searchRequest.fromDate && scope.searchRequest.fromDate.length > 0) {
            params.pv_month = scope.searchRequest.fromDate + "-01";
          }
          if (scope.searchRequest.toDate && scope.searchRequest.toDate.length > 0) {
            params.to_pv_month = scope.searchRequest.toDate + "-03";
          }
          if (scope.searchRequest.garmentQty && scope.searchRequest.garmentQty.length > 0 &&params.queryType == 1&&!isExpand) {
            var key = scope.searchRequest.condition.id + "_total_qty";
            params[key] = scope.searchRequest.garmentQty;
          }
          if (scope.searchRequest.totalPvQuantitys && scope.searchRequest.totalPvQuantitys.length > 0 &&params.queryType == 1&&!isExpand) {
            var key2 = scope.searchRequest.condition2.id + "_totalPvQuantitys";
            params[key2] = scope.searchRequest.totalPvQuantitys;
          }
          if (scope.searchRequest.processName) {
            params["eq_process_id"] = scope.searchRequest.processName.id;
          }
          if (scope.searchRequest.site.label != "All") {
            params["eq_confirm_factory"] = scope.searchRequest.site.label;
          }
          if (scope.searchRequest.orderTime.id) {
            params["eq_document_id"] = scope.searchRequest.orderTime.id;
          }
          for (var key in params) {
            if (!params[key] || params[key].length == 0) {
              delete params[key]
            }
          }
          return params;
        }
        this.getTopGridInfo = function (scope,data) {
          var params = angular.copy(__this.getSearchParam(scope));
          params.pageNo = 1;
          params.pageSize = 100000;

          var searchKey = FilterInGridService.getFilterParams(scope.gridApi1.grid);
          for (var key in searchKey) {
            params[key] = searchKey[key];
          }
          scope.factoryAdjustmentData = [];
          scope.gridOptions1.showLoading = true;
          GLOBAL_Http($http, "cpo/api/factory_adjustment/query_adjustment_data?", 'GET', params, function (data) {
            scope.gridOptions1.showLoading = false;
            data.output = translateData(data.output);

            scope.documentName = data.documentName;
            scope.documentType = data.documentType;
            scope.documentId = data.documentId;
            scope.documentStatus = data.documentStatus;
            scope.couldReleaseOrder = (scope.documentStatus == 4) && (scope.documentType == 2);
            var headers = [];
            var headers2 = [];
            var buttonColumn = {
              name: 'adjust',
              displayName: "",
              field: '',
              width: '70',
              pinnedLeft: true,
              enableCellEdit: false,
              cellTemplate: '<button type="button" class="btn btn-info"  ng-click="grid.appScope.expand(row)" >Expand</button>'
            };
            var buttonColumn2 = {
              name: 'collapse',
              displayName: "",
              field: '',
              width: '70',
              pinnedLeft: true,
              enableCellEdit: false,
              cellTemplate: '<button type="button" class="btn btn-info"  ng-click="grid.appScope.collapose()" >Collapse</button>'
            };
            if (scope.documentType != 1) {
              headers.push(buttonColumn);
            }

            headers2.push(buttonColumn2);


            for (var key in data.headers) {
              var content = data.headers[key];
              var item = {
                name: content,
                displayName: content,
                field: key,
                width: '180',
                visible: !CommonService.columnHasHide(scope.gridOptions1.zsGridName, key),
                headerCellTemplate: 'app/worktable/filter.html'
              };
              if (key == "workingNo") {
                item.pinnedLeft = true;
              }
              headers.push(item);

            }
            for (var key in data.headers) {
              var content = data.headers[key];
              var item = {
                name: content,
                displayName: content,
                field: key,
                width: '180',
                visible: !CommonService.columnHasHide(scope.gridOptions1.zsGridName, key)
              };
              if (content === 'WorkingNo') {
                item.pinnedLeft = true
              }
              headers2.push(item);
            }

            var select = scope.idPropertyData.filter(function (item) {
              var selected = false;
              angular.forEach(scope.idPropertyModel, function (selectItem) {
                selected = selected || (item.id == selectItem.id);
              })
              return selected;
            })
            //构造数据
            for (var index in data.output) {
              var item = data.output[index];
              item["totalString"] = "";
              for (var index3 in select) {
                var attr = select[index3];

                item["total" + attr.id] = 0;
              }
              for (var index2 in item.monthListInfo) {
                // var monthInfo = item.monthListInfo[index2];
                // var result = "";

                // for (var index3 in select) {
                //   var attr = select[index3];
                //   item["total" + attr.id] += parseInt(monthInfo[attr.id]);
                //   result += monthInfo[attr.id] + (index3 == select.length - 1 ? "" : "/");
                // }
                item[index2 + "info"] = item.monthListInfo[index2];

              }

              item["totalString"] = item.totalTypeQtys;
              // for (var index3 in select) {
              //   var attr = select[index3];
              //   item["totalString"] += item["total" + attr.id] + (index3 == select.length - 1 ? "" : "/");
              // }

            }
            if (select.length > 0) {
              var arr = {
                euRates:"EU Rate",
                euQuantitys:"EU Quantity",
                chinaRates:"CHINA Rate",
                chinaQuantitys:"CHINA Quantity",
                totalString:"Total"
              }
              for(var key in arr){
                var month = arr[key];
                var header = select.reduce(function (total, currentValue, currentIndex, arr) {
                  return total + currentValue.label + (currentIndex < arr.length - 1 ? "/" : ")")
                }, month + "(")
                var length = 70 * (select.length) > 120 ? (70 * (select.length)) : 120
                var item = {
                  name: month,
                  displayName: header,
                  field: key,
                  width: length,
                  headerCellTemplate: 'app/worktable/filter.html'
                }
                headers.push(item);
                headers2.push(angular.copy(item));
              }


            }

            //构造header
            if (select.length > 0) {
              for (var index in data.monthList) {
                var month = data.monthList[index];
                var header = select.reduce(function (total, currentValue, currentIndex, arr) {
                  return total + currentValue.label + (currentIndex < arr.length - 1 ? "/" : ")")
                }, month + "(")
                var length = 70 * (select.length) > 120 ? (70 * (select.length)) : 120
                var item = {
                  name: month,
                  displayName: header,
                  field: month + "info",
                  width: length
                };
                headers.push(item);
                headers2.push(angular.copy(item));
              }
            }

            scope.gridOptions1.columnDefs = angular.copy(headers);
            scope.factoryAdjustmentData = data.output;
            scope.page.totalNum = data.total;
            scope.gridOptions1.totalItems = scope.page.totalNum;
            scope.gridOptionsSingleLine.columnDefs = angular.copy(headers2);
            scope.singleLineData = data.output ? [data.output[0]] : [];
            angular.element("#singleRowGrid").css("height", "110px")

          }, function (data) {
            scope.gridOptions1.showLoading = false;

          });
        }
        this.expand = function (scope, row) {
          scope.showBottom = true;
          scope.singleLineData = [row.entity];

          scope.showFactioryDetail = true;
          var params = __this.getSearchParam(scope, row.entity.workingNo,'YES');


          scope.bottomParams = {
            eq_working_no: row.entity.workingNo,
            queryType: 2,
            eq_document_id: scope.documentId
          };
          if (params.pv_month) {
            scope.bottomParams.pv_month = params.pv_month;
          } else {
            if (scope.bottomParams.pv_month) {
              delete scope.bottomParams.pv_month;
            }
          }
          if (params.to_pv_month) {
            scope.bottomParams.to_pv_month = params.to_pv_month;
          } else {
            if (scope.bottomParams.to_pv_month) {
              delete scope.bottomParams.to_pv_month;
            }
          }
          var url = "cpo/api/factory_adjustment/query_adjustment_data_filter?";

          scope.gridOptions2.zsColumnFilterRequestUrl = url;
          scope.gridOptions2.zsColumnFilterRequestParam = angular.copy(scope.bottomParams);
          FilterInGridService.gridClearAllFilter(scope.gridApi2.grid);
          __this.fetchBottomGridInfo(scope);

        }

        this.getFactoryList = function (scope) {
          var _this = this;
          var param = {
            pageNo: 1,
            pageSize: 1000,
            eq_factory_type: 0
          }
          GLOBAL_Http($http, "portal/factory/find?", 'GET', param, function (data) {
            if (data.rows) {
              scope.items = translateData(data.rows);

              scope.siteList = new Array();

              for (var i = 0; i < scope.items.length; i++) {
                var siteData = {
                  id: scope.items[i].factoryId,
                  label: scope.items[i].factSimpName
                }
                // if(scope.items[i].factSimpName === scope.info.factoryName){
                //   scope.searchRequest.site = siteData;
                // }
                scope.searchRequest.site = scope.siteList[0]
                scope.siteList.push(siteData);
              }
              // if(!scope.searchRequest.site){
              //   scope.searchRequest.site = scope.siteList[0]
              // }
            } else {
              scope.siteList = [{ id: "", label: "none" }];
              scope.searchRequest.site = scope.siteList[0];

              //  modalAlert(CommonService , 2 , data.message , null);
            }
            //
          }, function (data) {
            scope.siteList = [{ id: "", label: "none" }];
            scope.searchRequest.site = scope.siteList[0];
            // modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
          });
        }
        this.collapose = function (scope) {

          scope.showBottom = false;
          if (scope.shouldUpdateTopGrid) {
            __this.getTopGridInfo(scope);
          }
          scope.shouldUpdateTopGrid = false;
        }
        this.getFactoryList = function (scope) {
          var _this = this;
          var param = {
            pageNo: 1,
            pageSize: 1000,
            eq_factory_type: 0
          }
          GLOBAL_Http($http, "portal/factory/find?", 'GET', param, function (data) {
            if (data.rows) {
              scope.items = translateData(data.rows);

              scope.siteList = new Array();
              scope.siteListNoAll = new Array();
              scope.siteList.push({ id: "", label: "All" });
              var site = {}
              for (var i = 0; i < scope.items.length; i++) {
                var siteData = {
                  id: scope.items[i].factoryId,
                  label: scope.items[i].factSimpName
                }
                 if(scope.info && scope.items[i].factSimpName === scope.info.factoryName){
                  site = siteData;
                }

                scope.siteList.push(siteData);
                scope.siteListNoAll.push(siteData);

              }
              if(site){
                scope.searchRequest.site = site
              }else
              scope.searchRequest.site = scope.siteList[0];
              scope.searchRequest.site2 = scope.siteListNoAll[0];

            } else {

            }

          }, function (data) {


          });
        }
        this.getOrderTime = function (scope) {
          if (scope.searchRequest.docType.id == "") {
            scope.orderTimes = [{ id: '', label: "" }];
            scope.searchRequest.orderTime = scope.orderTimes[0];
            return;
          }
          var params = {
            orderActualType: scope.searchRequest.docType.id,
            documentStatus: "3,4"
          };


          GLOBAL_Http($http, "cpo/api/document/query_order_date?", 'GET', params, function (data) {

            if (data.status && data.output && data.output.length > 0) {
              var result = data.output.map(function (item) {
                return {
                  id: item.documentId,
                  label: new Date(item.utcCreate).toLocaleDateString()
                }

              })
              scope.orderTimes = result;

              scope.searchRequest.orderTime = scope.orderTimes[scope.orderTimes.length - 1];
            } else {
              scope.orderTimes = [{ id: '', label: "" }]
              scope.searchRequest.orderTime = scope.orderTimes[0];
            }

          }, function (data) {
            scope.orderTimes = [{ id: '', label: "" }];
            scope.searchRequest.orderTime = scope.orderTimes[0];
          });
        }
        this.updateSingleLineInfo = function (scope) {
          var params = {
            eq_working_no: scope.singleLineData[0].workingNo,
            queryType: 1
          };
          GLOBAL_Http($http, "cpo/api/factory_adjustment/?", 'GET', params, function (data) {
            data.output = translateData(data.output);
            scope.singleLineData[0] = data.output[0];

          }, function (data) {

          });
        }
        this.init = function (scope) {
          scope.documentName = "";
          scope.shouldUpdateTopGrid = false;
          scope.page = {
            curPage: 1,
            pageSize: 10,
            sortColumn: 'id',
            sortDirection: false,
            totalNum: 0
          };
          scope.page2 = {
            curPage: 1,
            pageSize: 10,
            sortColumn: 'id',
            sortDirection: false,
            totalNum: 0
          };
          scope.lastSelectRow = null;
          __this.initGripOption(scope);

          scope.$on('factoryneworderadjustment.close', function (data) {

            scope.showNewOrder = '';
          });

          scope.orderTimes = [{ id: '', label: "" }];

          scope.idPropertyData = [
            { id: "pvQuantity", label: 'PV' },
            { id: "openForecastQty", label: 'Open FC' },
            { id: "newOrderQty", label: 'New Order' },
            { id: "actualOrderQty", label: 'Actual Qty' }
          ];
          scope.orderTypes = [
            { id: "pvQuantity", label: 'PV' },
            { id: "openForecastQty", label: 'Open FC' },
            { id: "newOrderQty", label: 'New Order' },
            { id: "actualOrderQty", label: 'Actual Qty' }
          ];
          var smartButtonTextConverter = function (selectionArray) {
            return "aaa"
          };
          scope.idPropertyModel = [
            { id: "pvQuantity", label: 'PV' },
            { id: "openForecastQty", label: 'Open FC' },
            { id: "newOrderQty", label: 'New Order' },
            { id: "actualOrderQty", label: 'Actual Qty' }
          ];
          scope.idPropertySettings = {
            smartButtonMaxItems: 100,
            smartButtonTextConverter: function (itemText, originalItem) {
              return itemText;
            },
            showCheckAll: false,
            showUncheckAll: false
          };
          scope.searchRequest = {
            site: { id: "", label: "All" },
            site2: {},
            workingNo: { id: "", label: "All" },
            condition: { label: ">=", id: "gte" },
            condition2: { label: ">=", id: "gte" },
            productType: { id: "", label: "All" },
            fabricType: { id: "", label: "All" },
            supplyChainTrack: { id: "", label: "All" },
            articleNo: { id: "", label: "All" },
            orderCountry: { id: "", label: "All" },
            fromDate: "",
            toDate: "",
            garmentQty: "",
            totalPvQuantitys: "",
            orderTime: { id: "", label: "" },
            docType: { id: "", label: "" }
          };

          scope.searchRequest.orderTime = scope.orderTimes[0];

          scope.productType = {};
          scope.showNewOrder = '';
          scope.conditions = [
            { label: ">=", id: "gte" },
            { label: "=", id: "eq" },
            { label: ">", id: "gt" },
            { label: "<", id: "lt" },
            { label: "<=", id: "lte" }];
          scope.searchRequest.condition = scope.conditions[0];
          scope.searchRequest.condition2 = scope.conditions[0];

          scope.selectSettings = {
            enableSearch: false,
            showUncheckAll: false,
            showCheckAll: false,
            scrollable: false,
            scrollableHeight: '230px',
            checkboxes: false,
            selectionLimit: 1
          };
          scope.fromFactorymodel = {};

          //   __this.getTopGridInfo(scope);

          var initEvent = function (event, data) {
            scope.info = data;
            var url = "cpo/api/factory_adjustment/query_adjustment_data_filter?";
            var param = __this.getSearchParam(scope);
            scope.gridOptions1.zsColumnFilterRequestUrl = url,
            scope.gridOptions1.zsColumnFilterRequestParam = __this.getSearchParam(scope)
            var date = scope.info.date ? scope.info.date.substr(0,4)+"-"+ scope.info.date.substr(4,6) : ""
            scope.searchRequest.fromDate = date;
            scope.searchRequest.toDate = date;
            __this.getSelectedData(scope);
            __this.getTopGridInfo(scope,data);
            __this.getFactoryList(scope);

            scope.searchRequest.productType = scope.info.productType
            scope.searchRequest.fabricType = scope.info.wovenKnit
            scope.workingNos = [{ id: "", label: "All" }];
            scope.searchRequest.workingNo = scope.workingNos[0];
            scope.productTypes = [{ id: "", label: "All" }];
            if(scope.info.productType){
              scope.productTypes.push({id:scope.info.productType,label:scope.info.productType})
              scope.searchRequest.productType = {id:scope.info.productType,label:scope.info.productType}
            }else
              scope.searchRequest.productType = scope.productTypes[0];

            scope.fabricTypes = [{ id: "", label: "All" }];
            scope.searchRequest.fabricType = scope.fabricTypes[0];
            __this.filterRequest(scope, "fabricType", false, function (array) {
              scope.fabricTypes = angular.copy(array);
              var index = 0;
              for (var i in array) {
                if (scope.info && scope.info.wovenKnit && array[i].id.toUpperCase() == scope.info.wovenKnit.toUpperCase()) {
                  index = i;
                  break;
                } else if (scope.searchRequest.wovenKnit && array[i].id.toUpperCase() == scope.searchRequest.wovenKnit.id.toUpperCase()) {
                  index = i;
                  break;
                }
              }
              scope.searchRequest.fabricType = scope.fabricTypes[index];

            });
            __this.filterRequest(scope, "productTypeFr", false, function (array) {
              scope.productTypes = array;
              var index = 0;
              for (var i in array) {
                if (scope.info && scope.info.productTyp && array[i].id.toUpperCase() == scope.info.productType.toUpperCase()) {
                  index = i;
                  break;
                } else if (scope.searchRequest.productType && array[i].id.toUpperCase() == scope.searchRequest.productType.id.toUpperCase()) {
                  index = i;
                  break;
                }
              }
              scope.searchRequest.productType = scope.productTypes[index];
            });


            var _this = this;
            var param = {
              in_code: 'ADJUSTMENT_DOCUMENT_TYPE'
            }
            GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function (data) {

              if (data.ADJUSTMENT_DOCUMENT_TYPE && data.ADJUSTMENT_DOCUMENT_TYPE.length > 0) {
                scope.docTypes = [{ id: "", label: "" }].concat(data.ADJUSTMENT_DOCUMENT_TYPE.map(function (item) {
                  return {
                    id: item.value, label: item.label
                  }

                }));
              } else {
                scope.docTypes = [{ id: "", label: "" }];
              }
              //  scope.orderTypes = data.ADJUSTMENT_DOCUMENT_TYPE;
              scope.searchRequest.docType = scope.docTypes[0];
            }, function (data) {
              scope.orderTypes = [{ id: "", label: "" }];
              scope.searchRequest.docType = scope.docTypes[0];
            });


          };

          __this.getFactoryList(scope)
          scope.$on('factoryadjustment.afterInit', initEvent);
          $timeout(function () {
            scope.fromCapacity = true;
            if (!scope.info) {

              initEvent(null, {
                productType: "",
                wovenKnit: "",
                processId: ""
              });
            }
          }, 1000);
        }
      }


    ])

    .controller('FactoryAdjustmentCtrl', ['$scope', 'FactoryAdjustmentService',
      function ($scope, FactoryAdjustmentService) {
        FactoryAdjustmentService.init($scope);
        $scope.example1model = [];
        $scope.example1data = [{ id: 1, label: "David" }, { id: 2, label: "Jhon" }, {
          id: 3,
          label: "Danny"
        }];
        $scope.selectSettings = {
          enableSearch: false,
          showUncheckAll: false,
          showCheckAll: false,
          scrollable: false,
          scrollableHeight: '230px',
          checkboxes: false,
          selectionLimit: 1
        };
        $scope.adjustFactoryAssignment2 = function (index, confirmFactory) {
          FactoryAdjustmentService.adjustFactoryAssignment2($scope, index, confirmFactory);
        };
        $scope.closePage = function () {
          $scope.$emit('factoryadjustment.close', null);
        }
        $scope.expand = function (row) {
          FactoryAdjustmentService.expand($scope, row);
        }
        $scope.collapose = function () {

          FactoryAdjustmentService.collapose($scope);
        }

        $scope.rowDblClick = function (row, isByWorkingNo) {
          FactoryAdjustmentService.rowDblClick($scope, row, isByWorkingNo);
        }
        $scope.checkboxChange = function (row) {
          FactoryAdjustmentService.checkboxChange($scope, row);
        }

        $scope.search = function () {
          FactoryAdjustmentService.search($scope);
        }

        $scope.exportFile = function () {
          FactoryAdjustmentService.exportFile($scope);
        }
        $scope.orderDateSelect = function () {
          FactoryAdjustmentService.getOrderTime($scope);
        }
        $scope.releaseOrder = function () {
          FactoryAdjustmentService.releaseOrder($scope);
        }
        $scope.ngStyleHeightToBottom = function (top) {

          return { height: (window.innerHeight - top) + "px !important" };
          //return {height:"1000px"};
        }

      }])
})();
