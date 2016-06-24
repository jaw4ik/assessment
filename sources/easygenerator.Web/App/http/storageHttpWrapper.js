define(['http/storageHttpRequestSender', 'durandal/app'], function (storageHttpRequestSender, app) {
    "use strict";

    return {
        post: post,
        get: get
    };

    function post(url, data) {
        app.trigger('storageHttpWrapper:post-begin');
        return window.auth.getHeader('storage').then(function(value) {
            return storageHttpRequestSender.post(url, data, value).fin(function () {
                app.trigger('storageHttpWrapper:post-end');
            });
        });
    }

    function get(url, query) {
        app.trigger('storageHttpWrapper:get-begin');
        return window.auth.getHeader('storage').then(function(value) {
            return storageHttpRequestSender.get(url, query, value).fin(function() {
                app.trigger('storageHttpWrapper:get-end');
            });
        });
    }
});