define(['http/apiHttpWrapper'], function (apiHttpWrapper) {
    'use strict';

    return {
        execute: function () {
            return apiHttpWrapper.post('/api/user/releasenote');
        }
    };

})