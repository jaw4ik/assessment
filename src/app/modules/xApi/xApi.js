(function () {
    'use strict';

    var app = angular.module('assessment.xApi', ['ngRoute']);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/modules/xApi/views/login.html',
                controller: 'XApiLoginController',
                controllerAs: 'login',
                resolve: {
                    assessment: ['dataContext', function (dataContext) {
                        return dataContext.getAssessment();
                    }]
                }
            })
            .when('/error/xapi/:backUrl?', {
                templateUrl: 'app/modules/xApi/views/xApiError.html',
                controller: 'XApiErrorController',
                controllerAs: 'xApiError',
                resolve: {
                    assessment: ['dataContext', function (dataContext) {
                        return dataContext.getAssessment();
                    }]
                }
            });
    }]);

}());