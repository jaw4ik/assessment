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

        describe('peopleBusyWithCourseDevelopmentAmount:', function () {

            it('should be defined', function () {
                expect(viewModel.peopleBusyWithCourseDevelopmentAmount).toBeDefined();
            });

            it('should be observable', function () {
                expect(viewModel.peopleBusyWithCourseDevelopmentAmount).toBeObservable();
            });

        });

        describe('needAuthoringTool', function () {

            it('should be defined', function () {
                expect(viewModel.needAuthoringTool).toBeDefined();
            });

            it('should be observable', function () {
                expect(viewModel.needAuthoringTool).toBeObservable();
            });

        });

        describe('usedAuthoringTool', function () {

            it('should be defined', function () {
                expect(viewModel.usedAuthoringTool).toBeDefined();
            });

            it('should be observable', function () {
                expect(viewModel.usedAuthoringTool).toBeObservable();
            });

        });

        describe('isSignupRequestPending:', function () {

            it('should be observable', function () {
                expect(viewModel.isSignupRequestPending).toBeObservable();
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

            describe('when signup request already pending', function () {

                it('should not call \"/api/user/signup"', function () {
                    viewModel.isSignupRequestPending(true);
                    viewModel.peopleBusyWithCourseDevelopmentAmount('2');
                    viewModel.needAuthoringTool('now');
                    viewModel.usedAuthoringTool('PowerPoint');
                    viewModel.signUp();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when signup request is not pending', function () {

                beforeEach(function () {
                    viewModel.peopleBusyWithCourseDevelopmentAmount('2');
                    viewModel.needAuthoringTool('now');
                    viewModel.usedAuthoringTool('PowerPoint');
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
                        var userData = { email: 'user@email.com', password: 'abcABC123!@#', fullName: 'user', phone: '+380971234567', organization: 'ism', country: 'Ukraine' };
                        spyOn(app.clientSessionContext, 'get').and.returnValue(userData);

                        data = {
                            email: userData.email, password: userData.password, fullName: userData.fullName, phone: userData.phone, organization: userData.organization, country: userData.country,
                            PeopleBusyWithCourseDevelopmentAmount: viewModel.peopleBusyWithCourseDevelopmentAmount(), NeedAuthoringTool: viewModel.needAuthoringTool(), UsedAuthoringTool: viewModel.usedAuthoringTool()
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

                            ajax.resolve({ data: 'username@easygenerator.com' });
                            done();
                        });

                        it('should remove user data from client session context', function () {
                            viewModel.signUp();
                            expect(app.clientSessionContext.remove).toHaveBeenCalledWith(app.constants.userSignUpFirstStepData);
                        });

                        it('should track event \'Sign up (2nd step)\'', function () {
                            viewModel.signUp();
                            expect(app.trackEvent).toHaveBeenCalledWith('Sign up (2nd step)', { username: username });
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

        describe('isInitializationContextCorrect', function () {

            it('should be function', function () {
                expect(viewModel.isInitializationContextCorrect).toBeFunction();
            });

            beforeEach(function () {
                spyOn(app, 'assingLocation');
            });

            beforeEach(function () {
                viewModel.peopleBusyWithCourseDevelopmentAmount('2');
                viewModel.needAuthoringTool('now');
                viewModel.usedAuthoringTool('PowerPoint');
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

    });
})