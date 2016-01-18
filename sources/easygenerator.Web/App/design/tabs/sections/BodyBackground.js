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

    activate(settings) {
        if (settings) {
            this.brightness(settings.brightness || 0);
            if (settings.color) {
                this.color(settings.color);
                this.popover.color(settings.color);
                this.texture(null);
                this.popover.texture(null);
            } else {
                this.texture(settings.texture);
                this.popover.texture(settings.texture);
                this.color(null);
                this.popover.color(null);
            }
        } else {
            this.color(null);
            this.popover.color(null);
            this.texture(null);
            this.popover.texture(null);
            this.brightness(0);
        }
    }
}
