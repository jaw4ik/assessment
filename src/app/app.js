(function () {
    'use strict';

    var app = angular.module('quiz', ['ngRoute']);

    app.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/questions', {
                    templateUrl: 'views/questions.html',
                    controller: 'QuizController',
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

    app.filter('pad', function () {
        return function (number, length) {
            var str = number + '';
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        };
    });

    app.directive('singleselectText', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/singleSelectText.html'
        };
    });

    app.directive('dragAndDropText', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/dragAndDropText.html'
        };
    });

    app.directive('statement', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/statement.html'
        };
    });

}());