define(['notify', 'http/httpRequestSender', 'durandal/app'], function (notify, httpRequestSender, app) {
    "use strict";

    return { post: post };

    function post(url, data) {
        app.trigger('authHttpWrapper:post-begin');
        return window.auth.getHeader('auth').then(function(value) {
            var headers = value;
            _.extend(headers, { "cache-control": "no-cache" });

            return httpRequestSender.post(url, data, headers).then(function (response) {

                if (!_.isObject(response)) {
                    throw 'Response data is not an object';
                }

                return response.data;
            }).fin(function () {
                app.trigger('authHttpWrapper:post-end');
            });
        });
    }

});