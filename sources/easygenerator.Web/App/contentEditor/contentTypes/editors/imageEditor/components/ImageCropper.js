import binder from 'binder';
import _ from 'underscore';
import $ from 'jquery.guillotine';
import 'jquery.guillotine/css/jquery.guillotine.css!';

const 
    cssClasses = {
        guillotineWindow: 'guillotine-window',
        imagePreloader: 'image-preloader-wrapper'
    },
    defaultSize = {
        width: 420,
        height: 255
    };

export default class {
    constructor() {
        binder.bindClass(this);

        this.$image = $('<img>').on('load', this._imageLoaded);
        this.disabled = false;
    }
    setImage(imageSrc, initialOptions) {
        this._wrapImage(initialOptions);

        let guillotineInstance = this.$image.guillotine('instance');
        if (_.isObject(guillotineInstance)) {
            if (this.$image.attr('src') === imageSrc) {
                this._unwrapImage();
                return Promise.resolve();
            }

            this.$image.guillotine('remove');
        } else {
            this.$image.attr('src', null);
        }
        
        this.options = initialOptions;
        this.$image.attr('src', imageSrc);
        return this.loadingPromise = new Promise(resolve => this.resolve = resolve);
    }
    _wrapImage(initialOptions) {
        let width, height;

        if (initialOptions) {
            width = initialOptions.w;
            height = initialOptions.h;
        } else if (this.$image.guillotine('instance')) {
            let imageData = this.$image.guillotine('getData');
            width = imageData.w;
            height = imageData.h;
        } else {
            width = defaultSize.width;
            height = defaultSize.height;
        }

        let $wrapper = $('<div>')
            .addClass(cssClasses.imagePreloader)
            .css('padding-top', (height / width * 100) + '%');

        $(this.getView()).wrap($wrapper);
    }
    _unwrapImage() {
        let $wrapper = this.$image.closest(`.${cssClasses.imagePreloader}`);
        if ($wrapper.length > 0) {
            $wrapper.children().unwrap();
        }
    }
    _imageLoaded() {
        this.initialWidth = this.options ? this.options.w : defaultSize.width;
        this.initialHeight = this.options ? this.options.h : defaultSize.height;

        this._unwrapImage();
        this.$image.guillotine({ width: this.initialWidth, height: this.initialHeight, init: this.options });
        this.defaultScale = this.options ? this.options.defaultScale : this.$image.guillotine('getData').scale;

        if (this.disabled) {
            this.disable();
        }

        if (_.isFunction(this.resolve)) {
            this.resolve();
            this.loadingPromise = null;
        }
    }
    getView() {
        let $imageWrapper = this.$image.closest(`.${cssClasses.guillotineWindow},.${cssClasses.imagePreloader}`);
        return ($imageWrapper.length ? $imageWrapper : this.$image).get(0);
    }
    async getSource() {
        if (this.loadingPromise) {
            await this.loadingPromise;
        }

        return $('<output>')
            .append(this.getView().outerHTML)
            .find('*')
            .removeAttr('class')
            .removeAttr('data-active-view')
            .closest('output')
            .children()
            .addClass('cropped-image')
            .closest('output')
            .html();
    }
    async getImageData() {
        if (this.loadingPromise) {
            await this.loadingPromise;
        }

        if (!this.$image.guillotine('instance')) {
            return null;
        }

        return _.extend(this.$image.guillotine('getData'), {
            defaultScale: this.defaultScale
        });
    }
    setSize(width, height) {
        this.$image.guillotine('setHeight', height * (this.initialWidth / width));
    }
    setScale(scale) {
        this.$image.guillotine('setScale', this.defaultScale * scale);
    }
    async getScale() {
        if (this.loadingPromise) {
            await this.loadingPromise;
        }

        if (!this.$image.guillotine('instance')) {
            return null;
        }

        let imageData = this.$image.guillotine('getData');
        if (_.isNullOrUndefined(imageData) || _.isNullOrUndefined(this.defaultScale)) {
            return null;
        }

        return imageData.scale / this.defaultScale;
    }
    reset() {
        this.$image.guillotine('reset');
    }
    enable() {
        this.$image.guillotine('enable');
        this.disabled = false;
    }
    disable() {
        this.$image.guillotine('disable');
        this.disabled = true;
    }
}