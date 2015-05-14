define(['notify', 'http/httpRequestSender', 'durandal/app'], function (notify, httpRequestSender, app) {
    "use strict";

    return { post: post };

    function post(url, data) {
        app.trigger('authHttpWrapper:post-begin');
       
        return httpRequestSender.post(url, data, window.auth.getHeader('auth')).then(function (response) {

            if (!_.isObject(response)) {
                throw 'Response data is not an object';
            }

            return response.data;
        }).fin(function () {
            app.trigger('authHttpWrapper:post-end');
        });
    }

});