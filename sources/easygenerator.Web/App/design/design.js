import ko from 'knockout';
import _ from 'underscore';
import app from 'durandal/app';

import router from 'routing/router';
import notify from 'notify';
import courseRepository from 'repositories/courseRepository';
import themeRepository from 'repositories/themeRepository';
import localizationManager from 'localization/localizationManager';
import waiter from 'utils/waiter';
import TemplateBrief from './templateBrief';
import constants from 'constants';


import bus from './bus.js';
import userContext from 'userContext.js';

import ThemesTab from './tabs/ThemesTab.js';
import BrandingTab from './tabs/BrandingTab.js';
import FontsTab from './tabs/FontsTab.js';

import * as getCommand from './commands/getCourseTemplateSettings.js';
import * as saveCommand  from './commands/saveCourseTemplateSettings.js';

import popoverService from './popoverService.js';
import textStyleService from './textStyleService.js';

import { CreateThemePopup } from './tabs/themes/CreateThemePopup.js';

import upgradeDialog from 'widgets/upgradeDialog/viewmodel.js';

import themesEvents from './tabs/themes/events.js';

let
    templateMessageTypes = {
        showSettings: 'show-settings',
        freezeEditor: 'freeze-editor',
        unfreezeEditor: 'unfreeze-editor',
        notification: 'notification'
    },

    templateSettingsLoadingTimeout = 2000,
    templateSettingsErrorNotification = localizationManager.localize('templateSettingsError'),

    delay = 100,
    limit = 100;

class Theme {
    constructor(spec) {
        this.id = spec.id;
        this.title = spec.title;
        this.settings = spec.settings;
    }
}

class Design{
    constructor() {
        this.courseId = '';
        this.previewUrl = ko.observable(null);
        this.template = ko.observable();
        this.loadingTemplate = ko.observable(false);
        this.settingsVisibility = ko.observable(false);
        this.canUnloadSettings = ko.observable(true);
        this.settingsLoadingTimeoutId = null;
        this.settingsVisibilitySubscription = null;

        this.settingsTabs = ko.observableArray([]);

        this.tab = ko.observable();
        this.settings = null;
        this.themesTab = new ThemesTab();

        this.brandingTab = new BrandingTab();
        this.fontsTab = new FontsTab();

        this.subscriptions = [];
        this.popovers = popoverService.collection;
        this.textStyleElements = textStyleService.collection;

        this.isThemesSupported = ko.computed(() => { return this.template() && this.template().presets && this.template().presets.length; });
        this.selectedTheme = null;
        this.createThemePopup = new CreateThemePopup();
        this.isOwner = true;
        this.allowEdit = true;
    }

    activate(courseId) {
        this.settingsVisibility(false);
        this.settingsVisibilitySubscription = this.settingsVisibility.subscribe(() => {
            if (this.settingsLoadingTimeoutId) {
                clearTimeout(this.settingsLoadingTimeoutId);
                this.settingsLoadingTimeoutId = null;
            }
        });
        
        return courseRepository.getById(courseId).then(course => {
            this.courseId = course.id;
            this.previewUrl('/preview/' + courseId);

            this.template(new TemplateBrief(course.template));
            this.isOwner = userContext.identity.email === course.createdBy;

            this.canSaveTheme = ko.computed(() => {
                return userContext.hasAcademyAccess();
            });

            this.subscriptions.push(app.on(constants.messages.course.templateUpdated + courseId).then(template => this.templateUpdated(template)));
            this.subscriptions.push(app.on(constants.messages.course.templateUpdatedByCollaborator).then(course => this.templateUpdatedByCollaborator(course)));
            this.subscriptions.push(app.on(themesEvents.selected).then(theme => this.themeSelected(theme)));
            this.subscriptions.push(bus.on('all').then(() => this.settingsChanged()));
            
            this.subscriptions.push(app.on('font:settings-changed').then(() => this.fontSettingsChanged()));
            this.subscriptions.push(app.on('text-color:changed').then(color => this.textColorChanged(color)));
            this.subscriptions.push(app.on(themesEvents.create).then(title => this.saveAsNewTheme(title)));
            this.subscriptions.push(app.on(themesEvents.update).then(() => this.updateTheme()));
            this.subscriptions.push(app.on(themesEvents.discardChanges).then(() => this.discardThemeChanges()));
            
            this.updateTabCollection(course.template);

            return this.loadSettings();
        }).catch(reason => {
            router.activeItem.settings.lifecycleData = { redirect: '404' };
            throw reason;
        });
    }

