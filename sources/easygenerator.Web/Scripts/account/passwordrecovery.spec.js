define([], function() {
    "use strict";

    var viewModel = app.passwordRecoveryViewModel();

    describe('viewModel [passwordRecoveryViewModel]', function () {

        describe('password:', function () {

            it('should be observable', function() {
                expect(viewModel.password).toBeObservable();
            });

        });

        describe('isPasswordVisible:', function () {

            it('should be observable', function() {
                expect(viewModel.isPasswordVisible).toBeObservable();
            });

        });
        
        describe('isPasswordEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isPasswordEditing).toBeObservable();
            });

        });

        describe('showHidePassword:', function () {

            it('should be function', function() {
                expect(viewModel.showHidePassword).toBeFunction();
            });

            describe('when password visible', function() {

                it('should hide password', function() {
                    viewModel.isPasswordVisible(true);
                    
                    viewModel.showHidePassword();

                    expect(viewModel.isPasswordVisible()).toBeFalsy();
                });

            });
            
            describe('when password hidden', function () {

                it('should show password', function () {
                    viewModel.isPasswordVisible(false);

                    viewModel.showHidePassword();

                    expect(viewModel.isPasswordVisible()).toBeTruthy();
                });

            });
            
        });

        describe('errorMessage:', function () {

            it('should be observable', function() {
                expect(viewModel.errorMessage).toBeObservable();
            });

        });

        describe('hasError:', function () {

            it('should be computed', function() {
                expect(viewModel.hasError).toBeComputed();
            });

            describe('when errorMessage is empty', function () {

                it('should return false', function() {
                    viewModel.errorMessage('');

                    var result = viewModel.hasError();

                    expect(result).toBeFalsy();
                });

            });
            
            describe('when errorMessage is not empty', function () {

                it('should return true', function () {
                    viewModel.errorMessage('asdasdasdasd');

                    var result = viewModel.hasError();

                    expect(result).toBeTruthy();
                });

            });
            
        });

        describe('canSubmit:', function () {

            it('should be computed', function() {
                expect(viewModel.canSubmit).toBeComputed();
            });

            describe('when password is valid', function() {

                it('should return true', function() {
                    viewModel.password('Easy123');

                    var result = viewModel.canSubmit();

                    expect(result).toBeTruthy();
                });

            });
        });
        
    });
    
});