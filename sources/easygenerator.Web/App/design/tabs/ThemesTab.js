import ko from 'knockout';
import app from 'durandal/app';
import _ from 'underscore';

import constants from 'constants.js';
import localizationManager from 'localization/localizationManager.js';
import templateRepository from 'repositories/templateRepository.js';
import themeRepository from 'repositories/themeRepository.js';
import deleteThemeDialog from 'dialogs/themes/delete/deleteTheme.js';
import { UnsavedChangesPopover } from './themes/UnsavedChangesPopover.js';
import themesEvents from './themes/events.js';

var _themeAdded = new WeakMap();
var _themeUpdated = new WeakMap();
var _themeDeleted = new WeakMap();

export default class ThemesTab{
    constructor () {
        this.name = 'themes';
        this.type = 'themes';
        this.title = localizationManager.localize('themes');
        this.isSelected = ko.observable(false);
        this.viewUrl = 'design/tabs/ThemesTab.html';

        this.isOwner = true;
        
        this.selectedTheme = ko.observable(null);
        this.isCustomThemeSelected = ko.computed(() => {
            return this.selectedTheme() !== null && (this.selectedTheme() instanceof UserTheme);
        });

        this.hasUnsavedChanges = ko.observable(false);
        this.showUnsavedTheme = ko.computed(() => {
            return this.hasUnsavedChanges() && !this.isCustomThemeSelected();
        });

        this.popover = new UnsavedChangesPopover();

        
        this.themes = ko.observableArray([]);

        this.defaultThemes = ko.observableArray([]);
        this.sharedThemes = ko.observableArray([]);
        this.userThemes = ko.observableArray([]);

        _themeAdded.set(this, this.onThemeAdded);
        _themeUpdated.set(this, this.onThemeUpdated);
        _themeDeleted.set(this, this.onThemeDeleted);

        app.on(constants.messages.themes.added, _themeAdded.get(this).bind(this));
        app.on(constants.messages.themes.updated, _themeUpdated.get(this).bind(this));
        app.on(constants.messages.themes.deleted, _themeDeleted.get(this).bind(this));
    }
    onThemeAdded(item) {
        let theme = new UserTheme({ id: item.id, title: item.name, settings: item.settings });
        this.userThemes.unshift(theme);
        this.hasUnsavedChanges(false);
        this.selectTheme(theme);
    }
    onThemeUpdated(result) {
        let updatedTheme = _.find(this.userThemes(), item => item.id === result.themeId);
        if (!updatedTheme) {
            return;
        }
        
        updatedTheme.updateSettings(result.settings);

        if (this.selectedTheme() && this.selectedTheme().id === result.themeId) {
            this.hasUnsavedChanges(false);
        }
    }
    onThemeDeleted(themeId) {
        let theme = _.find(this.userThemes(), item => item.id === themeId);

        if (this.selectedTheme() && this.selectedTheme().id === themeId) {
            this.selectNextTheme();
        }

        this.userThemes.remove(theme);
    }
    discardChanges(settings) {
        this.hasUnsavedChanges(false);

        if (!this.selectedTheme()) {
            let preset = _.find(this.defaultThemes(), item => _.isCompleteMatch(item.settings, settings));
            this.selectedTheme(preset);
        }
    }
    showUnsavedChanges() {
        if (this.hasUnsavedChanges()) {
            this.popover.show(this.showUnsavedTheme());
            return;
        }
    }
    selectTheme(theme) {
        if (this.selectedTheme() === theme)
            return;

        if (this.hasUnsavedChanges()) {
            this.popover.show(this.showUnsavedTheme());
            return;
        }
    
        this.selectedTheme(theme);
        app.trigger(themesEvents.selected, theme ? { id: theme.id, title: theme.title, settings: theme.settings } : null);
    }
    selectNextTheme() {
        let index = _.indexOf(this.userThemes(), this.selectedTheme());
        let nextTheme;
        
        if (index + 1 < this.userThemes().length) {
            nextTheme = this.userThemes()[index + 1];
        }else if (index - 1 >= 0) {
            nextTheme = this.userThemes()[index - 1];
        } else {
            nextTheme = this.defaultThemes()[0];
        }
        this.hasUnsavedChanges(false);
        this.selectTheme(nextTheme);
    }
    remove(theme) {
        deleteThemeDialog.show(theme.id, theme.title);
    }
    activate(templateId, settings, theme, isOwner) {
        this.isOwner = isOwner;

        return this._loadPresets(templateId)
            .then(() => this._loadUserThemes(templateId))
            .then(() => this._loadSharedThemes(theme, settings, isOwner))
            .then(() => this._selectTheme(theme, settings));
    }

