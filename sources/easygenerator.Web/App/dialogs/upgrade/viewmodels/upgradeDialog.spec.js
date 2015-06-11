define(['dialogs/upgrade/viewmodels/upgradeDialog'], function (UpgradeDialog) {
    'use strict';

    describe('[upgradeDialog]', function () {
        var upgradeDialog,
            subtitle = 'subtitle',
            text = 'text',
            category = 'category',
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            router = require('plugins/router');

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'openUrl');
            upgradeDialog = new UpgradeDialog(category, subtitle, text);
        });

        it('should be constructor function', function () {
            expect(UpgradeDialog).toBeFunction();
        });

        describe('ctor:', function() {
            it('should initialize fields with proper values', function () {
                expect(upgradeDialog.category).toBe(category);
                expect(upgradeDialog.subtitle).toBe(subtitle);
                expect(upgradeDialog.text).toBe(text);

                expect(upgradeDialog.isShown()).toBeFalsy();
            });
        });

        describe('isShown:', function () {

            it('should be observable', function () {
                expect(upgradeDialog.isShown).toBeObservable();
            });

        });

        describe('show:', function () {

            it('should be function', function () {
                expect(upgradeDialog.show).toBeFunction();
            });

            it('should show dialog', function () {
                upgradeDialog.isShown(false);
                upgradeDialog.show();
                expect(upgradeDialog.isShown()).toBeTruthy();
            });

        });

        describe('upgrade:', function () {

            it('should be function', function () {
                expect(upgradeDialog.upgrade).toBeFunction();
            });

            it('should close dialog', function () {
                upgradeDialog.isShown(true);
                upgradeDialog.upgrade();
                expect(upgradeDialog.isShown()).toBeFalsy();
            });

            it('should send event \'Upgrade now\'', function () {
                upgradeDialog.upgrade();
                expect(eventTracker.publish).toHaveBeenCalledWith('Upgrade now', 'category');
            });

            it('should open upgrade url', function () {
                upgradeDialog.upgrade();
                expect(router.openUrl).toHaveBeenCalledWith(constants.upgradeUrl);
            });
        });

        describe('skip:', function () {
            it('should be function', function () {
                expect(upgradeDialog.skip).toBeFunction();
            });

            it('should close dialog', function () {
                upgradeDialog.isShown(true);
                upgradeDialog.skip();
                expect(upgradeDialog.isShown()).toBeFalsy();
            });

            it('should send event \'Skip upgrade\'', function () {
                upgradeDialog.skip();
                expect(eventTracker.publish).toHaveBeenCalledWith('Skip upgrade', 'category');
            });
        });
    });
});