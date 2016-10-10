(function () {
    'use strict';

    var app = angular.module('assessment.xApi', ['ngRoute']);

    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
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