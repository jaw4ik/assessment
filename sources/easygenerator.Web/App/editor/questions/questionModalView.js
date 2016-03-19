import ko from 'knockout';
import _ from 'underscore';
import app from 'durandal/app';
import constants from 'constants';
import modalView from 'widgets/modalView/viewmodel';
import questionViewModel from './question';
import router from 'plugins/router';
import navigationPanel from 'editor/questions/panels/questionsNavigationView';
import eventTracker from 'eventTracker';

let _courseDeleted = new WeakMap();
let _sectionsDisconnected = new WeakMap();
let _questionsDeleted = new WeakMap();
let _routerNavigationProcessing = new WeakMap();

const events = {
    previewCourse: 'Preview course'
};

class QuestionModalView {
    constructor() {
        this.courseId = '';
        this.sectionId = '';
        this.questionId = '';
        this.questionViewModel = ko.observable();
        this.navigationPanel = navigationPanel;
        this.isNavigationPanelExpanded = ko.observable(true);
        this.isQuestionViewReady = ko.observable(false);

        _courseDeleted.set(this, courseId => {
            if (courseId === this.courseId) {
                modalView.close();
            }
        });

        _sectionsDisconnected.set(this, (courseId, sectionIds) => {
            if (this.courseId === courseId && _.some(sectionIds, id => id === this.sectionId)) {
                modalView.close();
            }
        });

        _questionsDeleted.set(this, (sectionId, questionIds) => {
            if (this.sectionId === sectionId && _.some(questionIds, id => id === this.questionId)) {
                modalView.close();
            }
        });

        _routerNavigationProcessing.set(this, () => {
            this.isQuestionViewReady(false);
        });

        app.on(constants.messages.course.collaboration.finished, _courseDeleted.get(this).bind(this));
        app.on(constants.messages.course.deletedByCollaborator, _courseDeleted.get(this).bind(this));
        app.on(constants.messages.course.sectionsUnrelatedByCollaborator, _sectionsDisconnected.get(this).bind(this));
        app.on(constants.messages.question.deletedByCollaborator, _questionsDeleted.get(this).bind(this));
        router.on('router:navigation:processing', _routerNavigationProcessing.get(this).bind(this));
    }
    async initialize(courseId) {
        this.courseId = courseId;
        await this.navigationPanel.initialize(courseId);
        modalView.initialize(this);
    }
    async open(sectionId, questionId) {
        if (!sectionId || !questionId) {
            modalView.close();
            return;
        }

        this.sectionId = sectionId;
        this.questionId = questionId;
        this.isQuestionViewReady(false);
        this.navigationPanel.activate(sectionId, questionId);
        await questionViewModel.activate(this.courseId, sectionId, questionId);
        this.questionViewModel(questionViewModel);
        modalView.open();
    }
    close() {
        router.navigate(`#courses/${this.courseId}`);
        modalView.close();
    }

    toggleExpandNavigationPanel() {
        this.isNavigationPanelExpanded(!this.isNavigationPanelExpanded());
    }

    onQuestionViewCompositionComplete() {
        this.isQuestionViewReady(true);
    }
    previewCourse() {
        eventTracker.publish(events.previewCourse);
        router.openUrl('/preview/' + this.courseId);
    }
}

export default new QuestionModalView();