define(['notify', 'http/httpRequestSender', 'durandal/app'], function (notify, httpRequestSender, app) {
    "use strict";

    return {
        post: post,
        get: get
    };

    function post(url, data) {
        app.trigger('apiHttpWrapper:post-begin');
        return window.auth.getHeader('api').then(function(value) {
            var headers = value;
            _.extend(headers, { "cache-control": "no-cache" });

            return httpRequestSender.post(url, data, headers).then(function (response) {

                if (!_.isObject(response)) {
                    throw 'Response data is not an object';
                }

                if (!response.success) {
                    notify.error(response.errorMessage);
                    throw response.errorMessage;
                }

                return response.data;
            }).fin(function () {
                app.trigger('apiHttpWrapper:post-end');
            });
        });
    }

    function get(url, data) {
        return window.auth.getHeader('api').then(function (value) {
            var headers = value;
            _.extend(headers, { "cache-control": "no-cache" });

            return httpRequestSender.get(url, data, headers);
        });
    }

});