define(['notify', 'http/httpRequestSender', 'durandal/app'],
    function (notify, httpRequestSender, app) {
        "use strict";

        var
            post = function (url, data) {
                app.trigger('authHttpWrapper:post-begin');

                var headers = {
                    "Authorization": "Bearer " + localStorage['token-auth']
                };

                return httpRequestSender.post(url, data, headers)
                     .then(function (response) {
                         if (!_.isObject(response)) {
                             throw 'Response data is not an object';
                             return;
                         }
                     
                         return response.data;
                     })
                     .fin(function () {
                         app.trigger('authHttpWrapper:post-end');
                     });
            }
        ;

        return {
            post: post
        };
    });