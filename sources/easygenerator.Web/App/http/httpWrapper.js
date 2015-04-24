define(['notify', 'http/httpRequestSender', 'durandal/app'],
    function (notify, httpRequestSender, app) {
        "use strict";

        var
            post = function (url, data) {
                app.trigger('httpWrapper:post-begin');
                return httpRequestSender.post(url, data)
                     .then(function (response) {
                         if (!_.isObject(response)) {
                             throw 'Response data is not an object';
                             return;
                         }
                        
                         if (!response.success) {
                             notify.error(response.errorMessage);
                             throw response.errorMessage;
                             return;
                         }

                         return response.data;
                     })
                     .fin(function () {
                         app.trigger('httpWrapper:post-end');
                     });
            }
        ;

        return {
            post: post
        };
    });