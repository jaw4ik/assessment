define(['dialogs/upgrade/viewmodels/upgradeExtendedResults'], function (viewModel) {
    'use strict';

    describe('[upgradeExtendedResults]', function () {
        var eventTracker = require('eventTracker'),
                constants = require('constants'),
                router = require('plugins/router');

        beforeEach(function() {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'openUrl');
        });

        describe('isShown:', function () {

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

        describe('upgrade:', function() {

            it('should be function', function () {
                expect(viewModel.upgrade).toBeFunction();
            });

            it('should close dialog', function () {
                viewModel.isShown(true);
                viewModel.upgrade();
                expect(viewModel.isShown()).toBeFalsy();
            });

            it('should send event \'Upgrade now\'', function () {
                viewModel.upgrade();
                expect(eventTracker.publish).toHaveBeenCalledWith('Upgrade now', 'Load extended results');
            });

            it('should open upgrade url', function () {
                viewModel.upgrade();
                expect(router.openUrl).toHaveBeenCalledWith(constants.upgradeUrl);
            });
        });

        describe('skip:', function () {
            it('should be function', function () {
                expect(viewModel.skip).toBeFunction();
            });

            it('should close dialog', function () {
                viewModel.isShown(true);
                viewModel.skip();
                expect(viewModel.isShown()).toBeFalsy();
            });

            it('should send event \'Skip upgrade\'', function () {
                viewModel.skip();
                expect(eventTracker.publish).toHaveBeenCalledWith('Skip upgrade', 'Load extended results');
            });
        });
    });
});