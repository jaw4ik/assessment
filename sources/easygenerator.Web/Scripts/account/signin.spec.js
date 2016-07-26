define([], function () {
    "use strict";

    describe('viewModel [signin]', function () {

        var viewModel;

        beforeEach(function () {
            viewModel = app.signinViewModel();
        });

        describe('username:', function () {

            it('should be observable', function () {
                expect(viewModel.username).toBeObservable();
            });


            describe('isModified', function () {

                it('should be observable', function () {
                    expect(viewModel.username).toBeObservable();
                });

                it('should be false by default', function () {
                    expect(viewModel.username.isModified()).toBeFalsy();
                });

            });

            describe('markAsModified', function () {

                it('should be function', function () {
                    expect(viewModel.username.markAsModified).toBeFunction();
                });

                it('should mark question as modified', function () {
                    viewModel.username.isModified(false);
                    viewModel.username.markAsModified();
                    expect(viewModel.username.isModified()).toBeTruthy();
                });

            });

            describe('isValid:', function () {

                it('should be computed', function () {
                    expect(viewModel.username.isValid).toBeComputed();
                });

                describe('when username is not a string', function () {

                    it('should be false', function () {
                        viewModel.username(null);
                        expect(viewModel.username.isValid()).toBeFalsy();
                    });

                });

                describe('when username is an empty string', function () {

                    it('should be true', function () {
                        viewModel.username('');
                        expect(viewModel.username.isValid()).toBeFalsy();
                    });

                });

                describe('when username is a not-e-mail string', function () {

                    it('should be true', function () {
                        viewModel.username('Username');
                        expect(viewModel.username.isValid()).toBeFalsy();
                    });

                });

                describe('when username is an email string', function () {

                    it('should be true', function () {
                        viewModel.username('username@easygenerator.com');
                        expect(viewModel.username.isValid()).toBeTruthy();
                    });

                });

            });

        });

        describe('password:', function () {

            it('should be observable', function () {
                expect(viewModel.password).toBeObservable();
            });

        });

        describe('isPasswordVisible', function () {

            it('should be observable', function () {
                expect(viewModel.isPasswordVisible).toBeObservable();
            });

        });

        describe('togglePasswordVisibility', function () {

            it('should be function', function () {
                expect(viewModel.togglePasswordVisibility).toBeFunction();
            });

            describe('when password is visible', function () {

                it('should make password not visible', function () {
                    viewModel.isPasswordVisible(true);
                    viewModel.togglePasswordVisibility();

                    expect(viewModel.isPasswordVisible()).toBeFalsy();
                });

            });

            describe('when password is not visible', function () {

                it('should make password visible', function () {
                    viewModel.isPasswordVisible(false);
                    viewModel.togglePasswordVisibility();

                    expect(viewModel.isPasswordVisible()).toBeTruthy();
                });

            });
        });

        describe('errorMessage:', function () {

            it('should be observable', function () {
                expect(viewModel.errorMessage).toBeObservable();
            });

            describe('when error message exists', function () {

                beforeEach(function () {
                    viewModel.username("");
                    viewModel.password("");
                    viewModel.errorMessage("error");
                });

                describe('and username changed', function () {

                    it('should clear error message', function () {
                        viewModel.username("username@easygenerator.com");
                        expect(viewModel.errorMessage()).toBe("");
                    });

                });

                describe('and password changed', function () {

                    it('should clear error message', function () {
                        viewModel.password("Abc123!");
                        expect(viewModel.errorMessage()).toBe("");
                    });

                });

            });

        });

        describe('hasError:', function () {

            it('should be observable', function () {
                expect(viewModel.hasError).toBeComputed();
            });

            describe('when errorMessage exists', function () {

                it('should be true', function () {
                    viewModel.errorMessage("error");
                    expect(viewModel.hasError()).toBeTruthy();
                });

            });

            describe('when errorMessage does not exist', function () {

                it('should be false', function () {
                    viewModel.errorMessage(null);
                    expect(viewModel.hasError()).toBeFalsy();
                });

            });

            describe('when errorMessage is empty', function () {

                it('should be false', function () {
                    viewModel.errorMessage("");
                    expect(viewModel.hasError()).toBeFalsy();
                });

            });

        });

        describe('canSubmit', function () {

            it('should be function', function () {
                expect(viewModel.canSubmit).toBeComputed();
            });

            describe('when username is empty', function () {

                it('should be false', function () {
                    viewModel.username("");
                    viewModel.password("abc123");

                    expect(viewModel.canSubmit()).toBeFalsy();
                });

            });

            describe('when username is whitespace', function () {

                it('should be false', function () {
                    viewModel.username("            ");
                    viewModel.password("abc123");

                    expect(viewModel.canSubmit()).toBeFalsy();
                });

            });

            describe('when username is not an email string', function () {

                it('should be false', function () {
                    viewModel.username("username");
                    viewModel.password("abc123");

                    expect(viewModel.canSubmit()).toBeFalsy();
                });

            });

            describe('when password is empty', function () {

                it('should be false', function () {
                    viewModel.username("username@easygenerator.com");
                    viewModel.password("");

                    expect(viewModel.canSubmit()).toBeFalsy();
                });

            });

            describe('when password is whitespace', function () {

                it('should be false', function () {
                    viewModel.username("username@easygenerator.com");
                    viewModel.password("            ");

                    expect(viewModel.canSubmit()).toBeFalsy();
                });

            });

            describe('when username is an email string and password is empty or whitespace', function () {

                it('should be true', function () {
                    viewModel.username("username@easygenerator.com");
                    viewModel.password("abc123");

                    expect(viewModel.canSubmit()).toBeTruthy();
                });

            });

        });

        describe('submit:', function () {

            var ajax;

            beforeEach(function () {
                ajax = $.Deferred();
                spyOn($, "ajax").and.returnValue(ajax.promise());
            });

            it('should be function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            describe('when username is empty', function () {

                it('should not send request to /auth/token', function () {
                    viewModel.username("");
                    viewModel.password("abc123");

                    viewModel.submit();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when username is whitespace', function () {

                it('should not send request to /auth/token', function () {
                    viewModel.username("            ");
                    viewModel.password("abc123");

                    viewModel.submit();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when username is not an email string', function () {

                it('should not send request to /auth/token', function () {
                    viewModel.username("username");
                    viewModel.password("abc123");

                    viewModel.submit();

                    expect($.ajax).not.toHaveBeenCalled();
                });
            });

            describe('when password is empty', function () {

                it('should not send request to /auth/token', function () {
                    viewModel.username("username@easygenerator.com");
                    viewModel.password("");

                    viewModel.submit();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when password is whitespace', function () {

                it('should not send request to /auth/token', function () {
                    viewModel.username("username@easygenerator.com");
                    viewModel.password("            ");

                    viewModel.submit();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when username is an email string and password is not empty or whitespace', function () {

                var username = "username@easygenerator.com";
                var firstname = "test first name";
                var lastname = "test last name";
                var password = "Abc123! ";
                var grant_type = "password";
                var endpoints = window.auth.getRequiredEndpoints();

                beforeEach(function () {
                    viewModel.username(username);
                    viewModel.password(password);
                });

                it('should trim username before sending request', function () {
                    viewModel.username("   " + username + "    ");

                    viewModel.submit();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/auth/token',
                        data: {
                            username: username,
                            password: password,
                            grant_type: grant_type,
                            endpoints: endpoints
                        },
                        type: 'POST'
                    });
                });

                it('should make username lowercase before sending request', function () {
                    viewModel.username(username.toUpperCase());

                    viewModel.submit();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/auth/token',
                        data: {
                            username: username,
                            password: password,
                            grant_type: grant_type,
                            endpoints: endpoints
                        },
                        type: 'POST'
                    });
                });

                it('should clear errorMessage before sending request', function () {
                    viewModel.errorMessage("message");
                    viewModel.submit();
                    expect(viewModel.errorMessage()).toEqual("");
                });

                it('should send request to auth/token', function () {
                    viewModel.submit();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/auth/token',
                        data: {
                            username: username,
                            password: password,
                            grant_type: grant_type,
                            endpoints: endpoints
                        },
                        type: 'POST'
                    });
                });

                it('should set isSigninRequestPending to true', function () {
                    viewModel.isSigninRequestPending(false);
                    viewModel.submit();

                    expect(viewModel.isSigninRequestPending()).toEqual(true);
                });

                describe('when request failed', function () {

                    var message = "message";

                    beforeEach(function (done) {
                        ajax.reject(message);
                        done();
                    });

                    it('should display message with an error', function () {
                        viewModel.submit();
                        expect(viewModel.errorMessage()).toEqual(message);
                    });

                    it('should set isSigninRequestPending to false', function () {
                        viewModel.isSigninRequestPending(true);
                        viewModel.submit();

                        expect(viewModel.isSigninRequestPending()).toEqual(false);
                    });

                });

                describe('when request succeed', function () {

                    describe('and response is not an object', function () {

                        beforeEach(function (done) {
                            ajax.resolve();
                            done();
                        });

                        it('should throw exception', function () {
                            var f = function () {
                                viewModel.submit();
                            };

                            expect(f).toThrow('Response is not an object');
                        });

                    });

                    describe('and response is not successful', function () {

                        describe('and message does not exist', function () {

                            beforeEach(function (done) {
                                ajax.resolve({ success: false });
                                done();
                            });

                            it('should throw exception', function () {
                                var f = function () {
                                    viewModel.submit();
                                };

                                expect(f).toThrow("Error message is not defined");
                            });

                        });

                        describe('and message exists', function () {

                            var message = 'message';

                            beforeEach(function (done) {
                                ajax.resolve({ success: false, message: message });
                                done();
                            });

                            it('should display message with an error', function () {
                                viewModel.submit();

                                expect(viewModel.errorMessage()).toEqual(message);
                            });

                            it('should set isSigninRequestPending to false', function () {
                                viewModel.isSigninRequestPending(true);
                                viewModel.submit();

                                expect(viewModel.isSigninRequestPending()).toEqual(false);
                            });

                        });
                    });

                    describe('and response is successful', function () {

                        var trackEvent;
                        var loginDfd;
                        var user = {
                            username: username,
                            firstname: firstname,
                            lastname: lastname
                        };

                        beforeEach(function (done) {
                            trackEvent = $.Deferred();
                            loginDfd = $.Deferred();
                            spyOn(app, 'trackEvent').and.returnValue(trackEvent.promise());
                            spyOn(window.auth, 'login').and.returnValue(loginDfd.promise());

                            ajax.resolve({ success: true, data: user });
                            done();
                        });

                        it('should try to login user', function() {
                            viewModel.submit();
                            expect(window.auth.login).toHaveBeenCalledWith(user);
                        });

                        describe('when login done', function() {

                            beforeEach(function(done) {
                                loginDfd.resolve(true);
                                done();
                            });

                            it('should track event \'Sign in\'', function () {
                                viewModel.submit();
                                expect(app.trackEvent).toHaveBeenCalledWith('Sign in', user);
                            });

                            describe('and event is tracked', function () {

                                beforeEach(function (done) {
                                    trackEvent.resolve();
                                    spyOn(app, 'openHomePage');
                                    done();
                                });

                                it('should redirect to home page', function () {
                                    viewModel.submit();
                                    expect(app.openHomePage).toHaveBeenCalled();
                                });

                                describe('and ltiUserInfoToken is in hash', function () {

                                    beforeEach(function () {
                                        spyOn(window.auth, 'getLtiUserInfoTokenFromHash').and.returnValue('token');
                                    });

                                    it('should redirect to home page with token in hash', function () {
                                        viewModel.submit();
                                        expect(app.openHomePage).toHaveBeenCalledWith('#token.user.lti=token');
                                    });

                                });

                                describe('and samlIdPUserInfoToken is in hash', function () {

                                    beforeEach(function () {
                                        spyOn(window.auth, 'getSamlIdPUserInfoTokenFromHash').and.returnValue('token');
                                    });

                                    it('should redirect to home page with token in hash', function () {
                                        viewModel.submit();
                                        expect(app.openHomePage).toHaveBeenCalledWith('#token.user.saml=token');
                                    });

                                });

                            });

                        });

                    });

                });

            });

        });

        describe('isSigninRequestPending:', function () {

            it('should be observable', function () {
                expect(viewModel.isSigninRequestPending).toBeObservable();
            });

        });

    });
});