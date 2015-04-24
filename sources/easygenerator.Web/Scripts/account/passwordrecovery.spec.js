define([], function () {
    "use strict";

    var viewModel = app.passwordRecoveryViewModel();

    describe('viewModel [passwordRecoveryViewModel]', function () {

        describe('password:', function () {

            it('should be observable', function () {
                expect(viewModel.password).toBeObservable();
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

        });

        describe('isPasswordVisible:', function () {

            it('should be observable', function () {
                expect(viewModel.isPasswordVisible).toBeObservable();
            });

        });

        describe('isPasswordEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isPasswordEditing).toBeObservable();
            });

        });

        describe('showHidePassword:', function () {

            it('should be function', function () {
                expect(viewModel.showHidePassword).toBeFunction();
            });

            describe('when password visible', function () {

                it('should hide password', function () {
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

            it('should be observable', function () {
                expect(viewModel.errorMessage).toBeObservable();
            });

        });

        describe('hasError:', function () {

            it('should be computed', function () {
                expect(viewModel.hasError).toBeComputed();
            });

            describe('when errorMessage is empty', function () {

                it('should return false', function () {
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

            it('should be computed', function () {
                expect(viewModel.canSubmit).toBeComputed();
            });

            describe('when password is valid', function () {

                it('should return true', function () {
                    viewModel.password('Easy123');

                    var result = viewModel.canSubmit();

                    expect(result).toBeTruthy();
                });

            });

            describe('when password is not valid', function () {

                it('should return false', function () {
                    viewModel.password('Eas3');

                    var result = viewModel.canSubmit();

                    expect(result).toBeFalsy();
                });

            });

        });

    });

});