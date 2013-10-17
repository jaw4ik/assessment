define([], function () {
    "use strict";

    var viewModel;

    describe('viewModel [signUp]', function () {

        beforeEach(function () {
            viewModel = signupModel();
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

        describe('fullName:', function () {

            it('should be observable', function () {
                expect(viewModel.fullName).toBeObservable();
            });
        });

        describe('phone:', function () {

            it('should be observable', function () {
                expect(viewModel.phone).toBeObservable();
            });
        });

        describe('organization:', function () {

            it('should be observable', function () {
                expect(viewModel.organization).toBeObservable();
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

            it('should be a function', function () {
                expect(viewModel.signUp).toBeFunction();
            });

            var ajax;
            beforeEach(function () {
                ajax = $.Deferred();
                spyOn($, 'ajax').andReturn(ajax.promise());
            });


            it('should call \"/api/user/signupfirststep"', function () {
                viewModel.userName('mail');
                viewModel.password('password');
                viewModel.signUp();

                expect($.ajax).toHaveBeenCalledWith({
                    url: '/api/user/signupfirststep',
                    data: { email: 'mail', password: 'password', fullName: '', phone: '', organization: '' },
                    type: 'POST'
                });
            });

        });

    });

});