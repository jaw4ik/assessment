import ko from 'knockout';
import _ from 'underscore';
import constants from 'constants';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';

class CreateDocumentDialog {
    constructor() {
        this.isShown = ko.observable(false);
        this.cancelEvent = null;
        this.callback = null;
        this.description = localizationManager.localize('documentPopupDescription');

        this.title = ko.observable('');
        this.titleMaxLength = constants.validation.documentTitleMaxLength;
        this.isTitleEditing = ko.observable();
        this.isTitleChanged = ko.observable();
        this.isTitleValid = ko.computed(() => {
            var length = this.title() ? this.title().trim().length : 0;
            return length > 0 && length <= this.titleMaxLength;
        });

        this.embedCode = ko.observable('');
        this.isEmbedCodeEditing = ko.observable();
        this.isEmbedCodeChanged = ko.observable();
        this.isEmbedCodeValid = ko.computed(() => {
            return (this.embedCode() ? this.embedCode().trim().length > 0 : false);
        });

        this.titleChanged = () => {
            this.isTitleChanged(true);
        }

        this.embedCodeChanged = () => {
            this.isEmbedCodeChanged(true);
        }

        this.submit = () => {
            if (!this.isTitleValid() || !this.isEmbedCodeValid()) {
                this.isTitleChanged(true);
                this.isEmbedCodeChanged(true);
                return;
            }

            this.title(this.title() && this.title().trim());
            this.embedCode(this.embedCode() && this.embedCode().trim());
            if (_.isFunction(this.callback)) {
                this.callback(this.title(), this.embedCode());
            }
            this.isShown(false);
        }

        this.title.subscribe(this.titleChanged);
        this.embedCode.subscribe(this.embedCodeChanged);
    }
    show(cancelEvent, callback) {
        this.isShown(true);
        this.cancelEvent = cancelEvent;
        this.callback = callback;
        this.title('');
        this.isTitleEditing(false);
        this.isTitleChanged(false);
        this.embedCode('');
        this.isEmbedCodeEditing(false);
        this.isEmbedCodeChanged(false);
    }
    hide() {
        eventTracker.publish(this.cancelEvent);
        this.isShown(false);
    }
    beginEditTitle() {
        this.isTitleEditing(true);
    }
    endEditTitle() {
        this.isTitleEditing(false);
    }
    beginEditEmbedCode() {
        this.isEmbedCodeEditing(true);
    }
    endEditEmbedCode() {
        this.isEmbedCodeEditing(false);
    }
}

export default new CreateDocumentDialog();
