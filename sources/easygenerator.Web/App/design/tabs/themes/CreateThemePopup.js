import _ from 'underscore';
import ko from 'knockout';
import app from 'durandal/app';

import localizationManager from 'localization/localizationManager.js';
import constants from 'constants.js';
import themesEvents from './events.js';

export class CreateThemePopup{
    constructor() {
        this.viewUrl = 'design/tabs/themes/CreateThemePopup.html';
        this.isVisible = ko.observable(false);
        this.isEditing = ko.observable(false);
        this.name = ko.observable('');
    }
    show() {
        this.name('');
        this.isVisible(true);
        this.isEditing(true);
        app.on(constants.messages.themes.added, this.hide.bind(this));
        app.on(constants.messages.themes.updated, this.hide.bind(this));
        app.on(constants.messages.themes.deleted, this.hide.bind(this));
        app.on(themesEvents.discardChanges, this.hide.bind(this));
    }
    hide() {
        this.isVisible(false);
        app.off(constants.messages.themes.added, this.hide.bind(this));
        app.off(constants.messages.themes.updated, this.hide.bind(this));
        app.off(constants.messages.themes.deleted, this.hide.bind(this));
        app.off(themesEvents.discardChanges, this.hide.bind(this));
    }
    create() {
        let themeName = !_.isEmptyOrWhitespace(this.name().trim()) ? this.name().trim() : localizationManager.localize('untitledTheme');
        app.trigger(themesEvents.create, themeName);
    }
}

export default new CreateThemePopup();