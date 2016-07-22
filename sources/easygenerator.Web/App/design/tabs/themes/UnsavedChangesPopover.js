import ko from 'knockout';
import app from 'durandal/app';

import userContext from 'userContext.js';
import constants from 'constants.js';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel.js';
import { CreateThemePopup } from './CreateThemePopup.js';
import themesEvents from './events.js';

export class UnsavedChangesPopover{
    constructor() {
        this.viewUrl = 'design/tabs/themes/UnsavedChangesPopover.html';
        this.isVisible = ko.observable(false);
        this.isNewTheme = ko.observable(false);
        this.createThemePopup = new CreateThemePopup();
    }
    show(isNewTheme) {
        this.isNewTheme(isNewTheme);
        this.isVisible(true);
    }
    showCreateThemePopup() {
        if (!this.ensurePermissionsToSaveThemes()) {
            return;
        }

        app.on(themesEvents.create, this.hide.bind(this));
        this.createThemePopup.show();
    }
    save() {
        if (!this.ensurePermissionsToSaveThemes()) {
            return;
        }

        app.trigger(themesEvents.update);
        this.hide();
    }
    discardChanges() {
        app.trigger(themesEvents.discardChanges);
        this.hide();
    }
    hide() {
        this.isVisible(false);
        this.createThemePopup.hide();
        app.off(themesEvents.create, this.hide.bind(this));
    }
    ensurePermissionsToSaveThemes() {
        let hasPermissions = userContext.hasAcademyAccess();

        if (!hasPermissions) {
            this.hide();
            upgradeDialog.show(constants.dialogs.upgrade.settings.saveThemes);
        }

        return hasPermissions;
    }
}

export default new UnsavedChangesPopover();