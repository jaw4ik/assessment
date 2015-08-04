(function () {
    'use strict';

    angular
        .module('assessment.xApi')
        .controller('XApiErrorController', ErrorsController);

    ErrorsController.$inject = ['$rootScope', '$location', '$routeParams', 'settings', 'xAPIManager', 'assessment'];

    function ErrorsController($rootScope, $location, $routeParams, settings, xAPIManager, assessment) {
        var that = this,
            backUrl = $routeParams.backUrl || '/';

        $rootScope.title = assessment.title;

        that.logoUrl = settings.logo.url;
        that.allowToContinue = !settings.xApi.required;

        that.restartCourse = function () {
            $rootScope.isXApiInitialized = false;
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