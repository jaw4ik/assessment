(function (angular, _, angularDragula) {
    'use strict';
    
    var app = angular.module('assessment', ['ngRoute', 'pascalprecht.translate', angularDragula(angular)]);

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
				if (isXapiDisabled()) {
					settings.xApi.enabled = false;
                }

                var xApiEnabled = settings.xApi.enabled;
                if (xApiEnabled && !$rootScope.isXApiInitialized) {
                    forbidRedirects('/login');
                } 
                else if (!attemptsLimiter.hasAvailableAttempt()) {
                    forbidRedirects('/summary');
                }
				
				function isXapiDisabled() {
					var xapi = getQueryStringValue('xapi');
					return !settings.xApi.required && !_.isNull(xapi) && !_.isUndefined(xapi) && xapi.toLowerCase() === 'false';
				}
				
				function getQueryStringValue(key) {
					var urlParams = window.location.search;
					var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
					var results = regex.exec(urlParams);
					return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
})(window.angular, window._, window.angularDragula);


