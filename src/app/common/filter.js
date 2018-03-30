(function() {
  'use strict';

  angular
    .module('cpo')

    // 日期表示filter（年月日时分秒）
    .filter('dateFormatFilter_YYYYMMDDHHMMSS', ['$translate', '$filter',
      function ($translate, $filter) {
        return function (dateValue) {
          var dateDispFormat = $translate.instant('index.DATE_FORMAT_YYYYMMDDHHMMSS');
          return $filter("date")(dateValue, dateDispFormat);
        };
      }
    ])
    .filter('timeConvert', function(){
      return function(value,pa){
        if(!value){return "";}
        var date = (new Date(value)).toISOString().split("T")[0];
        return date;
      }
    })
})();
