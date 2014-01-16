var app = app || {};

app.signupModel = function () {

    var
        userName = ko.observable(''),
        password = ko.observable(''),
        fullName = ko.observable(''),
        phone = ko.observable(''),
        organization = ko.observable(''),
        country = ko.observable(null),
        isLicenseAgreed = ko.observable(false),
        isUserNameEditing = ko.observable(false),
        isUserNameValidating = ko.observable(false),
        isPasswordEditing = ko.observable(false),
        isPasswordVisible = ko.observable(false),
        isFullNameErrorVisible = ko.observable(false),
        isPhoneErrorVisible = ko.observable(false),
        isOrganizationErrorVisible = ko.observable(false),
        isCountrySuccessVisible = ko.observable(false),
        isCountryErrorVisible = ko.observable(false),
        lastValidateCountry = null,
        userExists = ko.observable(false),
        isFormValid = null,
        lastValidatedUserName = null,
        lastValidateFullName = null,
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
            fullName: fullName(),
            phone: phone(),
            organization: organization(),
            country: country()
        };

        app.clientSessionContext.set(app.constants.userSignUpFirstStepData, data);
        
        app.trackEvent(app.constants.events.signupFirstStep, { username: data.email }).done(function () {
            
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

    validateFullName = function () {
        lastValidateFullName = fullName().trim();
        fullName(fullName().trim());
        isFullNameErrorVisible(_.isEmpty(lastValidateFullName));
    },

    onFocusFullName = function () {
        isFullNameErrorVisible(false);
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
        var digitRegex = /\d/,
            whitespaceRegex = /\s/;

        return password().length >= 7
            && password().toLowerCase() != password()
            && password().toUpperCase() != password()
            && digitRegex.test(password())
            && !whitespaceRegex.test(password());
    });

    fullName.isValid = ko.computed(function () {
        return !_.isEmptyOrWhitespace(fullName());
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
            && fullName.isValid() && phone.isValid()
            && organization.isValid() && country.isValid()
            && isLicenseAgreed();
    });

    userName.subscribe(function (newValue) {
        if (userName() != newValue)
            userExists(false);
    });

    return {
        userName: userName,
        password: password,
        fullName: fullName,
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

        isFullNameErrorVisible: isFullNameErrorVisible,
        isPhoneErrorVisible: isPhoneErrorVisible,
        isOrganizationErrorVisible: isOrganizationErrorVisible,
        isCountrySuccessVisible: isCountrySuccessVisible,
        isCountryErrorVisible: isCountryErrorVisible,
        onFocusFullName: onFocusFullName,
        onFocusPhone: onFocusPhone,
        onFocusOrganization: onFocusOrganization,

        validateFullName: validateFullName,
        validatePhone: validatePhone,
        validateOrganization: validateOrganization,

        showHidePassword: showHidePassword,
        checkUserExists: checkUserExists,
        signUp: signUp,
        phoneCode: phoneCode
    };
}