    canDeactivate() {
        this.settingsVisibility(false);

        return waiter.waitFor(this.canUnloadSettings, delay, limit)
            .catch(() => {
                notify.error(templateSettingsErrorNotification);
            })
            .then(() => {
                this.settingsVisibility(true);
                return true;
            });
    }

    deactivate() {
        if (this.settingsVisibilitySubscription) {
            this.settingsVisibilitySubscription.dispose();
        }

        this.subscriptions.forEach(s => s.off());
    }

    templateUpdated(template) {
        if (template.id === this.template().id) {
            return;
        }
        
        this.template().isLoading(true);
        this.loadingTemplate(true);
        this.tab(null);

        return waiter.waitFor(this.canUnloadSettings, delay, limit)
            .catch(() => {
                notify.error(templateSettingsErrorNotification);
            })
            .then(() => {
                this.settingsVisibility(false);
                this.template(new TemplateBrief(template));
                this.loadingTemplate(false);
            })
            .then(() => this.loadSettings())
            .then(() =>  this.updateTabCollection(template));
    }

    templateUpdatedByCollaborator(course) {
        if (course.id !== this.courseId)
            return;

        this.templateUpdated(course.template);
    }

    onGetTemplateMessage(message) {
        if (!message || !message.type) {
            return;
        }

        switch (message.type) {
            case templateMessageTypes.showSettings:
                this.settingsVisibility(true);
                break;
            case templateMessageTypes.freezeEditor:
                this.canUnloadSettings(false);
                break;
            case templateMessageTypes.unfreezeEditor:
                this.canUnloadSettings(true);
                break;
            case templateMessageTypes.notification:
                var data = message.data;

                if (data.success) {
                    data.message ? notify.success(data.message) : notify.saved();
                    this.reloadPreview();
                } else {
                    notify.error(data.message || templateSettingsErrorNotification);
                }
                break;
        }
    }

    reloadPreview() {
        this.previewUrl.valueHasMutated();
    }

    updateTabCollection(template) {
        var collection = _.map(template.settingsUrls.design || [], tab => {
            return {
                name: tab.name,
                isSelected: ko.observable(false),
                title: localizationManager.localize(tab.name),
                url: tab.url,
                type: 'external'
            }
        });

        if (template.supports && template.supports.indexOf('fonts') > -1) {
            collection.push(this.fontsTab);
        }

        if (template.supports && template.supports.indexOf('branding') > -1) {
            collection.unshift(this.brandingTab);
        }

        if (this.isThemesSupported()) {
            collection.unshift(this.themesTab);
        }

        collection.forEach((tab, index) => {
            if (ko.isWriteableObservable(tab.isSelected)) {
                tab.isSelected(index === 0);
            }
        });
    
        this.tab(collection[0]);
        this.settingsTabs(collection);
    }

    settingsFrameLoaded() {
        this.canUnloadSettings(true);
        this.settingsLoadingTimeoutId = _.delay(this.showSettings.bind(this), templateSettingsLoadingTimeout);
    }

    showSettings() {
        this.settingsVisibility(true);
    }

    changeTab(tab) {
        if (!tab || tab.isSelected()) {
            return;
        }

        this.tab().isSelected(false);
        
        this.tab(tab);
        this.tab().isSelected(true);

        this.settingsVisibility(false);
    }

