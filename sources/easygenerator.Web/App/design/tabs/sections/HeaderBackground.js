﻿import ko from 'knockout';

import { HeaderPopover } from './HeaderBackgroundPopover.js';
import bus from './../../bus';

export const BACKGROUND_IMAGE_FULLSCREEN = 'fullscreen';
export const BACKGROUND_IMAGE_REPEAT = 'repeat';
export const BACKGROUND_IMAGE_ORIGINAL = 'original';

export const EVENT_HEADER_BACKGROUND_EXPANDED_CHANGED = 'branding:header-background-expanded:changed';
export const EVENT_HEADER_BACKGROUND_IMAGE_CHANGED = 'branding:header-background-image:changed';
export const EVENT_HEADER_BACKGROUND_IMAGE_REMOVED = 'branding:header-background-image:removed';
export const EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED = 'branding:header-background-image-option:changed';
export const EVENT_HEADER_BACKGROUND_COLOR_CHANGED = 'branding:header-background-color:changed';
export const EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED = 'branding:header-background-brightness:changed';


export default class HeaderBackground {
    constructor() {
        this.expanded = ko.observable(false);

        this.image = ko.observable();
        this.image.isDefault = ko.computed(() => {
            return this.image() && this.image() === (this.defaults && this.defaults.image && this.defaults.image.url);
        }, this);
        this.color = ko.observable('#aabbcc');

        this.option = ko.observable(BACKGROUND_IMAGE_FULLSCREEN);

        [BACKGROUND_IMAGE_FULLSCREEN, BACKGROUND_IMAGE_REPEAT, BACKGROUND_IMAGE_ORIGINAL].forEach(option => {
            this[`is${option.toLowerCase().capitalize()}`] = ko.computed(() => {
                return this.option() === option;
            }, this);
            this[`switchTo${option.toLowerCase().capitalize()}`] = () => {
                if (this.option() !== option) {
                    this.option(option);
                    bus.trigger(EVENT_HEADER_BACKGROUND_IMAGE_OPTION_CHANGED);
                }
            }
        });

        this.brightness = ko.observable(0);

        this.popover = new HeaderPopover();
        this.popover.on('color:selected').then(color => this.updateColor(color));
        this.popover.on('image:selected').then(color => this.updateImage(color));
    }

    toggleExpanded() {
        this.expanded(!this.expanded());
        bus.trigger(EVENT_HEADER_BACKGROUND_EXPANDED_CHANGED);
    }

    updateColor(color) {
        this.color(color);
        this.image(null);
        bus.trigger(EVENT_HEADER_BACKGROUND_COLOR_CHANGED);
    }

    updateImage(image) {
        this.image(image);
        this.option(BACKGROUND_IMAGE_FULLSCREEN);
        this.color(null);
        bus.trigger(EVENT_HEADER_BACKGROUND_IMAGE_CHANGED);
    }

    removeImage() {
        this.image(this.defaults && this.defaults.image && this.defaults.image.url || null);
        bus.trigger(EVENT_HEADER_BACKGROUND_IMAGE_REMOVED);
    }

    changeBackground() {
        this.popover.isVisible(true);
    }

    changeBrightness(value) {
        if (isNaN(value)) {
            return;
        }

        if (this.brightness() !== value) {
            this.brightness(value);
            bus.trigger(EVENT_HEADER_BACKGROUND_BRIGHTNESS_CHANGED);
        }
    }

    activate(settings, defaults) {
        this.defaults = defaults || null;

        this.expanded(settings && settings.expanded || defaults && defaults.expanded || false);
        this.image(settings && settings.image && settings.image.url || defaults && defaults.image && defaults.image.url || null);
        this.popover.image(settings && settings.image && settings.image.url || defaults && defaults.image && defaults.image.url || null);
        this.option(settings && settings.image && settings.image.option || defaults && defaults.image && defaults.image.option || null);
        this.color(settings && settings.color || defaults && defaults.color || null);
        this.popover.color(settings && settings.color || defaults && defaults.color || null);
        this.brightness(settings && settings.brightness || defaults && defaults.brightness || 0);
    }
}