(function() {
	'use strict';

	angular
		.module('cpo')
		.service('UploadFileService', ['$http', '$translate', 'CommonService', '$location',
			function($http, $translate, CommonService, $location) {

				var modalScope;
				var gModalInstance;
				var _this = this;
				this.setModalScope = function(inScope, inModalInstance) {
					modalScope = inScope;
					gModalInstance = inModalInstance;
				};

				this.cancel = function() {
					gModalInstance.dismiss();
				}
				this.save = function(scope) {

				}

				this.getSeasonList = function(scope) {
					var _this = this;
					GLOBAL_Http($http, "cpo/api/worktable/query_season?", 'GET', {}, function(data) {

						if(data.output) {
							scope.seasonList = data.output;

							for(var i = 0; i < scope.seasonList.length; i++) {
								scope.seasonList[i].id = scope.seasonList[i].value;
							}
							if(scope.fileType != 1 && scope.fileType != 201) {
								scope.season = [];
							} else {
								scope.season = {};
							}

						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				/**
				 * init
				 */
				this.UploadFile = function(scope, file) {

					scope.file = file;
					scope.fileName = file.name;
				}

				this.Upload = function(scope) {
					if(scope.showOrderDate && !scope.searchRequest.orderTime) {
						modalAlert(CommonService, 2, "Please enter Batch Date", null);
						return;
					}
					if(scope.fileType == 1 || scope.fileType == 201) {
						if(!scope.season.id) {
							modalAlert(CommonService, 2, $translate.instant('worktable.SELECT_AT_LEAST_A_SEASON'), null);
							return;
						}
					} else {

						if(scope.showSeasonSelect != 1) {
							if(scope.season.length == 0) {
								modalAlert(CommonService, 2, $translate.instant('worktable.SELECT_AT_LEAST_A_SEASON'), null);
								return;
							}

						}
					}

					if(!scope.file) {
						modalAlert(CommonService, 2, $translate.instant('errorMsg.PLEASE_SELECT_FILE'), null);
						return;
					}
					var _this = this;
					var fileType = getFileType(scope.file.name);
					if(fileType !== 'xlsx' && fileType !== 'xls' && fileType !== 'xlsm' && fileType !== 'xltx' && fileType !== 'xltm' && fileType !== 'xlsb' && fileType !== 'xlam') {
						modalAlert(CommonService, 3, $translate.instant('errorMsg.ERROR_FILE_FORMAT'), null);
						return;
					}
					var fd = new FormData();
					fd.append('file', scope.file);

					if(scope.showOrderDate) {
						fd.append('orderDate', scope.searchRequest.orderTime);
					}
					if(scope.custom) {
						for(var key in scope.custom) {
							if(scope.custom[key]) {
								fd.append(key, scope.custom[key]);
							}
						}
					}

					if(scope.season) {
						if(scope.fileType == 1 || scope.fileType == 201) {
							fd.append("season", scope.season.id);
						} else {

							var seasons = scope.seasonList.filter(function(item) {
								var has = false;
								angular.forEach(scope.season, function(selecItem) {
									has = has || (selecItem.id == item.id)

								})
								return has;
							});

							fd.append("season", listToString(seasons, 'id'));
						}
					}

					if(scope.showLco190Type) {
						fd.append("documentType", $("#loc190Type").val());
					} else {
						fd.append("documentType", scope.fileType);
					}

					scope.uploadHtml = 'Uploading... ';
					scope.Uploading = true;

					GLOBAL_Http_UploadFile($http, "cpo/api/worktable/upload_factory_assignment_document?", fd, function(data) {

						if(data.status == 0) {

							if(scope.fileType == 2) {
								_this.waitCustomerForecastDataImporting(function() {
									gModalInstance.close("YES",data);
									if(data.message) {
										modalAlert(CommonService, 2, data.message, null);
									}

								})

							} else {

								gModalInstance.close("YES");
								if(data.message) {
									modalAlert(CommonService, 2, data.message, null);
								}

							}

						} else {
							scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
							scope.Uploading = false;
							modalAlert(CommonService, 3, data.message, null);
						}
					}, function(data) {
						scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
						scope.Uploading = false;
						modalAlert(CommonService, 3, $translate.instant('notifyMsg.UPLOAD_FAIL'), null);
					});
				}
				this.waitCustomerForecastDataImporting = function(finishCallBack, time) {
					var _this = this;
					var param = {
						in_code: 'ASYNCHRONOUSCUS'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
						time++;
						if(data.ASYNCHRONOUSCUS[0].label == "YES") {
							setTimeout(function() {
								_this.waitCustomerForecastDataImporting(finishCallBack, time);
							}, 2000);
						} else {
							if(finishCallBack) {
								finishCallBack();
							}
						}
					}, function(data) {
						if(finishCallBack) {
							finishCallBack();
						}
					});

				}
				this.init = function(scope, planGroups) {
					var _this = this;

					scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
					scope.Uploading = false;
					scope.fileName = 'Please Select File...';
					scope.fileType = planGroups.fileType;
					scope.custom = planGroups.custom;
					scope.lco190types = [];
					scope.lco190type = null;
					scope.searchRequest = {
						orderTime: null
					};
					scope.showSeasonSelect = planGroups.showSeasonSelect;
					if(planGroups.fileType == 6) {
						scope.showLco190Type = true;
					}

					if(planGroups.special && planGroups.special.showOrderDate) {
						scope.showOrderDate = true;
						scope.searchRequest.orderTime = ""; //(new Date()).Format("yyyy-MM-dd");
					}

					//  console.log("111111111111111"+scope.fileType);
					if(scope.fileType != 1 && scope.fileType != 201) {
						scope.extraSettings = {
							checkBoxes: true,
							smartButtonMaxItems: 100,
							smartButtonTextConverter: function(itemText, originalItem) {
								return itemText;
							},
							selectionLimit: 2,
							showCheckAll: false,
							scrollableHeight: '200px',
							scrollable: true
						};
					} else {
						scope.extraSettings = {
							smartButtonMaxItems: 1,
							closeOnSelect: true,
							smartButtonTextConverter: function(itemText, originalItem) {
								return itemText;
							},
							selectionLimit: 1,
							scrollable: true
						};
					}
					_this.getSeasonList(scope);
				};
			}
		])
		.controller('UploadFileController', ["$scope", '$translate', "UploadFileService", '$uibModalInstance', "fileReader", 'planGroups',
			function($scope, $translate, UploadFileService, $uibModalInstance, fileReader, planGroups) {

				UploadFileService.setModalScope($scope, $uibModalInstance);
				$scope.translationTexts = {
					checkAll: $translate.instant('index.SELECT_ALL'),
					uncheckAll: $translate.instant('index.NOT_SELECT_ALL'),
					buttonDefaultText: $translate.instant('index.SELECT')
				}
				
				/**
				 * モーダル設定
				 */
				$scope.seasonList = [];

				$scope.cancel = function() {
					UploadFileService.cancel();
				}
				
				$scope.save = function() {
					UploadFileService.save($scope);
				}
				
				$scope.UploadFile = function(file) {
					if(file) {
						UploadFileService.UploadFile($scope, file);
					}
				}

				$scope.Upload = function() {
					UploadFileService.Upload($scope);
				}

				UploadFileService.init($scope, planGroups);
			}
		])

})();