define(['plugins/http', 'localization/localizationManager'],
    function (http, localizationManager) {
        "use strict";

        return {
            post: post,
            get: get,
            configure: configure
        };

        function post(url, data, headers) {
            var deferred = Q.defer();
            http.post(url, data, headers).done(function (response) {
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

        function get(url, query, headers) {
            var deferred = Q.defer();

             $.ajax(url, { data: query, headers: headers })
                .done(function (response) {
                    deferred.resolve(response);
                }).fail(function (reason) {
                    deferred.reject(reason);
            });

            return deferred.promise;
        }

        function configure() {
            $.ajaxSetup({
                headers: {
                    "cache-control": "no-cache"
                }
            });
        }
    });