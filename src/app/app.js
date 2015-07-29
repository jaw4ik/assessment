(function () {
    'use strict';
    var app = angular.module('assessment', ['ngRoute', 'pascalprecht.translate']);

    app.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: 'app/views/main.html',
                    controller: 'MainController',
                    controllerAs: 'assessment',
                    reloadOnSearch: false,
                    resolve: {
                        assessment: [
                            'dataContext', function (dataContext) {
                                return dataContext.getAssessment();
                            }
                        ]
                    }
                })
                .when('/summary', {
                    templateUrl: 'app/views/summary.html',
                    controller: 'SummaryController',
                    controllerAs: 'summary',
                    resolve: {
                        assessment: [
                            'dataContext', function (dataContext) {
                                return dataContext.getAssessment();
                            }
                        ]
                    }
                })
                .when('/error/404', {
                    templateUrl: 'app/views/notFoundError.html',
                    controller: 'NotFoundErrorController',
                    controllerAs: 'notFoundError',
                    resolve: {
                        assessment: [
                            'dataContext', function (dataContext) {
                                return dataContext.getAssessment();
                            }
                        ]
                    }
                })
                .otherwise({
                    redirectTo: '/error/404'
                });
        }
    ]).run([
        '$rootScope', '$location', 'settings', 'htmlTemplatesCache', '$templateCache', 'attemptsLimiter',
        function ($rootScope, $location, settings, htmlTemplatesCache, $templateCache, attemptsLimiter) {
            $rootScope.$on('$routeChangeStart', function (event, next) {
                var xApiEnabled = settings.xApi.enabled;
                if (xApiEnabled && !$rootScope.isXApiInitialized) {
                    forbidRedirects('/login');
                } 
                else if (!attemptsLimiter.hasAvailableAttempt()) {
                    forbidRedirects('/summary');
                }

                function forbidRedirects(urlHash) {
                    if (next.originalPath !== urlHash) {
                        $location.path(urlHash);
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
