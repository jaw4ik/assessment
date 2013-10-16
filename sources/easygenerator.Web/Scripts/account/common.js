var app = app || {};

app.openHomePage = function () {
    window.location.replace('/');
};

app.emailPattern = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/;

$(function () {
    if ($(".sign-up").length) {
        ko.applyBindings(signupModel(), $(".sign-up")[0]);
    }

    if ($(".log-in").length) {
        ko.applyBindings(app.signinViewModel(), $(".log-in")[0]);
    }
    
    if ($('.sign-up-second-step').length) {
        ko.applyBindings(SignUpSecondStepModel(), $('.sign-up-second-step')[0]);
    }
});

