import ContentBase from './../ContentBase';

import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import constants from 'constants';
import _ from 'underscore';

export default class extends ContentBase {
    constructor() {
        super();

        this.data = ko.observable(null);
        this.hasFocus = ko.observable(false);
        this.isActive = false;
        this.hasFocus.subscribe((value) => {
            if (value) {
                this.isActive = true;
            }
        });

        this.localizationManager = localizationManager;
        this.eventTracker = eventTracker;
        this.autosaveInterval = constants.autosaveTimersInterval.learningContent;

        this.blur = this.blur.bind(this);
    }
    activate(data, justCreated) {
        this.data(data);

        if (_.isEmpty(data) && justCreated) {
            this.hasFocus(true);
        }
    }
    update(data) {
        this.data(data);
    }
    saveData(data) {
        this.save(data);

        if (_.isEmptyHtmlText(data)) {
            this.delete();
        }
    }
    blur() {
        if (this.isActive) {
            this.endEditing();
            this.isActive = false;
        }
    }
}