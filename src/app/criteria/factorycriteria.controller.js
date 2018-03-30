(function() {
	'use strict';

	angular
		.module('cpo')
		.service('FactoryCriteriaService', ['$http', '$uibModal', '$translate', 'COMMON_CONFIG', 'CommonService', '$location',
			function($http, $uibModal, $translate, COMMON_CONFIG, CommonService, $location) {
				var workingPullUpLoadMoreMark = true;
				var workingPullUpLoadMorePage = 1;
				var workingPullUpLoadMorePageSize = 100;
				var workingNoSourceDataArray;

				this.inputParamCheck = function(scope) {
					//					if(!scope.factoryCriteriaDetail.factoryCriteriaType) {
					//						modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_SELECT_CRITERIA_NAME'), null);
					//						return false;
					//					} else
					if(!scope.factoryCriteriaDetail.criteriaCategory) {
						modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_SELECT_CRITERIA_CATEGORY'), null);
						return false;
					} else if(!scope.factoryCriteriaDetail.factoryOrderType) {
						modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_SELECT_APPLICATION_ORDER_TYPE'), null);
						return false;
					} else if(!scope.factoryCriteriaDetail.mandatorySelected) {
						modalAlert(CommonService, 2, $translate.instant('processCriteria.PLEASE_SELECT_MANDATORY'), null);
						return false;
					} else if(!scope.factoryCriteriaDetail.applicationSite) {
						modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_SELECT_APPLICATION_SITE'), null);
						return false;
					}else if(!scope.factoryCriteriaDetail.criteriaValue) {
						modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_INPUT_CONDITION_SCORE'), null);
						return false;
					} else if(isNaN(scope.factoryCriteriaDetail.criteriaValue)) {
						modalAlert(CommonService, 2, $translate.instant('factoryCriteria.CONDITION_SCORE_SHOULD_BE_A_NUMBER'), null);
						return false;
					} else if(scope.factoryCriteriaDetail.criteriaValue > 100 && !scope.showScore) {
						modalAlert(CommonService, 2, $translate.instant('factoryCriteria.COEFFICIENT_MUAT_LESS_THAN_100'), null);
						return false;
					}
					scope.factoryCriteriaDetail.criteriaValue = isDot(scope.factoryCriteriaDetail.criteriaValue) ? parseFloat(scope.factoryCriteriaDetail.criteriaValue).toFixed(2) : scope.factoryCriteriaDetail.criteriaValue;
					for(var i = 0; i < scope.factoryCriteriaDetail.criteriaCondition.length; i++) {
						var crit = scope.factoryCriteriaDetail.criteriaCondition[i];
						if(!crit.condition) {
							modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_SELECT_CONDITION'), null);
							return false;
						} else if(!crit.conditionValue1) {
							modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_INPUT_CONDITION_VALUE_A'), null);
							return false;
						}
						//						if(!crit.criteriaValue) {
						//							modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_INPUT_CONDITION_SCORE'), null);
						//							return false;
						//						} else if(isNaN(crit.criteriaValue)) {
						//							modalAlert(CommonService, 2, $translate.instant('factoryCriteria.CONDITION_SCORE_SHOULD_BE_A_NUMBER'), null);
						//							return false;
						//						}
						//						else if(crit.criteriaValue>100&&!scope.showScore){
						//            modalAlert(CommonService, 2, $translate.instant('factoryCriteria.COEFFICIENT_MUAT_LESS_THAN_100'), null);
						//            return false;
						//          }
						//						else if(!crit.applicationSite) {
						//							modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_SELECT_APPLICATION_SITE'), null);
						//							return false;
//						//						}
//						crit.criteriaValue = isDot(crit.criteriaValue) ? parseFloat(crit.criteriaValue).toFixed(2) : crit.criteriaValue;
//						if(!crit.start) {
//							modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_SELECT_START_TIME'), null);
//							return false;
//						} else if((!crit.end) && (new Date(crit.start).getTime() >= new Date(crit.end).getTime())) {
//							modalAlert(CommonService, 2, $translate.instant('notifyMsg.SELECT_DATE_ERROR'), null);
//							return false;
//						}
						//						else if(!crit.end) {
						//							modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_SELECT_END_TIME'), null);
						//							return false;
						//						}
						if(crit.condition.value > 4 && !crit.conditionValue2) {
							modalAlert(CommonService, 2, $translate.instant('factoryCriteria.PLEASE_INPUT_CONDITION_VALUE_B'), null);
							return false;
						}
					}
					return true;
				};
				this.closePage = function(scope, refresh) {
					var returnData = {
						'type': 1
					}
					if(refresh) {
						returnData.refresh = refresh;
					}
					//					workingPullUpLoadMorePage = 1;
					scope.$emit("page.close", returnData);
				}
				this.add = function(scope) {
					var data = {
						critCondition: "",
						conditionValue1: "",
						//						criteriaValue: "",
						//						applicationSite: [],
						//						appWorkingNo: angular.copy(scope.workingNoList),
						//                      applicationWorkingNo:"ALL",
						inputType: "input",
						start: simpleDateFormat(new Date().getTime())
					};
					scope.factoryCriteriaDetail.criteriaCondition.push(data);
				}
				this.Save = function(scope) {
					if(!this.inputParamCheck(scope)) {
						return;
					}
					var _this = this;
					var param = angular.copy(scope.factoryCriteriaDetail);
					param.startDate = new Date(param.start + " 00:00:01").getTime();
					param.endDate = new Date(param.end + " 23:59:59").getTime();
					if(param.startDate > param.endDate ) {
						modalAlert(CommonService, 2, $translate.instant('factoryCriteria.END_TIME_EARLY_THAN_START_TIME'), null);
						return;
					}

					param.criteriaType = param.criteriaCategory.value;
					param.mandatory = param.mandatorySelected.value,
					param.factoryId = listToString(param.applicationSite, 'id');
					//					param.factoryId = param.applicationSite.value;
					param.orderType = param.factoryOrderType.value;
					for(var i = 0; i < param.criteriaCondition.length; i++) {
						param.criteriaCondition[i].criteriaCode = param.criteriaCondition[i].factoryCriteriaType.value;
						param.criteriaCondition[i].critCondition = param.criteriaCondition[i].condition.value;
//						param.criteriaCondition[i].startDate = new Date(param.criteriaCondition[i].start + " 00:00:01").getTime();
//						param.criteriaCondition[i].endDate = new Date(param.criteriaCondition[i].end + " 23:59:59").getTime();
						//						param.criteriaCondition[i].factoryIds = listToString(param.criteriaCondition[i].applicationSite, 'id');
						//						param.criteriaCondition[i].applicationWorkingNo = listToString(param.criteriaCondition[i].appWorkingNo, 'label');
					}
					if(scope.originFactoryCriteria) {
						compareListOpType(scope, param.criteriaCondition, scope.originFactoryCriteria.criteriaCondition, 'critCondiId');
					} else {
						compareListOpType(scope, param.criteriaCondition, null, 'critCondiId');
					}

					scope.submitLoading = true;
					if(scope.Mode == 'ADD') {
						param.criteriaVersionId = scope.versionId;
						param.criteriaStatus = '1';
						GLOBAL_Http($http, "cpo/api/factory_criteria/create?", 'POST', param, function(data) {
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
						GLOBAL_Http($http, "cpo/api/factory_criteria/update?", 'PUT', param, function(data) {
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

				this.selectWorkingNo = function(scope, condition) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'WorkingNoSelectModal',
						controller: 'WorkingNoSelectController',
						backdrop: 'static',
						size: 'lg',
						resolve: {
							planGroups: function() {
								return {
									fileType: "101"
								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {
						if(returnData) {
							condition.applicationWorkingNo = returnData;
						}
					}, function() {});
				}

				this.getSelectedData = function(scope, Mode, id) {
					var _this = this;
					var param = {
						in_code: 'CRITERIACONDITION,CRITERIASITE,CRITERIAVALUETYPE,FACTCRITTYPE,DOCUMENTASSIGNRATE,MANDATORY'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
						scope.siteList = data.CRITERIASITE;
						for(var i = 0; i < scope.siteList.length; i++) {
							scope.siteList[i].id = scope.siteList[i].value;
						}
						scope.conditionList = data.CRITERIACONDITION;
						scope.categoryList = data.CRITERIAVALUETYPE;
						scope.factoryCriteriaTypeList = data.FACTCRITTYPE;
						scope.orderTypeList = data.DOCUMENTASSIGNRATE;
						scope.mandatoryList = data.MANDATORY;
						//						workingNoSourceDataArray = data.WORKINGNO;
						//						workingPullUpLoadMorePage = 1;
						//						scope.workingNoList = _this.getWorkingNoListByPageAndPageSize(workingPullUpLoadMorePage, workingPullUpLoadMorePageSize);
						for(var i = 0; i < scope.workingNoList.length; i++) {
							scope.workingNoList[i].id = scope.workingNoList[i].value;
						}
						for(var i = 0; i < scope.conditionList.length; i++) {
							if(scope.conditionList[i].value > 4) {
								scope.conditionList[i].label = scope.conditionList[i].label.format('A', 'B');
							} else {
								scope.conditionList[i].label = scope.conditionList[i].label.format('A');
							}
						}

						switch(Mode) {
							case "ADD":
								{
									//									scope.factoryCriteriaDetail.criteriaCondition[0].appWorkingNo = angular.copy(scope.workingNoList);
									break;
								}
							case 'EDIT':
								{
									_this.getFactoryCriteriaDetail(scope, id);
									break;
								}
							case 'VIEW':
								{
									_this.getFactoryCriteriaDetail(scope, id);
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
				this.getFactoryCriteriaDetail = function(scope, id) {
					var paramObj = {
						'id': id
					}
					GLOBAL_Http($http, "cpo/api/factory_criteria/view?", 'GET', paramObj, function(data) {

						scope.submitLoading = false;
						if(data.status == 0) {
							scope.factoryCriteriaDetail = data.output;
							scope.factoryCriteriaDetail.start = simpleDateFormat(scope.factoryCriteriaDetail.startDate);
							scope.factoryCriteriaDetail.end = simpleDateFormat(scope.factoryCriteriaDetail.endDate);
							scope.originFactoryCriteria = angular.copy(scope.factoryCriteriaDetail);
//							for(var i = 0; i < scope.factoryCriteriaTypeList.length; i++) {
//								if(scope.factoryCriteriaTypeList[i].value == scope.factoryCriteriaDetail.criteriaCode) {
//									scope.factoryCriteriaDetail.factoryCriteriaType = scope.factoryCriteriaTypeList[i];
//									break;
//								}
//							}
							for(var i = 0; i < scope.mandatoryList.length; i++) {
								if(scope.factoryCriteriaDetail.mandatory == scope.mandatoryList[i].value) {
									scope.factoryCriteriaDetail.mandatorySelected = scope.mandatoryList[i];
									break;
								}
							}
							for(var i = 0; i < scope.categoryList.length; i++) {
								if(scope.categoryList[i].value == scope.factoryCriteriaDetail.criteriaType) {
									scope.factoryCriteriaDetail.criteriaCategory = scope.categoryList[i];
									break;
								}
							}
							scope.showScore = (scope.factoryCriteriaDetail.criteriaCategory.value != 2);

							for(var i = 0; i < scope.orderTypeList.length; i++) {
								if(scope.orderTypeList[i].value == scope.factoryCriteriaDetail.orderType) {
									scope.factoryCriteriaDetail.factoryOrderType = scope.orderTypeList[i];
									break;
								}
							}

							var factoryIds = scope.factoryCriteriaDetail.factoryId.split(",");
								scope.factoryCriteriaDetail.applicationSite = [];
								for(var k = 0; k < factoryIds.length; k++) {
									for(var j = 0; j < scope.siteList.length; j++) {
										if(scope.siteList[j].value == factoryIds[k]) {
											scope.factoryCriteriaDetail.applicationSite.push(scope.siteList[j]);
											break;
										}
									}
							}


							for(var i = 0; i < scope.factoryCriteriaDetail.criteriaCondition.length; i++) {
								var con = scope.factoryCriteriaDetail.criteriaCondition[i];
								for(var j = 0; j < scope.conditionList.length; j++) {
									if(con.critCondition == scope.conditionList[j].value) {
										con.condition = scope.conditionList[j];
										break;
									}
								}

							   for(var j = 0; j < scope.factoryCriteriaTypeList.length; j++) {
								  if(scope.factoryCriteriaTypeList[j].value == con.criteriaCode) {
									   con.factoryCriteriaType = scope.factoryCriteriaTypeList[j];
									  break;
								  }
							   }


//								var factoryIds = con.factoryIds.split(",");
//								con.applicationSite = [];
//								for(var k = 0; k < factoryIds.length; k++) {
//									for(var j = 0; j < scope.siteList.length; j++) {
//										if(scope.siteList[j].value == factoryIds[k]) {
//											con.applicationSite.push(scope.siteList[j]);
//											break;
//										}
//									}
//								}

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

				this.onCriteriaTypeChange = function(scope) {
//					var _this = this;
//					var param = {
//						in_code: 'FACTCRITTYPE' + scope.factoryCriteriaDetail.factoryCriteriaType.value
//					}
//					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
//						//                      scope.factoryCriteriaDetail.criteriaCondition;
//					}, function(data) {
//						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
//					});
				}

				//				this.getWorkingNoListByPageAndPageSize = function(page, pageSize) {
				//					var tempArray = new Array();
				//					var offset = (page - 1) * pageSize;
				//					for(var i = offset; i < offset + pageSize; i++) {
				//						tempArray.push(workingNoSourceDataArray[i]);
				//					}
				//					return tempArray;
				//				}

				//				this.addLoadMoreEvent = function(scope) {
				//					var _this = this;
				//					$('#workingNoMultiDropdown .dropdown-menu.dropdown-menu-form').scroll(function() {
				//						var $this = $(this),
				//							viewH = $(this).height(), //可见高度
				//							contentH = $(this).get(0).scrollHeight, //内容高度
				//							scrollTop = $(this).scrollTop(); //滚动高度
				//						if(contentH - viewH - scrollTop <= 10 && workingPullUpLoadMoreMark) { //到达底部10px时,加载新内容
				//							//if(scrollTop / (contentH - viewH) >= 0.95) { //到达底部95%时,加载新内容
				//
				//							//Lock Event
				//							workingPullUpLoadMoreMark = false;
				//							//上拉加载Block
				//							workingPullUpLoadMorePage++;
				//							var moreArray = _this.getWorkingNoListByPageAndPageSize(workingPullUpLoadMorePage, workingPullUpLoadMorePageSize);
				//							if(moreArray && moreArray.length) {
				//								for(var i = 0; i < moreArray.length; i++) {
				//									moreArray[i].id = moreArray[i].value;
				//								}
				//								scope.workingNoList = scope.workingNoList.concat(moreArray);
				//								//暂时只能用模拟点击刷新列表
				//								angular.element($('#workingNoMultiDropdown .dropdown-menu.dropdown-menu-form>li:nth-child(4)>a')).click();
				//								angular.element($('#workingNoMultiDropdown .dropdown-menu.dropdown-menu-form>li:nth-child(4)>a')).click();
				//							}
				//							//Unlock Event
				//							setTimeout(function() {
				//								workingPullUpLoadMoreMark = true;
				//							}, 500);
				//
				//						}
				//					});
				//				}

				this.init = function(scope) {
					// 初期化
					var _this = this;
					scope.Mode = {};
					scope.showScore = true;
					scope.factoryCriteria = {};
					scope.workingNoList = [];
					scope.factoryCriteriaDetail = {
						applicationWorkingNo: "ALL",
						applicationSite: [],
						criteriaCondition: [{
							critCondition: "",
							conditionValue1: "",
							criteriaValue: "",
							applicationSite: [],
							//							appWorkingNo: [],
							//                          applicationWorkingNo:"ALL",
							inputType: "input"
						}],
						start: simpleDateFormat(new Date().getTime())
					}

					scope.$on('criteria.afterFactoryInit', function(event, data) {
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
						_this.getSelectedData(scope, data.Mode, data.factoryCriteriaId);
					});

					scope.$emit("criteria.factoryInit", null);

				}
			}
		])
		.controller('FactoryCriteriaController', ['$scope', 'FactoryCriteriaService', 'CommonService', '$translate', 'sectionWidgetService',
			function($scope, FactoryCriteriaService, CommonService, $translate, sectionWidgetService) {
				$scope.closePage = function() {
					FactoryCriteriaService.closePage($scope);
				}
				$scope.Save = function() {
					FactoryCriteriaService.Save($scope);
				}
				$scope.moveUp = function(index, Array) {

					sectionWidgetService.moveUp(Array, index);
				};
				$scope.onCategoryChange = function() {

					$scope.showScore = ($scope.factoryCriteriaDetail.criteriaCategory.value != 2);

				}
				$scope.onCriteriaTypeChange = function() {
					FactoryCriteriaService.onCriteriaTypeChange($scope);
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

				$scope.moveDown = function(index, Array) {
					sectionWidgetService.moveDown(Array, index);
				};
				$scope.add = function() {
					FactoryCriteriaService.add($scope);
				};
				//				$scope.addLoadMoreEvent = function() {
				//					FactoryCriteriaService.addLoadMoreEvent($scope);
				//				}
				$scope.selectWorkingNo = function(condition) {
					FactoryCriteriaService.selectWorkingNo($scope, condition);
				}
				$scope.delete = function(index, Array) {
					sectionWidgetService.delete(Array, index);
				};
				FactoryCriteriaService.init($scope);

			}
		])
})();
