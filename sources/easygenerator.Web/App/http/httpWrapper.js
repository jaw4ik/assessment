define(['notify', 'http/httpRequestSender', 'durandal/app'],
    function (notify, httpRequestSender, app) {
        "use strict";

        var
            post = function (url, data) {
                var deferred = Q.defer();
                app.trigger('httpWrapper:post-begin');
                httpRequestSender.post(url, data)
                    .done(function (response) {
                        if (!_.isObject(response)) {
                            deferred.reject('Response data is not an object');
                            return;
                        }

                        if (!response.success) {
                            notify.error(response.errorMessage);
                            deferred.reject(response.errorMessage);
                            return;
                        }

                        deferred.resolve(response.data);
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