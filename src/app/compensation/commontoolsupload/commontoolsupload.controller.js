(function () {
  'use strict';

  angular
    .module('cpo')
    .service('commonToolsService', ['$http', 'CommonService', '$translate',
      function ($http, CommonService, $translate) {
				var upload_url = 'https://commontools.bowkerasia.com/zhimitool/ie/taskQueue/push/import'
				var import_success_link = 'https://commontools.bowkerasia.com/commontools-ui-bowker/#/ie/UploadDownloadContent'
				var token_type = 'bowker_baseportal'
        var modalScope;
        var gModalInstance;

        this.setModalScope = function (inScope, inModalInstance) {
          modalScope = inScope;
          gModalInstance = inModalInstance;
        };

        this.cancel = function () {
          gModalInstance.dismiss();
        }
        this.save = function (scope) {

        }
        /**
         * init
         */
        this.UploadFile = function (scope, file) {
          var fileType = getFileType(file.name);
					// 全小写
					var supportFileType = ['xlsx', 'xls', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xlam']
          if (supportFileType.indexOf(fileType.toLowerCase()) < 0) {
            modalAlert(CommonService, 3, $translate.instant('errorMsg.ERROR_FILE_FORMAT'), null);
            return;
          }
          scope.file = file;
          scope.fileName = file.name;
        }

        this.Upload = function (scope, reUpload) {
          if (!scope.file) {
            modalAlert(CommonService, 2, $translate.instant('errorMsg.PLEASE_SELECT_FILE'), null);
            return;
          }
          var fd = new FormData();
          fd.append('file', scope.file);
          fd.append("importConfig.configKey", scope.importConfigKey);
          fd.append("param", JSON.stringify());
          scope.Uploading = true;
					var token = window.localStorage ? localStorage.getItem("token") : Cookie.read("token");
					$http({
						method: "POST",
						url: upload_url,
						timeout: 1000 * 60 * 10,
						data: fd,
						headers: {
							'Content-Type': undefined,
							'Accept-Language': findLanguage(),
							'tokentype': token_type,
							'token': token
						}
					}).success(function(data) {
						if (data.success) {
							window.open(import_success_link + "?token=" + token
								+ "&tokenType=" + token_type + "&isIframe=true" ,"通用平台", null, true)
							if (scope.doResolve) {
                gModalInstance.resolve(data);
              }
              gModalInstance.close("YES");
						} else {
              scope.Uploading = false;
              modalAlert(CommonService, 3, data.message, null);
            }
					}).error(function(data) {
						scope.Uploading = false;
						modalAlert(CommonService, 3, $translate.instant('notifyMsg.UPLOAD_FAIL'), null);
					})
        }
        this.init = function (scope, planGroups) {
          scope.Uploading = false;
          scope.fileName = 'Please Select File...';
          scope.doResolve = planGroups.doResolve;
					scope.importConfigKey = planGroups.importConfigKey;
        };
      }
    ])
    .controller('commonToolsController', ["$scope", "commonToolsService", '$uibModalInstance', 'planGroups',
      function ($scope, UploadcommonToolsService, $uibModalInstance, planGroups) {
        UploadcommonToolsService.setModalScope($scope, $uibModalInstance);
        $scope.cancel = function () {
          UploadcommonToolsService.cancel();
        }
        $scope.save = function () {
          UploadcommonToolsService.save($scope);
        }
        $scope.UploadFile = function (file) {
					console.log(file)
          if (file) {
            UploadcommonToolsService.UploadFile($scope, file);
          }
        }
        $scope.Upload = function () {
          UploadcommonToolsService.Upload($scope);
        }
        UploadcommonToolsService.init($scope, planGroups);
      }
    ])

})();
