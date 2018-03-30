/**
 * Created by mac on 2017/11/17.
 */
(function() {
  'use strict';

  angular
    .module('cpo').directive('loading', function() {
    return {
      restrict: 'E',
      template: function(tElement,attrs){
        var _html = '';

        _html +=  ' <div class="well grid-loading" ng-show="'+attrs.show+'">\
      <i class="fa fa-spin fa-spinner"></i>\
      <strong>Loading...</strong>\
      </div>';
        return _html;
      },

      replace: true
    };
  });
  angular
    .module('cpo').directive('selectSize', function() {
    return {
      link : function ( scope , element ) {


        angular.element(element).bind('focus', function(){

          angular.element(this).attr("size",3)
        });
        angular.element(element).bind('blur', function(){
          angular.element(this).removeAttr("size")
        });
        angular.element(element).bind('click', function(){
          angular.element(this).removeAttr("size")
        });
      }
    }
  });
  angular
    .module('cpo')
    .directive("hightAutoFillBottom" , ['$window',function ($window) {
      return {
        link : function ( scope , element ) {

          scope.autoFillButtom = function(){


            var height = window.innerHeight - angular.element(element[ 0 ]).offset().top-20;
            height = height>385?height:385;
            return {height:height+"px"};
          }

          angular.element($window).bind('resize', function(){
            var height = window.innerHeight - angular.element(element[ 0 ]).offset().top-20;
            height = height>385?height:385;
            angular.element(element).height(height);
          });//
          setTimeout(function(){
            var height = window.innerHeight - angular.element(element[ 0 ]).offset().top-20;
            height = height>385?height:385;
            angular.element(element).height(height);
          },500);

        }
      }
    }]);

  angular
    .module('cpo')
    .directive("commonDirectiveFunction" , function () {
      return {
        link : function ( scope , element ) {
          //使用方法 ng-style="getLeftSpaceHeight()" common-directive-function

          angular.element(element).height( window.innerHeight-200)
       //   angular.element(element).style.height = window.innerHeight;
          scope.getLeftSpaceHeight = function(minHeight){
            var height = (window.innerHeight - angular.element(element[ 0 ]).offset().top-20);
            if(minHeight>height){
              height = minHeight;
            }
            return height;
          }
        }

      }
    });

}());
