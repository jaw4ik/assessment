(function () {
    'use strict';

    angular.module('assessment.xApi').factory('errorsHandler', errorsHandler);

    errorsHandler.$inject = ['$location', '$timeout'];

    function errorsHandler($location, $timeout) {
        return {
            handleError: handleError
        };

        function handleError() {
            if ($location.hash().indexOf('/error/xapi') !== -1) {
                return;
            }
            var hash = $location.hash().slice(1, $location.hash().length);

            var navigateUrl = '/error/xapi' + encodeURIComponent(_.isEmpty(hash) ? '' : hash);
            $timeout(function () {
                $location.path(navigateUrl).replace();
            }, 100);
        }
    }
}());