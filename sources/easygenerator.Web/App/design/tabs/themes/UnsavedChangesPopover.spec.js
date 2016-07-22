import app from 'durandal/app';

import { UnsavedChangesPopover } from './UnsavedChangesPopover.js';
import { CreateThemePopup } from './CreateThemePopup.js';
import userContext from 'userContext.js';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel.js';
import themesEvents from './events.js';
import constants from 'constants.js';

let popover;

describe('UnsavedChangesPopover', () => {
    beforeEach(() => {
        popover = new UnsavedChangesPopover();

        spyOn(app, 'on').and.returnValue(Promise.resolve());
        spyOn(app, 'off');
        spyOn(app, 'trigger');
        spyOn(upgradeDialog, 'show');
    });

    describe('isVisible:', () => {
        it('should be observable', () => {
            expect(popover.isVisible).toBeObservable();
        });
    });

    describe('createThemePopup:', () => {
        it('should be instance of CreateThemePopup', () => {
            expect(popover.createThemePopup).toBeInstanceOf(CreateThemePopup);
        });
    });

    describe('show:', () => {
        it('should set isNewTheme', () => {
            let isNewTheme = true;
            popover.isNewTheme(null);

            popover.show(isNewTheme);

            expect(popover.isNewTheme()).toBe(isNewTheme);
        });

        it('should make popover visible', () => {
            popover.isVisible(null);

            popover.show(true);

            expect(popover.isVisible()).toBeTruthy();
        });
    });

    describe('showCreateThemePopup', () => {
        describe('when user doesn\'t have permissions to save themes', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(false);
            });

            it('should show upgrade dialog', () => {
                popover.showCreateThemePopup();

                expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.saveThemes);
            });

            it('should hide popover', () => {
                spyOn(popover, 'hide');

                popover.showCreateThemePopup();

                expect(popover.hide).toHaveBeenCalled();
            });
        });

        describe('when user has permissions to save themes', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(true);
            });

            it('should show create theme popup', () => {
                spyOn(popover.createThemePopup, 'show');

                popover.showCreateThemePopup();

                expect(popover.createThemePopup.show).toHaveBeenCalled();
            });
        });
    });

    describe('save:', () => {
        describe('when user doesn\'t have permissions to save themes', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(false);
            });

            it('should show upgrade dialog', () => {
                popover.save();

                expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.saveThemes);
            });

            it('should hide popover', () => {
                spyOn(popover, 'hide');

                popover.save();

                expect(popover.hide).toHaveBeenCalled();
            });
        });

        describe('when user has permissions to save themes', () => {
            beforeEach(() => {
                spyOn(userContext, 'hasAcademyAccess').and.returnValue(true);
            });

            it('should trigger update theme event', () => {
                popover.save();

                expect(app.trigger).toHaveBeenCalledWith(themesEvents.update);
            });

            it('should hide popover', () => {
                spyOn(popover, 'hide');

                popover.save();

                expect(popover.hide).toHaveBeenCalled();
            });
        });
    });

    describe('discard:', () => {
        it('should trigger discard changes theme event', () => {
            popover.discardChanges();

            expect(app.trigger).toHaveBeenCalledWith(themesEvents.discardChanges);
        });

        it('should hide popover', () => {
            spyOn(popover, 'hide');

            popover.discardChanges();

            expect(popover.hide).toHaveBeenCalled();
        });
    });

    describe('hide:', () => {
        it('should set isVisible to false', () => {
            popover.isVisible(true);
            spyOn(popover.createThemePopup, 'hide');

            popover.hide();

            expect(popover.isVisible()).toBeFalsy();
        });

        it('should hide create theme popup', () => {
            spyOn(popover.createThemePopup, 'hide');
                
            popover.hide();

            expect(popover.createThemePopup.hide).toHaveBeenCalled();
        });
    });
});