﻿define([], function () {
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

            describe('when password is empty', function () {

                it('should be false', function () {
                    viewModel.username("username@easygenerator.com");
                    viewModel.password("");

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

            describe('when password is whitespace', function () {

                it('should be false', function () {
                    viewModel.username("username@easygenerator.com");
                    viewModel.password("            ");

                    expect(viewModel.canSubmit()).toBeFalsy();
                });

            });

            describe('when username and password are not empty or whitespace', function () {

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
                spyOn($, "ajax").andReturn(ajax.promise());
            });

            it('should be function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            describe('when username is empty', function () {

                it('should not send request to /api/user/signin', function () {
                    viewModel.username("");
                    viewModel.password("abc123");

                    viewModel.submit();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when password is empty', function () {

                it('should not send request to /api/user/signin', function () {
                    viewModel.username("username@easygenerator.com");
                    viewModel.password("");

                    viewModel.submit();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when username is whitespace', function () {

                it('should not send request to /api/user/signin', function () {
                    viewModel.username("            ");
                    viewModel.password("abc123");

                    viewModel.submit();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when password is whitespace', function () {

                it('should not send request to /api/user/signin', function () {
                    viewModel.username("username@easygenerator.com");
                    viewModel.password("            ");

                    viewModel.submit();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when username and password are not empty or whitespace', function () {

                var username = "username@easygenerator.com";
                var password = "Abc123! ";

                beforeEach(function () {
                    viewModel.username(username);
                    viewModel.password(password);
                });

                it('should trim username before sending request', function () {
                    viewModel.username("   " + username + "    ");

                    viewModel.submit();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/api/user/signin',
                        data: { username: username, password: password },
                        type: 'POST'
                    });
                });

                it('should make username lowercase before sending request', function () {
                    viewModel.username(username.toUpperCase());

                    viewModel.submit();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/api/user/signin',
                        data: { username: username, password: password },
                        type: 'POST'
                    });
                });

                it('should clear errorMessage before sending request', function () {
                    viewModel.errorMessage("message");
                    viewModel.submit();
                    expect(viewModel.errorMessage()).toEqual("");
                });

                it('should send request to /api/user/signin', function () {
                    viewModel.submit();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/api/user/signin',
                        data: { username: username, password: password },
                        type: 'POST'
                    });
                });

                describe('when request failed', function () {

                    it('should display message with an error', function () {
                        var message = "message";
                        ajax.reject(message);

                        viewModel.submit();

                        waitsFor(function () {
                            return ajax.state() !== "pending";
                        });
                        runs(function () {
                            expect(viewModel.errorMessage()).toEqual(message);
                        });
                    });

                });

                describe('when request succeed', function () {

                    describe('and response is not an object', function () {

                        it('should throw exception', function () {
                            ajax.resolve();

                            var f = function () {
                                viewModel.submit();
                            };

                            waitsFor(function () {
                                return ajax.state() !== "pending";
                            });
                            runs(function () {
                                expect(f).toThrow('Response is not an object');
                            });
                        });

                    });

                    describe('and response is not successful', function () {

                        describe('and message does not exist', function () {

                            it('should throw exception', function () {
                                ajax.resolve({ success: false });

                                var f = function () {
                                    viewModel.submit();
                                };

                                waitsFor(function () {
                                    return ajax.state() !== "pending";
                                });
                                runs(function () {
                                    expect(f).toThrow("Error message is not defined");
                                });
                            });

                        });

                        describe('and message exists', function () {

                            it('should display message with an error', function () {
                                var message = 'message';
                                ajax.resolve({ success: false, message: message });

                                viewModel.submit();

                                waitsFor(function () {
                                    return ajax.state() !== "pending";
                                });
                                runs(function () {
                                    expect(viewModel.errorMessage()).toEqual(message);
                                });
                            });

                        });
                    });

                    describe('and response is successful', function () {

                        it('should redirect to home page', function () {
                            ajax.resolve({ success: true });

                            spyOn(app, 'openHomePage');

                            viewModel.submit();

                            waitsFor(function () {
                                return ajax.state() !== "pending";
                            });
                            runs(function () {
                                expect(app.openHomePage).toHaveBeenCalled();
                            });
                        });

                    });
                });
            });

        });

    });
});