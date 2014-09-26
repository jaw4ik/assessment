define(['plugins/http', 'localization/localizationManager'],
    function (http, localizationManager) {
        "use strict";

        return {
            post: post,
            configure: configure
        };

        function post(url, data) {
            var deferred = Q.defer();
            http.post(url, data).done(function (response) {
                if (!_.isObject(response)) {
                    deferred.reject('Response data is not an object');
                    return;
                }

                if (response.success) {
                    deferred.resolve(response);
                    return;
                }

                var errorMessage;

                if (response.resourceKey) {
                    errorMessage = localizationManager.localize(response.resourceKey);
                } else if (response.message) {
                    errorMessage = response.message;
                } else {
                    errorMessage = localizationManager.localize('responseFailed');
                }

                deferred.resolve({
                    success: false,
                    errorMessage: errorMessage
                });

            }).fail(function (reason) {
                deferred.reject(reason);
            });

            return deferred.promise;
        }

        function configure() {
            $.ajaxSetup({
                type: 'POST',
                headers: { "cache-control": "no-cache" }
            });
        }

    });