import ko from 'knockout';
import Events from 'durandal/events';

import notify from 'notify';
import uploadImage from 'images/commands/upload';

export const IMAGE_MODE = 'image';
export const COLOR_MODE = 'color';

export const EVENT_IMAGE_SELECTED = 'image:selected';
export const EVENT_COLOR_SELECTED = 'color:selected';

export class HeaderPopover {
    constructor() {
        Events.includeIn(this);

        this.viewUrl = 'design/tabs/branding/backgrounds/HeaderBackgroundPopover.html';
        this.isVisible = ko.observable(false);

        this.mode = ko.observable(IMAGE_MODE);
        [IMAGE_MODE, COLOR_MODE].forEach(mode => {
            this[`is${mode.capitalize()}Mode`] = ko.computed(() => {
                return this.mode() === mode;
            });
            this[`to${mode.capitalize()}Mode`] = () => {
                this.mode(mode);
            }
        });

        this.color = ko.observable();
        this.colors = ko.observableArray(colors);

        this.image = ko.observable();
        this.images = ko.observableArray(images);

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
        this.image(null);
        this.trigger(EVENT_COLOR_SELECTED, color);
    }
    selectImage(image) {
        this.image(image);
        this.color(null);
        this.trigger(EVENT_IMAGE_SELECTED, image);
    }
    async upload(file) {
        try {
            let image = await uploadImage.execute(file);
            this.selectImage(image.url);
            notify.saved();
            return image.url;
        } catch (e) {
            notify.error(e);
        }
    }
    show() {
        this.isVisible(true);
    }
}

var images = [
   '//cdn.easygenerator.com/images/1.jpg',
   '//cdn.easygenerator.com/images/2.jpg',
   '//cdn.easygenerator.com/images/3.jpg',
   '//cdn.easygenerator.com/images/4.jpg',
   '//cdn.easygenerator.com/images/5.jpg',
   '//cdn.easygenerator.com/images/6.jpg',
   '//cdn.easygenerator.com/images/7.jpg',
   '//cdn.easygenerator.com/images/8.jpg',
   '//cdn.easygenerator.com/images/9.jpg',
   '//cdn.easygenerator.com/images/10.jpg',
   '//cdn.easygenerator.com/images/11.jpg',
   '//cdn.easygenerator.com/images/12.jpg',
   '//cdn.easygenerator.com/images/13.jpg'
];

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

export default new HeaderPopover();