    themeSelected(theme) {
        this.settings = _.extend({}, this.settings, theme.settings ? cloneObject(theme.settings) : {});

        if (theme.id) {
            return themeRepository.addThemeToCourse(this.courseId, this.template().id, theme.id)
                .then(() => {
                    this.selectedTheme = new Theme(theme);
                    return this.saveSettings();
                });
        }else if (this.selectedTheme && this.selectedTheme.id) {
            return themeRepository.removeCourseTheme(this.courseId, this.template().id)
                .then(() => {
                    this.selectedTheme = new Theme(theme);
                    return this.saveSettings();
                });
        }

        this.selectedTheme = new Theme(theme);
        return this.saveSettings();
    }
    loadSettings() {
        return getCommand.getCourseTemplateSettings(this.courseId, this.template().id).then(response => {
            if (response.theme) {
                this.selectedTheme = response.theme;
                this.settings = deepExtend(response.settings, response.theme.settings ? cloneObject(response.theme.settings) : {});
                return;
            }
            
            let preset;
            if (Array.isArray(this.template().presets)) {
                preset = _.find(this.template().presets, p => p.title && p.title === (response.extraData && response.extraData.preset));
                preset = preset || _.first(this.template().presets);
            }
            this.settings = deepExtend(response.settings, preset && preset.settings ? cloneObject(preset.settings) : {});
            this.selectedTheme = preset ? new Theme(preset) : null;
        });
    }
    getDefaultSettings() {
        let preset;
        if (Array.isArray(this.template().presets)) {
            preset = _.first(this.template().presets);
        }

        return preset && preset.settings ? cloneObject(preset.settings) : {};
    }
    saveSettings() {
        let isUserThemeSelected = this.selectedTheme && this.selectedTheme.id;
        let courseTemplateSettings = isUserThemeSelected ? deepDiff(this.settings, this.selectedTheme.settings) : this.settings;
        let extraData = { preset: this.selectedTheme && this.selectedTheme.title };
        return saveCommand.saveCourseTemplateSettings(this.courseId, this.template().id, courseTemplateSettings, extraData)
            .then(() => {
                notify.saved();
                this.reloadPreview();
            })
            .catch(() => notify.error());
    }

    settingsChanged() {

        this.settings = this.settings || {};
        this.settings.branding = this.settings.branding || {};

        this.settings.branding.logo = {
            url: this.brandingTab.logo.imageUrl()
        };

        let colorsInFontsTab = _.map(this.fontsTab.generalStyles.colors(), item => { 
            return {
                key: item.key, 
                value: item.value()
            }
        });

        let isChangedInFontsTab = compareArrays(colorsInFontsTab, this.settings.branding.colors);

        if(isChangedInFontsTab){
            _.each(colorsInFontsTab, item => {
                var element = _.find(this.settings.branding.colors, color => color.key === item.key);
                element.value = item.value;
            });
        };

        if(!isChangedInFontsTab && this.brandingTab.colors.colors().length){
            this.settings.branding.colors = this.brandingTab.colors.colors().map(c => {
                return {
                    key: c.key,
                    value: c.value()
                }
            });
        
            this.settings.branding.background = {
                header: {
                    brightness: this.brandingTab.background.header.brightness(),
                    color: this.brandingTab.background.header.color() ? this.brandingTab.background.header.color() : null,
                    image: this.brandingTab.background.header.image() ? {
                        url: this.brandingTab.background.header.image(),
                        option: this.brandingTab.background.header.option()
                    } : null
                },
                body: {
                    enabled: this.brandingTab.background.body.enabled(),
                    brightness: this.brandingTab.background.body.brightness(),
                    color: this.brandingTab.background.body.color() ? this.brandingTab.background.body.color() : null,
                    texture: this.brandingTab.background.body.texture() ? this.brandingTab.background.body.texture() : null
                }
            };
        };

        this.themesTab.hasUnsavedChanges(true);
        return this.saveSettings();
    }

