define(['plugins/router', './settings'],
    function (router, settings) {
    
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

                if (!_.isNullOrUndefined(settings.errorPageUrl)) {
                    if (window.location.hash.indexOf(settings.errorPageUrl) !== -1)
                        return;

                    var navigateUrl = settings.errorPageUrl + '/' + encodeURIComponent(window.location.hash);

                    _.defer(function () {
                        router.navigate(navigateUrl, { replace: true, trigger: true });
                    });
                }
            };

        return {
            errors: errorMessages,
            handleError: handleError
        };

    }
);