define(['plugins/router'],
    function (router) {
    
        var
            errorMessages = {
                invalidEndpoint: "Invalid endpoint",
                notFoundEndpoint: "Not found endpoint",
                invalidCredentials: "Invalid credentials",
                invalidEmail: "Invalid e-mail",
                invalidProtocol: "Invalid protocol",
                xDomainRequestError: "XDomainRequest error",
                timeoutError: "Timeout error",
                xApiCorsNotSupported: "xAPI CORS Not Supported",

                badRequest: "Bad request: ",
                unhandledMessage: "Unhandled error: ",
                
                verbIsIncorrect: "Vebr object is not well formed",
                actorDataIsIncorrect: "Actor data is incorrect",
                
                notEnoughDataInSettings: "Request failed: Not enough data in the settings"
            },

            handleError = function (errorMessage) {

                if (window.location.hash.indexOf('xapierror') !== -1)
                    return;

                var hash = window.location.hash.slice(1, window.location.hash.length);

                var navigateUrl = 'xapierror/' + encodeURIComponent(_.isEmpty(hash) ? 'home' : hash);
                router.navigate(navigateUrl, { replace: true, trigger: true });
            };

        return {
            errors: errorMessages,
            handleError: handleError
        };

    }
);