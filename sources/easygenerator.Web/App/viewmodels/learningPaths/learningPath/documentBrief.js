import ko from 'knockout';
import app from 'durandal/app';
import constants from 'constants';
import eventTracker from 'eventTracker';
import previewDocumentDialog from 'dialogs/document/preview/index';

export default class {
    constructor(document) {
        this.id = document.id;
        this.type = document.documentType;
        this.title = ko.observable(document.title);
        this.embedCode = ko.observable(document.embedCode);
        this.modifiedOn = ko.observable(document.modifiedOn);
        this.previewEvent = null;
        switch (this.type) {
            case constants.documentType.powerPoint:
                {
                    this.previewEvent = 'Preview PowerPoint document';
                    break;
                }
            case constants.documentType.pdf:
                {
                    this.previewEvent = 'Preview PDF document';
                    break;
                }
            case constants.documentType.office:
                {
                    this.previewEvent = 'Preview Office document';
                    break;
                }
            default:
                return;
        }
        this.preview = () => {
            eventTracker.publish(this.previewEvent);
            previewDocumentDialog.show(this.title(), this.embedCode(), this.type);
        }
        this.remove = () => {
            app.trigger(constants.messages.learningPath.removeDocument, this.id);
        }
    }
}