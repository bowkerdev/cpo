(function() {
  'use strict';
  angular
    .module('cpo')
    .service('reportSummaryService', ['$http', '$translate', 'CommonService', '$uibModal','$filter',
      function($http, $translate, CommonService, $uibModal,$filter) {
        function selectNull(list) {
          var b=false;
          if(list.length==0){
            return true;
          }
          list.forEach(function (value) {
            if(value.id==""||value.id==null){
              b=true;
            }
          })
          return b;
        }
        function _join(list) {
          var str="";
          list.forEach(function (val) {
            if(str==""){
              str+=val.id;
            }else{
              str+=","+val.id;
            }
          })
          return str;
        }
        function findDef(list,selectList) {
          var result=[];
          list.forEach(function (value) {
            var c=false;
            selectList.forEach(function (val) {
              if(value.id==val.id){
                  c=true;
              }
            })
            if(!c&&result.indexOf(value)==-1) {
              result.push(value);
            }
          })
          return result;
        }
        function _joinf(list) {
          var str="";
          list.forEach(function (val) {
            if(str==""){
              str+=val.id;
            }else{
              str+="**"+val.id;
            }
          })
          return str;
        }
        this.getForwarderList=function (scope) {
          var param={
            in_code:"VENDORKPIFORWARDER"
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
            if(data.VENDORKPIFORWARDER){
              scope.forwarderList=data.VENDORKPIFORWARDER;
              for(var i=0;i<scope.forwarderList.length;i++){
                scope.forwarderList[i].id=scope.forwarderList[i].value;
              }
            }
          });
        }
        this.getFactoryList=function (scope,callBack) {
          var param={
            in_code:"FACTORYCODE"
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
            if(data.FACTORYCODE){
              scope.factoryCodeList=data.FACTORYCODE;
              for(var i=0;i<scope.factoryCodeList.length;i++){
                scope.factoryCodeList[i].id=scope.factoryCodeList[i].value;
                if(scope.factoryCodeList[i].label&& scope.factoryCodeList[i].label!=0){
                  scope.factoryCode.push(scope.factoryCodeList[i]);
                }
              }
              callBack();
              // scope.factoryCodeListdropdownItems=data.FACTORYCODE;
              // scope.factoryCodeListallDropdownItems=data.FACTORYCODE;
            }
          });
        }
        this.controlTime=function (scope,type,t) {
          if(t==1){
            if(Date.parse(new Date(scope.inputStartTime))>Date.parse(new Date(scope.inputEndTime))){
              modalAlert(CommonService, 2, $translate.instant('factoryCriteria.END_TIME_EARLY_THAN_START_TIME'), null);
              if(type=='start'){
                scope.inputStartTime='';
              }else{
                scope.inputEndTime='';
              }
            }
          }else{
            if(Date.parse(new Date(scope.intendedDeliveryStartDate))>Date.parse(new Date(scope.intendedDeliveryEndDate))){
              modalAlert(CommonService, 2, $translate.instant('factoryCriteria.END_TIME_EARLY_THAN_START_TIME'), null);
              if(type=='start'){
                scope.intendedDeliveryStartDate='';
              }else{
                scope.intendedDeliveryEndDate='';
              }
            }
          }
        }
        this.getSummaryList=function (scope) {
          var _this = this;
          var param = {
            pageNo: scope.page_summary.curPage,
            pageSize: scope.page_summary.pageSize
          }
          if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&& !selectNull(scope.factoryCode)){
            param.factoryCode=_join(scope.factoryCode);
          }else if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&&selectNull(scope.factoryCode)){
            param.nin_factoryCode=_join(findDef(scope.factoryCodeList,scope.factoryCode));
          }
          if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&& !selectNull(scope.forwarder)){
            param.forwarder=_joinf(scope.forwarder);
          }else if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&&!selectNull(scope.forwarder)){
            param.nin_forwarder=_joinf(findDef(scope.forwarderList,scope.forwarder));
          }
          if(scope.loadPort){
            param.loadPort=scope.loadPort;
          }
          if(scope.inputStartTime){
            param.startDate = scope.inputStartTime;
          }
          if(scope.inputEndTime){
            param.endDate =scope.inputEndTime;
          }
          if(scope.intendedDeliveryStartDate){
            param.intendedDeliveryStartDate=scope.intendedDeliveryStartDate;
          }
          if(scope.intendedDeliveryEndDate){
            param.intendedDeliveryEndDate=scope.intendedDeliveryEndDate;
          }
          scope.gridOptions_summary.showLoading=true;
          GLOBAL_Http($http, "cpo/api/report/summary?", 'GET', param, function(data) {
            scope.gridOptions_summary.showLoading=false;
            if(data.rows){
              scope.summaryItems=data.rows;
              scope.page_summary.totalNum=data.total;
              scope.gridOptions_summary.totalItems=scope.page_summary.totalNum;
            }else{
              scope.summaryItems=[];
              scope.page_summary.totalNum=0;
            }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
            scope.gridOptions_summary.showLoading=false;
          });
        }
        this.getDetailList=function (scope) {
          var _this = this;
          var param = {
            pageNo: scope.page_detail.curPage,
            pageSize: scope.page_detail.pageSize
          }
          if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&& !selectNull(scope.factoryCode)){
            param.factoryCode=_join(scope.factoryCode);
          }else if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&&selectNull(scope.factoryCode)){
            param.nin_factoryCode=_join(findDef(scope.factoryCodeList,scope.factoryCode));
          }
          if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&& !selectNull(scope.forwarder)){
            param.forwarder=_joinf(scope.forwarder);
          }else if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&&!selectNull(scope.forwarder)){
            param.nin_forwarder=_joinf(findDef(scope.forwarderList,scope.forwarder));
          }
          if(scope.loadPort){
            param.loadPort=scope.loadPort;
          }
          if(scope.inputStartTime){
            param.startDate = scope.inputStartTime;
          }
          if(scope.inputEndTime){
            param.endDate = scope.inputEndTime;
          }
          if(scope.intendedDeliveryStartDate){
            param.intendedDeliveryStartDate=scope.intendedDeliveryStartDate;
          }
          if(scope.intendedDeliveryEndDate){
            param.intendedDeliveryEndDate=scope.intendedDeliveryEndDate;
          }
          scope.gridOptions_detail.showLoading=true;
          GLOBAL_Http($http, "cpo/api/report/detail?", 'GET', param, function(data) {
            scope.gridOptions_detail.showLoading=false;
            if(data.rows){
              scope.detailItems=data.rows;
              scope.page_detail.totalNum=data.total;
              scope.gridOptions_detail.totalItems=scope.page_detail.totalNum;
            }else{
              scope.detailItems=[];
              scope.page_detail.totalNum=0;
            }
          }, function(data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
            scope.gridOptions_detail.showLoading=false;
          });
        }
        this.getReportList = function(scope) {
          var _this = this;
          _this.getSummaryList(scope);
          _this.getDetailList(scope);
        }
        this.selectThisOne_m=function (scope,row) {
          scope.gridApi_summary.selection.toggleRowSelection(row.entity);
        }
        this.selectThisOne_d=function (scope,row) {
          scope.gridApi_detail.selection.toggleRowSelection(row.entity);
        }
        this.exportFile =function(scope,type){
          var _this=this;
          var param={}
          switch (type){
            case "SUMMARY":
              param.documentType=1005;
              if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&& !selectNull(scope.factoryCode)){
                param.factoryCode=_join(scope.factoryCode);
              }else if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&&selectNull(scope.factoryCode)){
                param.nin_factoryCode=_join(findDef(scope.factoryCodeList,scope.factoryCode));
              }
              if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&& !selectNull(scope.forwarder)){
                param.forwarder=_joinf(scope.forwarder);
              }else if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&&!selectNull(scope.forwarder)){
                param.nin_forwarder=_joinf(findDef(scope.forwarderList,scope.forwarder));
              }
              if(scope.loadPort){
                param.loadPort=scope.loadPort;
              }
              if(scope.inputStartTime){
                param.startDate =scope.inputStartTime;
              }
              if(scope.inputEndTime){
                param.endDate = scope.inputEndTime;
              }
              if(scope.intendedDeliveryStartDate){
                param.intendedDeliveryStartDate=scope.intendedDeliveryStartDate;
              }
              if(scope.intendedDeliveryEndDate){
                param.intendedDeliveryEndDate=scope.intendedDeliveryEndDate;
              }
              break;
            case "DETAIL":
              param.documentType=1004;
              if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&& !selectNull(scope.factoryCode)){
                param.factoryCode=_join(scope.factoryCode);
              }else if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&&selectNull(scope.factoryCode)){
                param.nin_factoryCode=_join(findDef(scope.factoryCodeList,scope.factoryCode));
              }
              if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&& !selectNull(scope.forwarder)){
                param.forwarder=_joinf(scope.forwarder);
              }else if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&&!selectNull(scope.forwarder)){
                param.nin_forwarder=_joinf(findDef(scope.forwarderList,scope.forwarder));
              }
              if(scope.loadPort){
                param.loadPort=scope.loadPort;
              }
              if(scope.inputStartTime){
                param.startDate = scope.inputStartTime;
              }
              if(scope.inputEndTime){
                param.endDate = scope.inputEndTime;
              }
              if(scope.intendedDeliveryStartDate){
                param.intendedDeliveryStartDate=scope.intendedDeliveryStartDate;
              }
              if(scope.intendedDeliveryEndDate){
                param.intendedDeliveryEndDate=scope.intendedDeliveryEndDate;
              }
              break;
            case "ALL":
              param.documentType=1007;
              if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&& !selectNull(scope.factoryCode)){
                param.factoryCode=_join(scope.factoryCode);
              }else if(scope.factoryCode &&scope.factoryCode.length!=scope.factoryCodeList.length&&selectNull(scope.factoryCode)){
                param.nin_factoryCode=_join(findDef(scope.factoryCodeList,scope.factoryCode));
              }
              if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&& !selectNull(scope.forwarder)){
                param.forwarder=_joinf(scope.forwarder);
              }else if(scope.forwarder &&scope.forwarder.length!=scope.forwarderList.length&&!selectNull(scope.forwarder)){
                param.nin_forwarder=_joinf(findDef(scope.forwarderList,scope.forwarder));
              }
              if(scope.loadPort){
                param.loadPort=scope.loadPort;
              }
              if(scope.inputStartTime){
                param.startDate =scope.inputStartTime;
              }
              if(scope.inputEndTime){
                param.endDate = scope.inputEndTime;
              }
              if(scope.intendedDeliveryStartDate){
                param.intendedDeliveryStartDate=scope.intendedDeliveryStartDate;
              }
              if(scope.intendedDeliveryEndDate){
                param.intendedDeliveryEndDate=scope.intendedDeliveryEndDate;
              }
              break;
          }

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
        this.importFile=function (scope,type) {
          var _this = this;
          var paramType="";
          switch (type){
            case "SHP":
              paramType=1002;
              break;
            case "INV":
              paramType=1001;
              break;
            case "DOC":
              paramType=1003;
              break;
            case "HOL":
              paramType=1004;
              break;
            case "SHM-PA":
              paramType=1005;
              break;
            case "SHM-KN":
              paramType=1006;
              break;
            case "SHM-DC":
              paramType=1007;
              break;
          }
          var modalInstance = $uibModal.open({
            templateUrl: 'vendorKpiFileModal',
            controller: 'vendorKpiFileController',
            backdrop: 'static',
            size: 'md',
            resolve: {
              planGroups: function() {
                return {
                  fileType: paramType
                };
              }
            }
          });
          modalInstance.result.then(function(returnData) {
            if(returnData) {
              modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
              _this.getReportList(scope);
            }
          }, function() {});
        }

        /**
         * init
         */
        this.init = function(scope) {
          // 初期化
          var _this = this;
          scope.factoryCodeList=[];
          scope.factoryCode=[];
          scope.forwarder=[];
          scope.forwarderList=[];
          scope.factoryCodeListdropdownItems=[];
          scope.factoryCodeListallDropdownItems=[];
          _this.getFactoryList(scope,function () {
            _this.getReportList(scope);
          });
          _this.getForwarderList(scope);
          scope.factorySetting = {
            smartButtonMaxItems: 5,
            template: '{{option.label}}',
            smartButtonTextConverter: function(itemText, originalItem) {
              return itemText;
            }
          };
          scope.factoryButtonTrans = {
            buttonDefaultText:$translate.instant('vendorKpi.ALL_COUNTRY'),
            checkAll: $translate.instant('index.SELECT_ALL'),
            uncheckAll: $translate.instant('index.NOT_SELECT_ALL')
          };
          scope.forwarderButtonTrans = {
            buttonDefaultText:$translate.instant('vendorKpi.ALL_FORWARDER'),
            checkAll: $translate.instant('index.SELECT_ALL'),
            uncheckAll: $translate.instant('index.NOT_SELECT_ALL')
          };
          scope.page_summary = {
            curPage: 1,
            pageSize: 10,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.page = {
            curPage: 1,
            pageSize: 10,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.inputStartTime="";
          scope.inputEndTime="";
          var columnHeaderTemplate = document.getElementById('columnHeaderTemplate').innerText;
          scope.gridOptions_summary = {
            data: 'summaryItems',
            paginationPageSizes: [10, 20, 30, 40, 50],
            paginationPageSize: 10,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            showLoading:true,
            enableRowHeaderSelection: true,
            enableColumnMenus: true,
            enableGridMenu: true,
            rowTemplate: "<div ng-click='grid.appScope.selectThisOne_m(row, $event)' ng-repeat='col in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ui-grid-cell ></div>",
            enableSorting: false,
            enableHorizontalScrollbar: 1,
            enablePaginationControls: true,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 1,
            headerTemplate: columnHeaderTemplate,
            totalItems: scope.page_summary.totalNum,
            useExternalPagination: true,
            expandableRowHeight: 150,
            expandableRowScope: {
              subGridVariable: 'subGridScopeVariable'
            },
            category: [{
              name: 'noGroup',
              displayName:'noGroup',
              visible: true,
              showCatName: true,
              hide: true
            },
              {
                name: 'meetRequirment',
                displayName:$translate.instant("vendorKpi.MEET_REQUIRMENT"),
                visible: true,
                showCatName: true
              },
              {
                name: 'performanceScore',
                displayName:$translate.instant("vendorKpi.PERFORMANCE_SCORE"),
                visible: true,
                showCatName: true
              }
            ],
            columnDefs: [
              {
                name: 'factoryCode',
                displayName: $translate.instant("vendorKpi.FACTORY_CODE"),
                field: 'factoryCode',
                category: 'noGroup',
                width:"150",
                enableCellEdit: false
              },
              {
                name: 'loadPort',
                displayName: $translate.instant("vendorKpi.LOCAL_PORT"),
                field: 'loadPort',
                category: 'noGroup',
                width:"150",
                enableCellEdit: false
              },
              {
                name: 'totalPONumber',
                displayName: $translate.instant("vendorKpi.TOTAL_NUMBER_OF_SHIPPEDPOS"),
                field: 'totalPONumber',
                width:"270",
                category: 'noGroup',
                enableCellEdit: false
              },
              {
                name: 'totalShippingOrder',
                displayName: $translate.instant("vendorKpi.TOTAL_NUMBER_OF_SHIPMENT_FOR_BOOKING"),
                field: 'totalShippingOrder',
                category: 'noGroup',
                width:"270",
                enableCellEdit: false
              },
              {
                name: 'bookingNumber',
                category: 'meetRequirment',
                categoryDisplayName:$translate.instant("vendorKpi.MEET_REQUIRMENT"),
                displayName: $translate.instant("vendorKpi.BOOK_ONS_0LEVEL"),
                field: 'bookingNumber',
                minWidth: 180,
                enableCellEdit: false
              },
              {
                name: 'docDispatchNumber',
                category: 'meetRequirment',
                categoryDisplayName:$translate.instant("vendorKpi.MEET_REQUIRMENT"),
                displayName: $translate.instant("vendorKpi.DOCDISPATCH"),
                field: 'docDispatchNumber',
                minWidth: 180,
                enableCellEdit: false
              },
              {
                name: 'cargoDeliveryNumber',
                category: 'meetRequirment',
                categoryDisplayName:$translate.instant("vendorKpi.MEET_REQUIRMENT"),
                displayName: $translate.instant("vendorKpi.CARGO_DELIVERY"),
                field: 'cargoDeliveryNumber',
                minWidth: 230,
                enableCellEdit: false
              },
              {
                name: 'bookingScore',
                category: 'performanceScore',
                categoryDisplayName:$translate.instant("vendorKpi.PERFORMANCE_SCORE"),
                displayName: $translate.instant("vendorKpi.BOOK_ONS_0LEVEL"),
                field: 'bookingScore',
                cellFilter:'percent',
                minWidth: 180,
                enableCellEdit: false
              },
              {
                name: 'docDispatchScore',
                category: 'performanceScore',
                categoryDisplayName:$translate.instant("vendorKpi.PERFORMANCE_SCORE"),
                displayName: $translate.instant("vendorKpi.DOCDISPATCH"),
                field: 'docDispatchScore',
                cellFilter:'percent',
                minWidth: 180,
                enableCellEdit: false
              },
              {
                name: 'cargoDeliveryScore',
                category: 'performanceScore',
                categoryDisplayName:$translate.instant("vendorKpi.PERFORMANCE_SCORE"),
                displayName: $translate.instant("vendorKpi.CARGO_DELIVERY"),
                field: 'cargoDeliveryScore',
                cellFilter:'percent',
                minWidth: 230,
                enableCellEdit: false
              }
            ],
            onRegisterApi: function(gridApi) {
              scope.gridApi_summary = gridApi;
              scope.gridApi_summary.core.on.sortChanged(scope, function(grid, sortColumns) {
                if(sortColumns.length !== 0) {
                  if(sortColumns[0].sort.direction === 'asc') {
                    scope.page_summary.sortDirection = true;
                  }
                  if(sortColumns[0].sort.direction === 'desc') {
                    scope.page_summary.sortDirection = false;
                  }
                  scope.page_summary.sortColumn = sortColumns[0].displayName;
                }
              });
              scope.gridApi_summary.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                scope.page_summary.curPage = newPage;
                scope.page_summary.pageSize = pageSize;
                _this.getSummaryList(scope);
              });
            }
          };

          scope.page_detail = {
            curPage: 1,
            pageSize: 100,
            sortColumn: 'id',
            sortDirection: true,
            totalNum: 0
          };
          scope.gridOptions_detail = {
            data: 'detailItems',
            paginationPageSizes: [100, 200, 300, 400, 500],
            paginationPageSize: 100,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            showLoading:true,
            enableRowHeaderSelection: true,
            rowTemplate: "<div ng-click='grid.appScope.selectThisOne_d(row, $event)'ng-repeat='col in colContainer.renderedColumns track by col.colDef.name' class='ui-grid-cell' ui-grid-cell ></div>",
            enableColumnMenus: true,
            enableGridMenu: true,
            enableSorting: false,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 1,
            // headerTemplate: columnHeaderTemplate,
            totalItems: scope.page_detail.totalNum,
            useExternalPagination: true,
            columnDefs: [
              {
                name: 'poNumber',
                displayName: $translate.instant("vendorKpi.PONUMBER"),
                field: 'poNumber',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'gtnBookingNo',
                displayName: $translate.instant("vendorKpi.GTN_BOOKING_NO"),
                field: 'gtnBookingNo',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'soNumber',
                displayName: $translate.instant("vendorKpi.SONUMBER"),
                field: 'soNumber',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'bowkerInvoiceNo',
                displayName: $translate.instant("vendorKpi.BOWKER_INVOICE_NO"),
                field: 'bowkerInvoiceNo',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'factoryCode',
                displayName: $translate.instant("vendorKpi.FACTORY_CODE"),
                field: 'factoryCode',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'shipper',
                displayName: $translate.instant("vendorKpi.SHIPPER"),
                field: 'shipper',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'forwarder',
                displayName: $translate.instant("vendorKpi.FORWARDER"),
                field: 'forwarder',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'shipMode',
                displayName: $translate.instant("vendorKpi.SHIPMODE"),
                field: 'shipMode',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'bookedOriginService',
                displayName: $translate.instant("vendorKpi.BOOKED_ORIGIN_SERVICE"),
                field: 'bookedOriginService',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'loadPort',
                displayName: $translate.instant("vendorKpi.LOCAL_PORT"),
                field: 'loadPort',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'customerNumber',
                displayName: $translate.instant("vendorKpi.CUST_NO"),
                field: 'customerNumber',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'destinationCountry',
                displayName: $translate.instant("vendorKpi.ORDER_COUNTRY"),
                field: 'destinationCountry',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'bookingIssueDate',
                displayName: $translate.instant("vendorKpi.BOOKING_ISSUE_DATE"),
                field: 'bookingIssueDate',
                width:"180",
                cellFilter:'timeConvert:\'yyyy-MM-dd\'',
                enableCellEdit: false
              },
              {
                name: 'bookingIntendedDeliveryDate',
                displayName: $translate.instant("vendorKpi.BOOKING_INTENDED_DELIVERY_DATE"),
                field: 'bookingIntendedDeliveryDate',
                cellFilter:'timeConvert:\'yyyy-MM-dd\'',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'actualReceiptDate',
                displayName:$translate.instant("vendorKpi.ACTUAL_RECEIPT_DATE"),
                field: 'actualReceiptDate',
                cellFilter:'timeConvert:\'yyyy-MM-dd\'',
                width:"180",
                enableCellEdit: false
              },
              // {
              //   name: 'pl3WarehouseDate',
              //   displayName: $translate.instant("vendorKpi.CARGO_DEL_TO_3PL_WH_DATE"),
              //   field: 'pl3WarehouseDate',
              //   cellFilter:'timeConvert:\'yyyy-MM-dd\'',
              //   width:"180",
              //   enableCellEdit: false
              // },

              {
                name: 'etdDate',
                displayName: $translate.instant("vendorKpi.ETD_DATE"),
                field: 'etdDate',
                cellFilter:'timeConvert:\'yyyy-MM-dd\'',
                width:"180",
                enableCellEdit: false
              },

              {
                name: 'origin',
                displayName: $translate.instant("vendorKpi.ORIGINS"),
                field: 'origin',
                width:"180",
                enableCellEdit: false
              },
//            {
//              name: 'trade',
//              displayName: $translate.instant("vendorKpi.TRADE"),
//              field: 'trade',
//              width:"180",
//              enableCellEdit: false
//            },
              {
                name: 'baseDate',
                displayName: $translate.instant("vendorKpi.BASE_DATE"),
                field: 'baseDate',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'adidasShmDocTimeline',
                displayName: $translate.instant("vendorKpi.ADIDAS_SHIPPING_MANAUL_DOC_SUBTIMELINE"),
                field: 'adidasShmDocTimeline',
                width:"270",
                enableCellEdit: false
              },
              {
                name: 'docCheckListPL3',
                displayName: $translate.instant("vendorKpi.ACTUALLT_DOC_SUB_DATE_AS_DOC_CHECK_LIST_SIG_BY_3PL"),
                field: 'docCheckListPL3',
                cellFilter:'timeConvert:\'yyyy-MM-dd\'',
                width:"270",
                enableCellEdit: false
              },
              {
                name: 'holidayRemark',
                displayName: $translate.instant("vendorKpi.HOLIDAY_REMARK"),
                field: 'holidayRemark',
                width:"270",
                enableCellEdit: false
              },
              {
                name: 'bPG',
                displayName: $translate.instant("vendorKpi.BOOKING_PERFORMANCE_GROSS"),
                field: 'bPG',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'delPG',
                displayName: $translate.instant("vendorKpi.DELIVERY_PERFORMANCE_GROSS"),
                field: 'delPG',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'docPG',
                displayName: $translate.instant("vendorKpi.DOCUMENT_PERFORMACE_GROSS"),
                field: 'docPG',
                width:"180",
                enableCellEdit: false
              },
              {
                name: 'shippingOrderStatus',
                displayName: $translate.instant("vendorKpi.SHIPPING_ORDER_STATUS"),
                field: 'shippingOrderStatus',
                width:"270",
                enableCellEdit: false
              }
            ],
            onRegisterApi: function(gridApi) {
              scope.gridApi_detail = gridApi;
              scope.gridApi_detail.core.on.sortChanged(scope, function(grid, sortColumns) {
                if(sortColumns.length !== 0) {
                  if(sortColumns[0].sort.direction === 'asc') {
                    scope.page_detail.sortDirection = true;
                  }
                  if(sortColumns[0].sort.direction === 'desc') {
                    scope.page_detail.sortDirection = false;
                  }
                  scope.page_detail.sortColumn = sortColumns[0].displayName;
                }
              });
              scope.gridApi_detail.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                scope.page_detail.curPage = newPage;
                scope.page_detail.pageSize = pageSize;
                _this.getDetailList(scope);
              });
            }
          };


        };
      }
    ])
    .filter('columnHeaderFilter', function() {
      return function(value) {
        if(value == 'noGroup') {
          return '1'
        }
        return value;
      }
    })
    .filter('percent', function() {
      return function(value) {
        return value+"%";
      }
    })
    .controller('reportSummaryCtrl', ['$scope', 'reportSummaryService',
      function($scope, reportSummaryService) {
        $scope.getReportList = function() {
          reportSummaryService.getReportList($scope);
        }
        $scope.exportFile = function(type) {
          reportSummaryService.exportFile($scope,type);
        }
        $scope.controlTime = function(type,t) {
          reportSummaryService.controlTime($scope,type,t);
        }
        $scope.selectThisOne_m = function(row, event){
          event.preventDefault();
          event.stopPropagation();
          reportSummaryService.selectThisOne_m($scope, row);
        }
        $scope.selectThisOne_d = function(row, event){
          event.preventDefault();
          event.stopPropagation();
          reportSummaryService.selectThisOne_d($scope, row);
        }
        $scope.downLoadINV = function() {
          reportSummaryService.downLoadINV($scope);
        }
        $scope.importFile = function(type) {
          reportSummaryService.importFile($scope,type);
        }
        reportSummaryService.init($scope);
      }
    ])
})();
