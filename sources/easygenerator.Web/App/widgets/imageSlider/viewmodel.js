import ko from 'knockout';
import _ from 'underscore';

export default class {
    constructor() {
        this.settings = '';//paramble
        this.status = '';
        this.index = 0;
        this.images = [];//paramble
        this.selectedImage = ko.observable('');//paramble    
        this.shouldDisplayIcons = ko.observable(false);
        this.imageLoaded = ko.observable(false);
    }

    next() {
        if(this.images.length <= this.index + 1) {
            this.index = 0;
        } else { this.index++; }
        this.imageLoaded(true);
        this.selectedImage(this.images[this.index]);
    }

    previus() {
        if(this.index > 0) {
            this.index--; 
        } else { this.index = this.images.length - 1; }
        this.imageLoaded(true);
        this.selectedImage(this.images[this.index]);
    }

    close() {
        this.selectedImage('');
    }

    activate(activationData) {
        if (!_.isUndefined(activationData.imageArray)) {
            this.images = this.images.concat(activationData.imageArray);
        }
        if (!_.isUndefined(activationData.selectedImage)) {
            this.selectedImage = activationData.selectedImage;
        }
        if (!_.isUndefined(activationData.settings)) {
            this.settings = activationData.settings;
        }
        if (!_.isUndefined(activationData.shouldDisplayIcons)) {
            this.shouldDisplayIcons = activationData.shouldDisplayIcons;
        } else this.shouldDisplayIcons(false);
    }
}