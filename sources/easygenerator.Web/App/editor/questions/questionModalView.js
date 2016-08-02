﻿import ko from 'knockout';
import _ from 'underscore';
import app from 'durandal/app';
import constants from 'constants';
import modalView from 'widgets/modalView/viewmodel';
import questionViewModel from './question';
import router from 'routing/router';
import navigationPanel from 'editor/questions/panels/questionsNavigationView';
import eventTracker from 'eventTracker';
import httpRequestTracker from 'http/httpRequestTracker';

let _courseDeleted = new WeakMap(),
    _sectionsDisconnected = new WeakMap(),
    _questionsDeleted = new WeakMap(),
    _navigateToQuestion = new WeakMap(),
    _navigateToCourse = new WeakMap()
;

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
        this.isLoading = ko.observable(false);

        _courseDeleted.set(this, courseId => {
            if (courseId === this.courseId) {
                this.close();
            }
        });

        _sectionsDisconnected.set(this, (courseId, sectionIds) => {
            if (this.courseId === courseId && _.some(sectionIds, id => id === this.sectionId)) {
                this.close();
            }
        });

        _questionsDeleted.set(this, (sectionId, questionIds) => {
            if (this.sectionId === sectionId && _.some(questionIds, id => id === this.questionId)) {
                this.close();
            }
        });

        _navigateToQuestion.set(this, (data) => {
            this.loadQuestion(data.sectionId, data.questionId);
        });

        _navigateToCourse.set(this, () => {
            this.close();
        });

        app.on(constants.messages.course.collaboration.finishedByCollaborator, _courseDeleted.get(this).bind(this));
        app.on(constants.messages.course.deletedByCollaborator, _courseDeleted.get(this).bind(this));
        app.on(constants.messages.course.sectionsUnrelatedByCollaborator, _sectionsDisconnected.get(this).bind(this));
        app.on(constants.messages.question.deletedByCollaborator, _questionsDeleted.get(this).bind(this));
        app.on(constants.messages.questionNavigation.navigateToQuestion, _navigateToQuestion.get(this).bind(this));
        app.on(constants.messages.questionNavigation.navigateToCourse, _navigateToCourse.get(this).bind(this));
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

        modalView.open();
        this.isLoading(true);

        await httpRequestTracker.waitForRequestFinalization();
        await this.loadQuestion(sectionId, questionId);

        this.isLoading(false);
    }

    async loadQuestion(sectionId, questionId){
        this.sectionId = sectionId;
        this.questionId = questionId;
        this.isQuestionViewReady(false);
        this.navigationPanel.activate(sectionId, questionId);
        await questionViewModel.activate(this.courseId, sectionId, questionId);
        this.questionViewModel(questionViewModel);
    }
    close() {
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