var app = app || {};

app.signUpSecondStepModel = function () {

    var self = {
        lastValidateCountry: null,
        lastValidatePhone: null
    };

    var viewModel = {
        country: ko.observable(null),
        countries: app.constants.countries,
        phone: ko.observable(''),
        phoneCode: ko.observable('+ ( ... )'),
        userRole: ko.observable(),

        onFocusPhone: onFocusPhone,

        isCountrySuccessVisible: ko.observable(false),
        isCountryErrorVisible: ko.observable(false),
        isPhoneErrorVisible: ko.observable(false),

        validatePhone: validatePhone,

        isSignupRequestPending: ko.observable(false),
        isInitializationContextCorrect: isInitializationContextCorrect,

        signUp: signUp
    };


    viewModel.phone.isValid = ko.computed(function () {
        return !_.isEmpty(viewModel.phone());
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
        return viewModel.country.isValid() && viewModel.phone.isValid();
    });

    return viewModel;


    function onFocusPhone() {
        viewModel.isPhoneErrorVisible(false);
    }


    function validatePhone() {
        self.lastValidatePhone = viewModel.phone().trim();
        viewModel.phone(viewModel.phone().trim());
        viewModel.isPhoneErrorVisible(_.isEmpty(self.lastValidatePhone));
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

        data.userRole = viewModel.userRole() || null;
        data.phone = viewModel.phone();
        data.country = viewModel.country();

        viewModel.isSignupRequestPending(true);

        $.ajax({
            url: '/api/user/signup',
            data: data,
            type: 'POST'
        }).done(function (response) {
            $.when(
                login(response.data, data.password),
                app.trackEvent(app.constants.events.signupSecondStep, { username: response.data, firstname: data.firstName, lastname: data.lastName, role: data.userRole }),
                app.trackPageview(app.constants.pageviewUrls.signupSecondStep)
            ).done(function () {
                app.clientSessionContext.remove(app.constants.userSignUpFirstStepData);
                localStorage.setItem('showCreateCoursePopup', true);
                app.openHomePage();
            });
        }).fail(function () {
            viewModel.isSignupRequestPending(false);
        });
    };

    function login(username, password) {
        var defer = $.Deferred();
        var data = {
            username: username,
            password: password,
            grant_type: "password",
            endpoints: window.auth.getRequiredEndpoints()
        };

        var requestArgs = {
            url: '/auth/token',
            data: data,
            type: 'POST'
        };

        $.ajax(requestArgs).done(function (response) {
            if (!response || !response.success) {
                defer.resolve(false);
                return;
            }
            window.auth.login(response.data).then(function(success) {
                defer.resolve(success);
            });
        }).fail(function(reason) {
            defer.reject(reason);
        });
        return defer.promise();
    }

}