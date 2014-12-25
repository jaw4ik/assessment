(function () {
    'use strict';
    debugger;
    var app = angular.module('notSupportedBrowser', ['ngRoute']);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/notSupportedBrowser', {
                templateUrl: 'views/notSupportedBrowser.html',
                controller: 'notSupportedBrowserController',
                controllerAs: 'notSupportedBrowser'
            })
            .otherwise({
                redirectTo: '/notSupportedBrowser'
            });
    }]);
}());