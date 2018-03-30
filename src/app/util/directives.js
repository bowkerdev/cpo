'use strict';

angular.module('app.directives', [])
    .directive('ngTime', function() {
    return {
        restrict : 'A',
        require : '?ngModel',
        link : function($scope, $element, $attrs, $ngModel) {
            if (!$ngModel) {
                return;
            }
            $('.form_datetime').datetimepicker({
                weekStart: 0,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                forceParse: 0,
                showMeridian: 1
            });
            $('.form_datemonth').datetimepicker({
                weekStart: 0,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 0,
                startView: 3,
                minView: 3,
                maxView: 4,
                forceParse: 0
            });
            $('.form_date').datetimepicker({
                weekStart: 0,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                forceParse: 0
            });
            $('.form_time').datetimepicker({
                weekStart: 0,
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 1,
                minView: 0,
                maxView: 1,
                forceParse: 0
            });
            $('.form_year').datetimepicker({
                weekStart: 0,
                todayBtn:  0,
                autoclose: 1,
                todayHighlight: 0,
                startView: 4,
                minView: 4,
                maxView: 4,
                forceParse: 0
            });
        },
    };
})
  .directive('limitTo', function() {
  return {
    restrict: "A",
    link: function(scope, elem, attrs) {
      var limit = parseInt(attrs.limitTo);
      angular.element(elem).on("keypress", function(e) {
        if (this.value.length == limit && e.which !== 8) e.preventDefault();
      });
    }
  }
});
