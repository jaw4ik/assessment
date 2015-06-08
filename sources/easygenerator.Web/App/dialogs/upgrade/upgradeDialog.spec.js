define(['dialogs/upgrade/upgradeDialog'], function (viewModel) {
    'use strict';

    describe('upgradeDialog', function () {

        describe('isShown', function () {

            it('should be observable', function () {
                expect(viewModel.isShown).toBeObservable();
            });

        });

        describe('show:', function () {

            it('should be function', function () {
                expect(viewModel.show).toBeFunction();
            });

            it('should show dialog', function () {
                viewModel.isShown(false);
                viewModel.show();
                expect(viewModel.isShown()).toBeTruthy();
            });

        });

        describe('hide', function () {

            it('should be function', function () {
                expect(viewModel.hide).toBeFunction();
            });

            it('should hide dialog', function () {
                viewModel.isShown(true);
                viewModel.hide();
                expect(viewModel.isShown()).toBeFalsy();
            });

        });
    });
});