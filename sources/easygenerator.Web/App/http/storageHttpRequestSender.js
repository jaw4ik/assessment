define(['plugins/http', 'localization/localizationManager'],
    function (http, localizationManager) {
        "use strict";

        return {
            post: post,
            get: get
        };

        function post(url, data, headers) {
            var deferred = Q.defer();

            http.post(url, data, headers).done(function (response) {

                if (!response) {
                    deferred.reject('Response data is not an object');
                    return;
                }

                deferred.resolve(response);

            }).fail(function (reason) {

                /*if (reason.status == ) {
                    errorMessage = localizationManager.localize(response.resourceKey);
                } else if (response.message) {
                    errorMessage = response.message;
                } else {
                    errorMessage = localizationManager.localize('responseFailed');
                }*/
                deferred.reject(reason);
            });

            return deferred.promise;
        }

        function get(url, query, headers) {
            var deferred = Q.defer();

            $.ajax(url, { data: query, headers: headers })
                .done(function (response) {
                    if (!response) {
                        deferred.reject('Response data is not an object');
                        return;
                    }
                    deferred.resolve(response);
                }).fail(function (reason) {
                    deferred.reject(reason);
                });

            return deferred.promise;
        }

    });