var app = app || {};

app.signupModel = function () {

    var self = {
        lastValidatedUserName: null,
        lastValidateFirstName: null,
        lastValidateLastName: null
    };

    var whitespaceRegex = /\s/;

    var viewModel = {
        firstName: ko.observable(''),
        lastName: ko.observable(''),
        userName: ko.observable(''),
        password: ko.observable(''),

        userExists: ko.observable(false),
        checkUserExists: checkUserExists,

        isUserNameEditing: ko.observable(false),
        isUserNameValidating: ko.observable(false),
        isPasswordEditing: ko.observable(false),
        isFirstNameErrorVisible: ko.observable(false),
        isLastNameErrorVisible: ko.observable(false),
        grecaptchaResponse: ko.observable(!window.reCaptchaEnabled),
        onFocusFirstName: onFocusFirstName,
        onFocusLastName: onFocusLastName,

        validateFirstName: validateFirstName,
        validateLastName: validateLastName,

        isPasswordVisible: ko.observable(false),
        showHidePassword: showHidePassword,

        signUp: signUp,
        isSignupRequestPending: ko.observable(false)
    };

    viewModel.userName.isValid = ko.computed(function () {
        var length = viewModel.userName().trim().length;
        return length > 0 && length < 255 && app.constants.patterns.email.test(viewModel.userName().trim()) && !viewModel.userExists();
    });

    viewModel.password.isValid = ko.computed(function () {
        return viewModel.password().length >= 7
            && !whitespaceRegex.test(viewModel.password());
    });

    viewModel.password.hasSpaces = ko.computed(function () {
        return !whitespaceRegex.test(viewModel.password())
            && viewModel.password().length != 0;
    });

    viewModel.password.hasMoreThanSevenSymbols = ko.computed(function () {
        return viewModel.password().length >= 7;
    });

    viewModel.firstName.isValid = ko.computed(function () {
        return !_.isEmptyOrWhitespace(viewModel.firstName());
    });

    viewModel.lastName.isValid = ko.computed(function () {
        return !_.isEmptyOrWhitespace(viewModel.lastName());
    });

    viewModel.isFormValid = ko.computed(function () {
        return viewModel.userName.isValid() && viewModel.password.isValid()
            && viewModel.firstName.isValid() && viewModel.lastName.isValid() && viewModel.grecaptchaResponse();
    });

    viewModel.userPreciselyExists = ko.computed(function () {
        return viewModel.userExists() && viewModel.userName().trim().toLowerCase() === self.lastValidatedUserName;
    });

    viewModel.userName.subscribe(function (newValue) {
        if (viewModel.userName() != newValue)
            viewModel.userExists(false);
    });

    /* declare callbacks for google reCaptcha */
    if (window.reCaptchaEnabled) {
        window.recaptchaChecked = function (response) {
            viewModel.grecaptchaResponse(response);
        }

        window.recaptchaExpired = function () {
            viewModel.grecaptchaResponse(false);
        }
    }

    return viewModel;

    function showHidePassword() {
        viewModel.isPasswordVisible(!viewModel.isPasswordVisible());
    }

    function validateFirstName() {
        self.lastValidateFirstName = viewModel.firstName().trim();
        viewModel.firstName(viewModel.firstName().trim());
        viewModel.isFirstNameErrorVisible(_.isEmpty(self.lastValidateFirstName));
    }

    function validateLastName() {
        self.lastValidateLastName = viewModel.lastName().trim();
        viewModel.lastName(viewModel.lastName().trim());
        viewModel.isLastNameErrorVisible(_.isEmpty(self.lastValidateLastName));
    }

    function onFocusFirstName() {
        viewModel.isFirstNameErrorVisible(false);
    }

    function onFocusLastName() {
        viewModel.isLastNameErrorVisible(false);
    }

    function checkUserExists() {
        viewModel.userName(viewModel.userName().trim());
        if (viewModel.userPreciselyExists()) {
            return;
        }

        viewModel.userExists(false);
        if (!viewModel.userName.isValid()) {
            return;
        }

        self.lastValidatedUserName = viewModel.userName().trim().toLowerCase();
        viewModel.isUserNameValidating(true);

        $.ajax({
            url: '/api/user/exists',
            data: { email: viewModel.userName().trim().toLowerCase() },
            type: 'POST'
        }).done(function (response) {
            viewModel.userExists(response.data);
            viewModel.isUserNameValidating(false);
        });
    }

    function signUp() {
        if (viewModel.isSignupRequestPending()) {
            return;
        }

        viewModel.isSignupRequestPending(true);

        var data = {
            email: viewModel.userName().trim().toLowerCase(),
            password: viewModel.password(),
            firstName: viewModel.firstName(),
            lastName: viewModel.lastName(),
            grecaptchaResponse: (typeof viewModel.grecaptchaResponse() === 'string') ? viewModel.grecaptchaResponse() : ''
        };

        app.clientSessionContext.set(app.constants.userSignUpFirstStepData, data);
        $.when(app.trackEvent(app.constants.events.signupFirstStep, { username: data.email, firstname: data.firstName, lastname: data.lastName }), app.trackPageview(app.constants.pageviewUrls.signupFirstStep))
            .done(function () {
                var href = app.getLocationHref();

                if (href.indexOf('signup') != -1) {
                    app.assingLocation(href.replace(/signup/, 'signupsecondstep'));
                } else if (href.indexOf('register') != -1) {
                    app.assingLocation(href.replace(/register/, 'signupsecondstep'));
                }

                viewModel.isSignupRequestPending(false);
            });
    }

}