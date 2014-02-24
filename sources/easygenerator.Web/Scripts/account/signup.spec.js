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

        describe('firstName:', function() {

            it('should be observable', function() {
                expect(viewModel.firstName).toBeObservable();
            });

            describe('isValid:', function() {

                it('should be computed', function() {
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

        describe('lastName:', function() {

            it('should be observable', function() {
                expect(viewModel.lastName).toBeObservable();
            });
            
            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.lastName.isValid).toBeComputed();
                });

            });

            describe('when empty', function() {

                it('should be not valid', function () {
                    viewModel.lastName('');
                    expect(viewModel.lastName.isValid()).toBeFalsy();
                });

            });

            describe('when not empty', function() {

                it('should be valid', function() {
                    viewModel.lastName('lastName');
                    expect(viewModel.lastName.isValid()).toBeTruthy();
                });

            });

        });

        describe('phone:', function () {

            it('should be observable', function () {
                expect(viewModel.phone).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.phone.isValid).toBeComputed();
                });

            });

            describe('when empty', function () {

                it('should be not valid', function () {
                    viewModel.phone('');
                    expect(viewModel.phone.isValid()).toBeFalsy();
                });

            });

            describe('when not empty', function () {

                it('should be valid', function () {
                    viewModel.phone('some phone');
                    expect(viewModel.phone.isValid()).toBeTruthy();
                });

            });

        });

        describe('organization:', function () {

            it('should be observable', function () {
                expect(viewModel.organization).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.organization.isValid).toBeComputed();
                });

            });

            describe('when empty', function () {

                it('should be not valid', function () {
                    viewModel.organization('');
                    expect(viewModel.organization.isValid()).toBeFalsy();
                });

            });

            describe('when not empty', function () {

                it('should be valid', function () {
                    viewModel.organization('some organization');
                    expect(viewModel.organization.isValid()).toBeTruthy();
                });

            });

        });

        describe('country:', function () {

            it('should be observable', function () {
                expect(viewModel.country).toBeObservable();
            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.country.isValid).toBeComputed();
                });

            });

            describe('when null', function () {

                it('should be not valid', function () {
                    viewModel.country(null);
                    expect(viewModel.country.isValid()).toBeFalsy();
                });

                it('should set country error message visible to true', function() {
                    viewModel.isCountryErrorVisible(false);
                    viewModel.country(undefined);
                    expect(viewModel.isCountryErrorVisible()).toBeTruthy();
                });

            });

            describe('when not empty', function () {

                it('should be valid', function () {
                    viewModel.country('some country');
                    expect(viewModel.country.isValid()).toBeTruthy();
                });

                it('should set phone code', function () {
                    viewModel.country('Ukraine');
                    expect(viewModel.phoneCode()).toBe('+ 380');
                });

                it('should set country error message visible to false', function () {
                    viewModel.isCountryErrorVisible(true);
                    viewModel.country('Ukraine');
                    expect(viewModel.isCountryErrorVisible()).toBeFalsy();
                });

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
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeTruthy();
                });

            });

            describe('when all data not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('');
                    viewModel.password('');
                    viewModel.lastName('');
                    viewModel.firstName('');
                    viewModel.phone('');
                    viewModel.organization('');
                    viewModel.country(null);
                    viewModel.isLicenseAgreed(false);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when userName not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('');
                    viewModel.password('abcABC123');
                    viewModel.lastName('lastName');
                    viewModel.firstName('firstName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when password not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('');
                    viewModel.lastName('lastName');
                    viewModel.firstName('firstName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when firstName not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.lastName('lastName');
                    viewModel.firstName('');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });
            
            describe('when lastName not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.lastName('');
                    viewModel.firstName('firstName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when phone not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.lastName('lastName');
                    viewModel.firstName('firstName');
                    viewModel.phone('');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when organization not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.lastName('lastName');
                    viewModel.firstName('firstName');
                    viewModel.phone('some phone');
                    viewModel.organization('');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when country not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.lastName('lastName');
                    viewModel.firstName('firstName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country(null);
                    viewModel.isLicenseAgreed(true);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

            describe('when isLicenseAgreed not valid', function () {

                it('should be not valid', function () {
                    viewModel.userName('anonymous@easygenerator.com');
                    viewModel.password('abcABC123');
                    viewModel.lastName('lastName');
                    viewModel.firstName('firstName');
                    viewModel.phone('some phone');
                    viewModel.organization('some organization');
                    viewModel.country('some country');
                    viewModel.isLicenseAgreed(false);

                    expect(viewModel.isFormValid()).toBeFalsy();
                });

            });

        });

        describe('isUserNameEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isUserNameEditing).toBeObservable();
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

            describe('hasUpperAndLowerCaseLetters:', function () {
                
                it('should be computed', function () {
                    expect(viewModel.password.hasUpperAndLowerCaseLetters).toBeComputed();
                });

                describe('when password has uppercase and lowercase letters', function() {

                    it('should return true', function() {
                        viewModel.password('SomePassword');
                        expect(viewModel.password.hasUpperAndLowerCaseLetters()).toBeTruthy();
                    });

                });
                
                describe('when password not has uppercase and lowercase letters', function () {
                    
                    it('should return false', function () {
                        viewModel.password('111');
                        expect(viewModel.password.hasUpperAndLowerCaseLetters()).toBeFalsy();
                    });
                    
                });

            });
            
            describe('hasNumbers:', function () {

                it('should be computed', function () {
                    expect(viewModel.password.hasNumbers).toBeComputed();
                });

                describe('when password has number', function() {

                    it('should return true', function() {
                        viewModel.password('111asd');
                        expect(viewModel.password.hasNumbers()).toBeTruthy();
                    });

                });
                
                describe('when password not has number', function () {

                    it('should return false', function () {
                        viewModel.password('abcABC');
                        expect(viewModel.password.hasNumbers()).toBeFalsy();
                    });

                });

            });
            
            describe('hasSpaces:', function () {

                it('should be computed', function () {
                    expect(viewModel.password.hasSpaces).toBeComputed();
                });

                describe('when password not has spaces', function() {

                    it('should return true', function() {
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

            describe('when not contain upper case letter', function () {

                it('should be not valid', function () {
                    viewModel.password('password');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when not contain lower case letter', function () {

                it('should be not valid', function () {
                    viewModel.password('PASSWORD');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when not contain digit', function () {

                it('should be not valid', function () {
                    viewModel.password('Password');
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

        describe('isPasswordEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isPasswordEditing).toBeObservable();
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

        describe('isLicenseAgreed:', function () {

            it('should be observable', function () {
                expect(viewModel.isLicenseAgreed).toBeObservable();
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

        describe('isUserNameValidating:', function () {

            it('should be observable', function () {
                expect(viewModel.isUserNameValidating).toBeObservable();
            });

        });

        describe('checkUserExists:', function () {

            it('should be a function', function () {
                expect(viewModel.checkUserExists).toBeFunction();
            });

            describe('when user precisely exists', function () {

                it('should not set \"userExists\"', function () {
                    viewModel.userExists(null);
                    spyOn(viewModel, "userPreciselyExists").andReturn(true);

                    viewModel.checkUserExists();
                    expect(viewModel.userExists()).toBeNull();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    spyOn(viewModel, "userPreciselyExists").andReturn(true);

                    viewModel.checkUserExists();
                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when user name is empty', function () {

                it('should set \"userExists\" false', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('');
                    viewModel.userExists(null);
                    viewModel.checkUserExists();

                    expect(viewModel.userExists()).toBeFalsy();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('');
                    viewModel.checkUserExists();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when user name is not e-mail', function () {

                it('should set \"userExists\" false', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('invalid mail');
                    viewModel.userExists(null);
                    viewModel.checkUserExists();

                    expect(viewModel.userExists()).toBeFalsy();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('invalid mail');
                    viewModel.checkUserExists();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when user name is valid e-mail', function () {

                it('should call \"/api/user/exists"', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('user@mail.com');
                    viewModel.checkUserExists();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/api/user/exists',
                        data: { email: 'user@mail.com' },
                        type: 'POST'
                    });
                });

                it('should set \"isUserValidating\" true', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('user@mail.com');
                    viewModel.isUserNameValidating(null);

                    viewModel.checkUserExists();

                    expect(viewModel.isUserNameValidating()).toBeTruthy();
                });

            });

            describe('when request succeed', function () {

                var deferred,
                    promise;

                beforeEach(function () {
                    deferred = $.Deferred(),
                    promise = deferred.promise().always(function () { });
                    spyOn($, 'ajax').andReturn(deferred.promise());
                });

                describe('and user exists', function () {

                    it('should set \"userExists\" true', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.userExists(null);
                        deferred.resolve({ data: true });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.userExists()).toBeTruthy();
                        });
                    });

                    it('should change \"userPreciselyExists\" in true', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.userExists(null);
                        deferred.resolve({ data: true });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.userPreciselyExists()).toBeTruthy();
                        });
                    });

                    describe('and userName is changed', function () {

                        it('should change \"userPreciselyExists\" in false', function () {
                            viewModel.userName('user@mail.com');
                            viewModel.userExists(null);
                            deferred.resolve({ data: true });

                            viewModel.checkUserExists();

                            waitsFor(function () {
                                return promise.state() != "pending";
                            });

                            runs(function () {
                                viewModel.userName('newMail');
                                expect(viewModel.userPreciselyExists()).toBeFalsy();
                            });

                        });

                    });

                    it('should set \"isUserNameValidating\" false', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.isUserNameValidating(null);
                        viewModel.userExists(null);
                        deferred.resolve({ data: true });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.isUserNameValidating()).toBeFalsy();
                        });
                    });

                });

                describe('and user not exists', function () {

                    it('should set \"userExists\" false', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.userExists(null);
                        deferred.resolve({ data: false });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.userExists()).toBeFalsy();
                        });
                    });

                    it('should set \"isUserNameValidating\" false', function () {
                        viewModel.userName('user@mail.com');
                        viewModel.isUserNameValidating(null);
                        deferred.resolve({ data: false });

                        viewModel.checkUserExists();

                        waitsFor(function () {
                            return promise.state() != "pending";
                        });

                        runs(function () {
                            expect(viewModel.isUserNameValidating()).toBeFalsy();
                        });
                    });

                });

            });

        });

        describe('signUp:', function () {

            var data;
            var currentHref = 'http://easygenerator.com/signup';
            var trackEventDefer, trackPageviewDefer;

            beforeEach(function () {
                viewModel.userName('anonymous@easygenerator.com');
                viewModel.password('abcABC123');
                viewModel.firstName('firstName');
                viewModel.lastName('lastName');
                viewModel.phone('some phone');
                viewModel.organization('some organization');
                viewModel.country('some country');

                data = {
                    email: viewModel.userName(),
                    password: viewModel.password(),
                    firstName: viewModel.firstName(),
                    lastName: viewModel.lastName(),
                    phone: viewModel.phone(),
                    organization: viewModel.organization(),
                    country: viewModel.country()
                };

                spyOn(app, 'assingLocation');
                spyOn(app, 'getLocationHref').andReturn(currentHref);
                spyOn(app.clientSessionContext, 'set');

                trackEventDefer = jQuery.Deferred();
                spyOn(app, 'trackEvent').andReturn(trackEventDefer.promise);

                trackPageviewDefer = jQuery.Deferred();
                spyOn(app, 'trackPageview').andReturn(trackPageviewDefer.promise);
            });

            it('should be a function', function () {
                expect(viewModel.signUp).toBeFunction();
            });

            it('should set first sign up step data to client sessions context', function () {
                viewModel.signUp();
                expect(app.clientSessionContext.set).toHaveBeenCalledWith(app.constants.userSignUpFirstStepData, data);
            });

            it('should send event \'Sign up (1st step)\'', function () {
                viewModel.signUp();

                var promise = trackEventDefer.promise().always(function () { });

                trackEventDefer.reject();

                waitsFor(function () {
                    return promise.state() != 'pending';
                });
                runs(function () {
                    expect(app.trackEvent).toHaveBeenCalledWith('Sign up (1st step)', { username: data.email });
                });
            });

            it('should track pageview', function () {
                viewModel.signUp();

                var promise = trackPageviewDefer.promise().always(function () { });

                trackPageviewDefer.reject();

                waitsFor(function () {
                    return promise.state() != 'pending';
                });
                runs(function () {
                    expect(app.trackPageview).toHaveBeenCalledWith(app.constants.pageviewUrls.signupFirstStep);
                });
            });

            describe('when event sent and pageview tracked', function () {

                beforeEach(function () {
                    trackEventDefer.resolve();
                    trackPageviewDefer.resolve();
                });

                it('should assing window location', function () {
                    viewModel.signUp();

                    var trackPageviewPromise = trackPageviewDefer.promise().always(function () { });
                    var trackEventPromise = trackEventDefer.promise().always(function () { });

                    waitsFor(function () {
                        return trackPageviewPromise.state() != 'pending' && trackEventPromise.state() != 'pending';
                    });
                    runs(function () {
                        expect(app.assingLocation).toHaveBeenCalledWith('http://easygenerator.com/signupsecondstep');
                    });
                });

            });

            describe('when event send and pageview not tracked', function() {
                
                beforeEach(function () {
                    trackEventDefer.resolve();
                    trackPageviewDefer.reject();
                });

                it('should assing window location', function () {
                    viewModel.signUp();

                    var trackPageviewPromise = trackPageviewDefer.promise().always(function () { });
                    var trackEventPromise = trackEventDefer.promise().always(function () { });

                    waitsFor(function () {
                        return trackPageviewPromise.state() != 'pending' && trackEventPromise.state() != 'pending';
                    });
                    runs(function () {
                        expect(app.assingLocation).toHaveBeenCalledWith('http://easygenerator.com/signupsecondstep');
                    });
                });

            });

            describe('when event not send and pageview tracked', function () {

                beforeEach(function () {
                    trackEventDefer.reject();
                    trackPageviewDefer.resolve();
                });

                it('should assing window location', function () {
                    viewModel.signUp();

                    var trackPageviewPromise = trackPageviewDefer.promise().always(function () { });
                    var trackEventPromise = trackEventDefer.promise().always(function () { });

                    waitsFor(function () {
                        return trackPageviewPromise.state() != 'pending' && trackEventPromise.state() != 'pending';
                    });
                    runs(function () {
                        expect(app.assingLocation).toHaveBeenCalledWith('http://easygenerator.com/signupsecondstep');
                    });
                });

            });

            describe('when not event send and pageview not tracked', function () {

                beforeEach(function () {
                    trackEventDefer.reject();
                    trackPageviewDefer.reject();
                });

                it('should assing window location', function () {
                    viewModel.signUp();

                    var trackPageviewPromise = trackPageviewDefer.promise().always(function () { });
                    var trackEventPromise = trackEventDefer.promise().always(function () { });

                    waitsFor(function () {
                        return trackPageviewPromise.state() != 'pending' && trackEventPromise.state() != 'pending';
                    });
                    runs(function () {
                        expect(app.assingLocation).toHaveBeenCalledWith('http://easygenerator.com/signupsecondstep');
                    });
                });

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

        describe('isPhoneErrorVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isPhoneErrorVisible).toBeObservable();
            });

        });

        describe('isOrganizationErrorVisible', function () {

            it('should be observable', function () {
                expect(viewModel.isOrganizationErrorVisible).toBeObservable();
            });

        });

        describe('isCountrySuccessVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isCountrySuccessVisible).toBeObservable();
            });

        });

        describe('isCountrySuccessVisible', function () {

            it('should be observable', function () {
                expect(viewModel.isCountrySuccessVisible).toBeObservable();
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

        describe('onFocusPhone:', function () {

            it('should be function', function () {
                expect(viewModel.onFocusPhone).toBeFunction();
            });

            it('should set isPhoneErrorVisible to false', function () {
                viewModel.isPhoneErrorVisible(true);
                viewModel.onFocusPhone();
                expect(viewModel.isPhoneErrorVisible()).toBeFalsy();
            });

        });

        describe('onFocusOrganization:', function () {

            it('should be function', function () {
                expect(viewModel.onFocusOrganization).toBeFunction();
            });

            it('should set isOrganizationErrorVisible to false', function () {
                viewModel.isOrganizationErrorVisible(true);
                viewModel.onFocusOrganization();
                expect(viewModel.isOrganizationErrorVisible()).toBeFalsy();
            });

        });

        describe('validatePhone:', function () {

            it('should be function', function () {
                expect(viewModel.validatePhone).toBeFunction();
            });

            describe('when phone has only whitespaces', function () {

                it('should be set isPhoneErrorVisible to true', function () {
                    viewModel.phone('        ');
                    viewModel.isPhoneErrorVisible(false);
                    viewModel.validatePhone();
                    expect(viewModel.isPhoneErrorVisible()).toBeTruthy();
                });

            });

            describe('when phone not has only whitespaces', function () {

                it('should be set isPhoneErrorVisible to false', function () {
                    viewModel.phone('    some phone    ');
                    viewModel.isPhoneErrorVisible(true);
                    viewModel.validatePhone();
                    expect(viewModel.isPhoneErrorVisible()).toBeFalsy();
                });

            });

        });

        describe('validateOrganization:', function () {

            it('should be function', function () {
                expect(viewModel.validateOrganization).toBeFunction();
            });

            describe('when organization has only whitespaces', function () {

                it('should be set isOrganizationErrorVisible to true', function () {
                    viewModel.organization('        ');
                    viewModel.isOrganizationErrorVisible(false);
                    viewModel.validateOrganization();
                    expect(viewModel.isOrganizationErrorVisible()).toBeTruthy();
                });

            });

            describe('when organization not has only whitespaces', function () {

                it('should be set isOrganizationErrorVisible to false', function () {
                    viewModel.organization('    some organization    ');
                    viewModel.isOrganizationErrorVisible(true);
                    viewModel.validateOrganization();
                    expect(viewModel.isOrganizationErrorVisible()).toBeFalsy();
                });

            });
        });

        describe('phoneCode:', function () {

            it('should be observable', function () {
                expect(viewModel.phoneCode).toBeObservable();
            });

            it('should be equal \'+ ( ... )\'', function () {
                expect(viewModel.phoneCode()).toEqual('+ ( ... )');
            });

        });
    });

});