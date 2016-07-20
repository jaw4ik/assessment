(function () {
    var tokenNamespace = 'token.';
    var cookieTokens = ['preview', 'upgradeAccount', 'saml'];
    var requiredEndpoints = ['api', 'auth', 'storage', 'signalr', 'preview', 'upgradeAccount', 'settings', 'saml'];

    var localStorageProvider = window.localStorageProvider;

    window.auth = window.auth || {
        checkUserLogIn: checkUserLogIn,
        login: login,
        logout: logout,
        getToken: getToken,
        getHeader: getHeader,
        getRequiredEndpoints: getRequiredEndpoints,
        isAuthTokenPresentInHash: isAuthTokenPresentInHash,
        loginByAuthToken: loginByAuthToken,
        getCompanyIdFromHash: getCompanyIdFromHash,
        getLtiUserInfoTokenFromHash: getLtiUserInfoTokenFromHash,
        getSamlIdPUserInfoTokenFromHash: getSamlIdPUserInfoTokenFromHash
    };

    function isAuthTokenPresentInHash() {
        var hashParams = getHashParams(window.location.hash);
        return hashParams && (!_.isNullOrUndefined(hashParams['token.lti']) || !_.isNullOrUndefined(hashParams['token.samlAuth']));
    }

    function loginByAuthToken() {
        var hashParams = getHashParams(window.location.hash);
        var authToken = hashParams['token.lti'] || hashParams['token.samlAuth'];

        return Q.promise(function(resolve, reject) {
            $.ajax({
                url: '/auth/tokens',
                type: 'POST',
                data: { endpoints: requiredEndpoints },
                headers: {
                    'Authorization': 'Bearer ' + authToken, 'cache-control': 'no-cache'
                }
            }).done(function (response) {
                if (response && response.success) {
                    setTokens(response.data).then(function () {
                        resolve(true);
                    });
                    return;
                }
                resolve(false);
            }).fail(function(reason) {
                reject(reason);
            });
        });
    }

    function getLtiUserInfoTokenFromHash() {
        var hashParams = getHashParams(window.location.hash);
        return hashParams && hashParams['token.user.lti'];
    }

    function getSamlIdPUserInfoTokenFromHash() {
        var hashParams = getHashParams(window.location.hash);
        return hashParams && hashParams['token.user.saml'];
    }

    function getCompanyIdFromHash() {
        var hashParams = getHashParams(window.location.hash);
        return hashParams && hashParams['companyId'];
    }

    function checkUserLogIn() {
        var getTokensPromises = [];
        for (var i = 0; i < requiredEndpoints.length; i++) {
            getTokensPromises.push(getToken(requiredEndpoints[i]));
        }
        return Q.all(getTokensPromises).then(function (values) {
            var index;
            // check tokens in storage
            for (index = 0; index < values.length; index++) {
                if (values[index] === null) {
                    return false;
                }
            }
            // check tokens in cookie
            for (index = 0; index < cookieTokens.length; index++) {
                if (getCookieToken(cookieTokens[index]) === undefined) {
                    return false;
                }
            }
            return true;
        }).fail(function() {
            return false;
        });
    }

    function login(tokens) {
        var defer = Q.defer();
        if (!tokens || !tokens.length) defer.resolve(false);
        else {
            var tokenEndpoints = tokens.map(function (token) { return token.Endpoint; });
            if (!requiredEndpoints.every(function(endpoint) { return tokenEndpoints.indexOf(endpoint) > -1; })) defer.resolve(false);
            else {
                setTokens(tokens).then(function () {
                    defer.resolve(true);
                }).fail(function () {
                    defer.resolve(false);
                });
            }
        }
        return defer.promise;
    }

    function logout() {
        return removeTokens();
    }

    function setToken(name, value) {
        return localStorageProvider.setItem(tokenNamespace + name, value);
    }

    function getToken(name) {
        return localStorageProvider.getItem(tokenNamespace + name);
    }

    function getHeader(endpoints) {
        return getToken(endpoints).then(function(value) {
            return { 'Authorization': 'Bearer ' + value };
        });
    }

    function getRequiredEndpoints() {
        return requiredEndpoints;
    }

    //private

    function setTokens(tokens) {
        var setTokenPromises = [];
        for (var index = 0; index < tokens.length; index++) {
            var t = tokens[index];
            if (cookieTokens.indexOf(t.Endpoint) > -1) {
                var d = new Date();
                d.setTime(d.getTime() + 2592000000);
                var expires = "expires=" + d.toUTCString();
                document.cookie = tokenNamespace + t.Endpoint + '=' + t.Token + "; " + expires;
            }
            setTokenPromises.push(setToken(t.Endpoint, t.Token));
        }
        return Q.all(setTokenPromises);
    }

    function removeTokens() {
        var index;
        var removeTokenPromises = [];
        for (index = 0; index < cookieTokens.length; index++) {
            document.cookie = tokenNamespace + cookieTokens[index] + '=;expires=Wed 01 Jan 1970';
        }
        for (index = 0; index < requiredEndpoints.length; index++) {
            removeTokenPromises.push(localStorageProvider.removeItem(tokenNamespace + requiredEndpoints[index]));
        }
        return Q.all(removeTokenPromises);
    }

    function getCookieToken(cname) {
        var name = tokenNamespace + cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return undefined;
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