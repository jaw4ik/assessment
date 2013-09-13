define(['plugins/http'],
    function (http) {

        var
            post = function (url, data) {
                var deferred = Q.defer();
                
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
                    });
                
                return deferred.promise;
            }
        ;

        return {
            post: post
        };
    });