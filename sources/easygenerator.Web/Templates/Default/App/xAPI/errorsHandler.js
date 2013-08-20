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
                debugger;
                router.replaceLocation('#/xapierror');
            };

        return {
            errors: errorMessages,
            handleError: handleError
        };

    }
);