define(['plugins/http', 'durandal/app', 'localization/localizationManager', 'notify'],
    function (http, app, localizationManager, notify) {

        var
            post = function (url, data) {
                var deferred = Q.defer();
                app.trigger('httpWrapper:post-begin');
                http.post(url, data)
                    .done(function (response) {
                        if (!_.isObject(response)) {
                            deferred.reject('Response data is not an object');
                            return;
                        }

                        if (!response.success) {
                            var errorMessage;

                            if (response.resourceKey)
                                errorMessage = localizationManager.localize(response.resourceKey);
                            else if (response.message)
                                errorMessage = response.message;
                            else
                                errorMessage = localizationManager.localize('responseFailed');

                            notify.error(errorMessage);
                            deferred.reject(errorMessage);
                            return;
                        }

                        deferred.resolve(response.data);
                    })
                    .fail(function (reason) {
                        var message = null;

                        if (!_.isNullOrUndefined(reason)) {
                            if (typeof reason == "string") {
                                message = reason;
                            } else if (reason.status == 503) {
                                deferred.reject('Service unavailable');
                                return;
                            } else if (reason.statusText) {
                                message = reason.statusText;
                            }
                        }

                        if (_.isNull(message)) {
                            message = localizationManager.localize("responseFailed");
                        }

                        notify.error(message);
                        deferred.reject(message);
                    })
                    .always(function () {
                        app.trigger('httpWrapper:post-end');
                    });

                return deferred.promise;
            }
        ;

        return {
            post: post
        };
    });