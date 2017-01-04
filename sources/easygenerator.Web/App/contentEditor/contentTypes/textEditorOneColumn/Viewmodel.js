import ContentBase from './../ContentBase';
import localizationManager from 'localization/localizationManager';
import eventTracker from 'eventTracker';
import constants from 'constants';
import _ from 'underscore';
import ko from 'knockout';

export default class extends ContentBase {
    constructor(){
        super();
        this.data =  ko.observable(null);
        this.justCreated = null;

        this.hasFocus = ko.observable(false);
        this.isActive = false;
        this.hasFocus.subscribe((value) => {
            if (value) {
                this.isActive = true;
            }
        });
        this.saveData = this.saveData.bind(this);
    }

    activate(data, justCreated) {
        if(justCreated || !data.length) {
            data = [constants.templates.newEditorDefaultText];
        }
        this.data(data);
        this.justCreated = justCreated;
    }

    update(data) {
        this.data(data);
    }

    saveData(data) {
        if (_.isEmptyHtmlText(data)) {
            this.delete();
        } else{
            this.save(data);
        }
    }
}