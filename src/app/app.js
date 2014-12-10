(function () {
    'use strict';

    var app = angular.module('quiz', ['ngRoute']);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/questions', {
                templateUrl: 'views/questions.html',
                controller: 'QuestionController',
                controllerAs: 'quiz',
                resolve: {
                    questions: function (dataContext) {
                        return dataContext.getQuiz();
                    }
                }
            })
            .when('/summary', {
                templateUrl: 'views/summary.html',
                controller: 'SummaryController',
                controllerAs: 'summary',
                resolve: {
                    questions: function (dataContext) {
                        return dataContext.getQuiz();
                    }
                }
            })
            .otherwise({
                redirectTo: '/questions'
            });

    }]);

    WebFont.load({
        custom: {
            families: ['RobotoslabRegular', 'RobotoslabBold', 'Rabiohead', 'RobotoslabLight', 'TwCenMTCondensed', 'RobotoBold'],
            urls: ['../css/fonts.css']
        },
        active: function () {
            angular.bootstrap(document, ['quiz']);
        }
    });

}());