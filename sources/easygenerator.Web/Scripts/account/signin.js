var app = app || {};

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
        grecaptchaResponse: ko.observable(!window.reCaptchaEnabled),

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
        return !!(viewModel.username.isValid() &&
            viewModel.password() &&
            viewModel.password().trim().length &&
            viewModel.grecaptchaResponse());
    });

    ko.computed(function () {
        var subscription = viewModel.username() & viewModel.password();
        viewModel.errorMessage("");
    });

    /* reset captcha function */
    viewModel.resetCaptcha = function () {
        if (!window.reCaptchaEnabled) {
            return;
        }
        window.grecaptcha.reset();
        viewModel.grecaptchaResponse(false);
    };

    /* declare callbacks for google reCaptcha */
    if (window.reCaptchaEnabled) {
        window.recaptchaChecked = function(response) {
            viewModel.grecaptchaResponse(response);
        }

        window.recaptchaExpired = function() {
            viewModel.grecaptchaResponse(false);
        }
    }

    /* get login info from session context */
    var loginData = app.clientSessionContext.get(app.constants.userSignInData);
    if (loginData && loginData.username && loginData.password) {
        viewModel.username(loginData.username);
        // setting password after browser's autocomplete
        // TODO: fix autocomplete by using fake inputs
        setTimeout(function() {
            viewModel.password(loginData.password);
        }, 100);
    }
    app.clientSessionContext.remove(app.constants.userSignInData);

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
            endpoints: window.auth.getRequiredEndpoints(),
            grecaptchaResponse: (typeof viewModel.grecaptchaResponse() === 'string') ? viewModel.grecaptchaResponse() : ''
        };
        
        var requestArgs = {
            url: '/auth/token',
            data: data,
            type: 'POST'
        };
        $.ajax(requestArgs).done(function (response) {
            if (response) {
                if (response.success) {
                    window.auth.login(response.data).then(function(success) {
                        if (success) {
                            app.trackEvent(app.constants.events.signin, response.data)
                                .done(function() {
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
                            viewModel.isSigninRequestPending(false);
                            throw 'Unable to login';
                        }
                    });
                } else {
                    if (response.message) {
                        viewModel.isSigninRequestPending(false);
                        viewModel.errorMessage(response.message);
                        viewModel.resetCaptcha();
                    } else {
                        throw 'Error message is not defined';
                    }
                }
            } else {
                throw 'Response is not an object';
            }
        }).fail(function (reason) {
            if (reason.status === 400) {
                var loginData = {
                    username: data.username,
                    password: data.password
                };
                app.clientSessionContext.set(app.constants.userSignInData, loginData);
                var captchaPageUrl = getCaptchaPageUrl();
                if (captchaPageUrl) {
                    window.location.replace(captchaPageUrl);
                    return;
                }
                viewModel.resetCaptcha();
                return;
            }
            viewModel.isSigninRequestPending(false);
            viewModel.errorMessage(reason);
            viewModel.resetCaptcha();
        });
    }

    function getCaptchaPageUrl() {
        var url = window.location.href;
        var captchaParamKey = 'captcha';
        if (url.indexOf(captchaParamKey+'=true') !== -1) {
            return null;
        }
        var captchaParamIndex = url.indexOf(captchaParamKey+'=');
        if (captchaParamIndex !== -1) {
            var captchaParamStartIndex = captchaParamIndex + (captchaParamKey + '=').length;
            var captchaParamEndIndex = url.substring(captchaParamStartIndex).indexOf('&');
            if (captchaParamEndIndex === -1) {
                return url.substring(0, captchaParamStartIndex) + 'true';
            }
            captchaParamEndIndex += captchaParamStartIndex;
            return url.substring(0, captchaParamStartIndex) + 'true' + url.substring(captchaParamEndIndex);
        }
        if (url.indexOf('?') === -1) {
            return url + '?'+captchaParamKey+'=true';
        }
        return url + '&' + captchaParamKey + '=true';
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