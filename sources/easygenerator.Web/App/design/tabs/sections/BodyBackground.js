import ko from 'knockout';

import eventTracker from 'eventTracker';

import { BackgroundPopover } from './BodyBackgroundPopover.js';
import bus from './../../bus';
import _ from 'underscore';

export const EVENT_BODY_BACKGROUND_ENABLED_CHANGED = 'branding:body-background-enabled:changed';
export const EVENT_BODY_BACKGROUND_TEXTURE_CHANGED = 'branding:body-background-texture:changed';
export const EVENT_BODY_BACKGROUND_COLOR_CHANGED = 'branding:body-background-color:changed';
export const EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED = 'branding:body-background-brightness:changed';

export default class BodyBackground{
    constructor() {
        this.enabled = ko.observable(true);
        this.brightness = ko.observable(0);

        this.texture = ko.observable(null);
        this.color = ko.observable(null);

        this.popover = new BackgroundPopover();
        this.popover.on('color:selected').then(color => this.updateColor(color));
        this.popover.on('texture:selected').then(color => this.updateTexture(color));
    }

    toggleEnabled() {
        this.enabled(!this.enabled());
        bus.trigger(EVENT_BODY_BACKGROUND_ENABLED_CHANGED);

        if (ko.unwrap(this.enabled)) {
            eventTracker.publish('Switch to multiple backgrounds');
        } else {
            eventTracker.publish('Switch to one background');
        }
    }

    changeBrightness(value) {
        if (isNaN(value)) {
            return;
        }

        if (this.brightness() !== value) {
            this.brightness(value);
            bus.trigger(EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED);
            eventTracker.publish('Change secondary background');
        }
    }

    changeBackground() {
        this.popover.isVisible(true);
    }

    updateColor(color) {
        this.color(color);
        this.texture(null);
        bus.trigger(EVENT_BODY_BACKGROUND_COLOR_CHANGED);
        eventTracker.publish('Change secondary background');
    }
    
    updateTexture(texture) {
        this.texture(texture);
        this.color(null);
        bus.trigger(EVENT_BODY_BACKGROUND_TEXTURE_CHANGED);
        eventTracker.publish('Change secondary background');
    }

    activate(settings, defaults) {
        this.defaults = defaults || null;

        if(settings && !_.isNullOrUndefined(settings.enabled)) {
            this.enabled(settings.enabled);
        }else if(defaults && !_.isNullOrUndefined(defaults.enabled)){
            this.enabled(defaults.enabled);
        }else{
            this.enabled(true);
        }

        this.texture(settings && settings.texture || defaults && defaults.texture || null);
        this.popover.texture(settings && settings.texture || defaults && defaults.texture || null);
        this.color(settings && settings.color || defaults && defaults.color || null);
        this.popover.color(settings && settings.color || defaults && defaults.color || null);
        this.brightness(settings && settings.brightness || defaults && defaults.brightness || 0);
    }
}
