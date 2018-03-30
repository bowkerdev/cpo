'use strict';

angular.module('multiSelectDropdownOptions', [])
    .directive('multiSelectDropdownOptions', function ($http, $timeout, $translate) {
        return {
            restrict: 'E',
            replace: true,
            $scope: false,
            template: function (tElement, tAttrs) {
                var toWatchModel = tAttrs.model;
                var allSelectItemFlag = tAttrs.allSelectItemFlag;
                //针对repeat生成或针对多维对象
                var modelId = toWatchModel.replace(/\[|]|\.|\'/g, "");
                var _html = '<span class="multi-select-dropdown-code ' + (tAttrs.class ? tAttrs.class : '') + '" id="' + modelId + 'Id" ng-click="mutiStButtonClick(\'' + modelId + '\')"' + '>' +
                    '<span class="multi-select-dropdown-code-dropdown-control" ng-bind="' + toWatchModel + 'SelectString' + '" title="{{' + toWatchModel + 'SelectString' + '}}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"></span>' +
                    '<span class="fa fa-sort-desc sort-content"></span>' +
                    '<div class="dropdown-menu">' +
                    '<div class="search-group" aria-labelledby="' + modelId + 'Id">' +
                    '<div class="multi-select-dropdown-code-input-group" ng-if="' + toWatchModel + '&& ' + toWatchModel + '.length ">' +
                    '<button ng-repeat="item in ' + toWatchModel + '" ' +
                    'type="button" ng-click="mutiCleanSt($event, \'' + toWatchModel + '\', ' + '$index)">' +
                    '<span class="fa fa-times multi-selec-clear-content"> </span>' +
                    '<span  ng-bind="item.label"></span>' +
                    '</button>' +
                    '</div>' +
                    '<div class="multi-select-dropdown-code-input-group">' +
                    '<span class="multi-select-dropdown-code-input-group-search">' +
                    '<span class="fa fa-search"></span></span>' +
                    '<input type="text"' + 'ng-model="' + toWatchModel + 'Input" ' + 'autocomplate="off">' +
                    '</div>' +
                    '<div class="select-ul-group">' +
                    '<ul style="max-height: 190px;overflow-y: auto"> ' +
                    '<li ng-repeat="item in ' + toWatchModel + 'dropdownItems"' +
                    'ng-click="mutiSelectStItem($event, \'' + toWatchModel + '\',\'' + modelId + '\', item)"' +
                    'ng-mouseenter="setStActive($index)"' +
                    'ng-class="{\'active\': activeItemIndex === $index}"' +
                    '>' +
                    '<span ng-if="item.label">{{item.label}}</span>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</span>';
                return _html;
            },

            link: function ($scope, $element, $attrs) {
                var toWatchModel = $attrs.model;
                //针对repeat生成或针对多维对象
                var modelId = toWatchModel.replace(/\[|]|\.|\'/g, "");

                //监听输入，延时避免频繁调用接口
                $scope.$watch(toWatchModel + 'Input', function (newValue, oldValue) {
                    //焦点判断针对编辑页面输入框有值
                    if (newValue != oldValue) {
                        if ($scope[modelId + 'timer']) {
                            $timeout.cancel($scope[modelId + 'timer']);
                            $scope[modelId + 'timer'] = null;
                        }
                        $scope[modelId + 'timer'] = $timeout(function () {
                            var params = {};
                            var modelTemp = toWatchModel.replace(/\[/g, '.');
                            modelTemp = modelTemp.replace(/\]/, '');
                            console.log(modelTemp);
                            var dimen = modelTemp.indexOf('.');
                            console.log(dimen);
                            //针对多维对象或数组对象
                            if (dimen != -1) {
                                var multidimensional = modelTemp.split('.');
                                var a = $scope;
                                for (var i = 0; i < multidimensional.length - 1; i++) {
                                    a = a[multidimensional[i]];
                                }
                                if (a[multidimensional[i] + 'Input']) {
                                    a[multidimensional[i] + 'dropdownItems'] = $scope.dropDownItemsAutocomplete(toWatchModel, a[multidimensional[i] + 'Input']);
                                } else {
                                    a[multidimensional[i] + 'dropdownItems'] = a[multidimensional[i] + 'allDropdownItems'];
                                }
                            } else {
                                if ($scope[toWatchModel + 'Input']) {
                                    $scope[toWatchModel + 'dropdownItems'] = $scope.dropDownItemsAutocomplete(toWatchModel, $scope[toWatchModel + 'Input']);
                                } else {
                                    $scope[toWatchModel + 'dropdownItems']=$scope[toWatchModel + 'allDropdownItems']
                                }
                            }
                        }, 300);
                    }
                });

                $scope.mutiStButtonClick = function (modelId) {
                    //解决事件冲突
                    setTimeout(function () {
                        $('#' + modelId + 'Id').find('input').focus();
                    }, 1);
                };

                $scope.setStActive = function (itemIndex) {
                    $scope.activeItemIndex = itemIndex;
                };

                $scope.mutiSelectStItem = function (event, model, modelId, item) {
                    event.stopPropagation();
                    $scope.setStActive(null);
                    var modelTemp = model.replace(/\[/g, '.').replace(/\]/, '');
                    var dimen = modelTemp.indexOf('.');
                    //针对多维对象或数组对象
                    if (dimen != -1) {
                        var multidimensional = modelTemp.split('.');
                        var a = $scope;
                        for (var i = 0; i < multidimensional.length - 1; i++) {
                            a = a[multidimensional[i]];
                        }
                        if (!a[multidimensional[i]] || !a[multidimensional[i]].length) a[multidimensional[i]] = [];
                        for (var j = 0; j < a[multidimensional[i]].length; j++) {
                            if (a[multidimensional[i]][j].value == item.value)
                                return;
                        }
                        a[multidimensional[i]].push(item);
                        if (!a[multidimensional[i] + 'SelectString']){
                            a[multidimensional[i] + 'SelectString'] = item.label;
                            a[multidimensional[i] + 'SelectValue'] = item.value;
                        }
                        else{
                            a[multidimensional[i] + 'SelectString'] += ',' + item.label;
                            a[multidimensional[i] + 'SelectValue'] += ',' + item.value;
                        }
                        a[multidimensional[i] + 'Input'] = null;
                    } else {
                        if (!$scope[model] || !$scope[model].length) $scope[model] = [];
                      for (var j = 0; j < $scope[model] .length; j++) {
                        if ($scope[model][j].value == item.value)
                          return;
                      }
                        $scope[model].push(item);
                        if (!$scope[model + 'SelectString']){
                            $scope[model + 'SelectString'] = item.label;
                            $scope[model + 'SelectValue'] = item.value;
                        }else{
                            $scope[model + 'SelectString'] += ',' + item.label;
                            $scope[model + 'SelectValue'] += ',' + item.value;
                        }
                        $scope[model + 'Input'] = null;
                    }
                };

                $scope.mutiCleanSt = function (event, model, index) {
                    event.stopPropagation();
                    var modelTemp = model.replace(/\[/g, '.').replace(/\]/, '');
                    var dimen = modelTemp.indexOf('.');
                    //针对多维对象或数组对象
                    if (dimen != -1) {
                        var multidimensional = modelTemp.split('.');
                        var a = $scope;
                        for (var i = 0; i < multidimensional.length - 1; i++) {
                            a = a[multidimensional[i]];
                        }
                        a[multidimensional[i]].splice(index, 1);
                        var SelectStringTemp = a[multidimensional[i] + 'SelectString'].split(',');
                        SelectStringTemp.splice(index, 1);
                        a[multidimensional[i] + 'SelectString'] = SelectStringTemp.join(',');
                        var SelectValueTemp = a[multidimensional[i] + 'SelectValue'].split(',');
                        SelectValueTemp.splice(index, 1);
                        a[multidimensional[i] + 'SelectValue'] = SelectValueTemp.join(',');
                    } else {
                        $scope[model].splice(index, 1);
                        var SelectStringTemp = $scope[model + 'SelectString'].split(',');
                        SelectStringTemp.splice(index, 1);
                        $scope[model + 'SelectString'] = SelectStringTemp.join(',');
                        var SelectValueTemp = $scope[model + 'SelectValue'].split(',');
                        SelectValueTemp.splice(index, 1);
                        $scope[model + 'SelectValue'] = SelectValueTemp.join(',');
                    }
                };

                $scope.dropDownItemsAutocomplete = function (model, inputItem) {
                    var dropdownItemsTemp = [];
                    var allDropdownItemsTemp;
                    var params = {};
                    var modelTemp = model.replace(/\[/g, '.');
                    modelTemp = modelTemp.replace(/\]/, '');
                    var dimen = modelTemp.indexOf('.');
                    //针对多维对象或数组对象
                    if (dimen != -1) {
                        var multidimensional = modelTemp.split('.');
                        var a = $scope;
                        for (var i = 0; i < multidimensional.length - 1; i++) {
                            a = a[multidimensional[i]];
                        }
                        allDropdownItemsTemp = a[multidimensional[i] + 'allDropdownItems'];
                    } else {
                        allDropdownItemsTemp = $scope[model + 'allDropdownItems'];
                    }
                    if(allDropdownItemsTemp && allDropdownItemsTemp.length){
                        angular.forEach(allDropdownItemsTemp, function (item) {
                            if(item['label'].toLowerCase().indexOf(inputItem.toLowerCase()) === 0 ){
                                dropdownItemsTemp.push(item);
                            }
                        })
                    }
                    return dropdownItemsTemp;
                };
            }
        }
    });

