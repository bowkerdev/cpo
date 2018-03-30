(function() {
	'use strict';

	angular
		.module('cpo.core')
		.config(config)
		.config(languageConfig);

	/** @ngInject */
	function config($logProvider, AngularyticsProvider) {
		// Enable log
		$logProvider.debugEnabled(true);

		// Enable Google Analytics Tracking for SPA
		AngularyticsProvider.setEventHandlers(['Console', 'GoogleUniversal']);
	}
	languageConfig.$inject = ['$translateProvider'];

	function languageConfig($translateProvider) {
		// 设定浏览器语言
		$translateProvider.preferredLanguage(findLanguage());
		$translateProvider.fallbackLanguage('en-US');
		// 多语言文件定义
		$translateProvider.useStaticFilesLoader({
			prefix: 'assets/i18n/locale-',
			suffix: '.json'
		});

		//$translateProvider.preferredLanguage('en-GB');
		//$translateProvider.useLocalStorage();
	}

	// browser language
	function findLanguage() {
		try {
			var lang = (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0, 5);
			if(lang != 'zh-CN' && lang != 'en-US' && lang != 'en-GB') {
				return 'en-US';
			} else {
				return lang;
			}
		} catch(e) {
			return "en-US";
		}
	}
})();