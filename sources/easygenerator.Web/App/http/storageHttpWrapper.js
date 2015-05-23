define(['http/storageHttpRequestSender', 'durandal/app'], function (storageHttpRequestSender, app) {
    "use strict";

    return {
        post: post,
        get: get
    };

    function post(url, data) {
        app.trigger('storageHttpWrapper:post-begin');

        return storageHttpRequestSender.post(url, data, window.auth.getHeader('storage')).fin(function () {
            app.trigger('storageHttpWrapper:post-end');
        });
    }

    function get(url, query) {
        app.trigger('storageHttpWrapper:get-begin');

        return storageHttpRequestSender.get(url, query, window.auth.getHeader('storage')).fin(function () {
            app.trigger('storageHttpWrapper:get-end');
        });
    }
});