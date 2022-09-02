(function() {
	'use strict';
	angular
		.module('cpo')
		.service('workTableCommonService', ['$http', '$translate', 'CommonService', '$uibModal', 'uiGridConstants',
			function($http, $translate, CommonService, $uibModal, uiGridConstants) {
				var __this = this;

				this.constructeAssignmentStaticColumns = function(scope, columnDefName, hasFilter, width, girdName, zsGridName) {
					var array = scope.rootColumnDef[columnDefName];

					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;
					var hoverRateTemplate = document.getElementById("hoverRateTemplate").innerText;

					if(array) {
						var newArray = new Array();
						for(var index in array) {
							var item = array[index];
							var newItem = {
								name: item.displayName + index,
								displayName: item.displayName,
								width: width ? width : '100',
								field: item.field,
								enableCellEdit: false,
								enableSorting: false,
								visible: !CommonService.columnHasHide(girdName, item.field),
								headerCellTemplate: 'app/worktable/filter.html'
							}
							if(item.special && item.special.thousands) {
								newItem.cellTemplate = hoverBigNumberTemplate;
							} else if(item.special && item.special.rate) {
								newItem.cellTemplate = hoverRateTemplate;
							} else {
								newItem.cellTemplate = hoverTemplate;
							}
							if(hasFilter) {
								newItem.filters = [{
									condition: uiGridConstants.filter.CONTAINS,
									placeholder: ''
								}];
							} else {
								delete newItem.headerCellTemplate;
							}
							newArray.push(newItem);
						}
						return newArray;
					} else {
						return [];
					}
				};
				this.cusorderDynamicColumnsForAChinaBuyPlan = function(number, gridOption) {
					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;
					for(var i = 1; i <= number; i++) {

						var sizeNameItem = {
							name: "SIZENAME_" + i,
							displayName: "Size Name " + i,
							field: "SIZENAME_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}
						gridOption.columnDefs.push(sizeNameItem);

						var qutyItem = {
							name: "OQTY_" + i,
							displayName: "Size Quantity  " + i,
							field: "OQTY_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverBigNumberTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}

						gridOption.columnDefs.push(qutyItem);

					}

				}
				this.bulkorderDynamicColumns = function(number, gridOption,showOrgQty) {
					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;
					for(var i = 1; i <= number; i++) {
						var sizeNameItem = {
							name: "SIZENAME_" + i,
							displayName: "Customer Size" + i,
							field: "SIZENAME_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}
						gridOption.columnDefs.push(sizeNameItem);

						var tsItem = {
							name: "TS_" + i,
							displayName: "Techical Size" + i,
							field: "TS_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}
						gridOption.columnDefs.push(tsItem);

						var qtyItem = {
							name: "OQTY_" + i,
							displayName: "Size" + i + " Qty",
							field: "OQTY_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverBigNumberTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}

						gridOption.columnDefs.push(qtyItem);


            if(showOrgQty){
              var orgQtyItem = {
              	name: "ORGQTY_" + i,
              	displayName: "Org Size" + i + " Qty",
              	field: "ORGQTY_" + i,
              	width: '100',
              	enableCellEdit: false,
              	cellTemplate: hoverBigNumberTemplate,
              	filters: [{
              		condition: uiGridConstants.filter.CONTAINS,
              		placeholder: ''
              	}]
              }
              gridOption.columnDefs.push(orgQtyItem);
            }

						gridOption.columnDefs.push({
							name: "unitPrice" + i,
							displayName: "Size " + i + "Price",
							field: "unitPrice_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						});
					}

				}

				this.bulkorderDynamicColumnsMI = function(number, gridOption) {
					var hoverTemplate = document.getElementById("hoverTemplate").innerText;
					var hoverBigNumberTemplate = document.getElementById("hoverBigNumberTemplate").innerText;
					for(var i = 1; i <= number; i++) {
						var sizeNameItem = {
							name: "SIZENAME_" + i,
							displayName: "GB18SIZE" + i,
							field: "SIZENAME_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}
						gridOption.columnDefs.push(sizeNameItem);

						var tsItem = {
							name: "TS_" + i,
							displayName: "GB18SSIZ" + i,
							field: "TS_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}
						gridOption.columnDefs.push(tsItem);

						var qutyItem = {
							name: "OQTY_" + i,
							displayName: "GB18QTYN" + i,
							field: "OQTY_" + i,
							width: '100',
							enableCellEdit: false,
							cellTemplate: hoverBigNumberTemplate,
							filters: [{
								condition: uiGridConstants.filter.CONTAINS,
								placeholder: ''
							}]
						}

						gridOption.columnDefs.push(qutyItem);

						//          gridOption.columnDefs.push({
						//            name: "unitPrice"+i ,
						//            displayName: "Size "+i+"Price",
						//            field: "unitPrice_"+i,
						//            width: '100',
						//            enableCellEdit: false,
						//            cellTemplate: hoverTemplate,
						//            filters: [{
						//              condition: uiGridConstants.filter.CONTAINS,
						//              placeholder: ''
						//            }]
						//          });
					}

				}

				this.reAssignAll = function(scope, param, func) {
					var _this = this;

					var modalInstance =
						$uibModal.open({
							animation: true,
							ariaLabelledBy: "modal-header",
							templateUrl: 'app/worktable/assignFactory.html',
							controller: 'assignFactoryCtrl'
						});
					modalInstance.resolve = function(result) {
					GLOBAL_Http($http, "cpo/api/worktable/query_assignment_result?", 'POST', param, function(data) {
						if(data.status == 0) {
							if(data.output && data.output.length) {
								var param2 = {
									criteriaVersionId: scope.version.id,
									documentType: data.output[0].assignSource,
									document_id: data.output[0].documentId,
									isAssignByFactoryId:result.isAssignByFactoryId
								};
								GLOBAL_Http($http, "/cpo/api/worktable/re_assign_factory?", 'GET', param2, function(data) {

									if(data.status == 0) {
										if(data.tips && data.tips != "0") {
											modalAlert(CommonService, 2, "Assign Successfully with factory adjustment rules.", null);
										} else {
											modalAlert(CommonService, 2, $translate.instant('worktable.SUCCESS_ASSIGN'), null);
										}
									} else {
										modalAlert(CommonService, 2, data.message, null);
									}
									func(scope);
								}, function(data) {
									scope.showLoading = false;
									modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
									func(scope);
								});

							} else {

								modalAlert(CommonService, 3, $translate.instant('notifyMsg.NO_DATA_REASSIGN'), null);
							}
						} else {
							modalAlert(CommonService, 2, data.message, null);
						}
					}, function(data) {
						scope.showLoading = false;
						modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
					});

					}
				}
			}
		])

})();
