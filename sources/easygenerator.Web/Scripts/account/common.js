var app = app || {};

app.openHomePage = function() {
    window.location.replace('/');
};

$(function () {
    if ($(".sign-up").length) {
        ko.applyBindings(signupModel(), $(".sign-up")[0]);
    }

    if ($(".log-in").length) {
        ko.applyBindings(app.signinViewModel(), $(".log-in")[0]);
    }
});

