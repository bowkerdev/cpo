
(function() {
	'use strict';

	angular
		.module('cpo')
		.service('ProcessCriteriaService', ['$http', '$uibModal', '$translate', 'COMMON_CONFIG', 'CommonService', '$location',
			function($http, $uibModal, $translate, COMMON_CONFIG, CommonService, $location) {
				this.inputParamCheck = function(scope) {
					if(!scope.processCriteriaDetail.processSelected) {
						modalAlert(CommonService, 2, $translate.instant('processCriteria.PLEASE_SELECT_PROCESS'), null);
						return false;
					} else if(!scope.processCriteriaDetail.factorySelected) {
						modalAlert(CommonService, 2, $translate.instant('processCriteria.PLEASE_SELECT_APPLICATION_SITE'), null);
						return false;
					} else if(!scope.processCriteriaDetail.categorySelected) {
						modalAlert(CommonService, 2, $translate.instant('processCriteria.PLEASE_SELECT_CRITERIA_CATEGORY'), null);
						PLEASE_SELECT_CRITERIA_CATEGORY
						return false;
					} else if(!scope.processCriteriaDetail.mandatorySelected) {
						modalAlert(CommonService, 2, $translate.instant('processCriteria.PLEASE_SELECT_MANDATORY'), null);
						return false;
					} else if(!scope.processCriteriaDetail.processScore) {
						modalAlert(CommonService, 2, $translate.instant('processCriteria.PLEASE_INPUT_CONDITION_SCORE'), null);
						return false;
					} else if(isNaN(scope.processCriteriaDetail.processScore)) {
						modalAlert(CommonService, 2, $translate.instant('processCriteria.SCORE_SHOULD_BE_A_NUMBER'), null);
						return false;
					}
					scope.processCriteriaDetail.processScore = isDot(scope.processCriteriaDetail.processScore) ? parseFloat(scope.processCriteriaDetail.processScore).toFixed(2) : scope.processCriteriaDetail.processScore;
					if(!scope.processCriteriaDetail.start) {
						modalAlert(CommonService, 2, $translate.instant('processCriteria.PLEASE_SELECT_START_TIME'), null);
						return false;
					} else if(!isFloat(scope.processCriteriaDetail.processScore)) {
						modalAlert(CommonService, 2, $translate.instant('processCriteria.PLEASE_INPUT_CORRECT_SCORE'), null);
						return false;
					} else if( ( !scope.processCriteriaDetail.end ) && (new Date(scope.processCriteriaDetail.start).getTime() >= new Date(scope.processCriteriaDetail.end).getTime() ) ) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.SELECT_DATE_ERROR'), null);
						return false;
					}
					//					else if(!scope.processCriteriaDetail.end) {
					//						modalAlert(CommonService, 2, $translate.instant('processCriteria.PLEASE_SELECT_END_TIME'), null);
					//						return false;
					//					}
					return true;
				};

				this.closePage = function(scope, refresh) {
					var returnData = {
						'type': 2
					}
					if(refresh) {
						returnData.refresh = refresh;
					}
					scope.$emit("page.close", returnData);
				}

				this.Save = function(scope) {
					if(!this.inputParamCheck(scope)) {
						return;
					}
					var _this = this;
					var pcd = scope.processCriteriaDetail;

		            if(pcd.end){
			             var startDate = pcd.start +" 00:00:01";
			             var endDate = pcd.end+" 23:59:59";
			             if(startDate>endDate){
			               modalAlert(CommonService, 2, $translate.instant('factoryCriteria.END_TIME_EARLY_THAN_START_TIME'), null);
			               return ;
			             }
		            }

					var param = {
						"processId": pcd.processSelected.value,
						"factoryId": listToString(pcd.factorySelected, 'id'),
						"mandatory": pcd.mandatorySelected.value,
						"criteriaVersionId": pcd.criteriaVersionId,
						"processType": pcd.categorySelected.label,
						"startDate": new Date(pcd.start +" 00:00:01").getTime(),
						"endDate": new Date(pcd.end+" 23:59:59").getTime(),
						"criteriaStatus": 1,
						"processScore": pcd.processScore
					};

					scope.submitLoading = true;
					if(scope.Mode == 'ADD') {
						param.criteriaVersionId = scope.versionId;
						GLOBAL_Http($http, "cpo/api/process_criteria/save_process_criteria?", 'POST', param, function(data) {
							scope.submitLoading = false;
							_this.closePage(scope, 'refresh');
							if(data.status == 0) {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							} else {
								modalAlert(CommonService, 3, data.message, null);
							}
						}, function(data) {
							scope.submitLoading = false;
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					} else if(scope.Mode == 'EDIT') {
						param.processCriteriaId = pcd.processCriteriaId;

						GLOBAL_Http($http, "cpo/api/process_criteria/update_process_criteria?", 'PUT', param, function(data) {
							scope.submitLoading = false;
							_this.closePage(scope, 'refresh');
							if(data.status == 0) {
								modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
							} else {
								modalAlert(CommonService, 3, data.message, null);
							}
						}, function(data) {
							scope.submitLoading = false;
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						});
					}
				}

				//
				this.categoryChange = function(scope,selected){
					var param = {
						'categoryId':selected.value
					}
					GLOBAL_Http($http, "cpo/api/process_criteria/query_category_process?", 'GET', param, function(data) {
						if(data.status == 0){
							var processNames = [];
							var processList = data.output.processList;
							var item;
							for(var i = 0;i<processList.length;i++){
								item = {
									'label':processList[i].processName,
									'value':processList[i].processId
								}
								processNames.push(item);
							}
							scope.processList = processNames;
							scope.processCriteriaDetail.processSelected = processNames[0];
						}
						else{
							modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
						}

					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				this.getSelectedData = function(scope, Mode, id) {
					var _this = this;
					var param = {
						in_code: 'PROCESS,FACTORY,MANDATORY,PROCESSCATEGORY'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {


						scope.processList = data.PROCESS;
						scope.factoryList = data.FACTORY;
						for(var i = 0; i < scope.factoryList.length; i++) {
							scope.factoryList[i].id = scope.factoryList[i].value;
						}
						scope.mandatoryList = data.MANDATORY;
						scope.categoryList = data.PROCESSCATEGORY;
						switch(Mode) {
							case 'EDIT':
								{
									_this.getProcessCriteriaDetail(scope, id);
									break;
								}
							case 'VIEW':
								{
									_this.getProcessCriteriaDetail(scope, id);
									break;
								}
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				/**
				 * init
				 */
				this.getProcessCriteriaDetail = function(scope, id) {
					var _this = this;
					var paramObj = {
						'id': id
					}
					GLOBAL_Http($http, "cpo/api/process_criteria/view?", 'GET', paramObj, function(data) {
						scope.submitLoading = false;

						if(data.status == 0) {
							scope.processCriteriaDetail = data.output;
							scope.processCriteriaDetail.start = simpleDateFormat(scope.processCriteriaDetail.startDate);
							scope.processCriteriaDetail.end = simpleDateFormat(scope.processCriteriaDetail.endDate);
							for(var i = 0; i < scope.processList.length; i++) {
								if(scope.processCriteriaDetail.processId == scope.processList[i].value) {
									scope.processCriteriaDetail.processSelected = scope.processList[i];
									break;
								}
							}
							var factoryIds = scope.processCriteriaDetail.factoryId.split(",");
							scope.processCriteriaDetail.factorySelected = [];
							for(var i = 0; i < factoryIds.length; i++) {
								for(var j = 0; j < scope.factoryList.length; j++) {
									if(factoryIds[i] == scope.factoryList[j].value) {
										scope.processCriteriaDetail.factorySelected.push(scope.factoryList[j]);
										break;
									}
								}
							}
							for(var i = 0; i < scope.mandatoryList.length; i++) {
								if(scope.processCriteriaDetail.mandatory == scope.mandatoryList[i].value) {
									scope.processCriteriaDetail.mandatorySelected = scope.mandatoryList[i];
									break;
								}
							}

							for(var i = 0; i < scope.categoryList.length; i++) {
								if(scope.processCriteriaDetail.categoryId == scope.categoryList[i].value) {
									scope.processCriteriaDetail.categorySelected = scope.categoryList[i];
									_this.categoryChange(scope,scope.processCriteriaDetail.categorySelected);
									break;
								}
							}

						} else {
							var message = data.message;
							modalAlert(CommonService, 3, message, null);
						}
					}, function(data) {
						scope.submitLoading = false;
						modalAlert(CommonService, 3, $translate.instant('errorMsg.REQUSET_DATA_ERROR'), null);
					});
				}

				this.init = function(scope) {
					// 初期化
					var _this = this;
					scope.Mode = {};
					scope.processCriteria = {};
					scope.processCriteriaDetail = {
						start: simpleDateFormat(new Date().getTime()),
						factorySelected: []
					}
					scope.versionId = {};
					scope.$on('criteria.afterProcessInit', function(event, data) {
						scope.Mode = data.Mode;
						scope.versionId = data.versionId;

						switch(data.Mode) {
							case 'ADD':
								scope.submitLoading = false;
								scope.titleMode = $translate.instant('index.ADDED');
								break;
							case 'EDIT':
								{
									scope.submitLoading = true;
									scope.titleMode = $translate.instant('index.EDITED');
									break;
								}
							case 'VIEW':
								{
									scope.titleMode = pageStatus.VIEW;
									break;
								}
						}
						_this.getSelectedData(scope, data.Mode, data.processCriteriaId);
					});

					scope.$emit("criteria.processInit", null);

				}
			}
		])
		.controller('ProcessCriteriaController', ['$scope', 'ProcessCriteriaService', 'CommonService', '$translate',
			function($scope, ProcessCriteriaService, CommonService, $translate) {
				$scope.closePage = function() {
					ProcessCriteriaService.closePage($scope);
				}
				$scope.Save = function() {
					ProcessCriteriaService.Save($scope);
				}
				$scope.categoryChange = function(selected){
					ProcessCriteriaService.categoryChange($scope,selected);
				}
				$scope.translationTexts = {
					checkAll: $translate.instant('index.SELECT_ALL'),
					uncheckAll: $translate.instant('index.NOT_SELECT_ALL'),
					buttonDefaultText: $translate.instant('index.SELECT')
				}
				$scope.extraSettings = {
					checkBoxes: true,
					smartButtonMaxItems: 100,
					smartButtonTextConverter: function(itemText, originalItem) {
						return itemText;
					},
					scrollableHeight: '200px',
					scrollable: true
				};

				ProcessCriteriaService.init($scope);

			}
		])
})();
