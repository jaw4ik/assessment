(function () {
    var tokenNamespace = 'token.';
    var coockieTokens = { preview: 'preview' };
    var requiredScopes = ['api', 'auth', 'storage', 'signalr', 'preview'];

    window.auth = window.auth || {
        isUserLoggedIn: isUserLoggedIn,
        getToken: getToken,
        setTokens: setTokens,
        removeTokens: removeTokens,
        getHeader: getHeader,
        getRequiredScopes: getRequiredScopes
    };

    function isUserLoggedIn() {
        for (var index = 0; index < requiredScopes; index++) {
            if (token(requiredScopes[index]) === undefined) {
                return false;
            }
        }
        return true;
    }

    function getToken(scope) {
        return token(scope);
    }

    function setTokens(tokens) {
        if (tokens && tokens.length) {
            for (var index = 0; index < tokens.length; index++) {
                var t = tokens[index];
                if (coockieTokens[t.Scope]) {
                    document.cookie = tokenNamespace + t.Scope + '=' + t.Token;
                }
                token(t.Scope, t.Token);
            }
        }
    }

    function removeTokens() {
        var key;
        for (var i = 0; i < localStorage.length; i++) {
           key = localStorage.key(i);
            if (new RegExp('^' + tokenNamespace + '*').test(key)) {
                localStorage.removeItem(key);
            }
        }
        for (key in coockieTokens) {
            document.cookie = tokenNamespace + key + '=;expires=Wed 01 Jan 1970';
        }
    }

    function getHeader(scope) {
        return { 'Authorization': 'Bearer ' + token(scope) };
    }

    function getRequiredScopes() {
        return requiredScopes.join(' ');
    }

    //private
    function token(name, value) {
        if (value !== undefined) {
            localStorage.setItem(tokenNamespace + name, value);
        }
        return localStorage[tokenNamespace + name];
    }

}());