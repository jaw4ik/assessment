var app = app || {};

app.openHomePage = function () {
    window.location.replace('/');
};


app.constants = {
    events: {
        signin: 'Sign in',
        signup: 'Sign up'
    },
    patterns: {
        email: /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/
    }
};

$(function () {

    if ($(".sign-up").length) {
        ko.applyBindings(signupModel(), $(".sign-up")[0]);
    }

    if ($(".log-in").length) {
        ko.applyBindings(app.signinViewModel(), $(".log-in")[0]);
    }

    if ($('.sign-up-second-step').length) {
        ko.applyBindings(signUpSecondStepModel(), $('.sign-up-second-step')[0]);
    }
    
    if ($('.password-recovery').length) {
        ko.applyBindings(app.passwordRecoveryViewModel(), $('.password-recovery')[0]);
    }
});


