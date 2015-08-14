(function () {
    'use strict';

    angular.module('bootstrapping').factory('authenticationTask', authenticationTask);

    authenticationTask.$inject = ['$q'];

    function authenticationTask($q) {
        var dfr = $q.defer(),
            username = getQueryStringValue('name'),
            email = getQueryStringValue('email');

        dfr.resolve({ username: username, email: email });

        return dfr.promise;
    }

    function getQueryStringValue(key) {
        var urlParams = window.location.search;
        var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
        var results = regex.exec(urlParams);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}());
