var app = app || {};

app.signUpSecondStepModel = function () {

    var self = {
        lastValidateCountry: null,
        lastValidatePhone: null,
        lastValidateOrganization: null
    };

    var viewModel = {
        organization: ko.observable(''),
        country: ko.observable(null),
        countries: app.constants.countries,
        phone: ko.observable(''),
        phoneCode: ko.observable('+ ( ... )'),
        peopleBusyWithCourseDevelopmentAmount: ko.observable(),
        requestIntroductionDemo: ko.observable(false),

        onFocusOrganization: onFocusOrganization,
        onFocusPhone: onFocusPhone,

        isCountrySuccessVisible: ko.observable(false),
        isCountryErrorVisible: ko.observable(false),
        isPhoneErrorVisible: ko.observable(false),
        isOrganizationErrorVisible: ko.observable(false),

        validatePhone: validatePhone,
        validateOrganization: validateOrganization,

        isSignupRequestPending: ko.observable(false),
        isInitializationContextCorrect: isInitializationContextCorrect,

        signUp: signUp
    };


    viewModel.phone.isValid = ko.computed(function () {
        return !_.isEmpty(viewModel.phone());
    });

    viewModel.organization.isValid = ko.computed(function () {
        return !_.isEmpty(viewModel.organization());
    });

    viewModel.country.isValid = ko.computed(function () {
        self.lastValidateCountry = null;
        var currentCountry = _.find(app.constants.countries, function (item) {
            return item.name == viewModel.country();
        });

        if (!_.isNullOrUndefined(currentCountry)) {
            self.lastValidateCountry = viewModel.country();
            viewModel.isCountrySuccessVisible(true);
            viewModel.phoneCode(currentCountry.code);
            viewModel.isCountryErrorVisible(false);
        } else {
            viewModel.isCountrySuccessVisible(false);
            viewModel.phoneCode('+ ( ... )');
            viewModel.isCountryErrorVisible(_.isUndefined(viewModel.country()));
        }
        return !_.isNullOrUndefined(viewModel.country());
    });

    viewModel.isFormValid = ko.computed(function () {
        return viewModel.organization.isValid() && viewModel.country.isValid() && viewModel.phone.isValid();
    });

    return viewModel;


    function onFocusOrganization() {
        viewModel.isOrganizationErrorVisible(false);
    }

    function onFocusPhone() {
        viewModel.isPhoneErrorVisible(false);
    }


    function validatePhone() {
        self.lastValidatePhone = viewModel.phone().trim();
        viewModel.phone(viewModel.phone().trim());
        viewModel.isPhoneErrorVisible(_.isEmpty(self.lastValidatePhone));
    }

    function validateOrganization() {
        self.lastValidateOrganization = viewModel.organization().trim();
        viewModel.organization(viewModel.organization().trim());
        viewModel.isOrganizationErrorVisible(_.isEmpty(self.lastValidateOrganization));
    }


    function isInitializationContextCorrect() {
        var data = app.clientSessionContext.get(app.constants.userSignUpFirstStepData);
        return !_.isNullOrUndefined(data);
    }


    function signUp() {
        if (viewModel.isSignupRequestPending() || !viewModel.isFormValid()) {
            return;
        }

        var data = app.clientSessionContext.get(app.constants.userSignUpFirstStepData);
        if (_.isNullOrUndefined(data)) {
            throw 'User sign up data is not defined';
        }

        data.peopleBusyWithCourseDevelopmentAmount = viewModel.peopleBusyWithCourseDevelopmentAmount();
        data.phone = viewModel.phone();
        data.organization = viewModel.organization();
        data.country = viewModel.country();
        data.requestIntroductionDemo = viewModel.requestIntroductionDemo();

        viewModel.isSignupRequestPending(true);

        $.ajax({
            url: '/api/user/signup',
            data: data,
            type: 'POST'
        }).done(function (response) {
            app.clientSessionContext.remove(app.constants.userSignUpFirstStepData);

            $.when(
                app.trackEvent(app.constants.events.signupSecondStep, { username: response.data }),
                app.trackPageview(app.constants.pageviewUrls.signupSecondStep)
                ).done(function () {
                    localStorage.setItem('showCreateCoursePopup', true);
                    app.openHomePage();
                });
        }).fail(function () {
            viewModel.isSignupRequestPending(false);
        });
    };

}