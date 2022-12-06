(function() {
	'use strict';

	angular
		.module('cpo')
		.service('MultiUploadFileService', ['$http', '$translate', 'CommonService', '$location',
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

				/**
				 * init
				 */
				this.init = function(scope, planGroups) {
					var _this = this;
          scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
					scope.Uploading = false;
          scope.uploadList = [];
          scope.resultList = [];
				};
			}
		])
		.controller('MultiUploadFileController', ["$scope", '$translate', "MultiUploadFileService", '$uibModalInstance', "fileReader", 'planGroups',
			function($scope, $translate, MultiUploadFileService, $uibModalInstance, fileReader, planGroups) {

				MultiUploadFileService.setModalScope($scope, $uibModalInstance);

				/**
				 * モーダル設定
				 */
				$scope.cancel = function() {
					MultiUploadFileService.cancel();
				}

				$scope.UploadFile = function(files, file, newFiles, duplicateFiles, invalidFiles, event) {
					if(files && files.length) {
            $scope.uploadList = $scope.uploadList.concat(files);
					}
				}

				$scope.startUpload = function() {
          if($scope.uploadList && $scope.uploadList.length){
            $scope.uploadList.forEach(function(o){
              o.uploadResult = null;
            })
            $scope.Upload($scope.uploadList);
          }
        }

        $scope.Upload = function(files) {
					if(!(files && files.length)) {
						// modalAlert(CommonService, 2, $translate.instant('errorMsg.PLEASE_SELECT_FILE'), null);
						return;
					}
          var file = null;
          var currentFileIndex = 0;
          for (var i = 0; i < files.length; i++) {
            if(files[i].uploadResult != 'Failed'){
              file = files[i];
              currentFileIndex = i;
              break;
            }
          }
          if(file == null){
            return;
          }
					var _this = this;
					var fileType = getFileType(file.name);
					if(fileType !== 'xlsx' && fileType !== 'xls' && fileType !== 'xlsm' && fileType !== 'xltx' && fileType !== 'xltm' && fileType !== 'xlsb' && fileType !== 'xlam' & fileType !== 'pdf') {
						modalAlert(CommonService, 3, $translate.instant('errorMsg.ERROR_FILE_FORMAT'), null);
						return;
					}
					var fd = new FormData();
					fd.append('file', file);
					fd.append("documentType", '99999');
          $scope.uploadHtml = 'Uploading... ';
					$scope.Uploading = true;
          files[currentFileIndex].uploadResult = 'Uploading';
					GLOBAL_Http_UploadFile($http, "cpo/api/worktable/upload_factory_assignment_document?", fd, function(data) {
						if(data.status == 0) {
              var f = files.splice(0,1);
              f.lastModified = new Date().getTime();
              $scope.resultList = $scope.resultList.concat(f);
						} else {
              files[currentFileIndex].uploadResult = 'Failed';
							// modalAlert(CommonService, 3, data.message, null);
						}
            $scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
						$scope.Uploading = false;
            $scope.Upload($scope.uploadList);
					}, function(data) {
            files[currentFileIndex].uploadResult = 'Failed';
            $scope.uploadHtml = '<i class="fa fa-upload"></i> Upload ';
						$scope.Uploading = false;
            $scope.Upload($scope.uploadList);
						// modalAlert(CommonService, 3, $translate.instant('notifyMsg.UPLOAD_FAIL'), null);
					});
				}

				MultiUploadFileService.init($scope, planGroups);
			}
		])

})();
