(function () {
	'use strict';
	angular
		.module('cpo')
		.service('criteriaService', ['$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants', 'uiGridGroupingConstants',
			function ($http, $translate, CommonService, $uibModal, uiGridConstants, uiGridGroupingConstants) {
				this.scrolltoTop = function (scope) {
					jQuery('html,body').animate({
						scrollTop: 0
					}, 300);
				};
				var savenum = 0;
        this.importFactoryTuning = function (scope) {
          var _this = this;

          var modalInstance = $uibModal.open({
            templateUrl: 'uploadFileModal',
            controller: 'UploadFileController',
            backdrop: 'static',
            size: 'md',
            resolve: {
              planGroups: function () {
                return {
                  fileType: '301',
                  showSeasonSelect: 1,
                  custom:{
                    "isAdjust":"N"
                  }

                };
              }
            }
          });
          modalInstance.result.then(function (returnData) {
            if (returnData) {
              _this.getAdjustmentCriteria(scope);
              _this.getAdjustmentDocInfo(scope);
            }
          }, function () {
          });
        };

				this.initGridOptions = function (scope) {
					var factoryCriteriaTemplate = document.getElementById("factoryCriteriaTemplate").innerText;
					scope.gridOptions = {
						data: 'factoryCriterias',
						enableColumnMenus: true,
						enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						useExternalPagination: false,
						enableSorting: false,
						enablePagination: false,
						enablePaginationControls: false,
						enableFiltering: false,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [{
							name: 'criteriaName',
							displayName: $translate.instant('criteria.CRITERIA_NAME'),
							field: 'criteriaName',
							minWidth: '120',
							enableCellEdit: false,
							cellTemplate: factoryCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						},
						{
							name: 'condition',
							displayName: $translate.instant('criteria.CONDITION'),
							field: 'condition',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: factoryCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						},
						{
							name: 'applicationSite',
							displayName: $translate.instant('criteria.APPLICATION_SITE'),
							field: 'factSimpName',
							minWidth: '130',
							enableCellEdit: false,
							cellTemplate: factoryCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						},
						{
							name: 'criteriaCategory',
							displayName: $translate.instant('criteria.CRITERIA_CATEGORY'),
							field: 'criteriaTypeName',
							minWidth: '150',
							enableCellEdit: false,
							cellTemplate: factoryCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						},
						{
							name: 'order_type',
							displayName: $translate.instant('factoryCriteria.APPLICATION_ORDER_TYPE'),
							field: 'orderType',
							minWidth: '170',
							enableCellEdit: false,
							cellTemplate: factoryCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						},
						{
							name: 'mandatory',
							displayName: $translate.instant('factoryCriteria.MANDATORY'),
							field: 'mandatory',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: factoryCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						},
						{
							name: 'score',
							displayName: $translate.instant('criteria.VALUE'),
							field: 'criteriaValue',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: factoryCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						},
						{
							name: 'startTime',
							displayName: $translate.instant('criteria.START_TIME'),
							field: 'startDate',
							minWidth: '90',
							enableCellEdit: false,
							cellTemplate: factoryCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						},
						{
							name: 'endTime',
							displayName: $translate.instant('criteria.END_TIME'),
							field: 'endDate',
							minWidth: '90',
							enableCellEdit: false,
							cellTemplate: factoryCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						},
						{
							name: 'status',
							displayName: $translate.instant('criteria.STATUS'),
							field: 'criteriaStatus',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: scope.yesNoTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}
						],
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
				}

				this.initGridOptions1 = function (scope) {
					var processCriteriaTemplate = document.getElementById("processCriteriaTemplate").innerText;
					scope.gridOptions1 = {
						data: 'processCriterias',
						enableColumnMenus: true,
						enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableHorizontalScrollbar: 0,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 0,
						useExternalPagination: false,
						enableSorting: false,
						enablePagination: false,
						enablePaginationControls: false,
						enableFiltering: false,
						//						paginationTemplate: "<div>a</div>",
						// useExternalPagination: true,
						// useExternalSorting: true,
						columnDefs: [{
							name: 'category',
							displayName: $translate.instant('criteria.CATEGORY'),
							field: 'category',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: processCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}, {
							name: 'criteriaName',
							displayName: $translate.instant('criteria.CRITERIA_NAME'),
							field: 'processName',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: processCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}, {
							name: 'availableFactory',
							displayName: $translate.instant('criteria.AVAILABLE_FACTORY'),
							field: 'factSimpName',
							minWidth: '130',
							enableCellEdit: false,
							cellTemplate: processCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}, {
							name: 'startTime',
							displayName: $translate.instant('criteria.START_TIME'),
							field: 'startDate',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: processCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}, {
							name: 'endTime',
							displayName: $translate.instant('criteria.END_TIME'),
							field: 'endDate',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: processCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}, {
							name: 'mandatory',
							displayName: $translate.instant('criteria.MANDATORY'),
							field: 'mandatory',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: processCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}, {
							name: 'score',
							displayName: $translate.instant('criteria.SCORE'),
							field: 'processScore',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: processCriteriaTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}, {
							name: 'status',
							displayName: $translate.instant('criteria.STATUS'),
							field: 'status',
							minWidth: '100',
							enableCellEdit: false,
							cellTemplate: scope.yesNoTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}],
						onRegisterApi: function (gridApi) {
							scope.gridApi1 = gridApi;
							scope.gridApi1.core.on.sortChanged(scope, function (grid, sortColumns) {
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
							scope.gridApi1.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
							});
						}
					};
				}
				this.initGridOptions2 = function (scope) {
					scope.gridOptions2 = {
						data: 'adjustmentCriteria',
            paginationPageSize : 50 ,
            paginationPageSizes : [ 50 ] ,
            enablePagination : true ,
            enablePaginationControls: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 1,
						useExternalPagination: false,
						enableSorting: false,


						enableFiltering: false,
						columnDefs: [{
							name : 'season' ,
							displayName : $translate.instant('documentlibrary.SEASON') ,
							field : 'season' ,
							minWidth : '120' ,
							enableCellEdit : false
						}, {
							name: 'workingNo',
							displayName: $translate.instant('workingNo.WORKING_NO'),
							field: 'workingNo',
							minWidth: '120',
							enableCellEdit: false
						}, {
							name : 'factory' ,
							displayName : $translate.instant('worktableMKTTitle.FINAL_CONFIRMATION') ,
							field : 'factory' ,
							minWidth : '120' ,
							enableCellEdit : false
						},{
							name : 'supplyChainTrack' ,
							displayName : $translate.instant('customerforecast.SUPPLY_CHAIN_TRACK') ,
							field : 'supplyChainTrack' ,
							minWidth : '120' ,
							enableCellEdit : false
						},{
							name : 'orderCountry' ,
							displayName : $translate.instant('worktable.ORDER_COUNTRY_EU') ,
							field : 'orderCountry' ,
							minWidth : '120' ,
							enableCellEdit : false
						},{
							name : 'article' ,
							displayName : $translate.instant('customerforecast.ARTICLE') ,
							field : 'article' ,
							minWidth : '120' ,
							enableCellEdit : false
						},{
							name : 'pvMonth' ,
							displayName : $translate.instant('criteria.FROM_PV_MONTH') ,
							field : 'pvMonth' ,
							minWidth : '120' ,
							enableCellEdit : false
						},{
							name : 'toPvMonth' ,
							displayName : $translate.instant('criteria.TO_PV_MONTH') ,
							field : 'toPvMonth' ,
							minWidth : '120' ,
							enableCellEdit : false
						},{
							name : 'updateBy' ,
							displayName : $translate.instant('processmaster.UPLOAD_BY') ,
							field : 'updateBy' ,
							minWidth : '120' ,
							enableCellEdit : false
						},{
							name : 'utcUpdate' ,
							displayName : $translate.instant('processmaster.UPLOAD_TIME') ,
							field : 'utcUpdate' ,
							minWidth : '120' ,
							enableCellEdit : false
						},{
              name : 'customerNo' ,
              displayName : "Customer No" ,
              field : 'customerNo' ,
              minWidth : '120' ,
              enableCellEdit : false
            },{
              name : 'countryCode' ,
              displayName : "Country Code" ,
              field : 'countryCode' ,
              minWidth : '120' ,
              enableCellEdit : false
            }],
						onRegisterApi: function (gridApi) {
							scope.gridApi3 = gridApi;
							scope.gridApi3.core.on.sortChanged(scope, function (grid, sortColumns) {
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
							scope.gridApi3.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
							});
						}
					};
				}
				this.getSelectList = function(scope) {
					var param = {
						in_code: 'WORKINGNO'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
						if(data.WORKINGNO)scope.workingList = data.WORKINGNO
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				this.getSeason = function (scope) {
					var param = {
					}
					GLOBAL_Http($http, "cpo/api/worktable/query_season?", 'GET', param, function(data) {
						scope.seasonList = data.output
						// scope.SourcingTypeList = data.SourcingType
						// for(var i = 0;i < scope.SourcingTypeList.length;i++){
						// 	scope.SourcingTypeList[i].value = scope.SourcingTypeList[i].label
						// 	if(scope.SourcingTypeList[i].label === scope.model.sourcingType){
						// 		scope.model.sourcingType = scope.SourcingTypeList[i]
						// 	}
						// }
						// scope.TransfeReasonList = data.TransfeReason
						// for(var j = 0;j < scope.TransfeReasonList.length;j++){
						// 	scope.TransfeReasonList[j].value = scope.TransfeReasonList[j].label
						// 	if(scope.TransfeReasonList[j].label === scope.model.transferReason){
						// 		scope.model.transferReason = scope.TransfeReasonList[j]
						// 	}
						// }
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
        this.deleteAll=function (scope) {
				  var _this=this;
				  if(scope.adjustmentCriteria.length==0){
            modalAlert(CommonService, 2, $translate.instant('index.NO_DATA_TO_DELETE'), null);
            return;
          }
          modalAlert(CommonService, 0, $translate.instant('notifyMsg.CONFIRM_MSG_DELETE'), function () {
              GLOBAL_Http($http, "cpo/api/criteria/delete_customer_forecast_tuning", 'post', {}, function(data) {
                if(data.status==0){
                  modalAlert(CommonService, 2, $translate.instant('notifyMsg.DELETE_SUCCESS'), null);
                  _this.getAdjustmentCriteria(scope);
                }else{
                  modalAlert(CommonService, 2, $translate.instant('notifyMsg.DELETE_FAIL'), null);
                }
              }, function(data) {
              });
          });

        }
				this.doSelectTab = function (scope, Tab) {
					scope.showView = Tab;
					if (Tab == 'factoryCriteria') {
						scope.activeTab = 1;
					} else if (Tab == 'processCriteria') {
						scope.activeTab = 2;
					} else if (Tab == 'adjustmentCriteria') {
						scope.activeTab = 3;
					}
				}

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
								if (savenum == 1) {
									savenum = scope.versionList.length - 1;
								}
								else {
									savenum = 0;
								}
								scope.version = scope.versionList[savenum];
								savenum = 0;
								_this.getFactoryCriteria(scope);
								_this.getProcessCriteria(scope);
								_this.getAdjustmentCriteria(scope);
							} else {
								scope.versionList = [];
							}
							scope.btndisable = false;
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

				this.onVersionChange = function (scope) {
					this.getFactoryCriteria(scope);
					this.getProcessCriteria(scope);
				}

				this.getFactoryCriteria = function (scope) {
					var param = {
						criteriaVersionId: scope.version.id
					}
					if (scope.searchFactoryCriteriaName) {
						param['criteriaName'] = scope.searchFactoryCriteriaName;
					}
					scope.factoryCriterias = [];
					GLOBAL_Http($http, "cpo/api/factory_criteria/query_factory_criteria_info?", 'GET', param, function (data) {

						scope.factoryTotalCount = 0;
						if (data.status == 0) {
							if (data.output) {
								var outputData = data.output.factoryCriteriaExts;
								for (var i = 0; i < outputData.length; i++) {
									var factoryCriteria = outputData[i];
									factoryCriteria.startDate = simpleDateFormat(factoryCriteria.startDate);
									factoryCriteria.endDate = simpleDateFormat(factoryCriteria.endDate);
									factoryCriteria.status = factoryCriteria.criteriaStatus;
									if (factoryCriteria.criteriaType == "2") {
										factoryCriteria.criteriaValue = factoryCriteria.criteriaValue + "%";
									}
									for (var j = 0; j < factoryCriteria.criteriaCondition.length; j++) {
										//										var factoryCrit = angular.copy(factoryCriteria);
										var factoryCrit = factoryCriteria;
										var condi = factoryCriteria.criteriaCondition[j];
										var condiValue;
										if (condi.critCondition > 4) {
											condiValue = condi.critConditionName.format(condi.conditionValue1, condi.conditionValue2);
										} else {
											condiValue = condi.critConditionName.format(condi.conditionValue1);
										}
										if (j == 0) {
											factoryCrit.condition = condiValue;
										} else {
											factoryCrit.condition += "&&" + condiValue;
										}
									}
									factoryCrit.criteriaName = listToString2(factoryCriteria.criteriaCondition, 'criteriaName', '&&');
									scope.factoryCriterias.push(factoryCrit);
								}
								if (outputData.length > 10) {
									var height = (scope.factoryCriterias.length * 30) + 46;
								} else {
									var height = (10 * 30) + 46;
								}
								$("#factoryCriteriaGrid").css('height', height + 'px');
								scope.gridOptions.totalItems = scope.factoryCriterias.length;
								scope.factoryTotalCount = scope.factoryCriterias.length;
							} else {
								scope.factoryCriterias = [];
								scope.gridOptions.totalItems = scope.factoryCriterias.length;

								scope.factoryTotalCount = scope.factoryCriterias.length;
								var height = (10 * 30) + 46;
								$("#factoryCriteriaGrid").css('height', height + 'px');
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

				this.getProcessCriteria = function (scope) {
					var param = {
						criteriaVersionId: scope.version.id
					}
					if (scope.searchProcessCriteriaName) {
						param['criteriaName'] = scope.searchProcessCriteriaName;
					}
					scope.processCriterias = [];
					GLOBAL_Http($http, "cpo/api/process_criteria/query_process_criteria_info?", 'GET', param, function (data) {

						scope.processTotalCount = 0;
						if (data.status == 0) {
							if (data.output) {
								scope.processCriterias = data.output.processCriteriaExts;
								for (var i = 0; i < scope.processCriterias.length; i++) {
									if (scope.processCriterias[i].endDate) {
										scope.processCriterias[i].endDate = simpleDateFormat(scope.processCriterias[i].endDate);
									}
									if (scope.processCriterias[i].startDate) {
										scope.processCriterias[i].startDate = simpleDateFormat(scope.processCriterias[i].startDate);
									}
									scope.processCriterias[i].status = scope.processCriterias[i].criteriaStatus;
								}
								if (scope.processCriterias.length > 10) {
									var height = (scope.processCriterias.length * 30) + 46;
								} else {
									var height = (10 * 30) + 46;
								}
								$("#processCriteriaGrid").css('height', height + 'px');
								scope.gridOptions1.totalItems = scope.processCriterias.length;
								scope.processTotalCount = scope.processCriterias.length;
							} else {
								scope.processCriterias = [];
								var height = (10 * 30) + 46;
								$("#processCriteriaGrid").css('height', height + 'px');
								scope.gridOptions1.totalItems = scope.processCriterias.length;
								scope.processTotalCount = scope.processCriterias.length;
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

				this.getAdjustmentCriteria = function (scope) {
					var param = {
						pageSize: 100000,
						pageNo: 1
					}
					if(scope.season){
						param.season = scope.season.label
					}
					if(scope.working) {
						param.workingNo = scope.working
					}
					scope.adjustmentCriteria = [];
				GLOBAL_Http($http, "cpo/api/worktable/customerforecasttuning/find?", 'GET', param, function (data) {

						scope.adjustmentTotalCount = 0;
							if (data.rows) {
								scope.adjustmentCriteria = translateData(data.rows);
                if(scope.adjustmentCriteria.length >50){
                  var height = 50*30 + 46;
                }
								else if (scope.adjustmentCriteria.length > 10) {
									var height = (scope.adjustmentCriteria.length * 30) + 46;
								} else {
									var height = (10 * 30) + 46;
								}
								scope.adjustmentTotalCount = scope.adjustmentCriteria.length;
								$("#adjustmentCriteriaGrid").css('height', height + 'px');
								// scope.gridOptions1.totalItems = scope.adjustmentCriteria.length;
								// scope.processTotalCount = scope.adjustmentCriteria.length;
							} else {
								scope.adjustmentCriteria = [];
								var height = (10 * 30) + 46;
								$("#adjustmentCriteriaGrid").css('height', height + 'px');
                scope.adjustmentTotalCount = scope.adjustmentCriteria.length;
								// scope.gridOptions1.totalItems = scope.adjustmentCriteria.length;
								// scope.processTotalCount = scope.adjustmentCriteria.length;
							}

					}, function (data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.getParamData = function (scope) {
					var param = {
						in_code: 'CRITERIACONDITION,CRITERIAVALUETYPE'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function (data) {
						if (data.status == 0) {
							if (data.output) {
								scope.conditionList = data.output.CRITERIACONDITION;
								scope.valueTypeList = data.output.CRITERIAVALUETYPE;
							} else {
								scope.conditionList = [];
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

				this.deleteCriteriaVersion = function (scope) {
					var _this = this;
					modalAlert(CommonService, 0, $translate.instant('errorMsg.PLEASE_CONFIREM_DELETE'), function () {
						var param = {
							versionId: scope.version.id
						}
						GLOBAL_Http($http, "cpo/api/criteria/delete_criteria_version?", 'POST', param, function (data) {
							if (data.status == 0) {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.DELETE_SUCCESS'), null);
								_this.getVersionList(scope);
							} else {
								var message = data.message;
								modalAlert(CommonService, 3, message, null);
							}
						}, function (data) {
							// alert error
							modalAlert(CommonService, 3, data, null);
						});

					});

				}

				this.saveNewCriteriaVersion = function (scope) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'NewCriteriaModal',
						controller: 'NewCriteriaModalCtrl',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function () {
								return {
									"id": scope.version.id
								};
							}
						}
					});
					// modalInstance callback
					modalInstance.result.then(function (returnData) {
						if (returnData) {
							savenum = 1;
							_this.getVersionList(scope);
						}
					}, function () {
						// dismiss(cancel)
					});
				}
				/**
				 * init
				 */
				this.addFactoryCriteria = function (scope) {
					scope.factoryCriteriaData = {
						versionId: scope.version.id
					};
					scope.factoryCriteriaData.Mode = scope.ModeType.ADD;
					scope.isEdit = 'editFactoryCriteria';
				}
				this.editFactoryCriteria = function (scope) {
					var selectedRows = scope.gridApi.selection.getSelectedRows();
					if (selectedRows.length !== 1) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.ALERT_CHOOSE_DATA'), null);
						return;
					}
					scope.factoryCriteriaData = {
						factoryCriteriaId: selectedRows[0].factoryCriteriaId,
						versionId: scope.version.id
					};
					scope.factoryCriteriaData.Mode = scope.ModeType.EDIT;
					scope.isEdit = 'editFactoryCriteria';
				}

				this.factoryRowSelect = function (scope, row) {
					scope.factoryCriteriaData = {
						factoryCriteriaId: row.entity.factoryCriteriaId,
						versionId: scope.version.id
					};
					scope.factoryCriteriaData.Mode = scope.ModeType.EDIT;
					scope.isEdit = 'editFactoryCriteria';
				}
				this.processRowSelect = function (scope, row) {
					scope.processCriteriaData = {
						processCriteriaId: row.entity.processCriteriaId,
						versionId: scope.version.id
					};
					scope.processCriteriaData.Mode = scope.ModeType.EDIT;
					scope.isEdit = 'editProcessCriteria';
				}

				this.deleteFactoryCriteria = function (scope) {
					var _this = this;
					var selectedRows = scope.gridApi.selection.getSelectedRows();
					if (selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					} else {
						//						modalAlert(CommonService, 0, $translate.instant('errorMsg.PLEASE_CONFIREM_DELETE'), null);
						modalAlert(CommonService, 0, $translate.instant('errorMsg.PLEASE_CONFIREM_DELETE'), function () {
							var modal = $uibModal.open({
								templateUrl: "loadingpage",
								controller: 'loadingController',
								backdrop: 'static',
								size: 'sm'
							});
							var factoryCriteriaIds = listToString(selectedRows, 'factoryCriteriaId');
							var param = {
								ids: factoryCriteriaIds
							}
							GLOBAL_Http($http, "cpo/api/factory_criteria/remove", 'DELETE', param, function (data) {
								if (data.status == 0) {
									modalAlert(CommonService, 2, $translate.instant('notifyMsg.DELETE_SUCCESS'), null);
									_this.getFactoryCriteria(scope);
								} else {
									modalAlert(CommonService, 3, data.message, null);
								}
							}, function (data) {
								modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
							});
						});
					}
				}

				this.addProcessCriteria = function (scope) {
					scope.processCriteriaData = {
						versionId: scope.version.id
					};
					scope.processCriteriaData.Mode = scope.ModeType.ADD;
					scope.isEdit = 'editProcessCriteria';
				}
				this.editProcessCriteria = function (scope) {
					var selectedRows = scope.gridApi1.selection.getSelectedRows();
					if (selectedRows.length !== 1) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.ALERT_CHOOSE_DATA'), null);
						return;
					}
					scope.processCriteriaData = {
						processCriteriaId: selectedRows[0].processCriteriaId,
						versionId: scope.version.id
					};
					scope.processCriteriaData.Mode = scope.ModeType.EDIT;
					scope.isEdit = 'editProcessCriteria';
				}
				this.deleteProcessCriteria = function (scope) {
					var _this = this;
					var selectedRows = scope.gridApi1.selection.getSelectedRows();
					if (selectedRows.length <= 0) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.ONE_RECORD_SELECT_WARNING'), null);
						return;
					} else {
						modalAlert(CommonService, 0, $translate.instant('errorMsg.PLEASE_CONFIREM_DELETE'), function () {
							var modal = $uibModal.open({
								templateUrl: "loadingpage",
								controller: 'loadingController',
								backdrop: 'static',
								size: 'sm'
							});
							var processCriteriaIds = listToString(selectedRows, 'processCriteriaId');
							GLOBAL_Http($http, "cpo/api/process_criteria/delete_document", 'POST', processCriteriaIds, function (data) {
								if (data.status == 0) {
									modalAlert(CommonService, 2, $translate.instant('notifyMsg.DELETE_SUCCESS'), null);
									_this.getProcessCriteria(scope);
								} else {
									modalAlert(CommonService, 3, data.message, null);
								}
							}, function (data) {
								modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
							});
						});
					}
				}
				this.exportFile = function (scope){
          var param = {
            pageSize: 1000000,
            pageNo: 1,
            documentType: '2002'
          };

          if(scope.season){
            param.season = scope.season.label
          }
      //    exportExcel(param, "cpo/portal/document/export_file?", "_blank");
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
				this.toggleFilterRow = function (scope, tab) {
					if (tab == 1) {
						scope.gridOptions.enableFiltering = !scope.gridOptions.enableFiltering;
						scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
					} else {
						scope.gridOptions1.enableFiltering = !scope.gridOptions1.enableFiltering;
						scope.gridApi1.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
					}
					//						gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
				}

				this.adjustmentCriteriaSearch = function(scope){
					this.getAdjustmentCriteria(scope)
				}

				this.init = function (scope) {
					// 初期化
					var _this = this;
					scope.btndisable = true;
					scope.yesNoTemplate = document.getElementById("yesNoTemplate").innerText;
					scope.factoryCriterias = [];
					scope.processCriterias = [];
					scope.activeTab = 1;
					scope.showView = 'factoryCriteria';
					scope.isEdit = 'edit';
					scope.ModeType = {
						ADD: "ADD",
						EDIT: "EDIT",
						VIEW: "VIEW"
					}
					scope.page = {
						curPage: 1,
						pageSize: 10,
						sortColumn: 'id',
						sortDirection: true,
						totalNum: 0
					};
					scope.$on('criteria.factoryInit', function (event, data) {
						scope.$broadcast('criteria.afterFactoryInit', scope.factoryCriteriaData);
					});

					scope.$on('criteria.processInit', function (event, data) {
						scope.$broadcast('criteria.afterProcessInit', scope.processCriteriaData);
					});

					scope.$on('page.close', function (event, data) {
						scope.isEdit = 'edit';
						var returnData = data;
						switch (returnData.type) {
							case 1:
								{
									if (returnData.refresh == 'refresh') {
										_this.getFactoryCriteria(scope);
									}
									scope.showView = 'factoryCriteria';
									break;
								}
							case 2:
								{
									if (returnData.refresh == 'refresh') {
										_this.getProcessCriteria(scope);
									}
									scope.showView = 'processCriteria';
									break;
								}
						}
					});
					scope.versionList = [];
					this.getParamData(scope);
					this.getVersionList(scope);
					this.initGridOptions(scope);
					this.initGridOptions1(scope);
					this.initGridOptions2(scope)
					// this.getSelectList(scope)
					this.getSeason(scope)
          this.getAdjustmentDocInfo(scope);
				};
        this.getAdjustmentDocInfo= function(scope){
          var param = {
            in_code: "CUSTOMERFORECASTTUNING"
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {

            try {
              scope.adjustmentDoc=data.CUSTOMERFORECASTTUNING[0].value+"("+data.CUSTOMERFORECASTTUNING[0].label.split(" ")[0]+")"
            }catch (e){};
          }, function(data) {

          });
        }
				this.importCustomerForecastAssignmentRule = function(scope) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'FileModal',
						controller: 'FileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: "601",
                                    criteriaVersionId:scope.version.id
								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {
						if(returnData) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
							_this.getFactoryCriteria(scope);
              _this.getAdjustmentDocInfo(scope);
						}
					}, function() {});
				};
			}
		])
		.controller('criteriaCtrl', ['$scope', 'criteriaService',
			function ($scope, criteriaService) {
				$scope.doSelectTab = function (Tab) {
					criteriaService.doSelectTab($scope, Tab);
				}
				$scope.saveNewCriteriaVersion = function () {
					criteriaService.saveNewCriteriaVersion($scope);
				}
				$scope.deleteCriteriaVersion = function () {
					criteriaService.deleteCriteriaVersion($scope);
				}
				$scope.addFactoryCriteria = function () {
					criteriaService.addFactoryCriteria($scope);
				}
				$scope.editFactoryCriteria = function () {
					criteriaService.editFactoryCriteria($scope);
				}
				$scope.deleteFactoryCriteria = function () {
					criteriaService.deleteFactoryCriteria($scope);
				}
				$scope.addProcessCriteria = function () {
          criteriaService.addProcessCriteria($scope);
        }
        $scope.deleteAll = function () {
          criteriaService.deleteAll($scope);
        }
				$scope.factoryRowSelect = function (row) {
					criteriaService.factoryRowSelect($scope, row);
				}
				$scope.processRowSelect = function (row) {
					criteriaService.processRowSelect($scope, row);
				}
				$scope.editProcessCriteria = function () {
					criteriaService.editProcessCriteria($scope);
				}
				$scope.deleteProcessCriteria = function () {
					criteriaService.deleteProcessCriteria($scope);
				}
				$scope.scrolltoTop = function () {
					criteriaService.scrolltoTop($scope);
				};
				$scope.onVersionChange = function () {
					criteriaService.onVersionChange($scope);
				}
				$scope.getFactoryCriteria = function () {
					criteriaService.getFactoryCriteria($scope);
				}
				$scope.getProcessCriteria = function () {
					criteriaService.getProcessCriteria($scope);
				}
				$scope.toggleFilterRow = function (tab) {
					criteriaService.toggleFilterRow($scope, tab);
				};
				$scope.adjustmentCriteriaSearch = function () {
					criteriaService.adjustmentCriteriaSearch($scope);
				};
				$scope.importCustomerForecastAssignmentRule = function() {
					criteriaService.importCustomerForecastAssignmentRule($scope);
				}
				$scope.exportFile = function(){
          criteriaService.exportFile($scope);
        }
        $scope.importFactoryTuning = function(){
          criteriaService.importFactoryTuning($scope);
        }
				criteriaService.init($scope);
			}
		])
})();
