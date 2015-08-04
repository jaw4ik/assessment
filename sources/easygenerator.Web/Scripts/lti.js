(function () {
    "use strict";

    window.lti = window.lti || {
        isAuthTokenPresent: isAuthTokenPresent,
        isForceLogoutKeyPresent: isForceLogoutKeyPresent,
        authenticate: authenticate
    };

    function authenticate() {
        return $.ajax({ url: '/lti/authenticate', type: 'POST' }).done(function(response) {
            if (response && response.success) {
                window.auth.login(response.data);
            }
        });
    }

    function isForceLogoutKeyPresent() {
        var hashParams = getHashParams(window.location.hash);
        return hashParams && hashParams.hasOwnProperty('logout');
    }

    function isAuthTokenPresent() {
        var hashParams = getHashParams(window.location.hash);
        return hashParams && !_.isNullOrUndefined(hashParams['token.lti']);
    }

    function getHashParams(queryString) {
        var query = (queryString || window.location.hash).substring(1);
        if (!query) {
            return false;
        }
        return _
        .chain(query.split('&'))
        .map(function (params) {
            var p = params.split('=');
            return [p[0], decodeURIComponent(p[1])];
        })
        .object()
        .value();
    }

}());