import ko from 'knockout';

import notify from 'notify';
import constants from 'constants';
import eventTracker from 'eventTracker';

import updateQuestionTitleCommand from '../commands/updateQuestionTitleCommand';

const events = {
    updateQuestionTitle: 'Update question title',
    updateInformationTitle: 'Update information title'
};

export default class QuestionViewmodel{
    constructor (courseId, sectionId, question, isProcessed, justCreated) {
        this.courseId = courseId;
        this.sectionId = sectionId;
        this.id = ko.observable(question.id || '');
        this.title = ko.observable(question.title || '');
        this.originalTitle = this.title();
        this.title.isEditing = ko.observable(false);
        this.title.isSelected = ko.observable(false);
        this.title.maxLength = constants.validation.questionTitleMaxLength;
        this.title.isValid = ko.computed(() => this.title().trim().length <= this.title.maxLength, this);
        this.title.isEmpty = ko.computed(() => this.title().trim().length === 0, this);
        this.type = ko.observable(question.type || '');
        this.isContent = ko.computed(() => {
            return this.type() === constants.questionType.informationContent.type;
        }, this);
        this.canBeDeleted = ko.observable(false);
        this.isProcessed = ko.observable(isProcessed || false);
        this.justCreated = ko.observable(justCreated);
    }
    updateFields(question, isProcessed) {
        this.id(question.id);
        this.title(question.title);
        this.type(question.type);
        this.isProcessed(!!isProcessed);
        this.originalTitle = this.title();
        
        if (this.justCreated()) {
            this.title.isEditing(true);
            this.title('');
        }
    }
    markToDelete() {
        this.canBeDeleted(true);
    }
    cancel() {
        this.canBeDeleted(false);
    }
    startEditingTitle() {
        this.title.isEditing(true);
    }
    async stopEditingTitle() {
        this.title.isEditing(false);
        this.title(this.title().trim());

        if (this.title.isValid() && !this.title.isEmpty() && this.title() !== this.originalTitle) {
            await updateQuestionTitleCommand.execute(this.id(), this.title());
            this.originalTitle = this.title();
            notify.saved();
            if (this.isContent()) {
                eventTracker.publish(events.updateInformationTitle, constants.eventCategories.informationContent);
            } else {
                eventTracker.publish(events.updateQuestionTitle);
            }
        } else {
            this.title(this.originalTitle);
        }

        this.justCreated(false);
    }

}