/* global moment:false */
(function() {
  'use strict';

  angular
    .module('cpo.core')
    .constant('moment', moment)
    .constant('COMMON_CONFIG', COMMON_CONFIG);

  var COMMON_CONFIG = {
    'BASE_URL': 'http://localhost:3000/',

    'NOT_EXIST_API_STATUS_CODE': 'OTHER',
    //  message parameter 接头字符
    'MESSAGE_PARAM_HEADER': '$',
    'KEY_NAME_ERROR_API_MSG': 'errorAPIMsg'
  }

})();