import ko from 'knockout';
import Events from 'durandal/events';

import notify from 'notify';
import imageUpload from 'imageUpload';

export const COLOR_MODE = 'color';
export const TEXTURE_MODE = 'texture';

export const EVENT_TEXTURE_SELECTED = 'texture:selected';
export const EVENT_COLOR_SELECTED = 'color:selected';

export class BackgroundPopover {
    constructor() {
        Events.includeIn(this);
        
        this.viewUrl = 'design/tabs/sections/BodyBackgroundPopover.html';
        this.isVisible = ko.observable(false);

        this.mode = ko.observable(COLOR_MODE);
        [COLOR_MODE, TEXTURE_MODE].forEach(mode => {
            this[`is${mode.capitalize()}Mode`] = ko.computed(() => {
                return this.mode() === mode;
            });
            this[`to${mode.capitalize()}Mode`] = () => {
                this.mode(mode);
            }
        });

        this.color = ko.observable();
        this.colors = ko.observableArray(colors);

        this.texture = ko.observable();
        this.textures = ko.observableArray(textures);

        this.attemptedColor = ko.observable();
        this.isColorPickerVisible = ko.observable();
    }

    showColorPicker() {
        this.isColorPickerVisible(true);
    }

    hideColorPicker() {
        this.isColorPickerVisible(false);
    }

    pickColor() {
        this.selectColor(this.attemptedColor());
        this.hideColorPicker();
    }

    selectColor(color) {
        this.color(color);
        this.texture(null);
        this.trigger(EVENT_COLOR_SELECTED, color);
    }

    selectTexture(texture) {
        this.texture(texture);
        this.color(null);
        this.trigger(EVENT_TEXTURE_SELECTED, texture);
    }

    upload(file) {
        if (!file) {
            return Promise.reject();
        }

        return imageUpload.v2(file)
            .then(response => this.selectTexture(response.url))
            .catch(reason => {
                notify.error(reason);
            });
    }

    show() {
        this.isVisible(true);
    }
}

let colors = [
    '#9E9E9E',
    '#607D8B',
    '#795548',
    '#FF9800',
    '#8BC34A',
    '#00BCD4',
    '#ecf0f1',
    '#bdc3c7',
    '#34495e',
    '#2c3e50',
    '#f3f7f9',
    '#c2e6f9',
    '#ced8de'
];

let textures = [
    '//cdn.easygenerator.com/textures/1.png',
    '//cdn.easygenerator.com/textures/2.png',
    '//cdn.easygenerator.com/textures/3.png',
    '//cdn.easygenerator.com/textures/4.png',
    '//cdn.easygenerator.com/textures/5.png',
    '//cdn.easygenerator.com/textures/6.png',
    '//cdn.easygenerator.com/textures/7.png',
    '//cdn.easygenerator.com/textures/8.png',
    '//cdn.easygenerator.com/textures/9.png',
    '//cdn.easygenerator.com/textures/10.png',
    '//cdn.easygenerator.com/textures/11.png',
    '//cdn.easygenerator.com/textures/12.png',
    '//cdn.easygenerator.com/textures/13.png',
    '//cdn.easygenerator.com/textures/14.png',
    '//cdn.easygenerator.com/textures/15.png',
    '//cdn.easygenerator.com/textures/16.png'
];

export default new BackgroundPopover();
