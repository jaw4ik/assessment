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

            describe('when meet all requirements', function () {

                it('should be valid', function() {
                    viewModel.userName('test@mail.com');
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

    });
    
});