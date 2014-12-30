(function () {
    'use strict';

    var app = angular.module('quiz', ['ngRoute']);

    app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider
            .when('/questions', {
                templateUrl: 'app/views/questions.html',
                controller: 'QuestionController',
                controllerAs: 'quiz',
                resolve: {
                    quiz: ['dataContext', function (dataContext) {
                        return dataContext.getQuiz();
                    }]
                }
            })
            .when('/summary', {
                templateUrl: 'app/views/summary.html',
                controller: 'SummaryController',
                controllerAs: 'summary',
                resolve: {
                    quiz: ['dataContext', function (dataContext) {
                        return dataContext.getQuiz();
                    }]
                }
            })
            .otherwise({
                redirectTo: '/questions'
            });

    }]);
}());