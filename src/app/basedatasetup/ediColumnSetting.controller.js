/**
 * Created by mac on 2017/11/17.
 */
(function() {
	'use strict';
	angular
		.module('cpo')
		.controller('ediColumnSettingCtrl', ['$scope', '$uibModal', 'CommonService', '$http', '$translate',
			function(scope, $uibModal, CommonService, $http, $translate) {
				scope.fetchInfo = function(scope) {
					scope.gridOptions.showLoading = true;
					var css3SwitchTemplate = document.getElementById("css3SwitchTemplate").innerText;
					var param = {};
					GLOBAL_Http($http, "/cpo/api/datasetting/query_edi_change_column_setting", 'GET', param, function(data) {
						scope.gridOptions.showLoading = false;
						if(data.status) {
							var headers = [];
							for(var i in data.jsonExportEntries) {
								var item = data.jsonExportEntries[i];
								var content = item['jsonObjectKey'];
								var headerName = item['headerName'];
								var template = css3SwitchTemplate
									.replace("XXREPLACEXX", "row.entity." + content)
									.replace("XXREPLACE2XX", "grid.appScope.mode!='EDIT'")
									.replace("XXXCHANGEXXX", "grid.appScope.checkingChange(row.entity,'"+content+"')")
									.replace('XXXCHECKXXX',"row.entity.content=='YES'");
								var item = {
									name: content,
									displayName: headerName,
									field: content,
									minWidth: '120',
									visible: !CommonService.columnHasHide(scope.gridOptions.zsGridName, content),
									cellTemplate: content == 'f1' ? undefined : template
								};
								headers.push(item);
							}
							scope.gridOptions.columnDefs = headers;
							scope.dataList = data.output;
						}
					}, function(data) {
						scope.gridOptions.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				scope.initGrid = function(scope) {
					var _this = this;
					scope.gridOptions = {
						data: 'dataList',
						paginationPageSizes: [10, 20, 50, 100, 200, 500],
						enablePagination: false,
						enablePaginationControls: false,
						paginationPageSize: 100,
						rowEditWaitInterval: -1,
						enableRowSelection: false,
						enableRowHeaderSelection: false,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						enableVerticalScrollbar: 0,
						zsColumnFilterRequestUrl: "/cpo/api/worktable/query_slt_result_filter?",
						zsColumnFilterRequestParam: {},
						onRegisterApi: function(gridApi) {
							scope.gridApi1 = gridApi;

							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope.page.curPage = newPage;
								scope.page.pageSize = pageSize;
							});

						}
					};

				}
				scope.init = function(scope) {
					scope.dataList = [];
					scope.mode = 'VIEW';
					scope.initGrid(scope);
					scope.fetchInfo(scope);
				}

				scope.edit = function() {
					scope.mode = 'EDIT';
				}

				scope.save = function() {
					var param={
						data:JSON.stringify(scope.dataList)	
					}
					GLOBAL_Http($http, "/cpo/api/datasetting/save_edi_change_column_setting", 'POST', param, function(data) {
						modalAlert(CommonService, 2, $translate.instant('notifyMsg.SUCCESS_SAVE'), null);
						scope.mode = 'VIEW';
					}, function(data) {
						scope.gridOptions.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}

				scope.showModal = function(mode,title) {
					//do add type

					var _this = this;
					var modalInstance =
						$uibModal.open({
							animation: true,
							ariaLabelledBy: "modal-header",
							templateUrl: 'app/basedatasetup/ediColumnSettingEdit.html',
							controller: 'ediColumnSettingEditCtrl',
							resolve: {
								info: {
									mode: mode,
									title: title
								}
							}
						});

					modalInstance.resolve = function(result) {
						if("YES"==result){
							_this.fetchInfo(scope);
						}
					}
				}

				scope.checkingChange = function(entity,changeColumn) {
					//check scope.dataList
					if('YES'==entity[changeColumn]||true==entity[changeColumn]){
						entity[changeColumn]='YES';
					}else{
						entity[changeColumn]='NO';
					}
					if(changeColumn!='tips'&&changeColumn!='combos'){
						//do check
						for(var i=0;i<scope.dataList.length;i++){
							var data=scope.dataList[i];
							var count=0;
							for(var prod in data){
								if(isFloat(prod.substring(1,prod.length))){
									if('YES'==data[prod]){
										count++;
										debugger;
										if(count>1){
											entity[changeColumn]='NO';
											modalAlert(CommonService, 3, $translate.instant('This Column is already in other type\'s set ,please invert the other\'s first.'), null);
											return;
										}
									}
								}
							}
						}
					}
				}

				scope.init(scope);
			}
		])
})();