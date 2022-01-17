(function() {
	'use strict';

	angular
		.module('cpo')
		.service('FilterInGridService', [function() {
			var refreshMarkDictionary = {};
			this.gridClearAllFilter = function(grid) {
				angular.forEach(grid.columns, function(column) {
					column.filters[0].term = "";
					//column.isFiltering = false;

				});
			}
			this.registRefreshMark = function(scope) {
				refreshMarkDictionary[scope.$id] = scope;
			}
			this.clearAllNotification = function() {
				for(var key in refreshMarkDictionary) {
					refreshMarkDictionary[key].example1model = [];
					refreshMarkDictionary[key].col.isFiltering = false;
				}
			}

			this.getFilterParams = function(grid) {
				var newsearchKey = {};
				if(!grid.options.zsFilter) {
					return {};
				}
				for(var key in grid.options.zsFilter) {

					var filter = grid.options.zsFilter[key];

					if(!filter[2].term) {
						newsearchKey["in_" + key] = filter[0].term;
					} else {
						newsearchKey["nin_" + key] = filter[1].term;
					}
				}
				return newsearchKey;
			}
			this.getFilterParamWithOption = function(gridOption) {

				var newsearchKey = {};
				if(!gridOption.zsFilter) {
					return {};
				}
				for(var key in gridOption.zsFilter) {

					var filter = gridOption.zsFilter[key];

					if(!filter[2].term) {
						newsearchKey["in_" + key] = filter[0].term;
					} else {
						newsearchKey["nin_" + key] = filter[1].term;
					}
				}
				return newsearchKey;
			}
		}])
		.controller('filterCtrl', ['$filter', '$scope', '$timeout', '$http', 'FilterInGridService',
			function($filter, $scope, $timeout, $http, FilterInGridService) {

				$scope.example1data = [];
				$scope.example1model = [];
				//	$scope.col.isFiltering = false;
				$scope.example1modelWatchUnbindFunction = null;
				$scope.settings = {
					enableSearch: true,
					showUncheckAll: true,
					showCheckAll: true,
					scrollable: true,
					scrollableHeight: '230px',
					checkboxes: true
				};

				$scope.showLoading = true;
				$scope.popoverIsOpen = false;

				//注册刷新mark
				FilterInGridService.registRefreshMark($scope);

				$scope.close = function() {

					$scope.popoverIsOpen = false;
				}

				$scope.clearThis = function() {
					$scope.example1model = [];
					$scope.search();
					//	$scope.col.isFiltering = false;
				}
				$scope.getThisFieldSelectColumns = function() {

					$scope.col.grid.options.zsFilter[$scope.col.field]
					var scope = this;
					var filter = $scope.col.grid.options.zsFilter[$scope.col.field];

					return scope.example1data.filter(function(item) {

						if(filter && filter.length == 3 && filter[0].term) {

							var selects = filter[0].term.split("**").map(function(select) {
								if(select == "%20") {
									return "";
								}
								return select;
							})

							return selects.indexOf(item.id) != -1;

						} else {
							return false;
						}
					});

				}
				$scope.clearAll = function() {
					angular.forEach($scope.col.grid.columns, function(column, index) {
						column.filters[0].term = "";
						//	column.isFiltering = false;
					});
					//clearAll通知
					FilterInGridService.clearAllNotification();

					$scope.clearThis();
				}
				$scope.search = function() {

					var result = null;

					$scope.example1model = $filter('multFilterSpecial')($scope.example1model, angular.element("#zsSearchInput").val());

					if($scope.example1model.length == $scope.example1data.length) {

						$scope.col.filters = [{
							term: ""
						}, {
							term: ""
						}, {
							term: false
						}];
						//	$scope.grid.api.core.raise.filterChanged();
						//	$scope.col.isFiltering = false;
					} else {
						if($scope.example1model.length > 0) {

							//是否有空

							var hasEmpty = $scope.example1model.reduce(function(prev, next) {
								return prev || (!next.id);
							}, false);

							//选中id
							var selectIds = new Array();
							angular.forEach($scope.example1model, function(item) {
								if(item.id) {
									selectIds.push(item.id)
								}
							});

							//选中
							var result =
								$scope.example1model.reduce(function(prev, next) {
									return prev ? (prev + "**" + (next.id ? next.id : '%20')) : (next.id ? next.id : '%20');
								}, "");

							//未选中
							var nin_result_array = $scope.example1data.filter(function(item) {

								if(!item.id) {
									return false;
								}
								if(selectIds.indexOf(item.id) != -1) {
									return false;
								} else {
									return true;
								}
							});

							var nin_result =
								nin_result_array.reduce(function(prev, next) {
									return prev ? (prev + "**" + (next.id ? next.id : '%20')) : (next.id ? next.id : '%20');
								}, "");
							$scope.col.filters = [{
								term: result
							}, {
								term: nin_result
							}, {
								term: hasEmpty
							}];
						} else {
							$scope.col.filters = [{
								term: ""
							}, {
								term: ""
							}, {
								term: false
							}];
						}

					}

					//放在option里面,数据还是不要依赖视图比较好
					if(!$scope.col.grid.options.zsFilter) {
						$scope.col.grid.options.zsFilter = {}
					}
					$scope.col.grid.options.zsFilter[$scope.col.field] = $scope.col.filters;

					$scope.grid.api.core.raise.filterChanged();

					$scope.close();

				}
				$scope.hasSelect = function() {

					var hasSelect =
						(this.col.grid.options.zsFilter &&
							this.col.grid.options.zsFilter[this.col.field] &&
							this.col.grid.options.zsFilter[this.col.field].length >= 3 &&
							this.col.grid.options.zsFilter[this.col.field][0].term) ? true : false;
					return hasSelect;
				}
				$scope.$watch('popoverIsOpen', function() {

					if($scope.popoverIsOpen) {

						if(!$scope.col.grid.options.zsFilter) {
							$scope.col.grid.options.zsFilter = {}
						}

						var requestURL = $scope.col.grid.options.zsColumnFilterRequestUrl ? $scope.col.grid.options.zsColumnFilterRequestUrl : "NO_URL_SET_IN_GRID_OPTION";
						var param = $scope.col.grid.options.zsColumnFilterRequestParam ? $scope.col.grid.options.zsColumnFilterRequestParam : {};
						$scope.getFieldData($scope, requestURL, angular.copy(param), $scope.col.field);
						$scope.nothing = false;

						$scope.example1modelWatchUnbindFunction = $scope.$watch('example1model', function() {
							$scope.noneSelected = ($scope.example1model.length == 0);
						}, true);

					} else {
						if($scope.example1modelWatchUnbindFunction) {
							$scope.example1modelWatchUnbindFunction();
						}

					}

				});

				$scope.getFieldData = function(scope, requestUrl, param, field) {

					var newsearchKey = {};
					var newsearchKey2 = {};

					angular.forEach(scope.col.grid.columns, function(column, index) {
						if(column.isFiltering && column.filters && column.filters[0].term && column.filters[0].term.length > 0) {

							if(!column.filters[2].term) {
								newsearchKey["in_" + column.field] = column.filters[0].term;
							} else {
								newsearchKey2["nin_" + column.field] = column.filters[1].term;
							}
						}
					});

					var filterParams = FilterInGridService.getFilterParams(scope.col.grid);

					param["field"] = field

					for(var attr in filterParams) {
						if(filterParams[attr]) {
							param[attr] = filterParams[attr];
						}
					}

					scope.disableReleaseOrderButton = false;

					param["field"] = field;

					var _this = this;
					scope.showLoading = true;
					/// return;

					var type = "GET";
					if(requestUrl == "cpo/api/worktable/query_assignment_result_filter?") {
						type = "POST";
					} else if(requestUrl == "cpo/api/worktable/get_change_order_filter?") {
						type = "POST";
					} else if(requestUrl == "cpo/api/worktable/get_confirm_order_filter?") {
						type = "POST";
					}

					var inkey = "in_" + field;
					delete param[inkey];
					var minkey = "min_" + field;
					delete param[minkey];

					GLOBAL_Http($http, encodeURI(requestUrl), type, param, function(data) {

						//清空残留参数
						for(var key in $scope.col.grid.options.zsColumnFilterRequestParam) {
							if(0 == key.indexOf("in_")) {
								delete $scope.col.grid.options.zsColumnFilterRequestParam[key];
							} else if(0 == key.indexOf("nin_")) {
								delete $scope.col.grid.options.zsColumnFilterRequestParam[key];
							}
						}

						if(data.output && data.output.length > 0) {

							$scope.example1data = data.output.filter(function(item) {
								return item.hasOwnProperty("field")
							}).map(function(item) {
								return {
									id: item.field ? item.field : "",
									label: (item.field ? item.field : "[Empty]") + " ( " + item.fieldCount + " )"
								}
							});

							if($scope.example1model.length == 0) {
								//可能因为滚动回来的原因,数据没有了

								// $scope.col.grid.options.zsFilter[$scope.col.field]
								$scope.example1model = scope.example1data.filter(function(item) {
									var selects = scope.col.filters[0]

									if(scope.col.filters.length == 3 && scope.col.filters[0].term) {
										var selects = scope.col.filters[0].term.split("**").map(function(select) {
											if(select == "%20") {
												return "";
											}
											return select;
										})
										return selects.indexOf(item.id) != -1;

									} else {
										return false;
									}
								});
								//还是没有,就全选
								if($scope.example1model.length == 0) {
									$scope.example1model = angular.copy($scope.example1data);
								}

							}
							$timeout(function() {
								scope.showLoading = false;

								$timeout(function() {
									angular.element("#filter").scope().$$childHead.close = function() {};

									angular.element("#filter").scope().$$childHead.open = true;
								}, 500);
							}, 500);

						} else {
							$timeout(function() {
								scope.nothing = true;
							}, 500);

						}
					}, function(data) {
						$timeout(function() {
							scope.nothing = true;
						}, 1000);

					});
				}

			}
		])
})();