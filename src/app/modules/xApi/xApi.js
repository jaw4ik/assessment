(function () {
    'use strict';

    var app = angular.module('quiz.xApi', ['ngRoute']);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'app/modules/xApi/views/login.html',
                controller: 'XApiLoginController',
                controllerAs: 'login',
                resolve: {
                    quiz: ['dataContext', function (dataContext) {
                        return dataContext.getQuiz();
                    }]
                }
            })
            .when('/error/xapi/:backUrl?', {
                templateUrl: 'app/modules/xApi/views/xApiError.html',
                controller: 'XApiErrorController',
                controllerAs: 'xApiError'
            });
    }]);

}());