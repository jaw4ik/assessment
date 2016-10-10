(function () {
    'use strict';

    angular
        .module('assessment')
        .controller('NoAccessController', NoAccessController);

    NoAccessController.$inject = ['$rootScope', '$location', 'settings', 'assessment', 'userContext'];

    function NoAccessController($rootScope, $location, settings, assessment, userContext) {
        var that = this;

        $rootScope.title = 'Access limited |' + assessment.title;

        that.logoUrl = settings.logo.url;

        that.goToLogin = function () {
            $rootScope.skipLoginGuard = false;
            userContext.clear();
            $location.path('/login');
        };
    }

}());