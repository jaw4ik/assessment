﻿var app = app || {};

app.openHomePage = function () {
    window.location.replace('/');
};

app.reload = function () {
    window.location.reload();
};

app.assingLocation = function (url) {
    window.location.assign(url);
};

app.getLocationHref = function() {
    return window.location.href;
};

$(function () {

    serviceUnavailableAjaxErrorHandler().subscribeOnGlobalErrorEvents();

    if ($(".sign-up").length) {
        ko.applyBindings(signupModel(), $(".sign-up")[0]);
    }

    if ($(".log-in").length) {
        ko.applyBindings(app.signinViewModel(), $(".log-in")[0]);
    }

    if ($('.sign-up-second-step').length) {
        var viewModel = signUpSecondStepModel();
        if (!viewModel.isInitializationContextCorrect()) {
            app.assingLocation('/signup');
        }
        
        ko.applyBindings(viewModel, $('.sign-up-second-step')[0]);
    }
    
    if ($('.password-recovery').length) {
        ko.applyBindings(app.passwordRecoveryViewModel(), $('.password-recovery')[0]);
    }
});


