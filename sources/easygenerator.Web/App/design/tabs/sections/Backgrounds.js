import ko from 'knockout';

import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';

import HeaderBackground from './HeaderBackground.js';
import BodyBackground from './BodyBackground.js';


export default class Backgrounds {
    constructor() {
        this.title = localizationManager.localize('backgrounds');
        this.viewUrl = 'design/tabs/sections/Backgrounds.html';
        this.expanded = ko.observable(false);
        
        this.available = null;
         
        this.header = new HeaderBackground();
        this.body = new BodyBackground();
    }

    activate(settings, defaults) {
        this.header.activate(settings ? settings.header : null, defaults? defaults.header: null);
        this.body.activate(settings ? settings.body : null, defaults? defaults.body: null);
        this.available = userContext.hasPlusAccess();
    }

    toggleExpanded() {
        this.expanded(!this.expanded());
    }
}