(function () {
    'use strict';

    var app = angular.module('quiz', ['ngRoute']);

    app.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/questions', {
                    templateUrl: 'views/questions.html',
                    controller: 'QuestionController',
                    controllerAs: 'quiz'
                })
                .when('/summary', {
                    templateUrl: 'views/summary.html',
                    controller: 'SummaryController',
                    controllerAs: 'summary'
                })
                .otherwise({
                    redirectTo: '/questions'
                });

        }]);

}());