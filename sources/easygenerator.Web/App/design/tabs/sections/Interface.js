﻿import ko from 'knockout';
import app from 'durandal/app';

import eventTracker from 'eventTracker';
import userContext from 'userContext';
import localizationManager from 'localization/localizationManager';

import bus from './../../bus';
import ColorpickerPopover from './ColorpickerPopover.js';
import { EVENT_COLORPICKER_COLOR_SELECTED } from './ColorpickerPopover.js';
import './../../components/colorpicker/index.js';

export const EVENT_COLOR_SELECTED = 'branding:interface-color:selected';

class Interface {
    constructor() {
        this.title = localizationManager.localize('interfaceColors');
        this.viewUrl = 'design/tabs/sections/Interface.html';
        this.expanded = ko.observable(false);
        this.colors = ko.observableArray();
        this.available = null;
    }

    activate(colors, defaults) {
        colors = Array.isArray(colors) ? colors : Array.isArray(defaults) ? defaults : [];
        this.colors(colors.map(c => new Color(c)));
        this.available = userContext.hasPlusAccess();
    }

    toggleExpanded() {
        this.expanded(!this.expanded());
    }
}

export class Color{
    constructor (spec) {
        spec = spec || {};
        spec.key = spec.key || 'untitled';
        spec.value = spec.value || '#ffffff';

        this.key = spec.key;
        this.value = ko.observable(spec.value);
        this.title = spec.key.replace('@', '').replace(/-/g, ' ').capitalize();

        this.popover = new ColorpickerPopover(spec.value);
        let that = this;

        this.popover.on(EVENT_COLORPICKER_COLOR_SELECTED).then(value => {
            if(that.key == '@text-color'){
                that.value(value);
                app.trigger('text-color:changed', value);
                eventTracker.publish('Change interface color');
            }else{
                this.updateValue(value);
            }
        });
    }

    showPopover() {
        this.popover.isVisible(true);
    }

    updateValue(value) {
        this.value(value);
        bus.trigger(EVENT_COLOR_SELECTED);
        eventTracker.publish('Change interface color');
    }

}

export default Interface;