    fontSettingsChanged() {
        this.settings.fonts = _.flatten([this.fontsTab.generalStyles.mainFont, this.fontsTab.contentStyles.elements()]).map(f => {
            return {
                key: f.key,
                fontFamily: f.fontFamily ? f.fontFamily() : null,
                fontWeight: f.fontWeight ? f.fontWeight() : null,
                size: f.size ? f.size() : null,
                color: f.color ? f.color() : null,
                textBackgroundColor: f.textBackgroundColor ? f.textBackgroundColor() : null,
                fontStyle: f.fontStyle ? f.fontStyle() : null,
                textDecoration: f.textDecoration ? f.textDecoration() : null,
                isGeneralSelected: f.isGeneralSelected ? f.isGeneralSelected() : null,
                isGeneralColorSelected: f.isGeneralColorSelected ? f.isGeneralColorSelected() : null
            }
        });

        this.themesTab.hasUnsavedChanges(true);
        return this.saveSettings();
    }

    textColorChanged(color) {
        _.each(this.settings.fonts, f => {
            if (f.isGeneralColorSelected && f.key !== 'links') {
                f.color = color;
            }
        });
        let textColor = _.find(this.settings.branding.colors, c => {
            return c.key === '@text-color';
        });
        textColor.value = color;

        this.themesTab.hasUnsavedChanges(true);
        return this.saveSettings();
    }
    
    showThemesUpgradeDialog() {
        upgradeDialog.show(constants.dialogs.upgrade.settings.saveThemes);
    }

    showCreateThemePopup() {
        this.createThemePopup.show();
    }
    saveAsNewTheme(title) {
        if (!this.canSaveTheme()) {
            return;
        }

        if (this.settings) {
            themeRepository.add(this.template().id, title, { branding: this.settings.branding, fonts: this.settings.fonts })
            .then((theme) => {
                notify.saved();
            });
        }
    }

    updateTheme() {
        if (!this.canSaveTheme()) {
            return;
        }

        if (this.selectedTheme && this.selectedTheme.id) {
            this.selectedTheme.settings = { branding: this.settings.branding, fonts: this.settings.fonts };
            themeRepository.update(this.selectedTheme.id, this.selectedTheme.settings)
            .then(() => {
                this.saveSettings();
            });
        }
    }

    discardThemeChanges() {
        let themeSettings = this.selectedTheme ? cloneObject(this.selectedTheme.settings) : this.getDefaultSettings();

        this.settings = _.extend({}, this.settings, themeSettings ? themeSettings : {});
        this.saveSettings().then(() => {
            this.themesTab.discardChanges(this.settings);
        });
    }
}

function compareArrays (array1, array2){
    var arr1 = _.map(array1, function(item){
        return item.key + item.value; 
    });
    var arr2 = _.map(array2, function(item){
        return item.key + item.value; 
    });
    var res = _.intersection(arr1, arr2);
    return res.length != arr1.length;
}

function cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function deepDiff(obj1, obj2) {
    let makeDiff = (obj1, obj2, result) => {
        _.each(obj1, (value, key) => {
            if (result.hasOwnProperty(key) || (obj2 && obj2[key] === value)) {
                return;
            }

            if (!_.isObject(value) || !obj2) {
                result[key] = value;
                return;
            }

            let resultValue = deepDiff(value, obj2[key]);
            if (!_.isEmpty(resultValue)) {
                result[key] = resultValue;
            }
        });
    };

    let result = Array.isArray(obj1) ? new Array() : {};
    makeDiff(obj1, obj2, result);
    makeDiff(obj2, obj1, result);
    return result;
}

function deepExtend(destination, source) {
    if (_.isNullOrUndefined(destination)) {
        return source;
    }

    for (var property in source) {
        if (source[property] && source[property].constructor &&
         (source[property].constructor === Object || source[property].constructor === Array)) {
            if (destination[property]) {
                deepExtend(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        } else {
            destination[property] = destination[property] || source[property];
        }
    }
    return destination;
};


export default new Design();