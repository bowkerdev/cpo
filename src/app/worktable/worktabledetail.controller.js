(function () {
  'use strict';
  angular
    .module('cpo')
    .service('workTableDetailService', ['$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants',
      function ($http, $translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants) {

        /**
         * searchPlanList
         */
        this.getVersionList = function (scope) {
          var _this = this;
          GLOBAL_Http($http, "cpo/api/criteria/query_criteria_version?", 'GET', {}, function (data) {


            if (data.status == 0) {
              if (data.output) {
                scope.versionList = data.output.criteriaVersions;
                for (var i = 0; i < scope.versionList.length; i++) {
                  scope.versionList[i].label = scope.versionList[i].versionName;
                  scope.versionList[i].id = scope.versionList[i].criteriaVersionId;
                }
                scope.version = scope.versionList[0];
              } else {
                scope.versionList = [];
              }
            } else {
              var message = data.message;
              if (message) {
                modalAlert(CommonService, 3, message, null);
              }
            }
          }, function (data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }


        this.initGripOption = function (scope) {
          var workTableDetailCategory = angular.element('#workTableDetailCategory')[0].innerText;

          scope.gridOptions = {
            data: 'detail',
            enableColumnMenus: true,
            enableGridMenu: true,
            paginationPageSize: 30,
            rowEditWaitInterval: -1,
            enableRowSelection: false,
            enableRowHeaderSelection: true,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            totalItems: scope.page.totalNum,
            showColumnFooter: true,
            enablePagination: false,
            useExternalPagination: false,
            columnFooterHeight: 81,
            enablePaginationControls: false,
            columnDefs: [],
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
              });
            }
          };
        };


        this.getFactoryList = function (scope) {
          var _this = this;
          var param = {
            pageNo: 1,
            pageSize: 1000
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

                scope.siteList.push(siteData);
                for (var j = 0; j < scope.detail.length; j++) {
                  var factoryId = scope.items[i].factoryId;
                  if (scope.detail[j][factoryId] == 0 || scope.detail[j][factoryId]) {
                    scope.detail[j][scope.items[i].factSimpName] = scope.detail[j][factoryId].toFixed(2);
                  } else {
                    scope.detail[j][scope.items[i].factSimpName] = '0.00';
                  }
                }
                var factoryId = scope.items[i].factoryId;
                scope.score[scope.items[i].factSimpName.replace('-', '_')] = scope.total[factoryId] ? scope.total[factoryId].toFixed(2) : "0.00";
                scope.subTotal[scope.items[i].factSimpName.replace('-', '_')] = scope.subTotal[factoryId] ? scope.subTotal[factoryId].toFixed(2) : "0.00";
                scope.coefficent[scope.items[i].factSimpName.replace('-', '_')] = scope.coefficent[factoryId] ? scope.coefficent[factoryId].toFixed(2) : "0.00";
              }

              //							scope.score["BYS"]=scope.score["BYS"].toFixed(2);
              //							scope.score["BVG"]=scope.score["BVG"].toFixed(2);
              //							scope.score["BVN"]=scope.score["BVN"].toFixed(2);
              //							scope.score["BCA"]=scope.score["BCA"].toFixed(2);


              var workTableDetailCategory = angular.element('#workTableDetailCategory')[0].innerText;
              var footerTemplate = angular.element('#workTableDetailCategory')[0].innerText;
              scope.gridOptions.columnDefs = [{
                name: 'mandatory',
                displayName: $translate.instant('worktabledetail.MANDATORY'),
                field: 'mandatory',
                enableCellEdit: false,
                cellTemplate: workTableDetailCategory
              }, {
                name: 'category',
                displayName: $translate.instant('worktabledetail.CATEGORY'),
                field: 'CategoryName',
                enableCellEdit: false,
                cellTemplate: workTableDetailCategory
              },
              {
                name: 'attributes',
                displayName: $translate.instant('worktabledetail.ATTRIBUTES'),
                field: 'Attribute',
                enableCellEdit: false,
                footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: #ebebeb;color: Black">Sub Total</div>'
                  +
                  '<div class="ui-grid-cell-contents" style="background-color: #ebebeb;color: Black">Coefficent</div>'
                  +
                  '<div class="ui-grid-cell-contents" style="background-color: #ebebeb;color: Black">Final Score</div>'
                ,
                cellTemplate: workTableDetailCategory
              }];

              var IsSampleOrder = scope.$parent.$parent.$parent.showView == "SampleOrder";
              var targetType;
              if (IsSampleOrder) {
                targetType = "1";
              } else {
                targetType = "0";
              }
              for (var i = 0; i < scope.items.length; i++) {
                if (scope.items[i].factoryType == targetType) {

                  var column = {
                    name: scope.items[i].factSimpName,
                    displayName: scope.items[i].factSimpName,
                    enableCellEdit: false,
                    field: scope.items[i].factoryId + "",
                    cellTemplate: angular.element('#workTableN')[0].innerText,
                    footerCellTemplate: '<div class="ui-grid-cell-contents ng-scope" style="background-color: #ebebeb;color: Black;height: 27px" ' +
                      'ng-bind="grid.appScope.subTotal[' + scope.items[i].factoryId + ']|number:2"' +
                      '></div>' +
                      '<div class="ui-grid-cell-contents" style="background-color: #ebebeb;color: Black;height: 27px" ' +
                      'ng-bind="grid.appScope.coefficent[' + scope.items[i].factoryId + ']|number:2"' +
                      '></div>' +
                      '<div class="ui-grid-cell-contents" style="background-color: #ebebeb;color: Black;height: 27px" ' +
                      'ng-bind="grid.appScope.total[' + scope.items[i].factoryId + ']|number:2"' +
                      '></div>'

                  }

                  scope.gridOptions.columnDefs.push(column);
                }

              }


              _this.getAssignFactoryResult(scope);
            } else {
              modalAlert(CommonService, 2, data.message, null);
            }
            //
          }, function (data) {
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

        this.getAssignFactoryResult = function (scope) {
          var param = {
            id: scope.ResultDetail.id
          };
          var _this = this;
          GLOBAL_Http($http, "cpo/api/worktable/get_assignment_result_detail?", 'GET', param, function (data) {


            if (data.output) {
              scope.details = angular.fromJson(data.output.factoryScoreDetial);
              scope.assignDetail = data.output;
              if (JSON.stringify(scope.details)) {
                scope.assignDetail.mandatory = JSON.stringify(scope.details).indexOf('Special Process') >= 0 ? "Special Process" : "N/A";
              } else {
                scope.assignDetail.mandatory = "N/A";
              }

              scope.assignDetail.workingNo = scope.assignDetail.workingNo ? scope.assignDetail.workingNo : "N/A";
              scope.assignDetail.leftOver = scope.assignDetail.leftOver ? scope.assignDetail.leftOver : "N/A";
              scope.assignDetail.Optional = 'Optional';
              scope.assignDetail.productType = scope.assignDetail.productType ? scope.assignDetail.productType : 'N/A';
              scope.assignDetail.customerNo = scope.assignDetail.customerNo ? scope.assignDetail.customerNo + "(" + scope.assignDetail.orderCountry + ")" : 'N/A';
              scope.assignDetail.po = scope.assignDetail.po ? scope.assignDetail.po : "N/A";
              scope.assignDetail.bBatch = scope.assignDetail.bBatch ? scope.assignDetail.bBatch : "N/A";
              scope.assignDetail.unit = scope.assignDetail.unit ? scope.assignDetail.unit : "N/A";
              scope.assignDetail.aSource = scope.assignDetail.aSource ? scope.assignDetail.aSource : "N/A";
              scope.assignDetail.assignedFactory = scope.assignDetail.assignedFactory ? scope.assignDetail.assignedFactory : "N/A";

              scope.assignDetail.productTypeAx = scope.assignDetail.productTypeAx ? scope.assignDetail.productTypeAx : "N/A";
              scope.assignDetail.fabricType = scope.assignDetail.fabricType ? scope.assignDetail.fabricType : "N/A";
              scope.assignDetail.orderCountry = scope.assignDetail.orderCountry ? scope.assignDetail.orderCountry : "N/A";
              scope.assignDetail.suggFactory = scope.assignDetail.suggFactory ? scope.assignDetail.suggFactory : "N/A";

              scope.assignDetail.supplyChainTrack = scope.assignDetail.supplyChainTrack ? scope.assignDetail.supplyChainTrack : (scope.assignDetail.classCode ? scope.assignDetail.classCode : "N/A");

              scope.assignDetail.euRate = scope.assignDetail.euRate ? (scope.assignDetail.euRate + '%') : "N/A";
              scope.assignDetail.euQuantity = scope.assignDetail.euQuantity ? scope.assignDetail.euQuantity : "N/A";
              scope.assignDetail.chinaRate = scope.assignDetail.chinaRate ? (scope.assignDetail.chinaRate + '%') : "N/A";
              scope.assignDetail.chinaQuantity = scope.assignDetail.chinaQuantity ? scope.assignDetail.chinaQuantity : "N/A";
              scope.assignDetail.orderType = scope.assignDetail.orderType ? scope.assignDetail.orderType : "N/A";
              scope.assignDetail.confirmFactory = scope.assignDetail.confirmFactory ? scope.assignDetail.confirmFactory : "N/A";
              scope.assignDetail.leftoverFactory = scope.assignDetail.leftoverFactory ? scope.assignDetail.leftoverFactory : "N/A";

              scope.detail = [];
              if (scope.details) {
                for (var i = 0; i < scope.details.length; i++) {
                  if (scope.details[i].TOTAL) {
                    scope.total = scope.details[i];

                  } else if (scope.details[i].subTotal) {
                    scope.subTotal = scope.details[i];
                  } else if (scope.details[i].coefficent) {
                    scope.coefficent = scope.details[i];
                  } else {

                    scope.detail.push(scope.details[i]);
                  }
                  if (!scope.details[i].mandatory) {
                    scope.details[i].mandatory = "N/A";
                  }
                }


                if (scope.assignDetail.documentType == "1"
                  && scope.assignDetail.lastProdFactory != scope.assignDetail.suggFactory
                  && scope.detail.length == 0) {
                  scope.assignDetail.criteria_Details = $translate.instant('worktable.No_match_criteria');
                } else if (scope.assignDetail.documentType == "2"
                  && scope.assignDetail.lastProdFactory == scope.assignDetail.suggFactory
                  && scope.detail.length == 0) {
                  scope.assignDetail.criteria_Details = $translate.instant('worktable.No_match_criteria');
                } else if (scope.assignDetail.documentType != "1"
                  && scope.assignDetail.documentType != "2"
                  && scope.assignDetail.note == "Follow up SLT Working No assignment result.") {
                  scope.assignDetail.criteria_Details = $translate.instant('worktable.No_match_criteria');
                } else if (scope.detail.length == 0) {
                  scope.assignDetail.criteria_Details = $translate.instant('worktable.No_match_criteria');
                } else {
                  scope.assignDetail.criteria_Details = $translate.instant('worktable.As_below_criteria_table');
                }
                if (scope.assignDetail.assignSource == "2") {
                  scope.assignDetail.note = scope.assignDetail.euRemark;
                } else {
                  if (scope.ResultDetail.assignmentRemark) {
                    scope.assignDetail.note = scope.ResultDetail.assignmentRemark + "; " + scope.assignDetail.note;
                  }
                }
              } else {
                scope.assignDetail.criteria_Details = $translate.instant('worktable.No_match_criteria');
              }
              scope.site = scope.siteList[0];
              var isComfirm = false;
              for (var i = 0; i < scope.siteList.length; i++) {
                if (scope.siteList[i].label == scope.assignDetail.confirmFactory) {
                  isComfirm = true;
                  scope.site = scope.siteList[i];
                  break;
                }
              }
              if (!isComfirm) {
                for (var i = 0; i < scope.siteList.length; i++) {
                  if (scope.assignDetail.suggFactory && scope.siteList[i].label == scope.assignDetail.suggFactory.split(",")[0]) {
                    scope.site = scope.siteList[i];
                    break;
                  }
                }
              }

            } else {
              modalAlert(CommonService, 3, data.message, null);
            }
          }, function (data) {
            scope.$emit('detailPage.close', null);
            modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
        }

        this.confirmAssign = function (scope) {
          var modalInstance =
            $uibModal.open({
              animation: true,
              ariaLabelledBy: "modal-header",
              templateUrl: 'app/factorymaster/transferReason.html',
              controller: 'transferReasonCtrrl'

            });
          modalInstance.resolve = function (result) {
            var param = {
              "assignResultId": scope.assignDetail.assignResultId,
              "workingNo": scope.assignDetail.workingNo,
              "assignResultStatus": scope.assignDetail.assignResultStatus,
              "confirmFactory": scope.site.label,
              "transferReason": result.reason,
              "transferRemark": result.remark
            };
            if (scope.ResultDetail.sltWorkingNoId) {
              param['sltWorkingNoId'] = scope.ResultDetail.sltWorkingNoId;
            }

            var _this = this;
            GLOBAL_Http($http, "cpo/api/worktable/confirm_assign?", 'POST', param, function (data) {
              if (data.status == 0) {
                modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
                scope.$emit('detailPage.close', null);
                scope.$emit('detailPage.refreshGrid', null);
              } else {
                modalAlert(CommonService, 3, data.message, null);
              }
            }, function (data) {
              modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
            });
          }

        }

        /**
         * init
         */
        this.init = function (scope) {
          // 初期化
          var _this = this;
          scope.detail = [];
          scope.criteriaVersion = {};
          scope.score = {
            'BYS': 0,
            'BVG': 0,
            'BVN': 0,
            'BCA': 0
          }
          scope.total = {};
          scope.subTotal = {};
          scope.coefficent = {};
          scope.assignDetail = {}

          this.initGripOption(scope);
          //					var height = (14 * 30) + 36;
          //					$("#workingTableDetailGrid").css('height', height + 'px');
          //					this.getVersionList(scope);
          scope.$on('workTableDetail.afterInit', function (event, data) {

            scope.ResultDetail = data;
            _this.getFactoryList(scope);
            //	_this.getSelectedData(scope);
          });
          scope.$emit("workTableDetail.init", null);
        };
      }
    ])
    .controller('workTableDetailCtrl', ['$scope', 'workTableDetailService',
      function ($scope, workTableDetailService) {
        $scope.selectTab = function (Tab) {
          workTableDetailService.selectTab($scope, Tab);
        }
        $scope.sumScore = function () {
          workTableDetailService.sumScore($scope);
        }
        $scope.confirmAssign = function () {
          workTableDetailService.confirmAssign($scope);
        }
        $scope.closePage = function () {
          $scope.$emit('detailPage.close', null);
        }
        workTableDetailService.init($scope);
      }
    ])
})();
