import app from 'durandal/app';

import { CreateThemePopup } from './CreateThemePopup.js';
import localizationManager from 'localization/localizationManager.js';
import constants from 'constants.js';
import themesEvents from './events.js';

describe('CreateThemePopup', () => {
    let popover;

    beforeEach(() => {
        spyOn(app, 'trigger');
        spyOn(app, 'on').and.returnValue(Promise.resolve());
        spyOn(app, 'off');
        spyOn(localizationManager, 'localize').and.callFake(arg => { return arg });
        popover = new CreateThemePopup();
    });

    describe('isVisible:', () => {
        it('should be observable and false', () => {
            expect(popover.isVisible).toBeObservable();
            expect(popover.isVisible()).toBeFalsy();
        });
    });

    describe('isEditing:', () => {
        it('should be observable and false', () => {
            expect(popover.isEditing).toBeObservable();
            expect(popover.isEditing()).toBeFalsy();
        });
    });

    describe('name:', () => {
        it('should be observable and empty', () => {
            expect(popover.name).toBeObservable();
            expect(popover.name()).toBe('');
        });
    });

    describe('show:', () => {
        it('should set isVisible to true', () => {
            popover.isVisible(false);
            popover.show();
            expect(popover.isVisible()).toBeTruthy();
        });

        it('should set isEditing to true', () => {
            popover.isEditing(false);
            popover.show();
            expect(popover.isEditing()).toBeTruthy();
        });

        it('should set name to empty', () => {
            popover.name('name');
            popover.show();
            expect(popover.name()).toBe('');
        });
    });

    describe('hide:', () => {
        it('should set isVisible to false', () => {
            popover.isVisible(true);
            popover.hide();
            expect(popover.isVisible()).toBeFalsy();
        });
    });

    describe('create:', () => {
        describe('when name is empty', () => {
            it('should trigger create theme event with default localized value', () => {
                popover.name('');
                popover.create();
                expect(app.trigger).toHaveBeenCalledWith(themesEvents.create, 'untitledTheme');
            });
        });

        describe('when name is whitespace', () => {
            it('should trigger create theme event with default localized value', () => {
                popover.name('          ');
                popover.create();
                expect(app.trigger).toHaveBeenCalledWith(themesEvents.create, 'untitledTheme');
            });
        });

        describe('when name is not empty', () => {
            it('should trigger create theme event with name', () => {
                popover.name('name');
                popover.create();
                expect(app.trigger).toHaveBeenCalledWith(themesEvents.create, 'name');
            });
        });
    });
});