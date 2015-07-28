var app = app || {};

app.ltiAuthenticateViewModel = function () {
    "use strict";

    var requestArgs = {
        url: '/lti/authenticate',
        data: data,
        type: 'POST'
    };

    $.ajax(requestArgs).done(function (response) {
        if (response && response.success) {
            window.auth.login(response.data);
        }
    }).fin(function () {
        app.openHomePage();
    });
};