    _loadPresets(templateId) {
        return templateRepository.getById(templateId).then(template => {
            this.defaultThemes(Array.isArray(template.presets) ? template.presets.map(preset => new Preset(preset)) : []);
        });
    }
    _loadUserThemes(templateId) {
        return themeRepository.getCollection(templateId).then(themes => {
            this.userThemes(_.chain(themes)
                .sortBy(item => {
                    return -item.createdOn;
                })
                .map(theme => new UserTheme({ id: theme.id, title: theme.name, settings: theme.settings }))
                .value());
        });
    }
    async _loadSharedThemes(theme, settings, isOwner) {
        if (isOwner) {
            this.sharedThemes([]);
            return;
        }

        let themeId = theme && theme.id;
        if (!themeId) {
            let selectedPreset = _.find(this.defaultThemes(), item => _.isCompleteMatch(item.settings, settings));
            if (selectedPreset) {
                this.sharedThemes([selectedPreset]);
            }

            return;
        }

        this.sharedThemes([new SharedTheme({ id: theme.id, title: theme.name, settings: theme.settings })]);
    }
    _selectTheme(theme, settings, isOwner) {
        if (this.sharedThemes().length) {
            this.selectedTheme(_.first(this.sharedThemes()));
            this.hasUnsavedChanges(false);
            return;
        }

        let themeId = theme && theme.id;

        let selectedTheme = _.find(this.userThemes(), item => item.id === themeId);
        if (selectedTheme) {
            this.selectedTheme(selectedTheme);
            
            let isThemeChanged = !_.isCompleteMatch(selectedTheme.settings, settings);
            this.hasUnsavedChanges(isThemeChanged);
            return;
        }
        
        let selectedPreset = _.find(this.defaultThemes(), item => _.isCompleteMatch(item.settings, settings));
        if (selectedPreset) {
            this.selectedTheme(selectedPreset);
            this.hasUnsavedChanges(false);
            return;
        }

        this.selectedTheme(null);
        this.hasUnsavedChanges(true);
    }
}

export class Theme {
    constructor(spec) {
        this.id = spec.id;
        this.title = spec.title;
        this.settings = spec.settings;

        this.mainColor = ko.observable('#000');
        this.secondaryColor = ko.observable('#000');
        this.textColor = ko.observable('#000');
        this.backgroundTexture = ko.observable();
        this.backgroundColor = ko.observable('#fff');

        this.updateSettings(spec.settings);
    }
    updateSettings(settings) {
        this.settings = settings;

        if (settings && settings.branding) {
            if (Array.isArray(settings.branding.colors)) {
                settings.branding.colors.forEach(c => {
                    if (c.key === '@main-color') {
                        this.mainColor(c.value);
                    }
                    if (c.key === '@text-color') {
                        this.textColor(c.value);
                    }
                    if (c.key === '@secondary-color') {
                        this.secondaryColor(c.value);
                    }
                });
            }
            if (settings.branding.background && settings.branding.background.body ) {
                if (settings.branding.background.body.texture) {
                    this.backgroundTexture(settings.branding.background.body.texture);
                }
                if (settings.branding.background.body.color) {
                    this.backgroundColor(settings.branding.background.body.color);
                }
            }
        }
    }
}

export class Preset extends Theme {
    
}

export class SharedTheme extends Theme {
    
}

export class UserTheme extends Theme {

}