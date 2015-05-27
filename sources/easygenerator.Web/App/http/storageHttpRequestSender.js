define([], function () {
    "use strict";

    return {
        post: post,
        get: get
    };

    function post(url, data, headers) {
        var deferred = Q.defer();

        $.ajax({
            url: url,
            data: data,
            method: 'POST',
            headers: headers,
            global: false
        }).then(function (response) {
            deferred.resolve(response);
        }).fail(function (reason) {
            deferred.reject(reason.status);
        });

        return deferred.promise;
    }

    function get(url, query, headers) {
        var deferred = Q.defer();

        $.ajax(url, { data: query, headers: headers, global: false })
            .then(function (response) {
                deferred.resolve(response);
            }).fail(function (reason) {
                deferred.reject(reason.status);
            });

        return deferred.promise;
    }

});