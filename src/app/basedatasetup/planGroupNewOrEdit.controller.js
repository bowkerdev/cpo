/**
 * Created by mac on 2017/12/13.
 */

(function() {
  'use strict';

  angular.module('cpo').controller('planGroupNewOrEditCtrl', function ($uibModalInstance,CommonService,$scope,$http,info) {

    $scope.title = info.title;
    $scope.fabricTypes = [{id:"WOVEN",label:"WOVEN"},{id:"KNIT",label:"KNIT"}];
    $scope.fabricType  = $scope.fabricTypes[0];
    $scope.type = info.type;
    $scope.factories = [];
    $scope.factory = {};
    if($scope.type=="edit"){
      if(info.select.knitWoven.toUpperCase()=="WOVEN"){
        $scope.fabricType  = $scope.fabricTypes[0];
      }else{
        $scope.fabricType  = $scope.fabricTypes[1];
      }
      $scope.apGroup =info.select.apGroup;
      $scope.productType =info.select.productType;
      $scope.apGroup =info.select.apGroup;
      $scope.planGroup =info.select.planGroup;
    }

    $scope.getFactoryList = function() {
      var _this = this;
      var param = {
        in_code: 'FACTORYWITHOUTSAMPLEROOM'
      }
      GLOBAL_Http($http, "cpo/api/sys/admindict/translate_code?", 'GET', param, function(data) {

        _this.factories  = data.FACTORYWITHOUTSAMPLEROOM.map(function(item){
          return {id:item.value,label:item.label}
        });
        var index = 0;
        angular.forEach( _this.factories,function(item,i){
          if(info.select&&item.id&&item.id.toUpperCase()==info.select.factSimpName.toUpperCase()){
            index = i;
          }
        })
        _this.factory = _this.factories[index];
      }, function(data) {
        modalAlert(CommonService, 3, $translate.instant('index.FAIL_GET_DATA'), null);
      });
    }
    $scope.getFactoryList();
    $scope.submit = function () {

      if(!$scope.productType){
        modalAlert(CommonService, 2, "Product Type-FR cannot be empty", null);
        return;
      }
      if(!$scope.apGroup){
        modalAlert(CommonService, 2, "AP Group cannot be empty", null);
        return;
      }
      if(!$scope.planGroup){
        modalAlert(CommonService, 2, "Plan Group cannot be empty", null);
        return;
      }
      var result = {
        factSimpName:$scope.factory.id.toUpperCase(),
        apGroup:$scope.apGroup.toUpperCase(),
        productType:$scope.productType.toUpperCase(),
        planGroup:$scope.planGroup.toUpperCase(),
        knitWoven:$scope.fabricType.id.toUpperCase()
      };
      switch ($scope.factory.id.toUpperCase()){
        case "BVN":
          result.apGroupCode="B-VIE";
          break;
        case "BVG":
          result.apGroupCode="B-BVG";
          break;
        case "BYS":
          result.apGroupCode="B-BYS";
          break;
        case "BCA":
          result.apGroupCode="CAME";
          break;
      }
      if($scope.type=="edit"){
        result.factoryGroupId = info.select.factoryGroupId;
      }
      $uibModalInstance.resolve(result);
      $uibModalInstance.dismiss();
    };
    $scope.dismiss = function(){
      $uibModalInstance.dismiss();
    }

  });


})();
