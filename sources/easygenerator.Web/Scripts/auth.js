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
        getRequiredEndpoints: getRequiredEndpoints
    };

    function isUserLoggedIn() {
        var index;
        // check tokens in storage
        for (index = 0; index < requiredEndpoints.length; index++) {
            if (token(requiredEndpoints[index]) === undefined) {
                return false;
            }
        }
        // check tokens in cookie
        for (index = 0; index < cookieTokens; index++) {
            if (getCookie(cookieTokens[index]) === undefined) {
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
        return requiredEndpoints.join(' ');
    }

    //private
  
    function setTokens(tokens) {
        for (var index = 0; index < tokens.length; index++) {
            var t = tokens[index];
            if (cookieTokens.indexOf(t.Endpoint) > -1) {
                document.cookie = tokenNamespace + t.Endpoint + '=' + t.Token;
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

    function getCookie(cname) {
        var name = cname + "=";
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

}());