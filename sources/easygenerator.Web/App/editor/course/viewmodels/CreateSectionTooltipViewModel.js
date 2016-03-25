import ko from 'knockout';
import userContext from 'userContext';
import clientContext from 'clientContext';

let createSectionTooltipClosedKey = ':createSectionTooltipClosed';

export default class CreateSectionTooltip {
    constructor() {
        this.visible = ko.observable(true);
    }
    hide() {
        if (!this.visible()) {
            return;
        }

        this.visible(false);
        clientContext.set(userContext.identity.email + createSectionTooltipClosedKey, true);
    }
    activate() {
        let createSectionTooltipClosed = clientContext.get(userContext.identity.email + createSectionTooltipClosedKey);
        
        if (createSectionTooltipClosed) {
            this.visible(false);
        }
    }
};