﻿var app = app || {};

app.signinViewModel = function () {
    "use strict";

    var viewModel = {
        username: ko.observable(),
        password: ko.observable(),
        isPasswordVisible: ko.observable(),
        forgotPasswordSent: ko.observable(false),
        forgotPasswordEnabled: ko.observable(true),
        isSigninRequestPending: ko.observable(false),
        errorMessage: ko.observable(),

        togglePasswordVisibility: togglePasswordVisibility,
        submit: submit,
        forgotPassword: forgotPassword
    };

    viewModel.username.isModified = ko.observable(false);
    viewModel.username.markAsModified = markAsModified;

    viewModel.username.isValid = ko.computed(function () {
        return !!(viewModel.username() && app.constants.patterns.email.test(viewModel.username().trim()));
    });

    viewModel.hasError = ko.computed(function () {
        return !!(viewModel.errorMessage() && viewModel.errorMessage().length);
    });

    viewModel.canSubmit = ko.computed(function () {
        viewModel.forgotPasswordSent(false);
        return !!(viewModel.username.isValid() && viewModel.password() && viewModel.password().trim().length);
    });

    ko.computed(function () {
        var subscription = viewModel.username() & viewModel.password();
        viewModel.errorMessage("");
    });

    return viewModel;

    function markAsModified() {
        viewModel.username.isModified(true);
    }

    function togglePasswordVisibility() {
        viewModel.isPasswordVisible(!viewModel.isPasswordVisible());
    }

    function submit() {
        if (!viewModel.canSubmit()) {
            return;
        }

        viewModel.errorMessage("");
        viewModel.forgotPasswordSent(false);
        viewModel.isSigninRequestPending(true);

        var data = {
            username: viewModel.username().trim().toLowerCase(),
            password: viewModel.password(),
            grant_type: "password",
            endpoints: window.auth.getRequiredEndpoints()
        };
        
        var requestArgs = {
            url: '/auth/token',
            data: data,
            type: 'POST'
        };
        $.ajax(requestArgs).done(function (response) {
            if (response) {
                if (response.success && window.auth.login(response.data)) {
                    app.trackEvent(app.constants.events.signin, response.data).done(function () {
                        var hash = null;
                        var query = window.location.search;
                        var returnUrlParam = '?ReturnUrl=';
                        if (query && query.indexOf(returnUrlParam) !== -1) {
                            var startIndex = query.indexOf(returnUrlParam) + returnUrlParam.length;
                            hash = query.substring(startIndex);
                            var endIndex = hash.indexOf('&');
                            hash = endIndex !== -1
                                ? decodeURIComponent(hash.substring(0, endIndex))
                                : decodeURIComponent(hash);
                        }
                        var ltiUserInfoToken = window.auth.getLtiUserInfoTokenFromHash();
                        if (ltiUserInfoToken) {
                            hash = '#token.user.lti=' + encodeURIComponent(ltiUserInfoToken);
                        } else {
                            var samlIdPUserInfoToken = window.auth.getSamlIdPUserInfoTokenFromHash();
                            if (samlIdPUserInfoToken) {
                                hash = '#token.user.saml=' + encodeURIComponent(samlIdPUserInfoToken);
                            }
                        }
                        app.openHomePage(hash);
                    });
                } else {
                    if (response.message) {
                        viewModel.isSigninRequestPending(false);
                        viewModel.errorMessage(response.message);
                    } else {
                        throw 'Error message is not defined';
                    }
                }
            } else {
                throw 'Response is not an object';
            }
        }).fail(function (reason) {
            viewModel.isSigninRequestPending(false);
            viewModel.errorMessage(reason);
        });
    }

    function forgotPassword() {
        if (!viewModel.username.isValid() || !viewModel.forgotPasswordEnabled()) {
            return;
        }

        viewModel.forgotPasswordEnabled(false);

        var data = {
            email: viewModel.username()
        };

        var requestArgs = {
            url: '/api/user/forgotpassword',
            data: data,
            type: 'POST'
        };

        $.ajax(requestArgs).done(function (response) {
            if (response) {
                if (response.success) {
                    viewModel.forgotPasswordSent(true);
                    viewModel.errorMessage('');
                } else {
                    if (response.message) {
                        viewModel.errorMessage(response.message);
                    } else {
                        throw 'Error message is not defined';
                    }
                }
            } else {
                throw 'Response is not an object';
            }
        }).fail(function (reason) {
            viewModel.errorMessage(reason);
        }).always(function () {
            viewModel.forgotPasswordEnabled(true);
        });
    }

};