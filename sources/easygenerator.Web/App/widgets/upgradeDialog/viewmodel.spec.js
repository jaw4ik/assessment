define(['widgets/upgradeDialog/viewmodel'], function (viewmodel) {
    'use strict';

    describe('[upgradeDialog]', function () {
        var settings = {
            containerCss: 'css',
            eventCategory: 'category',
            subtitle: 'subtitle',
            description: 'description'
        };

        var eventTracker = require('eventTracker'),
            constants = require('constants'),
            router = require('plugins/router'),
            localizationManager = require('localization/localizationManager');   

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

            it('should set containerCss', function () {
                viewmodel.containerCss('');
                viewmodel.show(settings);
                expect(viewmodel.containerCss()).toBe('css');
            });

            it('should set subtitle', function () {
                viewmodel.subtitle('');
                viewmodel.show(settings);
                expect(viewmodel.subtitle()).toBe('localized text');
            });

            it('should set description', function () {
                viewmodel.description('');
                viewmodel.show(settings);
                expect(viewmodel.description()).toBe('localized text');
            });

            it('should set eventCategory', function () {
                viewmodel.eventCategory = '';
                viewmodel.show(settings);
                expect(viewmodel.eventCategory).toBe('category');
            });

            it('should show dialog', function () {
                viewmodel.isShown(false);
                viewmodel.show(settings);
                expect(viewmodel.isShown()).toBeTruthy();
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
                viewmodel.eventCategory = settings.eventCategory;
                viewmodel.upgrade();
                expect(eventTracker.publish).toHaveBeenCalledWith('Upgrade now', settings.eventCategory);
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
                viewmodel.eventCategory = settings.eventCategory;
                viewmodel.skip();
                expect(eventTracker.publish).toHaveBeenCalledWith('Skip upgrade', settings.eventCategory);
            });
        });
    });
});