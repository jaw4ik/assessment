(function () {
	"use strict";
	
    angular.module('assessment')
		.service('htmlContentLoader', htmlContentLoader);
	
	htmlContentLoader.$inject = ['$http'];
	
	function htmlContentLoader($http) {
		return {
			load: function (url) {
				return $http.get(url, { dataType: 'html' });
			}
		};
	}
	
})();