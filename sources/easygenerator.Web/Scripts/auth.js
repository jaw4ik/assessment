(function () {
    var tokenNamespace = 'token.';
    var cookieTokens = ['preview', 'upgradeAccount'];
    var requiredEndpoints = ['api', 'auth', 'storage', 'signalr', 'preview', 'upgradeAccount', 'settings'];

    window.auth = window.auth || {
        isUserLoggedIn: isUserLoggedIn,
        login: login,
        logout: logout,
        getToken: getToken,
        getHeader: getHeader,
        getRequiredEndpoints: getRequiredEndpoints,
        isAuthTokenPresentInHash: isAuthTokenPresentInHash,
        loginByAuthToken: loginByAuthToken,
        getCompanyIdFromHash: getCompanyIdFromHash,
        getLtiUserInfoTokenFromHash: getLtiUserInfoTokenFromHash
    };

    function isAuthTokenPresentInHash() {
        var hashParams = getHashParams(window.location.hash);
        return hashParams && !_.isNullOrUndefined(hashParams['token.lti']);
    }

    function loginByAuthToken() {
        var hashParams = getHashParams(window.location.hash);
        var authToken = hashParams['token.lti'];
        
        return $.ajax({
            url: '/auth/tokens',
            type: 'POST',
            data: { endpoints: requiredEndpoints },
            headers: {
                'Authorization': 'Bearer ' + authToken, 'cache-control': 'no-cache'
            }
        }).done(function (response) {
            if (response && response.success) {
                setTokens(response.data);
            }
        });
    }

    function getLtiUserInfoTokenFromHash() {
        var hashParams = getHashParams(window.location.hash);
        return hashParams && hashParams['token.user.lti'];
    }

    function getCompanyIdFromHash() {
        var hashParams = getHashParams(window.location.hash);
        return hashParams && hashParams['companyId'];
    }

    function isUserLoggedIn() {
        var index;
        // check tokens in storage
        for (index = 0; index < requiredEndpoints.length; index++) {
            if (token(requiredEndpoints[index]) === undefined) {
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
    }

    function login(tokens) {
        if (tokens && tokens.length) {
            var tokenEndpoints = tokens.map(function (token) { return token.Endpoint; });
            if (requiredEndpoints.every(function (endpoint) { return tokenEndpoints.indexOf(endpoint) > -1; })) {
                setTokens(tokens);
                return true;
            }
        }
        return false;
    }

    function logout() {
        removeTokens();
    }

    function getToken(endpoints) {
        return token(endpoints);
    }

    function getHeader(endpoints) {
        return { 'Authorization': 'Bearer ' + token(endpoints) };
    }

    function getRequiredEndpoints() {
        return requiredEndpoints;
    }

    //private

    function setTokens(tokens) {
        for (var index = 0; index < tokens.length; index++) {
            var t = tokens[index];
            if (cookieTokens.indexOf(t.Endpoint) > -1) {
                var d = new Date();
                d.setTime(d.getTime() + 2592000000);
                var expires = "expires=" + d.toUTCString();
                document.cookie = tokenNamespace + t.Endpoint + '=' + t.Token + "; " + expires;
            }
            token(t.Endpoint, t.Token);
        }
    }

    function removeTokens() {
        var index;
        for (index = 0; index < requiredEndpoints.length; index++) {
            if (token(requiredEndpoints[index]) !== undefined) {
                localStorage.removeItem(tokenNamespace + requiredEndpoints[index]);
            }
        }

        for (index = 0; index < cookieTokens.length; index++) {
            document.cookie = tokenNamespace + cookieTokens[index] + '=;expires=Wed 01 Jan 1970';
        }
    }

    function token(name, value) {
        if (value !== undefined) {
            localStorage.setItem(tokenNamespace + name, value);
        }
        return localStorage[tokenNamespace + name];
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