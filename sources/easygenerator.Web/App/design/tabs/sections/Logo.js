﻿import ko from 'knockout';

import eventTracker from 'eventTracker';

import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';

import bus from './../../bus.js';
import notify from 'notify';

import { LogoPopover } from './LogoPopover.js';


export const EVENT_LOGO_REMOVED = 'branding:logo:removed';
export const EVENT_LOGO_CHANGED = 'branding:logo:changed';

class Logo {

    constructor() {
        this.title = localizationManager.localize('courseLogo');
        this.viewUrl = 'design/tabs/sections/Logo.html';
        this.expanded = ko.observable(true);

        this.imageUrl = ko.observable();
        this.imageUrl.isDefault = ko.computed(() => {
            return this.imageUrl() && this.imageUrl() === (this.defaults && this.defaults.url);
        }, this);

        this.defaults = null;
        this.available = null;
        this.popover = new LogoPopover();
        this.popover.on(EVENT_LOGO_CHANGED).then(url => this.updateLogo(url));
    }

    remove() {
        this.imageUrl(this.defaults && this.defaults.url || null);
        this.popover.imageUrl(this.defaults && this.defaults.url || null);
        bus.trigger(EVENT_LOGO_REMOVED);
    }

    activate(logo, defaults) {
        this.defaults = defaults || null;
        this.imageUrl(logo && logo.url || defaults && defaults.url || null);
        this.available = userContext.hasStarterAccess();
        this.popover.imageUrl(this.imageUrl());
    }

    toggleExpanded() {
        this.expanded(!this.expanded());
    }
   
    showPopover() {
        this.popover.isVisible(!this.popover.isVisible());
    }

    updateLogo(url){
        this.imageUrl(url);
        bus.trigger(EVENT_LOGO_CHANGED);
    }
}

export default Logo;