/**
 * Created by mac on 2017/11/17.
 */
(function() {
	'use strict';
	angular
		.module('cpo')
		.controller('blukOrderAddSampleCtrl', ['$scope', '$uibModal', 'CommonService', '$http', '$translate',
			function(scope, $uibModal, CommonService, $http, $translate) {
        scope.search = function() {
          scope.fetchInfo(scope);
        }
				scope.fetchInfo = function(scope) {
					scope.gridOptions.showLoading = true;
          var param = {};
          if (scope.searchParam.season) {
            param.season = scope.searchParam.season;
          }
          if (scope.searchParam.articleNo) {
            param.articleNo = scope.searchParam.articleNo;
          }
          if (scope.searchParam.workingNo) {
            param.workingNo = scope.searchParam.workingNo;
          }
          if(scope.searchParam.factory&&scope.searchParam.factory.length>0) {
            var fac=[];
            for (var i = 0; i < scope.searchParam.factory.length; i++) {
              fac.push(scope.searchParam.factory[i].id);
            }
          	param['in_factory'] = fac;
          }
          if(scope.searchParam.sampleType&&scope.searchParam.sampleType.length>0) {
            var fac=[];
            for (var i = 0; i < scope.searchParam.sampleType.length; i++) {
              fac.push(scope.searchParam.sampleType[i].id);
            }
          	param['in_sampleType'] = fac;
          }
					GLOBAL_Http($http, "/portal/ediorderaddsample/queryEdiOrderAddSample", 'post', param, function(data) {
						scope.gridOptions.showLoading = false;
						scope.dataList = data.output&&data.output.rows&&data.output.rows.length?translateData(data.output.rows):[];
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
						// zsColumnFilterRequestUrl: "/cpo/api/worktable/query_slt_result_filter?",
						// zsColumnFilterRequestParam: {},
            columnDefs:[
              {
              	name: 'workingNo',
              	displayName: 'Working No',
              	field: 'workingNo',
              	minWidth: '120'
              },
              {
              	name: 'bno',
              	displayName: 'B No',
              	field: 'bno',
              	minWidth: '100'
              },
              {
              	name: 'season',
              	displayName: 'Season',
              	field: 'season',
              	minWidth: '100'
              },
              {
              	name: 'baseSize',
              	displayName: 'Base Size',
              	field: 'baseSize',
              	minWidth: '100'
              },
              {
              	name: 'productName',
              	displayName: 'Product Name',
              	field: 'productName',
              	minWidth: '140'
              },
              {
              	name: 'fabricType',
              	displayName: 'Fabric Type',
              	field: 'fabricType',
              	minWidth: '120'
              },
              {
              	name: 'productType',
              	displayName: 'Product Type',
              	field: 'productType',
              	minWidth: '120'
              },
              {
              	name: 'articleNo',
              	displayName: 'Article',
              	field: 'articleNo',
              	minWidth: '100'
              },
              {
              	name: 'factory',
              	displayName: 'Factory',
              	field: 'factory',
              	minWidth: '100'
              },
              {
              	name: 'colorwayName',
              	displayName: 'Colorway Name',
              	field: 'colorwayName',
              	minWidth: '140'
              },
              {
              	name: 'addSampleQty',
              	displayName: 'Add Sample Qty',
              	field: 'addSampleQty',
              	minWidth: '160'
              },
              {
              	name: 'sampleType',
              	displayName: 'Sample Type',
              	field: 'sampleType',
              	minWidth: '120'
              },
              {
              	name: 'po',
              	displayName: 'PO',
              	field: 'po',
              	minWidth: '100'
              },
              {
              	name: 'originalPo',
              	displayName: 'Original PO',
              	field: 'originalPo',
              	minWidth: '120'
              },
              {
              	name: 'utcCreate',
              	displayName: 'Created Date',
              	field: 'utcCreate',
              	minWidth: '120'
              },
              {
              	name: 'createBy',
              	displayName: 'Created By',
              	field: 'createBy',
              	minWidth: '120'
              },
              {
              	name: 'utcUpdate',
              	displayName: 'Updated Date',
              	field: 'utcUpdate',
              	minWidth: '120'
              },
              {
              	name: 'updateBy',
              	displayName: 'Updated By',
              	field: 'updateBy',
              	minWidth: '120'
              },
              {
              	name: 'remark',
              	displayName: 'Remark',
              	field: 'remark',
              	minWidth: '100'
              },
              {
              	name: 'addSampleTime',
              	displayName: 'Add Sample Time',
              	field: 'addSampleTime',
              	minWidth: '180'
              },
              {
              	name: 'operation',
              	displayName: '',
              	field: 'operation',
              	minWidth: '100',
                cellTemplate: document.getElementById('blukOrderAddSampleOperationTemplate').innerText
              }
            ],
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
          scope.searchParam = {
            factory:[],
            sampleType:[]
          };
          scope.factoryList=[]
          var param = {
          	in_code: 'FACTORYLIST,BULK_ORDER_SAMPLE_TYPE'
          }
          GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {
            scope.factoryList=data['FACTORYLIST'];
            for (var i = 0; i < scope.factoryList.length; i++) {
              scope.factoryList[i].id=scope.factoryList[i].label;
            }
            scope.sampleTypeList=data['BULK_ORDER_SAMPLE_TYPE'];
            for (var i = 0; i < scope.sampleTypeList.length; i++) {
              scope.sampleTypeList[i].id=scope.sampleTypeList[i].value;
            }
          }, function(data) {
          	modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
          });
					scope.initGrid(scope);
					scope.fetchInfo(scope);
				}

        scope.importFile = function(fileType) {
          var modalInstance = $uibModal.open({
          	templateUrl: 'uploadFileModal',
          	controller: 'UploadFileController',
          	backdrop: 'static',
          	size: 'md',
          	resolve: {
          		planGroups: function() {
          			return {
          				fileType: fileType
          			};
          		}
          	}
          });
          modalInstance.result.then(function(returnData) {

          }, function() {});
				}

				scope.deleteRow = function(row) {
					modalAlert(CommonService, 0, $translate.instant('errorMsg.PLEASE_CONFIREM_DELETE'), function () {
					  GLOBAL_Http($http , "/portal/ediorderaddsample/removeEdiOrderAddSample" , 'POST' , {id:row.entity.ediOrderAddSampleId} , function ( data ) {
					    if ( data.status == 0 ) {
					      modalAlert(CommonService , 2 , $translate.instant('notifyMsg.DELETE_SUCCESS') , null);
					      scope.fetchInfo(scope);
					    } else {
					      modalAlert(CommonService , 2 , data.message , null);
					    }
					  } , function ( data ) {
					    modalAlert(CommonService , 3 , $translate.instant('index.FAIL_GET_DATA') , null);
					  });
					});
				}

				scope.init(scope);
			}
		])
})();
