var app = app || {};
var constants = constants || {};

app.signinViewModel = function () {

    var
        username = (function () {
            var value = ko.observable();
            value.isValid = ko.computed(function () {
                return !!(value() && constants.patterns.email.test(value().trim()));
            });
            value.isModified = ko.observable(false);
            value.markAsModified = function () {
                value.isModified(true);
            };
            return value;
        })(),
        password = ko.observable(),

        isPasswordVisible = ko.observable(),
        togglePasswordVisibility = function () {
            isPasswordVisible(!isPasswordVisible());
        },

        forgotPasswordSent = ko.observable(false),
        errorMessage = ko.observable(),
        hasError = ko.computed(function () {
            return !!(errorMessage() && errorMessage().length);
        }),

        canSubmit = ko.computed(function () {
            forgotPasswordSent(false);
            return !!(username.isValid() && password() && password().trim().length);
        }),

        submit = function () {
            if (!canSubmit()) {
                return;
            }

            errorMessage("");
            forgotPasswordSent(false);

            var data = {
                username: username().trim().toLowerCase(),
                password: password()
            };

            var that = this;

            $.ajax({
                url: '/api/user/signin',
                data: data,
                type: 'POST'
            })
            .done(function (response) {
                if (response) {
                    if (response.success) {
                        app.trackEvent(constants.events.signin, { username: data.username }).done(function () {
                            app.openHomePage();
                        });
                    } else {
                        if (response.message) {
                            that.errorMessage(response.message);
                        } else {
                            throw 'Error message is not defined';
                        }
                    }
                } else {
                    throw 'Response is not an object';
                }
            })
            .fail(function (reason) {
                that.errorMessage(reason);
            });
        },

        forgotPasswordEnabled = ko.observable(true),
        forgotPassword = function () {
            if (!username.isValid() || !forgotPasswordEnabled()) {
                return;
            }

            var data = {
                email: username()
            };
            
            var that = this;
            
            forgotPasswordEnabled(false);

            $.ajax({
                url: '/api/user/forgotpassword',
                data: data,
                type: 'POST'
            })
            .done(function (response) {
                if (response) {
                    if (response.success) {
                        that.forgotPasswordSent(true);
                        that.errorMessage('');
                    } else {
                        if (response.message) {
                            that.errorMessage(response.message);
                        } else {
                            throw 'Error message is not defined';
                        }
                    }
                } else {
                    throw 'Response is not an object';
                }
            })
            .fail(function (reason) {
                that.errorMessage(reason);
            })
            .always(function () {
                forgotPasswordEnabled(true);
            });
        };

    ko.computed(function () {
        var subscription = username() & password();
        errorMessage("");
    });

    return {
        username: username,
        password: password,
        isPasswordVisible: isPasswordVisible,
        togglePasswordVisibility: togglePasswordVisibility,

        canSubmit: canSubmit,
        submit: submit,

        forgotPasswordEnabled: forgotPasswordEnabled,
        forgotPassword: forgotPassword,
        forgotPasswordSent: forgotPasswordSent,

        hasError: hasError,
        errorMessage: errorMessage
    };

};