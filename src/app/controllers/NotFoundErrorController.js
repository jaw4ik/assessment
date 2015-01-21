(function() {
    'use strict';

    angular
        .module('quiz')
        .controller('NotFoundErrorController', ErrorController);

    ErrorController.$inject = ['$rootScope', '$location', 'settings', 'quiz'];

    function ErrorController($rootScope, $location, settings, quiz) {
        var that = this;

        $rootScope.title = '404 |' + quiz.title;
        
        that.logoUrl = settings.logo.url;
        
        that.goHome = function() {
            $location.path('/');
        };
    }

}());