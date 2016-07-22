import ko from 'knockout';

import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';

import HeaderBackground from './HeaderBackground.js';
import BodyBackground from './BodyBackground.js';


export default class Backgrounds {
    constructor() {
        this.title = localizationManager.localize('backgrounds');
        this.viewUrl = 'design/tabs/branding/backgrounds/Backgrounds.html';
        this.expanded = ko.observable(false);

        this.available = true;
        this.allowEdit = true;         
        this.header = new HeaderBackground();
        this.body = new BodyBackground();
    }

    activate(settings, defaults, allowEdit) {
        this.header.activate(settings ? settings.header : null, defaults? defaults.header: null);
        this.body.activate(settings ? settings.body : null, defaults? defaults.body: null);
        this.available = userContext.hasPlusAccess();
        this.allowEdit = allowEdit;
    }

    toggleExpanded() {
        this.expanded(!this.expanded());
    }
}