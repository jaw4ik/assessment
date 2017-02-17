import ko from 'knockout';
import Events from 'durandal/events';

import notify from 'notify';
import uploadImage from 'images/commands/upload';

import eventTracker from 'eventTracker';

import {EVENT_LOGO_CHANGED } from './Logo';

export class LogoPopover {
    constructor() {
        Events.includeIn(this);

        this.viewUrl = 'design/tabs/branding/courseLogo/LogoPopover.html';
        this.isVisible = ko.observable(false);

        this.imageUrl = ko.observable();
        this.imageUrl.endEdit = () => {
            this.trigger(EVENT_LOGO_CHANGED, this.imageUrl());
            eventTracker.publish('Change logo (link)');
        }
    }

    async upload(file) {
        try {
            let image = await uploadImage.execute(file);
            this.updateLogo(image.url);
            eventTracker.publish('Change logo (upload)');
            notify.saved();
            return image.url;
        } catch (e) {
            notify.error(e);
        }
    }

    updateLogo(url){
        this.trigger(EVENT_LOGO_CHANGED, url);
        this.imageUrl(url);
    }

}

export default new LogoPopover();