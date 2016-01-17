import ko from 'knockout';

import bus from './../../bus.js';
import imageUpload from 'imageUpload';
import notify from 'notify';

import localizationManager from 'localization/localizationManager';
import userContext from 'userContext';

export const URL_MODE = 'URL';
export const UPLOAD_MODE = 'upload';

export const EVENT_LOGO_CHANGED = 'branding:logo:changed';
export const EVENT_LOGO_UPLOADED = 'branding:logo:uploaded';
export const EVENT_LOGO_REMOVED = 'branding:logo:removed';

class Logo {

    constructor() {
        this.title = localizationManager.localize('courseLogo');
        this.viewUrl = 'design/tabs/sections/Logo.html';
        this.expanded = ko.observable(true);

        this.mode = ko.observable(UPLOAD_MODE);

        [URL_MODE, UPLOAD_MODE].forEach(mode => {
            this[`is${mode.capitalize()}Mode`] = ko.computed(() => {
                return this.mode() === mode;
        });
            this[`to${mode.capitalize()}Mode`] = () => {
                this.mode(mode);
            }
        });

        this.imageUrl = ko.observable();
        this.imageUrl.isDefault = ko.computed(() => {
            return this.imageUrl() && this.imageUrl() === (this.defaults && this.defaults.url);
        }, this);
        this.imageUrl.endEdit = () => bus.trigger(EVENT_LOGO_CHANGED);

        this.defaults = null;
        this.available = null;
    }

    remove() {
        this.imageUrl(this.defaults && this.defaults.url || null);
        bus.trigger(EVENT_LOGO_REMOVED);
    }

    activate(logo, defaults) {
        this.defaults = defaults || null;
        this.imageUrl(logo && logo.url ? logo.url : null);
        this.available = userContext.hasStarterAccess();
    }

    toggleExpanded() {
        this.expanded(!this.expanded());
    }
   
    upload(file) {
        if (!file) {
            return Promise.reject();
        }
        var that = this;
        return imageUpload.v2(file)
            .then(response => that.imageUrl(response.url))
            .then(() => bus.trigger(EVENT_LOGO_UPLOADED))
            .catch(reason => {
                notify.error(reason);
            });
    }

}


export default Logo;