(function () {
  'use strict';
  angular
    .module('cpo')
    .service('factoryCapacityService', ['$http', '$translate', 'CommonService', '$uibModal',
      function ($http, $translate, CommonService, $uibModal) {



        this.initFactoryCapacityGridOption = function(scope) {

          var gridOptions1 = {
            data: "factoryCapacityData",
            enableColumnMenus: true,
            enableGridMenu: true,
            rowEditWaitInterval: -1,
            enableRowSelection: true,
            enableFullRowSelection: true,
            enableRowHeaderSelection: false,
            enableHorizontalScrollbar: 1,
            gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
            enableVerticalScrollbar: 0,
            // totalItems: scope.page.totalNum,
            enablePagination: false,
            useExternalPagination: false,
            enablePaginationControls: false,
            expandableRowTemplate: '<div class="sub-ui-grid" style="height: 230px" ui-grid-pagination ui-grid="row.entity.subGridOptions"></div>',
            expandableRowHeight: 230,
            expandableRowScope: {
              subGridVariable: 'subGridScopeVariable1'
            },
            columnDefs: [{
              name: 'factoryName',
              displayName: $translate.instant('worktable.FACTORY_NAME'),
              field: 'factoryName',
              minWidth: '120',
              enableCellEdit: false
            },


            ],
            onRegisterApi: function(gridApi) {

              gridApi.core.on.sortChanged(scope, function(grid, sortColumns) {
                if(sortColumns.length !== 0) {
                  if(sortColumns[0].sort.direction === 'asc') {
                    scope.page.sortDirection = true;
                  }
                  if(sortColumns[0].sort.direction === 'desc') {
                    scope.page.sortDirection = false;
                  }
                  scope.page.sortColumn = sortColumns[0].displayName;
                }
              });
              gridApi.pagination.on.paginationChanged(scope, function(newPage, pageSize) {
                scope.page.curPage = newPage;
                scope.page.pageSize = pageSize;
              });

              gridApi.expandable.on.rowExpandedStateChanged(scope, function(row) {
                if(row.isExpanded) {

                  var year = new Date().getFullYear();
                  var month = new Date().getMonth() + 1;
                  var key   = [
                    "productType",
                    "wovenKnit",
                    "capacity"  + year +  fix(month,2) + "01" ,
                    "fillRate"  + year + fix(month,2) + "01" ,
                    "capacity"  + year + fix(month,2) + "02" ,
                    "fillRate"  + year + fix(month,2) + "02" ,
                    "capacity"  + year + fix(month+1,2) + "01" ,
                    "fillRate"  + year + fix(month+1,2) + "01" ,
                    "capacity"  + year +  fix(month+1,2) + "02" ,
                    "fillRate"  + year +  fix(month+1,2) + "02" ,
                  ];
                  var name   = [
                    "Product Type",
                    "Woven Knit",
                    "Capacity"  + year +  fix(month,2) + "01" ,
                    "Fill Rate"  + year +  fix(month,2)+ "01" ,
                    "Capacity"  + year +  fix(month,2) + "02" ,
                    "Fill Rate"  + year +  fix(month,2) + "02" ,
                    "Capacity"  + year +  fix(month+1,2) + "01" ,
                    "Fill Rate"  + year +  fix(month+1,2) + "01" ,
                    "Capacity"  + year +  fix(month+1,2) + "02" ,
                    "Fill Rate"  + year +  fix(month+1,2) + "02" ,
                  ];
                  var columns = new Array();
                  for (var i = 0;i<8;i++){

                    var column =  {
                      name: name[i],
                      displayName: name[i],
                      field: key[i],
                      minWidth: '80',
                      enableCellEdit: false,
                    }
                    if(i==2||i==4||i==6){
                      column.cellTemplate = "<div class='ui-grid-cell-contents'>{{COL_FIELD CUSTOM_FILTERS|number}}</div>";
                    }
                    columns.push(column);
                  }
                  row.entity.subGridOptions = {
                    enableColumnMenus: true,
                    enableGridMenu: true,
                    rowEditWaitInterval: -1,
                    enableRowSelection: false,
                    enableRowHeaderSelection: false,
                    enableFullRowSelection: false,
                    enableHorizontalScrollbar: 1,
                    gridMenuCustomItems: CommonService.zsZoomGridMenuCustomItems(),
                    enableVerticalScrollbar: 0,
                    paginationPageSize: 5,
                    columnDefs: columns
                  };
                  row.entity.subGridOptions.data = row.entity.items;
                }
              });
            }
          };
          var year = new Date().getFullYear();
          var month = new Date().getMonth() + 1;
          for(var i = 0; i < 4; i++) {
            var capacity = {
              name: 'capacity' + i,
              displayName: $translate.instant('worktable.CAPACITY') + " " + year + fix(Math.floor((month + (i / 2))),2) + "0" + ((i % 2) + 1),
              field: "capacity"  + year +  fix( Math.floor((month + (i / 2))),2) + "0" + ((i % 2) + 1),
              minWidth: '140',
              enableCellEdit: false,
              cellTemplate:"<div class='ui-grid-cell-contents'>{{COL_FIELD CUSTOM_FILTERS|quantityFilter}}</div>"
            }
            var fillRate = {
              name: 'fillRate' + i,
              displayName: $translate.instant('worktable.FILL_RATE') + " " + year + fix(Math.floor((month + (i / 2))),2) + "0" + ((i % 2) + 1),
              field: "fillRate"  + year +  fix(Math.floor((month + (i / 2))),2) + "0" + ((i % 2) + 1),
              minWidth: '140',
              enableCellEdit: false
            }

            gridOptions1.columnDefs.push(capacity);
            gridOptions1.columnDefs.push(fillRate);

          }
          return gridOptions1;
        };
        this.dealWithFactoryCapacityData = function (data) {

          ;
//获取全部工厂名称
          var factories = new Array();
          data.output.forEach(function (value, index, array) {

            if (factories.indexOf(value.factoryName) == -1) {
              factories.push(value.factoryName)
            }
          })

//按工厂分类
          var allInfo = {};
          factories.forEach(function (value, index, array) {
            allInfo[value] = {items: new Array()};
          });

          data.output.forEach(function (value, index, array) {
            allInfo[value.factoryName].items.push(value);
          })


//构造
          for (var key in allInfo) {
            //获取月份
            var value = allInfo[key];
            var months = new Array();
            value.items.forEach(function (value2, index, array) {

              value2.factoryMonthLoadings.forEach(function (value3, index, array) {
                if (months.indexOf(value3.month) == -1) {
                  months.push(value3.month);
                }

              });

            });
            months.forEach(function (month, index, array) {

              allInfo[key]["frLoading"+month] = 0;
              allInfo[key]['capacity' + month] = 0;
              allInfo[key]["capacityByPcs"+month] = 0;
              allInfo[key]['curLoading'+month] = 0;
              allInfo[key]['curLoadingByPcs'+month] = 0;
              allInfo[key]['loading' + month] = 0;
              allInfo[key]["loadingByPcs"+month] = 0;
              allInfo[key]['fillRate' + month] = 0;
              allInfo[key]['fillRateByPcs' + month] = 0;
            });
          }

//统计


          for (var key in allInfo) {
            //获取月份
            var factory = allInfo[key];
            if(factory.factoryName=="BYS"){
              ;
            }
            factory.items.forEach(function (product, index, array) {


              product.factoryMonthLoadings.forEach(function (productMonthInfo, index, array) {

                factory['frLoading' + productMonthInfo.month] += parseFloat(productMonthInfo.frLoading);

                factory['capacity' + productMonthInfo.month] += parseFloat(productMonthInfo.capacity);
                factory['capacityByPcs' + productMonthInfo.month] += parseFloat(productMonthInfo.capacityByPcs);

                factory['loading' + productMonthInfo.month] += parseFloat(productMonthInfo.loading);
                factory["loadingByPcs"+productMonthInfo.month] += parseFloat(productMonthInfo.loadingByPcs);

                factory['curLoading' + productMonthInfo.month] += parseFloat(productMonthInfo.curLoading);
                factory['curLoadingByPcs' + productMonthInfo.month] += parseFloat(productMonthInfo.curLoadingByPcs);


                if (factory['capacity' + productMonthInfo.month] == 0) {
                  allInfo[key]['fillRate' + productMonthInfo.month] = 0;
                } else {
                  allInfo[key]['fillRate' + productMonthInfo.month] = parseFloat(factory['loading' + productMonthInfo.month] / factory['capacity' + productMonthInfo.month] * 100);
                }

                if (factory['capacityByPcs' + productMonthInfo.month] == 0) {
                  allInfo[key]['fillRateByPcs' + productMonthInfo.month] = 0;
                } else {
                  allInfo[key]['fillRateByPcs' + productMonthInfo.month] = parseFloat(factory['loadingByPcs' + productMonthInfo.month] / factory['capacityByPcs' + productMonthInfo.month] * 100);
                }

                allInfo[key]['over'+productMonthInfo.month] = allInfo[key]['fillRate' + productMonthInfo.month]>100;
                allInfo[key]['overByPcs'+productMonthInfo.month] =  allInfo[key]['fillRateByPcs' + productMonthInfo.month]>100;

                var num = new Number(allInfo[key]['fillRate' + productMonthInfo.month]);
                allInfo[key]['fillRate' + productMonthInfo.month] = num.toFixed(2)+"%";

                var num2 = new Number(allInfo[key]['fillRateByPcs' + productMonthInfo.month]);
                allInfo[key]['fillRateByPcs' + productMonthInfo.month] = num2.toFixed(2)+"%";

              });

            });
          }

          //构造能演示的数组
          var newArray = new Array();
          for (key in allInfo) {
            var newObject = allInfo[key];
            newObject.factoryName = key;
            newArray.push(newObject)
          }

          for (var index in newArray) {
            var factory = newArray[index];
            for (var index2 in factory.items) {
              var item = factory.items[index2];

            }
          }

          for (var index in newArray) {
            var factory = newArray[index];
            for (var index2 in factory.items) {
              var item = factory.items[index2];

              for (var index3 in item.factoryMonthLoadings) {

                var monthInfo = item.factoryMonthLoadings[index3];


                item['frLoading' + monthInfo.month] = monthInfo.frLoading;

                item['capacity' + monthInfo.month] = monthInfo.capacity;
                item['capacityByPcs' + monthInfo.month] = monthInfo.capacityByPcs;

                item['loading' + monthInfo.month] = monthInfo.loading;
                item['loadingByPcs' + monthInfo.month] = monthInfo.loadingByPcs;

                item['curLoading' + monthInfo.month] = monthInfo.curLoading ;
                item['curLoadingByPcs' + monthInfo.month] = monthInfo.curLoadingByPcs ;


                if (item['capacity' + monthInfo.month] == 0) {
                  item['fillRate' + monthInfo.month] = 0;
                } else {
                  item['fillRate' + monthInfo.month] = parseFloat(item['loading' + monthInfo.month] / item['capacity' + monthInfo.month] * 100);
                }
                item['over'+monthInfo.month] =  item['fillRate' + monthInfo.month]>100;
                var num = new Number(item['fillRate' + monthInfo.month]);
                item['fillRate' + monthInfo.month] = num.toFixed(2)+"%";


                if (item['capacityByPcs' + monthInfo.month] == 0) {
                  item['fillRateByPcs' + monthInfo.month] = 0;
                } else {
                  item['fillRateByPcs' + monthInfo.month] = parseFloat(item['loadingByPcs' + monthInfo.month] / item['capacityByPcs' + monthInfo.month] * 100);
                }
                item['overByPcs'+monthInfo.month] =  item['fillRateByPcs' + monthInfo.month]>100;
                var num2 = new Number(item['fillRateByPcs' + monthInfo.month]);
                item['fillRateByPcs' + monthInfo.month] = num2.toFixed(2)+"%";

              }

            }
          }
          console.log(newArray)

          ;
          return newArray;
        };
        this.dealWithProcessCapacityData = function (data) {
//获取全部工厂名称
          var factories = new Array();
          data.output.forEach(function (value, index, array) {

            if (factories.indexOf(value.factoryName) == -1) {
              factories.push(value.factoryName)
            }
          })

//按工厂分类
          var allInfo = {};
          factories.forEach(function (value, index, array) {
            allInfo[value] = {items: new Array()};
          });

          data.output.forEach(function (value, index, array) {
            allInfo[value.factoryName].items.push(value);
          })


//构造
          for (var key in allInfo) {
            //获取月份
            var value = allInfo[key];
            var months = new Array();
            value.items.forEach(function (value2, index, array) {

              value2.factoryProcessLoadings.forEach(function (value3, index, array) {
                if (months.indexOf(value3.month) == -1) {
                  months.push(value3.month);
                }

              });

            });
            months.forEach(function (month, index, array) {
              allInfo[key]["frLoading"+month] = 0;
              allInfo[key]['capacity' + month] = 0;
              allInfo[key]['fillRate' + month] = 0;
              allInfo[key]['loading' + month] = 0;
              allInfo[key]['curLoading'+month] = 0;
            });
          }

//统计
          for (var key in allInfo) {
            //获取月份
            var factory = allInfo[key];
            factory.items.forEach(function (product, index, array) {


              product.factoryProcessLoadings.forEach(function (productMonthInfo, index, array) {

                factory['capacity' + productMonthInfo.month] += parseFloat(productMonthInfo.capacity?productMonthInfo.capacity:0);

                if(productMonthInfo.month =="20170901"&&key =="BCA"){

                  console.log(parseFloat(productMonthInfo.curLoading?productMonthInfo.curLoading:0));
                }
                factory['frLoading' + productMonthInfo.month] += parseFloat(productMonthInfo.frLoading?productMonthInfo.frLoading:0);
                factory['loading' + productMonthInfo.month] += parseFloat(productMonthInfo.loading?productMonthInfo.loading:0);
                factory['curLoading' + productMonthInfo.month] += parseFloat(productMonthInfo.curLoading?productMonthInfo.curLoading:0);
                if (factory['capacity' + productMonthInfo.month] == 0) {
                  allInfo[key]['fillRate' + productMonthInfo.month] = 0;
                } else {
                  allInfo[key]['fillRate' + productMonthInfo.month] = parseFloat((factory['loading' + productMonthInfo.month]) / factory['capacity' + productMonthInfo.month] * 100);
                }
                allInfo[key]['over'+productMonthInfo.month] =  allInfo[key]['fillRate' + productMonthInfo.month]>100;

                var num = new Number(allInfo[key]['fillRate' + productMonthInfo.month]);
                allInfo[key]['fillRate' + productMonthInfo.month] = num.toFixed(2)+"%";

              });

            });
          }

          //构造能演示的数组
          var newArray = new Array();
          for (key in allInfo) {
            var newObject = allInfo[key];
            newObject.factoryName = key;
            newArray.push(newObject)
          }



          for (var index in newArray) {
            var factory = newArray[index];
            for (var index2 in factory.items) {
              var item = factory.items[index2];

              for (var index3 in item.factoryProcessLoadings) {
                var monthInfo = item.factoryProcessLoadings[index3];
                item['capacity' + monthInfo.month] = monthInfo.capacity?monthInfo.capacity:0;
                item['frLoading' + monthInfo.month] = monthInfo.frLoading?monthInfo.frLoading:0;
                item['loading' + monthInfo.month] = monthInfo.loading?monthInfo.loading:0;
                item['curLoading' + monthInfo.month] = monthInfo.curLoading?monthInfo.curLoading:0 ;


                if (item['capacity' + monthInfo.month] == 0) {
                  item['fillRate' + monthInfo.month] = 0;
                } else {
                  item['fillRate' + monthInfo.month] = parseFloat(item['loading' + monthInfo.month] / item['capacity' + monthInfo.month] * 100);
                }
                item['over'+monthInfo.month] = item['fillRate' + monthInfo.month]>100;

                var num = new Number(item['fillRate' + monthInfo.month]);
                item['fillRate' + monthInfo.month] = num.toFixed(2)+"%";
              }

            }
          }

          return newArray;
        };
        this.dealWithSampleRoomCapacityData = function (data) {
//获取全部工厂名称
          var factories = new Array();
          data.output.forEach(function (value, index, array) {

            if (factories.indexOf(value.factoryName) == -1) {
              factories.push(value.factoryName)
            }
          })

//按工厂分类
          var allInfo = {};
          factories.forEach(function (value, index, array) {
            allInfo[value] = {items: new Array()};
          });

          data.output.forEach(function (value, index, array) {
            allInfo[value.factoryName].items.push(value);
          })


//构造
          for (var key in allInfo) {
            //获取月份
            var value = allInfo[key];
            var months = new Array();
            value.items.forEach(function (value2, index, array) {

              value2.factoryMonthLoadings.forEach(function (value3, index, array) {
                if (months.indexOf(value3.month) == -1) {
                  months.push(value3.month);
                }

              });

            });
            months.forEach(function (month, index, array) {
              allInfo[key]['capacity' + month] = 0;
              allInfo[key]['fillRate' + month] = 0;
              allInfo[key]['loading' + month] = 0;
              allInfo[key]['curLoading'+month] = 0;
            });
          }

//统计


          for (var key in allInfo) {
            //获取月份
            var factory = allInfo[key];
            factory.items.forEach(function (product, index, array) {


              product.factoryMonthLoadings.forEach(function (productMonthInfo, index, array) {

                factory['capacity' + productMonthInfo.month] += parseFloat(productMonthInfo.capacity);
                factory['loading' + productMonthInfo.month] += parseFloat(productMonthInfo.loading);
                factory['curLoading' + productMonthInfo.month] += parseFloat(productMonthInfo.curLoading);
                if (factory['capacity' + productMonthInfo.month] == 0) {
                  allInfo[key]['fillRate' + productMonthInfo.month] = 0;
                } else {
                  allInfo[key]['fillRate' + productMonthInfo.month] = parseFloat((factory['loading' + productMonthInfo.month]+factory['curLoading' + productMonthInfo.month]) / factory['capacity' + productMonthInfo.month] * 100);
                }
                allInfo[key]['over'+productMonthInfo.month] =  allInfo[key]['fillRate' + productMonthInfo.month]>100;
                var num = new Number(allInfo[key]['fillRate' + productMonthInfo.month]);
                allInfo[key]['fillRate' + productMonthInfo.month] = num.toFixed(2)+"%";

              });

            });
          }

          //构造能演示的数组
          var newArray = new Array();
          for (key in allInfo) {
            var newObject = allInfo[key];
            newObject.factoryName = key;
            newArray.push(newObject)
          }

          for (var index in newArray) {
            var factory = newArray[index];
            for (var index2 in factory.items) {
              var item = factory.items[index2];

            }
          }

          for (var index in newArray) {
            var factory = newArray[index];
            for (var index2 in factory.items) {
              var item = factory.items[index2];

              for (var index3 in item.factoryMonthLoadings) {
                var monthInfo = item.factoryMonthLoadings[index3];
                item['capacity' + monthInfo.month] = monthInfo.capacity;
                item['fillRate' + monthInfo.month] = monthInfo.fillRate + '%';
                item['loading' + monthInfo.month] = monthInfo.loading;
                item['curLoading' + monthInfo.month] = monthInfo.curLoading ;
                item['over'+monthInfo.month] = monthInfo.fillRate>100;
              }

            }
          }

          return newArray;
        };

      }
    ])

})();
