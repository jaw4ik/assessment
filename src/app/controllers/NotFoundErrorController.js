(function() {
    'use strict';

    angular
        .module('quiz')
        .controller('NotFoundErrorController', ErrorController);

    ErrorController.$inject = ['$location', 'settings'];

    function ErrorController($location, settings) {
        var that = this;
        
        that.logoUrl = settings.logo.url;
        
        that.goHome = function() {
            $location.path('/');
        };
    }

}());