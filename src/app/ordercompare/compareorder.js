(function() {
	'use strict';
	angular
		.module('cpo')
		.service('orderCompareService', ['$http', '$translate', 'CommonService', '$uibModal',
			function($http, $translate, CommonService, $uibModal) {
				var searchKey = [];
				/**
				 * init
				 */
				this.init = function(scope) {
					// 初期化
					var _this = this;
					scope.searchRequest={};
					scope.gridOptions = {
						data: 'items',
						rowEditWaitInterval: -1,
						enableRowSelection: false,
						enableRowHeaderSelection: false,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: true,
						enableFiltering:true,
						enableHorizontalScrollbar: 1,
						gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
						enableVerticalScrollbar: 1,
						totalItems: scope.page.totalNum,
						columnDefs: []
					};
//					_this.getCompareOrder(scope);
						_this.fetchBatchDates(scope);
				};

				this.fetchBatchDates = function(scope) {
					var _this = this;
					var param = {
						in_code: 'LOCOMPAREDOCS'
					}
					GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {

						if(data.LOCOMPAREDOCS) {

							scope.docs = data.LOCOMPAREDOCS;

							for(var i = 0; i < scope.docs.length; i++) {
								scope.docs[i].id = scope.docs[i].value;
								scope.docs[i].label = scope.docs[i].label;
							}
							if(scope.docs != null && scope.docs.length>0) {
								scope.searchRequest.doc = scope.docs[0] ;
								_this.getCompareOrder(scope);
							}
						}

					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}


				this.getCompareOrder = function(scope) {
					var param = {};

					if(scope.searchRequest.doc && scope.searchRequest.doc.id) {
						param.eq_document_id = scope.searchRequest.doc.id;
					}
					for(var attr in searchKey) {
						if(searchKey[attr]) {
							param[attr] = urlCharTransfer(searchKey[attr]);
						}
					}
					var _this = this;
					scope.showLoading = true;
					GLOBAL_Http($http, "cpo/api/worktable/query_lo_order_compare?", 'POST', param, function(data) {

						if(data.status == 0) {
							if(data.jsonExportEntries) {
								var headers = [];
								angular.forEach(data.jsonExportEntries, function(item, index) {
									headers.push({
										name: (item.headerName ? item.headerName : "") + index,
										displayName: item.headerName,
										field: item.jsonObjectKey,
										width: '150'
									})
								});
								scope.gridOptions.columnDefs = angular.copy(headers);
							}
							if(data.output.data) {
								scope.loTotal=data.output.loTotalQuantity;
								scope.cpoTotal= data.output.cpoTotalQuantity;
								data.output.data = translateData(data.output.data);
								scope.items = data.output.data;
							} else {

							}
						} else {

							modalAlert(CommonService, 2, data.message, null);
						}

					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

				}
				
				
				this.importFile = function(scope,documentType) {
					var _this = this;
					var modalInstance = $uibModal.open({
						templateUrl: 'FileModal',
						controller: 'FileController',
						backdrop: 'static',
						size: 'md',
						resolve: {
							planGroups: function() {
								return {
									fileType: documentType

								};
							}
						}
					});
					modalInstance.result.then(function(returnData) {

						if(returnData) {
							modalAlert(CommonService, 2, $translate.instant('notifyMsg.UPLOAD_SUCCESS'), null);
							_this.fetchBatchDates(scope);
						}
					}, function() {});

				}
				this.exportFile = function(scope,documentType) {
					var param={};
					if(scope.searchRequest.doc && scope.searchRequest.doc.id) {
						param.eq_document_id = scope.searchRequest.doc.id;
					}else{
						modalAlert(CommonService, 3,'Please Select Document.', null);
						return ;
					}
					param['documentType']=documentType;
					exportExcel(param, "cpo/portal/document/export_file?", "_blank");
				}
			}
		])
		.controller('orderCompareCtrl', ['$scope', 'orderCompareService',
			function($scope, orderCompareService) {
				
				$scope.importFile = function(documentType) {
					orderCompareService.importFile($scope,documentType);
				};
				$scope.exportFile = function(documentType) {
					orderCompareService.exportFile($scope,documentType);
				};
				orderCompareService.init($scope);
			}
		])
})();