define(['durandal/plugins/router'],
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
                
                if (window.location.hash.indexOf('#/xapierror') !== -1)
                    return;

                var navigateUrl = '#/xapierror/' + encodeURIComponent(window.location.hash);
                router.replaceLocation(navigateUrl);
            };

        return {
            errors: errorMessages,
            handleError: handleError
        };

    }
);