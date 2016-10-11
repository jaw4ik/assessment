import ko from 'knockout';
import binder from 'binder';
import eventTracker from 'eventTracker';
import constants from 'constants';
import localizationManager from 'localization/localizationManager';

export const className = 'TextEditor';

export default class TextEditor {
    constructor(text, callbacks) {
        binder.bindClass(this);
        this.viewUrl = 'contentEditor/contentTypes/editors/textEditor/index.html';

        this.autosaveInterval = constants.autosaveTimersInterval.learningContent;
        this.eventTracker = eventTracker;
        this.localizationManager = localizationManager;

        this.data = ko.observable(text);
        this.hasFocus = ko.observable(false);
        this.callbacks = callbacks;
    }
    save(content) {
        this.data(content.data());
        this.callbacks.save();
    }

    get className() {
        return className;
    }
}