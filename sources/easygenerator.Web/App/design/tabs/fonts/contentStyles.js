import ko from 'knockout';

import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';

import {ContentElement} from './generalStyles';

export default class ContentStyles {
    constructor() {
        this.available = null;
        this.title = localizationManager.localize('contentStyles');
        this.viewUrl = 'design/tabs/fonts/contentStyles.html';
        this.expanded = ko.observable(false);

        this.elements = ko.observableArray();
        this.contentBodyColor = null;
        this.allowEdit = null;
    }

    activate(settings, defaults, allowEdit) {
        this.available = userContext.hasPlusAccess();
        this.allowEdit = allowEdit;

        let elements = Array.isArray(settings.fonts) ? settings.fonts : Array.isArray(defaults.fonts) ? defaults.fonts : [];

        let supportedElements = _.filter(elements, element => {
            return element.key !== 'main-font';
        });

        let mainFontSettings =  _.find(elements, element => {
            return element.key === 'main-font';
        });

        let mainFontFamily = mainFontSettings ? mainFontSettings.fontFamily : null;

        let generalFontSettings = _.find(settings.branding.colors, e => {
            return e.key === '@text-color';
        });

        let generalFontColor = generalFontSettings ? generalFontSettings.value : null;

        let secondaryFontSettings = _.find(settings.branding.colors, e => {
            return e.key === '@secondary-color';
        });

        let secondaryFontColor = secondaryFontSettings ? secondaryFontSettings.value : null;

        let contentBodySettings = _.find(settings.branding.colors, e => {
            return e.key === '@content-body-color';
        });

        this.contentBodyColor = contentBodySettings ? contentBodySettings.value : null;

        this.elements(supportedElements.map(e => new ContentElement(e, _.find(defaults.fonts, value => {return value.key === e.key}), mainFontFamily, generalFontColor, secondaryFontColor)));
    }

    toggleExpanded() {
        this.expanded(!this.expanded());
    }
}