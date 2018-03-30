(function() {
	'use strict';

	angular
		.module('cpo')
		.service('FileService', ['$http', 'CommonService', '$location', '$translate',
			function($http, CommonService, $location, $translate) {

				var modalScope;
				var gModalInstance;
				/**
				 * モーダル設定
				 */
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
                scope.season=scope.seasonList[1];
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
				this.UploadFile=function(scope,file){

					scope.file=file;
					scope.fileName=file.name;
				}

				this.onSeasonChange = function(scope,season) {
					scope.season=season;
				}

				this.Upload=function(scope){

					if(scope.fileType == 901) {
						if(!scope.season.id) {
							modalAlert(CommonService, 2, $translate.instant('worktable.SELECT_AT_LEAST_A_SEASON'), null);
							return;
						}
					}
					if(!scope.file){
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
					fd.append("documentType", scope.fileType);
					if(scope.fileType == 901) {
						fd.append("season", scope.season.label);
					}
					if(scope.criteriaVersionId){
						fd.append("criteriaVersionId", scope.criteriaVersionId);
					}

					scope.uploadHtml = 'Uploading... ';
					scope.Uploading = true;
					GLOBAL_Http_UploadFile($http, "cpo/api/worktable/upload_factory_assignment_document?", fd, function(data) {

						if(data.status == 0) {
							gModalInstance.close("YES");
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
				this.init = function(scope, planGroups) {
					var _this = this;
					scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
					scope.Uploading = false;
					scope.fileName='Please Select File...';
					scope.fileType=planGroups.fileType;
					scope.criteriaVersionId=planGroups.criteriaVersionId;
					scope.season={};
					_this.getSeasonList(scope);
				};
			}
		])
		.controller('FileController', ["$scope", "FileService", '$uibModalInstance', "fileReader", 'planGroups',
			function($scope, UploadFileService, $uibModalInstance, fileReader, planGroups) {
				UploadFileService.setModalScope($scope, $uibModalInstance);
				$scope.cancel = function() {
					UploadFileService.cancel();
				}
				$scope.save = function() {
					UploadFileService.save($scope);
				}
				$scope.UploadFile = function(file) {
					if(file){
					UploadFileService.UploadFile($scope,file);
					}
				}

				$scope.Upload = function() {
					UploadFileService.Upload($scope);
				}
				$scope.onSeasonChange = function(season) {
					UploadFileService.onSeasonChange($scope,season);
				}
				UploadFileService.init($scope, planGroups);
			}
		])

})();
