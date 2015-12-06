import ko from 'knockout';
import router from 'plugins/router';

export default class QuestionViewmodel{
    constructor (sectionId, question, isProcessed) {
        this.sectionId = sectionId;
        this.id = ko.observable(question.id || '');
        this.title = ko.observable(question.title || '');
        this.type = ko.observable(question.type || '');
        this.canBeDeleted = ko.observable(false);
        this.isProcessed = ko.observable(isProcessed || false);
    }
    updateFields(question) {
        this.id(question.id);
        this.title(question.title);
        this.type(question.type);
        this.isProcessed(false);
    }
    markToDelete() {
        this.canBeDeleted(true);
    }
    cancel() {
        this.canBeDeleted(false);
    }
    openQuestion() {
        //TODO: navigate to question view
    }
}