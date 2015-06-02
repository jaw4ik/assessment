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
        that.allowToContinue = !settings.xApi.required;

        that.restartCourse = function () {
            $rootScope.isCourseStarted = false;
            $location.path('/').replace();
        };

        that.continue = function () {
            if (!that.allowToContinue) {
                return;
            }
            xAPIManager.off();
            $location.path(backUrl);
        };
    }

}());