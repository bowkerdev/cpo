(function() {
	'use strict';
	angular
	.module('cpo')
  .service('externalUrlService', ['$http',
  	function($http) {
      this.getExternalUrl = function(){
          return this.externalUrl || null;
      }

      this.setExternalUrl = function(url){
          this.externalUrl = url;
      }
  	}
  ])
	.controller('ExternalPageController', ['$scope', 'externalUrlService', '$location',
	function($scope, externalUrlService, $location) {
		var token = window.localStorage ? localStorage.getItem("token") : Cookie.read("token");
		var suffixer = 'token='+token;
		document.cookie = 'token='+token;
		var externalURL = externalUrlService.getExternalUrl();
		if(token){
			if(externalURL.indexOf('?') > -1){
				suffixer = '&'+suffixer;
			}else{
				suffixer = '?'+suffixer;
			}
			externalURL += suffixer;
		}
		document.getElementById('externalIframe').src = externalURL;
	}])

})();
