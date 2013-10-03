define(['plugins/http', 'durandal/app'],
    function (http, app) {

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
                            deferred.reject(response.message || 'Response is not successful');
                            return;
                        }

                        deferred.resolve(response.data);
                    })
                    .fail(function (reason) {
                        deferred.reject(reason);
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