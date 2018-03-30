(function () {
  'use strict';
  angular
    .module('cpo')
    .service('dashboardService', ['$http', '$translate', 'CommonService', '$uibModal',
      function ($http, $translate, CommonService, $uibModal) {

        this.init = function (scope) {
          scope.legend = ["PH值","溶解氧","电导率","温度值","浊度值"];
          scope.item = ["8:45","8:47","8:49","8:51","8:53","8:55","8:57","8:59"];
          scope.data = [
            ["7.95","7.71","7.16","7.77","7.99","7.76","7.91","7.76"],
            ["8.42","32.23","33.44","17.16","7.08","7.29","7.18","7.3"],
            ["257.85","254.65","253","279.8","206.6","271.08","286.24","263.5"],
            ["25.75","20.46","21.05","20.58","20.7","20.58","20.45","20.58"],
            ["8.08","3.83","2.79","6.39","7.75","7.81","7.58","7.81"]
          ];
          scope.legend1 = ['最高气温','最低气温'];
          scope.item1 =  ['周一','周二','周三','周四','周五','周六','周日'];
          scope.data1 = [
             ["11", "11", "15", "13", "12", "13", "10"],
             ["1","-2", "2", "5", "3", "2", "0"]
          ];


        };

      }
    ])
    .controller('dashBoardCtrl', ['$scope', 'dashboardService',
      function ($scope, dashboardService) {
        dashboardService.init($scope);
      }
    ])
})();

