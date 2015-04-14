(function () {
    'use strict';
    var app = angular.module('quiz', ['ngRoute', 'pascalprecht.translate']);

    app.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'app/views/main.html',
                    controller: 'MainController',
                    controllerAs: 'quiz',
                    reloadOnSearch: false,
                    resolve: {
                        quiz: [
                            'dataContext', function (dataContext) {
                                return dataContext.getQuiz();
                            }
                        ]
                    }
                })
                .when('/summary', {
                    templateUrl: 'app/views/summary.html',
                    controller: 'SummaryController',
                    controllerAs: 'summary',
                    resolve: {
                        quiz: [
                            'dataContext', function (dataContext) {
                                return dataContext.getQuiz();
                            }
                        ]
                    }
                })
                .when('/error/404', {
                    templateUrl: 'app/views/notFoundError.html',
                    controller: 'NotFoundErrorController',
                    controllerAs: 'notFoundError',
                    resolve: {
                        quiz: [
                            'dataContext', function (dataContext) {
                                return dataContext.getQuiz();
                            }
                        ]
                    }
                })
                .otherwise({
                    redirectTo: '/error/404'
                });
        }
    ]).run([
        '$rootScope', '$location', 'settings', 'htmlTemplatesCache', '$templateCache', function ($rootScope, $location, settings, htmlTemplatesCache, $templateCache) {
            $rootScope.$on('$routeChangeStart', function (event, next) {
                var xApiEnabled = settings.xApi.enabled;
                if (xApiEnabled && !$rootScope.isCourseStarted) {
                    if (next.originalPath !== '/login') {
                        $location.path('/login');
                    }
                }
            });

            $rootScope.$on('$viewContentLoaded', function () {
                $rootScope.isVisible = true;
            });

            _.each(htmlTemplatesCache, function (template) {
                $templateCache.put(template.key, template.value);
            });
        }
    ]);
})();
