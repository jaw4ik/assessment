define([], function () {
    "use strinct";

    var viewModel;

    describe('viewModel [signupsecondstep]', function () {
        beforeEach(function () {
            viewModel = app.signUpSecondStepModel();
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
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

                it('should set country error message visible to true', function () {
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

        describe('phoneCode:', function () {

            it('should be observable', function () {
                expect(viewModel.phoneCode).toBeObservable();
            });

            it('should be equal \'+ ( ... )\'', function () {
                expect(viewModel.phoneCode()).toEqual('+ ( ... )');
            });

        });

        describe('userRole:', function () {

            it('should be observable', function () {
                expect(viewModel.userRole).toBeObservable();
            });

        });

        describe('isFormValid:', function () {

            describe('when country is invalid', function () {

                it('should be falsy', function () {
                    viewModel.country('');

                    expect(viewModel.isFormValid()).toBeFalsy();
                });
            });

            describe('when phone is not valid', function () {

                it('should be falsy', function () {
                    viewModel.phone('');

                    expect(viewModel.isFormValid()).toBeFalsy();
                });
            });

            describe('when country and phone are valid', function () {

                it('should be true', function () {
                    viewModel.country('country');
                    viewModel.phone('phone');

                    expect(viewModel.isFormValid()).toBeTruthy();
                });

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


        describe('isCountrySuccessVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isCountrySuccessVisible).toBeObservable();
            });

        });

        describe('isCountryErrorVisible', function () {

            it('should be observable', function () {
                expect(viewModel.isCountryErrorVisible).toBeObservable();
            });

        });

        describe('isPhoneErrorVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isPhoneErrorVisible).toBeObservable();
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

        describe('isSignupRequestPending:', function () {

            it('should be observable', function () {
                expect(viewModel.isSignupRequestPending).toBeObservable();
            });

        });

        describe('isInitializationContextCorrect', function () {

            it('should be function', function () {
                expect(viewModel.isInitializationContextCorrect).toBeFunction();
            });

            beforeEach(function () {
                spyOn(app, 'assingLocation');
            });

            beforeEach(function () {
                viewModel.userRole('not in the list');
            });

            it('should get user data from client session context', function () {
                spyOn(app.clientSessionContext, 'get').and.returnValue(null);
                viewModel.isInitializationContextCorrect();

                expect(app.clientSessionContext.get).toHaveBeenCalledWith(app.constants.userSignUpFirstStepData);
            });

            describe('and when user data is null', function () {
                beforeEach(function () {
                    spyOn(app.clientSessionContext, 'get').and.returnValue(null);
                });

                it('should return false', function () {
                    var result = viewModel.isInitializationContextCorrect();
                    expect(result).toBeFalsy();
                });
            });

            describe('and when user data is object', function () {
                beforeEach(function () {
                    spyOn(app.clientSessionContext, 'get').and.returnValue({});
                });

                it('should return true', function () {
                    var result = viewModel.isInitializationContextCorrect();
                    expect(result).toBeTruthy();
                });
            });

        });


        describe('signup', function () {

            it('should be function', function () {
                expect(viewModel.signUp).toBeFunction();
            });

            var ajax;
            beforeEach(function () {
                ajax = $.Deferred();
                spyOn($, 'ajax').and.returnValue(ajax.promise());
                spyOn(app, 'assingLocation');
            });

            afterEach(function () {
                localStorage.removeItem('showCreateCourseView');
            });

            describe('when country is invalid', function () {

                it('should not call \"/api/user/signup"', function () {
                    viewModel.country('');
                    viewModel.signUp();

                    expect($.ajax).not.toHaveBeenCalled();
                });
            });

            describe('when phone is not valid', function () {

                it('should not call \"/api/user/signup"', function () {
                    viewModel.phone('');
                    viewModel.signUp();

                    expect($.ajax).not.toHaveBeenCalled();
                });
            });

            describe('when signup request already pending', function () {

                it('should not call \"/api/user/signup"', function () {
                    viewModel.isSignupRequestPending(true);
                    viewModel.signUp();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when signup request is not pending', function () {

                beforeEach(function () {
                    viewModel.phone('+380971234567');
                    viewModel.country('Ukraine');
                    viewModel.userRole('not in the list');
                });

                it('should get user data from client session context', function () {
                    spyOn(app.clientSessionContext, 'get').and.returnValue({});
                    viewModel.signUp();

                    expect(app.clientSessionContext.get).toHaveBeenCalledWith(app.constants.userSignUpFirstStepData);
                });

                describe('and when user data is null', function () {

                    beforeEach(function () {
                        spyOn(app.clientSessionContext, 'get').and.returnValue(null);
                    });

                    it('should throw exception \'User sign up data is not defined\'', function () {
                        var f = function () {
                            viewModel.signUp();
                        };
                        expect(f).toThrow('User sign up data is not defined');
                    });
                });

                describe('and when user data is an object', function () {

                    var data;

                    beforeEach(function () {
                        var userData = { email: 'user@email.com', password: 'abcABC123!@#', firstName: 'first name', lastName: 'last name', fullName: 'user', phone: '+380971234567', country: 'Ukraine' };
                        spyOn(app.clientSessionContext, 'get').and.returnValue(userData);

                        data = {
                            email: userData.email,
                            password: userData.password,
                            firstName: userData.firstName,
                            lastName: userData.lastName,
                            fullName: userData.fullName,
                            phone: viewModel.phone(),
                            country: viewModel.country(),
                            userRole: viewModel.userRole()
                        };
                    });

                    it('should set isSignupRequestPending', function () {
                        viewModel.isSignupRequestPending(false);

                        viewModel.signUp();

                        expect(viewModel.isSignupRequestPending()).toBeTruthy();
                    });

                    it('should call \"/api/user/signup"', function () {
                        viewModel.signUp();

                        expect($.ajax).toHaveBeenCalledWith({
                            url: '/api/user/signup',
                            data: data,
                            type: 'POST'
                        });
                    });

                    describe('and request succeded', function () {

                        var trackEventDefer, trackPageviewDefer;;
                        var username;

                        beforeEach(function (done) {
                            trackEventDefer = jQuery.Deferred();
                            spyOn(app, 'trackEvent')(trackEventDefer.promise);

                            trackPageviewDefer = jQuery.Deferred();
                            spyOn(app, 'trackPageview').and.returnValue(trackPageviewDefer.promise);

                            spyOn(app.clientSessionContext, 'remove');
                            username = 'username@easygenerator.com';

                            spyOn(app, 'openHomePage');

                            ajax.resolve({ data: username });
                            done();
                        });

                        it('should remove user data from client session context', function () {
                            viewModel.signUp();
                            expect(app.clientSessionContext.remove).toHaveBeenCalledWith(app.constants.userSignUpFirstStepData);
                        });

                        it('should track event \'Sign up (2nd step)\'', function () {
                            viewModel.signUp();
                            expect(app.trackEvent).toHaveBeenCalledWith('Sign up (2nd step)', { username: username, firstname: data.firstName, lastname: data.lastName, role: data.userRole });
                        });

                        it('should track pageview', function () {
                            viewModel.signUp();
                            expect(app.trackPageview).toHaveBeenCalledWith(app.constants.pageviewUrls.signupSecondStep);
                        });

                        describe('when event sent and pageview tracked', function () {

                            beforeEach(function (done) {
                                trackEventDefer.resolve();
                                trackPageviewDefer.resolve();
                                done();
                            });

                            it('should redirect to home page', function () {
                                viewModel.signUp();
                                expect(app.openHomePage).toHaveBeenCalled();
                            });

                        });

                        describe('when event sent and pageview not tracked', function () {

                            beforeEach(function (done) {
                                trackEventDefer.resolve();
                                trackPageviewDefer.reject();
                                done();
                            });

                            it('should redirect to home page', function () {
                                viewModel.signUp();
                                expect(app.openHomePage).toHaveBeenCalled();
                            });

                        });

                        describe('when event not sent and pageview tracked', function () {

                            beforeEach(function (done) {
                                trackEventDefer.reject();
                                trackPageviewDefer.resolve();
                                done();
                            });

                            it('should redirect to home page', function () {
                                viewModel.signUp();
                                expect(app.openHomePage).toHaveBeenCalled();
                            });

                        });

                        describe('when event not sent and pageview not tracked', function () {

                            beforeEach(function (done) {
                                trackEventDefer.reject();
                                trackPageviewDefer.reject();
                                done();
                            });

                            it('should redirect to home page', function () {
                                viewModel.signUp();
                                expect(app.openHomePage).toHaveBeenCalled();
                            });

                        });

                    });

                    describe('and request fails', function () {

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

    });
})