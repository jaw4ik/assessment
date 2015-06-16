define(['http/httpRequestSender'], function (httpRequestSender) {
    "use strict";

    return { post: post };

    function post(url, data) {
        var headers = window.auth.getHeader('api');
        _.extend(headers, { "cache-control": "no-cache" });

        return httpRequestSender.post(url, data, headers)
            .then(function (response) {

            if (!_.isObject(response)) {
                throw 'Response data is not an object';
            }

            if (!response.success) {
                throw response.errorMessage;
            }

            return response.data;
        });
    }
});