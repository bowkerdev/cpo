(function() {
	'use strict';

	angular
		.module('cpo')
		.service('SampleRoomCapacityDetailService', ['$http', 'CommonService', '$location', '$translate',
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
					if(scope.Mode=='VIEW'){
                		 gModalInstance.close();
                		 return;
                	}
                	var data=judgeDifferent(scope.factoryLoadingDetail.factoryMonthLoadings,scope.originFLDetail.factoryMonthLoadings,
                	'factoryLoadingId','capacity');

                	if(data.length==0){
                		 modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
                		 gModalInstance.dismiss();
                		 return;
                	}
                	var param={
                		'factoryMonthLoadings':data
                	};
                	GLOBAL_Http($http, "cpo/api/factory/update_factory_capacity?", 'PUT', param, function(data) {

						if(data.status == 0) {
                             modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
                             gModalInstance.close('YES');
						} else {
							var message = data.message;
							if(message) {
								modalAlert(CommonService, 3, message, null);
							}
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}

				this.getLoading = function(scope) {
					var year = new Date().getFullYear();
					var month = new Date().getMonth() + 1;
					var months = [year + "0" + month + '01', year + "0" + month + '02', year + "0" + (month + 1) + '01', year + "0" + (month + 1) + '02'];
					var param = {
						'in_month': months,
						pageNo: 1,
						pageSize: 10000,
						fact_load_type: 1,
						factoryId:scope.loadingData.factoryId,
						productType:scope.loadingData.productType,
						wovenKnit:scope.loadingData.wovenKnit
					}
					GLOBAL_Http($http, "cpo/api/factory/query_factory_loading?", 'GET', param, function(data) {

						if(data.status == 0) {
							scope.factoryLoadingDetail = data.output[0];
							scope.originFLDetail=angular.copy(scope.factoryLoadingDetail);
						} else {
							var message = data.message;
							if(message) {
								modalAlert(CommonService, 3, message, null);
							}
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				/**
				 * init
				 */
				this.init = function(scope, planGroups) {
					var _this = this;
					scope.errorOutputMsgs = [];
					scope.Mode = planGroups.Mode;
                    scope.loadingData=planGroups.data;
                    scope.factoryLoadingDetail={};
                    _this.getLoading(scope);
				};
			}
		])
		.controller('SampleRoomCapacityDetailController', ["$scope", "SampleRoomCapacityDetailService", '$uibModalInstance', "fileReader", 'planGroups',
			function($scope, SampleRoomCapacityDetailService, $uibModalInstance, fileReader, planGroups) {
				SampleRoomCapacityDetailService.setModalScope($scope, $uibModalInstance);
				$scope.cancel = function() {
					SampleRoomCapacityDetailService.cancel();
				}
				$scope.save = function() {
					SampleRoomCapacityDetailService.save($scope);
				}
				SampleRoomCapacityDetailService.init($scope, planGroups);
			}
		])

})();
