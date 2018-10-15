/**
 * Created by mac on 2017/11/17.
 */
(function() {
	'use strict';
	angular
		.module('cpo')
		.controller('dataLogCtrl', ['$scope', '$uibModal', 'CommonService', '$http', '$translate',
			function($scope, $uibModal, CommonService, $http, $translate) {
				$scope.navList = ['Line Sheet', 'B Num', "Product Master","FR Capacity"];
				$scope.tabIndex = 1;
				$scope.initDataGrid = function(scope, index, dataName) {
					var _this = this;

					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverPercentTemplate = document.getElementById("hoverPercentTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;

					scope['gridOptions' + index] = {
						data: dataName,
						paginationPageSizes: [10, 20, 50, 100, 200, 500],
						paginationPageSize: 100,
						rowEditWaitInterval: -1,
						enableRowSelection: true,
						enableRowHeaderSelection: true,
						enableColumnMenus: true,
						enableGridMenu: true,
						enableSorting: false,
						enableHorizontalScrollbar: 1,
						enableVerticalScrollbar: 0,
						totalItems: scope.page.totalNum,
						useExternalPagination: true,
						enablePaginationControls: true,
						zsColumnFilterRequestUrl: "/cpo/api/worktable/query_slt_result_filter?",
						zsColumnFilterRequestParam: {},
						onRegisterApi: function(gridApi) {
							scope.gridApi1 = gridApi;

							gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
								scope['page' + index].curPage = newPage;
								scope['page' + index].pageSize = pageSize;
								_this.getData(scope, index+"");
							});

						}
					};

				}

				$scope.selectTab = function(index) {
					var _this=this;
					$scope.tabIndex = index + 1;
					switch($scope.tabIndex){
						case 1:{
							$scope.fetchDocs($scope,1);
							break;
						}
						case 2:{
							$scope.fetchDocs($scope,2);
							break;
						}
						case 3:{
							_this.getData($scope, '3');
							break;
						}
						case 4:{
							_this.getData($scope, '4');
							break;
						}
					}
				}
				$scope.search = function(index) {
					$scope.getData($scope,index);
				}
				$scope.getTitle = function(scope, list) {
					var columnDefs = [];
					for(var i = 0; i < list.length; i++) {
						columnDefs.push({
							name: list[i].fieldName,
							displayName: list[i].exportColumnName,
							field: list[i].fieldName,
							minWidth: '120',
							enableCellEdit: false,
							pinnedLeft: true
						})
					}
					return columnDefs
				}

				$scope.getData = function(scope, index) {
					var _this = this;
					scope['data' + index] = [];
					var param = {
						pageSize: scope['page' + index].pageSize,
						pageNo: scope['page' + index].curPage
					};

					switch(index) {
						case '1':
							{
								param['eq_data_type'] = '1';
								if(scope.lineSheetDocument){
									param['eq_document_id'] = scope.lineSheetDocument.value;
								}
								break;
							}
						case '2':
							{
								param['eq_data_type'] = '2';
								if(scope.BNumberDocument){
									param['eq_document_id'] = scope.BNumberDocument.value;
								}
								break;
							}
						case '3':
							{
								if(scope.searchRequest.workingNo){
									param['like_code'] = scope.searchRequest.workingNo;
								}
								if(scope.searchRequest.fromDate){
									param['gte_utc_create'] = scope.searchRequest.fromDate;
								}
								if(scope.searchRequest.toDate){
									param['lte_utc_create'] = scope.searchRequest.toDate;
								}
								param['eq_data_type'] = '3';
								break;
							}
						case '4':
							{
								if(scope.searchRequest.planGroup){
									param['like_code'] = scope.searchRequest.planGroup;
								}
								if(scope.searchRequest.fromDate2){
									param['gte_utc_create'] = scope.searchRequest.fromDate2;
								}
								if(scope.searchRequest.toDate2){
									param['lte_utc_create'] = scope.searchRequest.toDate2;
								}
								param['eq_data_type'] = '5';
								break;
							}
					}

					GLOBAL_Http($http, "cpo/api/worktable/datalogext/find_list?", 'GET', param, function(data) {
						scope['data' + index] = translateData(data.output.data);
						scope['page' + index].totalNum = data.output.total;
						scope['gridOptions' + index].totalItems = data.output.total;
						scope['gridOptions' + index].columnDefs = _this.getTitle(scope, data.output.headers);
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				$scope.fetchDocs = function(scope,index) {
					var _this = this;
					var param = {
						pageNo:1,
						pageSize:10000,
						in_document_type: '901,999',
						gte_utc_create:'2018-04-28'
					}
					GLOBAL_Http($http, "cpo/api/document/query_document?", 'GET', param, function(data) {
						var lineSheetDocuments=[];
						var BNumberDocuments=[];
						var documents=data.output.documents;
						for(var i=0;i<documents.length;i++){
							var document=documents[i];
							var documentType=document.documentType;
							var obj={
								label:document.documentOldName+"("+document.userName+","+simpleDateFormat(document.utcCreate)+")",
								value:document.documentId
							};
							if(documentType==999){
								BNumberDocuments.push(obj);
							}
							if(documentType==901){
								lineSheetDocuments.push(obj);
							}
						}
						
						if(index==1){
							scope.lineSheetDocuments=lineSheetDocuments;
							if(scope.lineSheetDocuments.length>0){
								scope.lineSheetDocument=scope.lineSheetDocuments[0];
							}
							_this.getData(scope, '1');
						}else if(index==2){
							scope.BNumberDocuments=BNumberDocuments;
							if(scope.BNumberDocuments.length>0){
								scope.BNumberDocument=scope.BNumberDocuments[0];
							}
							_this.getData(scope, '2');
						}else{
							scope.lineSheetDocuments=lineSheetDocuments;
							scope.BNumberDocuments=BNumberDocuments;
							if(scope.lineSheetDocuments.length>0){
								scope.lineSheetDocument=scope.lineSheetDocuments[0];
							}
							if(scope.BNumberDocuments.length>0){
								scope.BNumberDocument=scope.BNumberDocuments[0];
							}
							_this.getData(scope, '1');
							_this.getData(scope, '2');
							_this.getData(scope, '3');
							_this.getData(scope, '4');
						}
					}, function(data) {
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});
				}
				$scope.export = function(index) {
					var scope=$scope;
					var _this = this;
					var param = {
						pageSize: 1000000,
						pageNo: 1
					};
					switch(index) {
						case '1':
							{
								param['eq_data_type'] = '1';
								if(scope.lineSheetDocument){
									param['eq_document_id'] = scope.lineSheetDocument.value;
								}
								param['documentType']=8003;
								break;
							}
						case '2':
							{
								param['eq_data_type'] = '2';
								if(scope.BNumberDocument){
									param['eq_document_id'] = scope.BNumberDocument.value;
								}
								param['documentType']=8004;
								break;
							}
						case '3':
							{
								if(scope.searchRequest.workingNo){
									param['like_code'] = scope.searchRequest.workingNo;
								}
								if(scope.searchRequest.fromDate){
									param['gte_utc_create'] = scope.searchRequest.fromDate;
								}
								if(scope.searchRequest.toDate){
									param['lte_utc_create'] = scope.searchRequest.toDate;
								}
								param['eq_data_type'] = '3';
								param['documentType']=8005;
								break;
							}
						case '3':
							{
								if(scope.searchRequest.planGroup){
									param['like_code'] = scope.searchRequest.planGroup;
								}
								if(scope.searchRequest.fromDate2){
									param['gte_utc_create'] = scope.searchRequest.fromDate2;
								}
								if(scope.searchRequest.toDate2){
									param['lte_utc_create'] = scope.searchRequest.toDate2;
								}
								param['eq_data_type'] = '5';
								param['documentType']=8007;
								break;
							}
					}
					exportExcel(param, "cpo/portal/document/export_file?", "_blank");
				}
				
				$scope.refreshData=function(){
					$scope.getData($scope,$scope.tabIndex+'');
				}
				
				$scope.init = function(scope) {
					var _this = this;
					for(var i = 1; i < 5; i++) {
						scope['page' + i] = {
							curPage: 1,
							pageSize: 100,
							sortColumn: 'id',
							sortDirection: true,
							totalNum: 0
						};
						_this.initDataGrid($scope, i, 'data' + i);
					}
					scope.searchRequest={};
//					_this.fetchDocs(scope);
				}
				$scope.init($scope);
			}
		])
})();