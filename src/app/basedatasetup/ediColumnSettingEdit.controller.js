/**
 * Created by mac on 2017/12/13.
 */

(function() {
	'use strict';

	angular.module('cpo').controller('ediColumnSettingEditCtrl', function($uibModalInstance, CommonService, $scope, $http,$translate,info) {
		$scope.mode = info.mode;
		$scope.title = info.title;
		$scope.getEdiColumnTypes = function() {
			var _this = this;
			var param = {
				in_code: 'EDICOLUMNTYPE'
			}
			GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
				_this.ediColumnTypes = data.EDICOLUMNTYPE;
				_this.ediColumnType=_this.ediColumnTypes[0];
			}, function(data) {
				modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
			});
		}
		$scope.submit = function(ediColumnTypeLabel) {
			var _this=this;
			if($scope.mode=='DELETE'){
				var param={
					ediColumnTypeId:_this.ediColumnType.value
				}
				GLOBAL_Http($http, "cpo/api/worktable/edicolumntypeext/remove?", 'DELETE', param, function(data) {
					$uibModalInstance.resolve("YES");
					$uibModalInstance.dismiss();
				}, function(data) {
						CommonService.hideLoadingView();
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
				});
			}else{
				if(!_this.ediColumnTypeLabel){
					debugger;
					modalAlert(CommonService, 3, 'Please input type name.', null);
					return;
				}
				var param={
					typeName:_this.ediColumnTypeLabel
				}
				GLOBAL_Http($http, "cpo/api/worktable/edicolumntypeext/create?", 'POST', param, function(data) {
					$uibModalInstance.resolve("YES");
					$uibModalInstance.dismiss();
				}, function(data) {
						CommonService.hideLoadingView();
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
				});
			}
		};
		$scope.dismiss = function() {
			$uibModalInstance.dismiss();
		}
		$scope.getEdiColumnTypes();
	});

})();