(function () {
    'use strict';

    angular
        .module('quiz.xApi')
        .controller('XApiErrorController', ErrorsController);

    ErrorsController.$inject = ['$rootScope', '$location', '$routeParams', 'settings', 'xAPIManager', 'quiz'];

    function ErrorsController($rootScope, $location, $routeParams, settings, xAPIManager, quiz) {
        var that = this,
            backUrl = $routeParams.backUrl || '/';

        $rootScope.title = quiz.title;

        that.logoUrl = settings.logo.url;

        that.restartCourse = function () {
            $rootScope.isCourseStarted = false;
            $location.path('/').replace();
        };

        that.continue = function () {
            xAPIManager.off();
            $location.path(backUrl);
        };
    }

}());