define([], function () {
    "use strict";

    var viewModel = signupModel();

    describe('viewModel [signUp]', function () {
        
        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('userName:', function () {
            
            it('should be observable', function() {
                expect(viewModel.userName).toBeObservable();
            });
            
            it('should have isValid computed', function () {
                expect(viewModel.userName.isValid).toBeComputed();
            });

            describe('when empty', function () {

                it('should be not valid', function () {
                    viewModel.userName('');
                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when not e-mail', function() {

                it('should be not valid', function() {
                    viewModel.userName('Username');
                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when user with such e-mail exists', function() {

                it('should be not valid', function () {
                    viewModel.userName('test@mail.com');
                    viewModel.userExists(true);

                    expect(viewModel.userName.isValid()).toBeFalsy();
                });

            });

            describe('when meet all requirements', function () {

                it('should be valid', function() {
                    viewModel.userName('test@mail.com');
                    viewModel.userExists(false);

                    expect(viewModel.userName.isValid()).toBeTruthy();
                });

            });

        });

        describe('password:', function() {

            it('should be observable', function() {
                expect(viewModel.password).toBeObservable();
            });

            it('should have isValid computed', function() {
                expect(viewModel.password.isValid).toBeComputed();
            });

            describe('when is empty', function() {

                it('should be not valid', function() {
                    viewModel.password('');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });

            });

            describe('when less than 7 characters', function() {
                
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
                
                it('should be not valid', function() {
                    viewModel.password('Password');
                    expect(viewModel.password.isValid()).toBeFalsy();
                });
                
            });

            describe('when not contain special character', function () {

                it('should be not valid', function () {
                    viewModel.password('Password1');
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
                
                it('should be valid', function() {
                    viewModel.password('Password1!');
                    expect(viewModel.password.isValid()).toBeTruthy();
                });
                
            });

        });

        describe('isPasswordEditing:', function() {

            it('should be observable', function() {
                expect(viewModel.isPasswordEditing).toBeObservable();
            });

        });

        describe('isPasswordVisible:', function() {

            it('should be observable', function() {
                expect(viewModel.isPasswordVisible).toBeObservable();
            });

        });

        describe('showHidePassword:', function() {

            it('should be a function', function() {
                expect(viewModel.showHidePassword).toBeFunction();
            });

            describe('when password is not visible', function () {

                it('should show password', function () {
                    viewModel.isPasswordVisible(true);
                    viewModel.showHidePassword();
                    expect(viewModel.isPasswordVisible()).toBeFalsy();
                });

            });

            describe('when password is visible', function() {

                it('should hide password', function () {
                    viewModel.isPasswordVisible(true);
                    viewModel.showHidePassword();
                    expect(viewModel.isPasswordVisible()).toBeFalsy();
                });

            });

        });

        describe('isLicenseAgreed:', function() {

            it('should be observable', function() {
                expect(viewModel.isLicenseAgreed).toBeObservable();
            });

        });

        describe('userExists:', function () {
            
            it('should be observable', function() {
                expect(viewModel.userExists).toBeObservable();
            });

        });

        describe('checkUserExists:', function () {
            
            it('should be a function', function () {
                expect(viewModel.checkUserExists).toBeFunction();
            });

            describe('when userName is empty', function() {

                it('should set userExists false', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('');
                    viewModel.userExists(null);
                    viewModel.checkUserExists();

                    expect(viewModel.userExists()).toBeFalsy();
                });

                it('should not send request to server', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('');
                    viewModel.userExists(null);
                    viewModel.checkUserExists();

                    expect($.ajax).not.toHaveBeenCalled();
                });

            });

            describe('when userName is not empty', function () {

                it('should call \"/api/user/exists"', function () {
                    spyOn($, 'ajax').andReturn($.Deferred().promise());
                    viewModel.userName('mail');
                    viewModel.checkUserExists();

                    expect($.ajax).toHaveBeenCalledWith({
                        url: '/api/user/exists',
                        data: { email: 'mail' },
                        type: 'POST'
                    });
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

                describe('and user exists', function() {

                    it('should set userExists true', function() {
                        viewModel.userName('mail');
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

                });
                
                describe('and user not exists', function () {

                    it('should set userExists false', function () {
                        viewModel.userName('mail');
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

                });

            });

        });

        describe('resetUserExists:', function() {

            it('should be a function', function() {
                expect(viewModel.resetUserExists).toBeFunction();
            });

            it('should set userExists false', function () {
                viewModel.userExists(null);
                viewModel.resetUserExists();
                
                expect(viewModel.userExists()).toBeFalsy();
            });

        });

        describe('signUp:', function() {

            it('should be a function', function () {
                expect(viewModel.signUp).toBeFunction();
            });

            it('should call \"/api/user/signup"', function () {
                spyOn($, 'ajax').andReturn($.Deferred().promise());
                viewModel.userName('mail');
                viewModel.password('password');
                viewModel.signUp();

                expect($.ajax).toHaveBeenCalledWith({
                    url: '/api/user/signup',
                    data: { email: 'mail', password: 'password' },
                    type: 'POST'
                });
            });

        });

    });

});