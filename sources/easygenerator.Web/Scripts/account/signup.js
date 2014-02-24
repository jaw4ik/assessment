var app = app || {};

app.signupModel = function () {
    
    var digitRegex = /\d/,
        whitespaceRegex = /\s/;

    var
        userName = ko.observable(''),
        password = ko.observable(''),
        firstName = ko.observable(''),
        lastName = ko.observable(''),
        phone = ko.observable(''),
        organization = ko.observable(''),
        country = ko.observable(null),
        isLicenseAgreed = ko.observable(false),
        isUserNameEditing = ko.observable(false),
        isUserNameValidating = ko.observable(false),
        isPasswordEditing = ko.observable(false),
        isPasswordVisible = ko.observable(false),
        isFirstNameErrorVisible = ko.observable(false),
        isLastNameErrorVisible = ko.observable(false),
        isPhoneErrorVisible = ko.observable(false),
        isOrganizationErrorVisible = ko.observable(false),
        isCountrySuccessVisible = ko.observable(false),
        isCountryErrorVisible = ko.observable(false),
        lastValidateCountry = null,
        userExists = ko.observable(false),
        isFormValid = null,
        lastValidatedUserName = null,
        lastValidateFirstName = null,
        lastValidateLastName = null,
        lastValidatePhone = null,
        lastValidateOrganization = null,
        phoneCode = ko.observable('+ ( ... )'),

    userPreciselyExists = ko.computed(function () {
        return userExists() && userName().trim().toLowerCase() === lastValidatedUserName;
    }),

    showHidePassword = function () {
        isPasswordVisible(!isPasswordVisible());
    },

    signUp = function () {
        var data = {
            email: userName().trim().toLowerCase(),
            password: password(),
            firstName: firstName(),
            lastName: lastName(),
            phone: phone(),
            organization: organization(),
            country: country()
        };

        app.clientSessionContext.set(app.constants.userSignUpFirstStepData, data);

        $.when(
            app.trackEvent(app.constants.events.signupFirstStep, { username: data.email }),
            app.trackPageview(app.constants.pageviewUrls.signupFirstStep)
            ).done(function () {
                var href = app.getLocationHref();
                app.assingLocation(href.slice(0, href.lastIndexOf('/')) + '/signupsecondstep');
            });
    },

    checkUserExists = function () {
        userName(userName().trim());
        if (this.userPreciselyExists()) {
            return;
        }

        userExists(false);
        if (!userName.isValid()) {
            return;
        }

        lastValidatedUserName = userName().trim().toLowerCase();
        isUserNameValidating(true);

        $.ajax({
            url: '/api/user/exists',
            data: { email: userName().trim().toLowerCase() },
            type: 'POST'
        }).done(function (response) {
            userExists(response.data);
            isUserNameValidating(false);
        });
    },
        
    validateFirstName = function () {
        lastValidateFirstName = firstName().trim();
        firstName(firstName().trim());
        isFirstNameErrorVisible(_.isEmpty(lastValidateFirstName));
    },

    onFocusFirstName = function () {
        isFirstNameErrorVisible(false);
    },
        
    validateLastName = function () {
        lastValidateLastName = lastName().trim();
        lastName(lastName().trim());
        isLastNameErrorVisible(_.isEmpty(lastValidateLastName));
    },

    onFocusLastName = function () {
        isLastNameErrorVisible(false);
    },

    validatePhone = function () {
        lastValidatePhone = phone().trim();
        phone(phone().trim());
        isPhoneErrorVisible(_.isEmpty(lastValidatePhone));
    },

    onFocusPhone = function () {
        isPhoneErrorVisible(false);
    },

    validateOrganization = function () {
        lastValidateOrganization = organization().trim();
        organization(organization().trim());
        isOrganizationErrorVisible(_.isEmpty(lastValidateOrganization));
    },

    onFocusOrganization = function () {
        isOrganizationErrorVisible(false);
    };

    userName.isValid = ko.computed(function () {
        var mailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/,
            length = userName().trim().length;
        return length > 0 && length < 255 && mailRegex.test(userName().trim()) && !userExists();
    });

    password.isValid = ko.computed(function () {
        return password().length >= 7
            && password().toLowerCase() != password()
            && password().toUpperCase() != password()
            && digitRegex.test(password())
            && !whitespaceRegex.test(password());
    });

    password.hasUpperAndLowerCaseLetters = ko.computed(function() {
        return password().toLowerCase() != password()
            && password().toUpperCase() != password();
    });

    password.hasNumbers = ko.computed(function() {
        return digitRegex.test(password());
    });

    password.hasSpaces = ko.computed(function() {
        return !whitespaceRegex.test(password())
            && password().length != 0;
    });

    password.hasMoreThanSevenSymbols = ko.computed(function() {
        return password().length >= 7;
    });

    firstName.isValid = ko.computed(function() {
        return !_.isEmptyOrWhitespace(firstName());
    });

    lastName.isValid = ko.computed(function() {
        return !_.isEmptyOrWhitespace(lastName());
    });

    phone.isValid = ko.computed(function () {
        return !_.isEmpty(phone());
    });

    organization.isValid = ko.computed(function () {
        return !_.isEmpty(organization());
    });

    country.isValid = ko.computed(function () {
        lastValidateCountry = null;
        var currentCountry = _.find(app.constants.countries, function (item) {
            return item.name == country();
        });

        if (!_.isNullOrUndefined(currentCountry)) {
            lastValidateCountry = country();
            isCountrySuccessVisible(true);
            phoneCode(currentCountry.code);
            isCountryErrorVisible(false);
        } else {
            isCountrySuccessVisible(false);
            phoneCode('+ ( ... )');
            isCountryErrorVisible(_.isUndefined(country()));
        }
        return !_.isNullOrUndefined(country());
    });

    isFormValid = ko.computed(function () {
        return userName.isValid() && password.isValid()
            && firstName.isValid() && lastName.isValid()
            && phone.isValid() && organization.isValid() && country.isValid()
            && isLicenseAgreed();
    });

    userName.subscribe(function (newValue) {
        if (userName() != newValue)
            userExists(false);
    });

    return {
        userName: userName,
        password: password,
        firstName: firstName,
        lastName: lastName,
        country: country,
        countries: app.constants.countries,
        phone: phone,
        organization: organization,
        isLicenseAgreed: isLicenseAgreed,
        isUserNameEditing: isUserNameEditing,
        isUserNameValidating: isUserNameValidating,
        isPasswordEditing: isPasswordEditing,
        isPasswordVisible: isPasswordVisible,
        isFormValid: isFormValid,
        userExists: userExists,
        userPreciselyExists: userPreciselyExists,

        isFirstNameErrorVisible: isFirstNameErrorVisible,
        isLastNameErrorVisible: isLastNameErrorVisible,
        isPhoneErrorVisible: isPhoneErrorVisible,
        isOrganizationErrorVisible: isOrganizationErrorVisible,
        isCountrySuccessVisible: isCountrySuccessVisible,
        isCountryErrorVisible: isCountryErrorVisible,
        onFocusFirstName: onFocusFirstName,
        onFocusLastName: onFocusLastName,
        onFocusPhone: onFocusPhone,
        onFocusOrganization: onFocusOrganization,

        validateFirstName: validateFirstName,
        validateLastName: validateLastName,
        validatePhone: validatePhone,
        validateOrganization: validateOrganization,

        showHidePassword: showHidePassword,
        checkUserExists: checkUserExists,
        signUp: signUp,
        phoneCode: phoneCode
    };
}