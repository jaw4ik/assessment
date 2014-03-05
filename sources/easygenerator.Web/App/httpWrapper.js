define(['plugins/http', 'durandal/app', 'localization/localizationManager', 'notify'],
    function (http, app, localizationManager, notify) {
        "use strict";

        var
            post = function (url, data) {
                var deferred = Q.defer();
                app.trigger('httpWrapper:post-begin');
                http.post(url, data).done(function (response) {
                    if (!_.isObject(response)) {
                        deferred.reject('Response data is not an object');
                        return;
                    }

                    if (!response.success) {
                        var errorMessage;

                        if (response.resourceKey) {
                            errorMessage = localizationManager.localize(response.resourceKey);
                        } else if (response.message) {
                            errorMessage = response.message;
                        } else {
                            errorMessage = localizationManager.localize('responseFailed');
                        }

                        notify.error(errorMessage);
                        deferred.reject(errorMessage);
                        return;
                    }

                    deferred.resolve(response.data);
                }).fail(function (reason) {
                    deferred.reject(reason);
                }).always(function () {
                    app.trigger('httpWrapper:post-end');
                });

                return deferred.promise;
            }
        ;

        return {
            post: post
        };
    });