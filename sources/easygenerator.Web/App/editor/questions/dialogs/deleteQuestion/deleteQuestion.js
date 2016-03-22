import ko from 'knockout';
import notify from 'notify';
import eventTracker from 'eventTracker';
import localizationManager from 'localization/localizationManager';
import constants from 'constants';
import dialog from 'widgets/dialog/viewmodel';
import deleteQuestionCommand from 'editor/course/commands/deleteQuestionCommand';
import router from 'plugins/router';

let events = {
    deleteQuestion: 'Delete question',
    deleteContent: 'Delete content'
};

class DeleteQuestion {
    constructor() {
        this.courseId = '';
        this.sectionId = '';
        this.questionId = '';
        this.title = ko.observable('');
        this.isContent = ko.observable(false);
        this.isDeleting = ko.observable(false);
    }
    show(courseId, sectionId, questionId, title, isContent) {
        this.courseId = courseId;
        this.sectionId = sectionId;
        this.questionId = questionId;
        this.title(title);
        this.isContent(isContent);

        dialog.show(this, constants.dialogs.deleteItem.settings);
    }
    deleteQuestion() {
        eventTracker.publish(this.isContent() ? events.deleteContent : events.deleteQuestion);
        this.isDeleting(true);

        return deleteQuestionCommand.execute(this.sectionId, this.questionId).then(() => {
            notify.saved();
            this.isDeleting(false);
            dialog.close();
            router.navigate(`#courses/${this.courseId}`);
        }).catch((reason) => {
            notify.error(reason);
            this.isDeleting(false);
        });
    }
    cancel() {
        dialog.close();
    }
}

export default new DeleteQuestion();