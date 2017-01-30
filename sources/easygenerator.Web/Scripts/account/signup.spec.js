define([], function () {
    "use strict";

    var viewModel;

    describe('viewModel [signUp]', function () {

        beforeEach(function () {
            viewModel = app.signupModel();
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('firstName:', function () {

            it('should be observable', function () {
                expect(viewModel.firstName).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.firstName.isValid).toBeComputed();
                });

            });

            describe('when empty', function () {

                it('should be not valid', function () {
                    viewModel.firstName('');
                    expect(viewModel.firstName.isValid()).toBeFalsy();
                });

            });

            describe('when not empty', function () {

                it('should be valid', function () {
                    viewModel.firstName('firstName');
                    expect(viewModel.firstName.isValid()).toBeTruthy();
                });

            });

        });

        describe('lastName:', function () {

            it('should be observable', function () {
                expect(viewModel.lastName).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.lastName.isValid).toBeComputed();
                });

            });

            describe('when empty', function () {

                it('should be not valid', function () {
                    viewModel.lastName('');
                    expect(viewModel.lastName.isValid()).toBeFalsy();
                });

            });

            describe('when not empty', function () {

                it('should be valid', function () {
                    viewModel.lastName('lastName');
                    expect(viewModel.lastName.isValid()).toBeTruthy();
                });

            });

        });

        describe('userName:', function () {

            it('should be observable', function () {
                expect(viewModel.userName).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.userName.isValid).toBeComputed();
                });

            });

            describe('when empty', function () {

                it('should be not valid', function () {
                    viewModel.userName('');
                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when not e-mail', function () {

                it('should be not valid', function () {
                    viewModel.userName('Username');
                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when e-mail length bigger than 254', function () {

                it('should be not valid', function () {
                    viewModel.userName(utils.createString(250) + '@t.ru');
                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when user with such e-mail exists', function () {

                it('should be not valid', function () {
                    viewModel.userName('test@mail.com');
                    viewModel.userExists(true);

                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when meet all requirements', function () {

                it('should be valid', function () {
                    viewModel.userName('test@mail.com');
                    viewModel.userExists(false);

                    expect(viewModel.userName.isValid()).toBeTruthy();
                });

            });

        });

        describe('password:', function () {

            it('should be observable', function () {
                expect(viewModel.password).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.password.isValid).toBeComputed();
                });

            });

            describe('hasSpaces:', function () {

                it('should be computed', function () {
                    expect(viewModel.password.hasSpaces).toBeComputed();
                });

                describe('when password not has spaces', function () {

                    it('should return true', function () {
                        viewModel.password('abcANC123');
                        expect(viewModel.password.hasSpaces()).toBeTruthy();
                    });

                });

                describe('when password has spaces', function () {

                    it('should return false', function () {
                        viewModel.password('abcAN   C123');
                        expect(viewModel.password.hasSpaces()).toBeFalsy();
                    });

                });

            });

            describe('hasMoreThanSevenSymbols:', function () {

                it('should be computed', function () {
                    expect(viewModel.password.hasMoreThanSevenSymbols).toBeComputed();
                });

                describe('when password not less 7 symbols', function () {

                    it('should return true', function () {
                        viewModel.password('abcANC123');
                        expect(viewModel.password.hasMoreThanSevenSymbols()).toBeTruthy();
                    });

                });

                describe('when password has less 7 symbols', function () {

                    it('should return false', function () {
                        viewModel.password('abcAN');
                        expect(viewModel.password.hasMoreThanSevenSymbols()).toBeFalsy();
                    });

                });

            });

            describe('when is empty', function () {

                it('should be not valid', function () {
                    viewModel.password('');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when less than 7 characters', function () {

                it('should be not valid', function () {
                    viewModel.password('some');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when contain whitespace', function () {

                it('should be not valid', function () {
                    viewModel.password('Pass word1!');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when meet all requirements', function () {

                it('should be valid', function () {
                    viewModel.password('Password1!');
                    expect(viewModel.password.isValid()).toBeTruthy();
                });

            });

        });

        describe('grecaptchaResponse', function() {
            it('should be observable', function() {
                expect(viewModel.grecaptchaResponse).toBeObservable();
            });
        });

        describe('isUserNameEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isUserNameEditing).toBeObservable();
            });

        });

        describe('isUserNameValidating:', function () {

            it('should be observable', function () {
                expect(viewModel.isUserNameValidating).toBeObservable();
            });

        });

        describe('isPasswordEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isPasswordEditing).toBeObservable();
            });

        });

        describe('isFirstNameErrorVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isFirstNameErrorVisible).toBeObservable();
            });

        });

        describe('isLastNameErrorVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isLastNameErrorVisible).toBeObservable();
            });

        });

        describe('onFocusFirstName:', function () {

            it('should be function', function () {
                expect(viewModel.onFocusFirstName).toBeFunction();
            });

            it('should set isFullNameErrorVisible to false', function () {
                viewModel.isFirstNameErrorVisible(true);
                viewModel.onFocusFirstName();
                expect(viewModel.isFirstNameErrorVisible()).toBeFalsy();
            });

        });

        describe('onFocusLastName:', function () {

            it('should be function', function () {
                expect(viewModel.onFocusLastName).toBeFunction();
            });

            it('should set isFullNameErrorVisible to false', function () {
                viewModel.isLastNameErrorVisible(true);
                viewModel.onFocusLastName();
                expect(viewModel.isLastNameErrorVisible()).toBeFalsy();
            });

        });

        describe('isFormValid:', function () {

            it('should be computed', function () {
                expect(viewModel.isFormValid).toBeComputed();
            });

            describe('when all data valid', function () {

                it('should be valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.lastName('lastName');
                    viewModel.firstName('firstName');
                    viewModel.grecaptchaResponse('response');

                    expect(viewModel.isFormValid()).toBeTruthy();
                });

            });

            describe('when all data not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('');
                    viewModel.password('');
                    viewModel.lastName('');
                    viewModel.firstName('');
                    viewModel.grecaptchaResponse('');

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when userName not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('');
                    viewModel.password('abcABC123');
                    viewModel.lastName('lastName');
                    viewModel.firstName('firstName');

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when password not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('');
                    viewModel.lastName('lastName');
                    viewModel.firstName('firstName');

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when firstName not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.lastName('lastName');
                    viewModel.firstName('');

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when lastName not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.lastName('');
                    viewModel.firstName('firstName');

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });
        });

        describe('userExists:', function () {

            it('should be observable', function () {
                expect(viewModel.userExists).toBeObservable();
            });

        });

        describe('userPreciselyExists:', function () {

            it('should be computed', function () {
                expect(viewModel.userPreciselyExists).toBeComputed();
            });

        });

        describe('isPasswordVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isPasswordVisible).toBeObservable();
            });

        });

        describe('showHidePassword:', function () {

            it('should be a function', function () {
                expect(viewModel.showHidePassword).toBeFunction();
            });

            describe('when password is not visible', function () {

                it('should show password', function () {
                    viewModel.isPasswordVisible(true);
                    viewModel.showHidePassword();
                    expect(viewModel.isPasswordVisible()).toBeFalsy();
                });

            });

            describe('when password is visible', function () {

                it('should hide password', function () {
                    viewModel.isPasswordVisible(true);
                    viewModel.showHidePassword();
                    expect(viewModel.isPasswordVisible()).toBeFalsy();
                });

            });

        });

        describe('checkUserExists:', function () {

            it('should be a function', function () {
                expect(viewModel.checkUserExists).toBeFunction();
            });

            describe('when user precisely exists', function () {

                it('should not set \"userExists\"', function () {
                    viewModel.userExists(null);
                    spyOn(viewModel, "userPreciselyExists").and.returnValue(true);

                    viewModel.checkUserExists();
                    expect(viewModel.userExists()).toBeNull();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').and.returnValue($.Deferred().promise());
                    spyOn(viewModel, "userPreciselyExists").and.returnValue(true);

                    viewModel.checkUserExists();
                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when user name is empty', function () {

                it('should set \"userExists\" false', function () {
                    spyOn($, 'ajax').and.returnValue($.Deferred().promise());
                    viewModel.userName('');
                    viewModel.userExists(null);
                    viewModel.checkUserExists();

                    expect(viewModel.userExists()).toBeFalsy();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').and.returnValue($.Deferred().promise());
                    viewModel.userName('');
                    viewModel.checkUserExists();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when user name is not e-mail', function () {

                it('should set \"userExists\" false', function () {
                    spyOn($, 'ajax').and.returnValue($.Deferred().promise());
                    viewModel.userName('invalid mail');
                    viewModel.userExists(null);
                    viewModel.checkUserExists();

                    expect(viewModel.userExists()).toBeFalsy();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').and.returnValue($.Deferred().promise());
                    viewModel.userName('invalid mail');
                    viewModel.checkUserExists();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when user name is valid e-mail', function () {

                it('should call \"/api/user/exists"', function () {
                    spyOn($, 'ajax').and.returnValue($.Deferred().promise());
                    viewModel.userName('user@mail.com');
                    viewModel.checkUserExists();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/api/user/exists',
                        data: { email: 'user@mail.com' },
                        type: 'POST'
                    });
                });

                it('should set \"isUserValidating\" true', function () {
                    spyOn($, 'ajax').and.returnValue($.Deferred().promise());
                    viewModel.userName('user@mail.com');
                    viewModel.isUserNameValidating(null);

                    viewModel.checkUserExists();

                    expect(viewModel.isUserNameValidating()).toBeTruthy();
                });

            });

            describe('when request succeed', function () {

                var deferred;

                beforeEach(function () {
                    deferred = $.Deferred(),
                    spyOn($, 'ajax').and.returnValue(deferred.promise());
                });

                describe('and user exists', function () {

                    it('should set \"userExists\" true', function (done) {
                        viewModel.userName('user@mail.com');
                        viewModel.userExists(null);
                        deferred.resolve({ data: true });

                        viewModel.checkUserExists();

                        deferred.promise().always(function () {
                            expect(viewModel.userExists()).toBeTruthy();
                            done();
                        });
                    });

                    it('should change \"userPreciselyExists\" in true', function (done) {
                        viewModel.userName('user@mail.com');
                        viewModel.userExists(null);
                        deferred.resolve({ data: true });

                        viewModel.checkUserExists();

                        deferred.promise().always(function () {
                            expect(viewModel.userPreciselyExists()).toBeTruthy();
                            done();
                        });
                    });

                    describe('and userName is changed', function () {

                        it('should change \"userPreciselyExists\" in false', function (done) {
                            viewModel.userName('user@mail.com');
                            viewModel.userExists(null);
                            deferred.resolve({ data: true });

                            viewModel.checkUserExists();

                            deferred.promise().always(function () {
                                viewModel.userName('newMail');
                                expect(viewModel.userPreciselyExists()).toBeFalsy();
                                done();
                            });
                        });

                    });

                    it('should set \"isUserNameValidating\" false', function (done) {
                        viewModel.userName('user@mail.com');
                        viewModel.isUserNameValidating(null);
                        viewModel.userExists(null);
                        deferred.resolve({ data: true });

                        viewModel.checkUserExists();

                        deferred.promise().always(function () {
                            expect(viewModel.isUserNameValidating()).toBeFalsy();
                            done();
                        });
                    });

                });

                describe('and user not exists', function () {

                    it('should set \"userExists\" false', function (done) {
                        viewModel.userName('user@mail.com');
                        viewModel.userExists(null);
                        deferred.resolve({ data: false });

                        viewModel.checkUserExists();

                        deferred.promise().always(function () {
                            expect(viewModel.userExists()).toBeFalsy();
                            done();
                        });
                    });

                    it('should set \"isUserNameValidating\" false', function (done) {
                        viewModel.userName('user@mail.com');
                        viewModel.isUserNameValidating(null);
                        deferred.resolve({ data: false });

                        viewModel.checkUserExists();

                        deferred.promise().always(function () {
                            expect(viewModel.isUserNameValidating()).toBeFalsy();
                            done();
                        });
                    });

                });

            });

        });

        describe('signUp:', function () {

            var data;
            var trackEventDefer, trackPageviewDefer;
            var ajax;

            beforeEach(function () {
                viewModel.userName('anonymous@easygenerator.com');
                viewModel.password('abcABC123');
                viewModel.firstName('firstName');
                viewModel.lastName('lastName');
                viewModel.grecaptchaResponse('response');

                data = {
                    email: viewModel.userName(),
                    password: viewModel.password(),
                    firstName: viewModel.firstName(),
                    lastName: viewModel.lastName(),
                    grecaptchaResponse: viewModel.grecaptchaResponse()
                };

                ajax = $.Deferred();
                spyOn($, 'ajax').and.returnValue(ajax.promise());

                trackEventDefer = jQuery.Deferred();
                spyOn(app, 'trackEvent').and.returnValue(trackEventDefer.promise);

                trackPageviewDefer = jQuery.Deferred();
                spyOn(app, 'trackPageview').and.returnValue(trackPageviewDefer.promise);
            });

            it('should be a function', function () {
                expect(viewModel.signUp).toBeFunction();
            });

            it('should send event \'Sign up\'', function (done) {
                trackEventDefer.resolve();

                viewModel.signUp();

                trackEventDefer.promise().always(function () {
                    expect(app.trackEvent).toHaveBeenCalledWith(app.constants.events.signup, { username: data.email, firstname: data.firstName, lastname: data.lastName });
                    done();
                });
            });

            it('should track pageview', function (done) {
                trackPageviewDefer.resolve();

                viewModel.signUp();

                trackPageviewDefer.promise().always(function () {
                    expect(app.trackPageview).toHaveBeenCalledWith(app.constants.pageviewUrls.signup);
                    done();
                });
            });

            it('should call \"/api/user/signup"', function () {
                viewModel.signUp();

                expect($.ajax).toHaveBeenCalledWith({
                    url: '/api/user/signup',
                    data: data,
                    type: 'POST'
                });
            });

            describe('request succeeded', function () {
                var trackEventDefer, trackPageviewDefer;
                var username;

                beforeEach(function (done) {
                    spyOn(app, 'openHomePage');

                    ajax.resolve({ data: username });
                    done();
                });

                it('should redirect to home page', function () {
                    viewModel.signUp();
                    expect(app.openHomePage).toHaveBeenCalled();
                });
            });

            describe('request fails', function () {
                beforeEach(function (done) {
                    ajax.reject();
                    done();
                });

                it('should reset isSignupRequestPending to false', function () {
                    viewModel.signUp();

                    expect(viewModel.isSignupRequestPending()).toBeFalsy();
                });
            });

        });

    });

});