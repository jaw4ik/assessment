import ko from 'knockout';
import Events from 'durandal/events';

import notify from 'notify';
import imageUpload from 'imageUpload';

import eventTracker from 'eventTracker';

import {EVENT_LOGO_CHANGED } from './Logo';

export class LogoPopover {
    constructor() {
        Events.includeIn(this);

        this.viewUrl = 'design/tabs/sections/LogoPopover.html';
        this.isVisible = ko.observable(false);

        this.imageUrl = ko.observable();
        this.imageUrl.endEdit = () => {
            this.trigger(EVENT_LOGO_CHANGED, this.imageUrl());
            eventTracker.publish('Change logo (link)');
        }
    }

    upload(file) {
        if (!file) {
            return Promise.reject();
        }

        return imageUpload.v2(file)
            .then(response => this.updateLogo(response.url))
            .then(() => eventTracker.publish('Change logo (upload)'))
            .catch(reason => {
                notify.error(reason);
            });
    }

    updateLogo(url){
        this.trigger(EVENT_LOGO_CHANGED, url);
        this.imageUrl(url);
    }

}

export default new LogoPopover();