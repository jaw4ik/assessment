import ko from 'knockout';

import { BackgroundPopover } from './BodyBackgroundPopover.js';
import bus from './../../bus';

export const EVENT_BODY_BACKGROUND_TEXTURE_CHANGED = 'branding:body-background-texture:changed';
export const EVENT_BODY_BACKGROUND_COLOR_CHANGED = 'branding:body-background-color:changed';
export const EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED = 'branding:body-background-brightness:changed';

export default class BodyBackground{
    constructor() {
        this.brightness = ko.observable(0);

        this.texture = ko.observable(null);
        this.color = ko.observable(null);

        this.popover = new BackgroundPopover();
        this.popover.on('color:selected').then(color => this.updateColor(color));
        this.popover.on('texture:selected').then(color => this.updateTexture(color));
    }

    changeBrightness(value) {
        if (isNaN(value)) {
            return;
        }

        if (this.brightness() !== value) {
            this.brightness(value);
            bus.trigger(EVENT_BODY_BACKGROUND_BRIGHTNESS_CHANGED);
        }
    }

    changeBackground() {
        this.popover.isVisible(true);
    }

    updateColor(color) {
        this.color(color);
        this.texture(null);
        bus.trigger(EVENT_BODY_BACKGROUND_COLOR_CHANGED);
    }
    
    updateTexture(texture) {
        this.texture(texture);
        this.color(null);
        bus.trigger(EVENT_BODY_BACKGROUND_TEXTURE_CHANGED);
    }

    activate(settings, defaults) {
        this.defaults = defaults || null;

        this.texture(settings && settings.texture || defaults && defaults.texture || null);
        this.popover.texture(settings && settings.texture || defaults && defaults.texture || null);
        this.color(settings && settings.color || defaults && defaults.color || null);
        this.popover.color(settings && settings.color || defaults && defaults.color || null);
        this.brightness(settings && settings.brightness || defaults && defaults.brightness || 0);
    }
}
