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
                        return dataContext.initialize();
                    }
                }
            })
            .when('/summary', {
                templateUrl: 'views/summary.html',
                controller: 'SummaryController',
                controllerAs: 'summary',
                resolve: {
                    questions: function (dataContext) {
                        return dataContext.initialize();
                    }
                }
            })
            .otherwise({
                redirectTo: '/questions'
            });

    }]);

    app.directive('tooltip', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/widgets/tooltip.html',
            transclude: true,
        };
    });

}());