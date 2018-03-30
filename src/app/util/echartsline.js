'use strict';

angular.module('app.echarts', [])
  .directive('line', function () {
    return {
      scope: {
        id: "@",
        legend: "=",
        item: "=",
        data: "="
      },
      restrict: 'E',
      template: '<div style="height:400px;"></div>',
      replace: true,
      link: function ($scope, element, attrs, controller) {
        var myChart = echarts.init(document.getElementById($scope.id));
        var option = {
         // 提示框，鼠标悬浮交互时的信息提示
         tooltip: {
         show: true,
         trigger: 'item'
         },
         // 图例
         legend: {
         data: $scope.legend
         },
         // 横轴坐标轴
         xAxis: [{
         type: 'category',
         data: $scope.item
         }],
         // 纵轴坐标轴
         yAxis: [{
         type: 'value'
         }],
         // 数据内容数组
         series: function(){
         var serie=[];
         for(var i=0;i<$scope.legend.length;i++){
         var item = {
         name : $scope.legend[i],
         type: 'line',
         data: $scope.data[i]
         };
         serie.push(item);
         }
         return serie;
         }()
         };
        myChart.setOption(option);
      }
    };
  });
