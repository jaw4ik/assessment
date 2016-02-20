import viewmodel from './viewmodel';

import eventTracker from 'eventTracker';
import constants from 'constants';
import router from 'plugins/router';
import localizationManager from 'localization/localizationManager';

describe('[upgradeDialog]', function () {

    beforeEach(function () {
        spyOn(eventTracker, 'publish');
        spyOn(router, 'openUrl');
    });

    describe('containerCss:', function () {

        it('should be observable', function () {
            expect(viewmodel.containerCss).toBeObservable();
        });

    });

    describe('eventCategory:', function () {

        it('should be defined', function () {
            expect(viewmodel.eventCategory).toBeDefined();
        });

    });

    describe('title:', function () {

        it('should be observable', function () {
            expect(viewmodel.title).toBeObservable();
        });

    });

    describe('subtitle:', function () {

        it('should be observable', function () {
            expect(viewmodel.subtitle).toBeObservable();
        });

    });

    describe('description:', function () {

        it('should be observable', function () {
            expect(viewmodel.description).toBeObservable();
        });

    });

    describe('upgradeBtnText:', function () {

        it('should be observable', function () {
            expect(viewmodel.upgradeBtnText).toBeObservable();
        });

    });

    describe('skipBtnText:', function () {

        it('should be observable', function () {
            expect(viewmodel.skipBtnText).toBeObservable();
        });

    });

    describe('isShown:', function () {

        it('should be observable', function () {
            expect(viewmodel.isShown).toBeObservable();
        });

    });

    describe('show:', function () {

        beforeEach(function () {
            spyOn(localizationManager, 'localize').and.returnValue('localized text');
        });

        it('should be function', function () {
            expect(viewmodel.show).toBeFunction();
        });

        it('should show dialog', function () {
            viewmodel.isShown(false);
            viewmodel.show();
            expect(viewmodel.isShown()).toBeTruthy();
        });

        describe('when all settings are defined', function () {
            var settings = {
                titleKey: 'titleKey',
                subtitleKey: 'subtitleKey',
                descriptionKey: 'descriptionKey',
                upgradeBtnTextKey: 'upgradeBtnTextKey',
                skipBtnTextKey: 'skipBtnTextKey',
                containerCss: 'containerCss',
                eventCategory: 'eventCategory'
            };

            beforeEach(function () {
                viewmodel.title('');
                viewmodel.subtitle('');
                viewmodel.description('');
                viewmodel.upgradeBtnText('');
                viewmodel.skipBtnText('');
                viewmodel.eventCategory = '';
            });

            it('should set containerCss', function () {
                viewmodel.show(settings);
                expect(viewmodel.containerCss()).toBe('containerCss');
            });

            it('should set title', function () {
                viewmodel.show(settings);
                expect(viewmodel.title()).toBe('localized text');
            });

            it('should set subtitle', function () {
                viewmodel.show(settings);
                expect(viewmodel.subtitle()).toBe('localized text');
            });

            it('should set description', function () {
                viewmodel.show(settings);
                expect(viewmodel.description()).toBe('localized text');
            });

            it('should set upgradeBtnText', function () {
                viewmodel.show(settings);
                expect(viewmodel.upgradeBtnText()).toBe('localized text');
            });

            it('should set skipBtnText', function () {
                viewmodel.show(settings);
                expect(viewmodel.skipBtnText()).toBe('localized text');
            });

            it('should set eventCategory', function () {
                viewmodel.show(settings);
                expect(viewmodel.eventCategory).toBe('eventCategory');
            });

        });

        describe('when settings are undefined', function () {
            var defaultSettings = constants.dialogs.upgrade.settings.default;

            beforeEach(function () {
                viewmodel.title('');
                viewmodel.subtitle('');
                viewmodel.description('');
                viewmodel.upgradeBtnText('');
                viewmodel.skipBtnText('');
                viewmodel.eventCategory = '';
            });

            it('should set default containerCss', function () {
                viewmodel.show();
                expect(viewmodel.containerCss()).toBe(defaultSettings.containerCss);
            });

            it('should set default localized title', function () {
                viewmodel.show();
                expect(viewmodel.title()).toBe('localized text');
            });

            it('should not set subtitle', function () {
                viewmodel.show();
                expect(viewmodel.subtitle()).toBe('');
            });

            it('should not set description', function () {
                viewmodel.show();
                expect(viewmodel.description()).toBe('');
            });

            it('should set default localized upgradeBtnText', function () {
                viewmodel.show();
                expect(viewmodel.upgradeBtnText()).toBe('localized text');
            });

            it('should set default localized skipBtnText', function () {
                viewmodel.show();
                expect(viewmodel.skipBtnText()).toBe('localized text');
            });

            it('should set default eventCategory', function () {
                viewmodel.show();
                expect(viewmodel.eventCategory).toBe(defaultSettings.eventCategory);
            });
        });

        describe('when settings are empty', function () {
            var defaultSettings = constants.dialogs.upgrade.settings.default;

            beforeEach(function () {
                viewmodel.title('');
                viewmodel.subtitle('');
                viewmodel.description('');
                viewmodel.upgradeBtnText('');
                viewmodel.skipBtnText('');
                viewmodel.eventCategory = '';
            });

            it('should set default containerCss', function () {
                viewmodel.show({});
                expect(viewmodel.containerCss()).toBe(defaultSettings.containerCss);
            });

            it('should set default localized title', function () {
                viewmodel.show({});
                expect(viewmodel.title()).toBe('localized text');
            });

            it('should not set subtitle', function () {
                viewmodel.show({});
                expect(viewmodel.subtitle()).toBe('');
            });

            it('should not set description', function () {
                viewmodel.show({});
                expect(viewmodel.description()).toBe('');
            });

            it('should set default localized upgradeBtnText', function () {
                viewmodel.show({});
                expect(viewmodel.upgradeBtnText()).toBe('localized text');
            });

            it('should set default localized skipBtnText', function () {
                viewmodel.show({});
                expect(viewmodel.skipBtnText()).toBe('localized text');
            });

            it('should set default eventCategory', function () {
                viewmodel.show({});
                expect(viewmodel.eventCategory).toBe(defaultSettings.eventCategory);
            });
        });
    });

    describe('upgrade:', function () {

        it('should be function', function () {
            expect(viewmodel.upgrade).toBeFunction();
        });

        it('should close dialog', function () {
            viewmodel.isShown(true);
            viewmodel.upgrade();
            expect(viewmodel.isShown()).toBeFalsy();
        });

        it('should send event \'Upgrade now\'', function () {
            viewmodel.eventCategory = 'category';
            viewmodel.upgrade();
            expect(eventTracker.publish).toHaveBeenCalledWith('Upgrade now', 'category');
        });

        it('should open upgrade url', function () {
            viewmodel.upgrade();
            expect(router.openUrl).toHaveBeenCalledWith(constants.upgradeUrl);
        });
    });

    describe('skip:', function () {
        it('should be function', function () {
            expect(viewmodel.skip).toBeFunction();
        });

        it('should close dialog', function () {
            viewmodel.isShown(true);
            viewmodel.skip();
            expect(viewmodel.isShown()).toBeFalsy();
        });

        it('should send event \'Skip upgrade\'', function () {
            viewmodel.eventCategory = 'category';
            viewmodel.skip();
            expect(eventTracker.publish).toHaveBeenCalledWith('Skip upgrade', 'category');
        });
    });
});
