﻿var app = app || {};

app.signinViewModel = function () {

    var
        username = (function () {
            var value = ko.observable();
            value.isValid = ko.computed(function () {
                return !!(value() && app.constants.patterns.email.test(value().trim()));
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

        errorMessage = ko.observable(),
        hasError = ko.computed(function () {
            return !!(errorMessage() && errorMessage().length);
        }),

        canSubmit = ko.computed(function () {
            return !!(username.isValid() && password() && password().trim().length);
        }),

        submit = function () {
            if (!canSubmit()) {
                return;
            }

            errorMessage("");

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
                        app.trackEvent(app.constants.events.signin, { username: data.username }).done(function () {
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

        forgotPassword = function () {
            if (!username.isValid()) {
                return;
            }

            var data = {
                email: username()
            };

            $.ajax({
                url: '/api/user/forgotpassword',
                data: data,
                type: 'POST'
            })
            .done(function (response) {
                if (response) {
                    if (response.success) {
                        alert('Password recovery email has been send. Please check your mailbox for further instructions.');
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
        forgotPassword: forgotPassword,

        hasError: hasError,
        errorMessage: errorMessage
    };

};