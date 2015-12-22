define(function () {
    "use strict";

    var lrs = {
        uri: '//reports.staging.easygenerator.com/xApi/statements',
        authenticationRequired: false,
        credentials: {
            username: '',
            password: ''
        },
        version: '1.0.2'
    };

    return {
        lrs: lrs
    };
});