(function() {
	'use strict';

	angular
		.module('cpo')
		.service('StyleTransferService', ['$http', '$uibModal', '$translate', 'COMMON_CONFIG', 'CommonService', '$location',
			function($http, $uibModal, $translate, COMMON_CONFIG, CommonService, $location) {

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


				this.SaveStyle = function (scope) {
					var param = this.getParams(scope)

					GLOBAL_Http($http, "cpo/api/worktable/styletransferExt/update?", 'PUT', param, function(data) {
						scope.closePage(scope, 'refresh');
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
				this.SavePO = function (scope) {
					var param = this.getParams(scope)
					GLOBAL_Http($http, "cpo/api/worktable/potransferExt/update", 'PUT', param, function(data) {
						scope.closePage(scope, 'refresh');
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
				this.getParams = function(scope){
					var params = {
						"poTransferId":"poTransferId",
						"loContract":"loContract",
						"releaseDate":"releaseDate",
						"reason":"reason",
						"styleTransferId":"styleTransferId",
						"sourcingType":"sourcingType",
						"transferReason":"transferReason",
						"changeASource":"changeASource",
						"givingFactoryFob":"givingFactoryFob",
						"receivingFactoryFob":"receivingFactoryFob",
						"loMerch":"loMerch",
						"tierMerch":"tierMerch",
						"utcCreate":"utcCreate",
						"remarks":"remarks",
						"note":"note"
					}
					var obj = {}
					for(var key in params){
						if(scope.model[params[key]]){
							if(key === 'sourcingType' || key === 'transferReason'){
								obj[params[key]] = scope.model[params[key]].value
							}else if(key === 'utcCreate' || key === 'releaseDate'){
								obj[params[key]] = new Date(scope.model[params[key]]).getTime()
							}else{
								obj[params[key]] = scope.model[params[key]]
							}
						}else if(scope.model.hasOwnProperty(params[key])){
              obj[params[key]] = "";
            }
					}
					return obj
				}


				this.getSelectedData = function(scope) {
					var param = {
						in_code: 'SourcingType,TransfeReason'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
						scope.SourcingTypeList = data.SourcingType
						for(var i = 0;i < scope.SourcingTypeList.length;i++){
							scope.SourcingTypeList[i].value = scope.SourcingTypeList[i].label
							if(scope.SourcingTypeList[i].label === scope.model.sourcingType){
								scope.model.sourcingType = scope.SourcingTypeList[i]
							}
						}
						scope.TransfeReasonList = data.TransfeReason
						for(var j = 0;j < scope.TransfeReasonList.length;j++){
							scope.TransfeReasonList[j].value = scope.TransfeReasonList[j].label
							if(scope.TransfeReasonList[j].label === scope.model.transferReason){
								scope.model.transferReason = scope.TransfeReasonList[j]
							}
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}



				this.init = function(scope) {
					// 初期化
					var _this = this
					scope.model = angular.copy(scope.transferReportData.row)
					// if(scope.model && scope.model.utcCreate){
					// 	scope.model.utcCreate = simpleDateFormat(scope.model.utcCreate)
					// }
					// if(scope.model && scope.model.releaseDate){
					// 	scope.model.releaseDate = simpleDateFormat(scope.model.releaseDate)
					// }
					scope.reportType = scope.transferReportData.reportType
					// console.log(scope.transferReportData)
					if(scope.reportType === 'style'){
						_this.getSelectedData(scope)
					}
				}
			}
		])
		.controller('StyleTransferController', ['$scope', 'StyleTransferService', 'CommonService', '$translate', 'sectionWidgetService',
			function($scope, StyleTransferService, CommonService, $translate, sectionWidgetService) {
				$scope.closePage = function() {
					StyleTransferService.closePage($scope);
				}
				$scope.SaveStyle = function() {
					StyleTransferService.SaveStyle($scope);
				}
				$scope.SavePO = function() {
					StyleTransferService.SavePO($scope);
				}
				StyleTransferService.init($scope);

			}
		])
})();
