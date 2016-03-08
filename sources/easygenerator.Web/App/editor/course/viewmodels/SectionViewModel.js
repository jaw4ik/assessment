﻿import ko from 'knockout';
import _ from 'underscore';
import app from 'durandal/app';
import moment from 'moment';
import eventTracker from 'eventTracker';
import imageUpload from 'imageUpload';
import notify from 'notify';
import constants from 'constants';
import QuestionViewModel from './QuestionViewModel';
import sectionRepository from 'repositories/objectiveRepository';
import updateSectionTitleCommand from '../commands/updateSectionTitleCommand';
import updateSectionLearningObjectiveCommand from '../commands/updateSectionLearningObjectiveCommand';

let mapQuestions = (courseId, sectionId, questions) => _.map(questions, question => mapQuestion(courseId, sectionId, question));

let mapQuestion = (courseId, sectionId, question) => new QuestionViewModel(courseId, sectionId, question, false);

let updateModifiedOn = modifiedOn => moment(modifiedOn).format('DD/MM/YY');

var _sectionTitleUpdated = new WeakMap();
var _sectionLearningObjectiveUpdated = new WeakMap();
var _sectionImageUrlUpdated = new WeakMap();
var _questionTitleUpdated = new WeakMap();
var _questionDeleted = new WeakMap();
var _questionCreated = new WeakMap();
var _questionsReordered = new WeakMap();
var _questionCreatedByCollaborator = new WeakMap();

const eventCategory = 'Course editor (drag and drop)';
const events = {
    updateTitle: 'Update objective title',
    defineLearningOjective: 'Define learning objective for a section',
    openChangeObjectiveImageDialog: 'Open "change objective image" dialog'
}

const questionsExpandDelay = 500;

export default class SectionViewModel{
    constructor (courseId, section, isProcessed, justCreated) {
        this.courseId = courseId;
        this.id = ko.observable(section.id || '');
        this.title = ko.observable(section.title || '');
        this.title.isEditing = ko.observable(false);
        this.title.isSelected = ko.observable(false);
        this.title.maxLength = constants.validation.objectiveTitleMaxLength;
        this.title.isValid = ko.computed(() => this.title().trim().length <= this.title.maxLength, this);
        this.title.isEmpty = ko.computed(() => this.title().trim().length === 0, this);
        this.learningObjective = ko.observable(section.learningObjective || '');
        this.learningObjective.isEditing = ko.observable(false);
        this.learningObjective.isSelected = ko.observable(false);
        this.learningObjective.maxLength = constants.validation.objectiveTitleMaxLength;
        this.learningObjective.isValid = ko.computed(() => this.learningObjective().trim().length <= this.learningObjective.maxLength, this);
        this.learningObjective.isEmpty = ko.computed(() => this.learningObjective().trim().length === 0, this);
        this.learningObjective.isVisible = ko.observable(false);
        this.originalLearningObjective = this.learningObjective();
        this.createdBy = section.createdBy;
        this.originalTitle = this.title();
        this.modifiedOn = ko.observable(section.modifiedOn ? updateModifiedOn(section.modifiedOn) : '');
        this.image = ko.observable(section.image || '');
        this.imageLoading = ko.observable(false);
        this.menuExpanded = ko.observable(false);
        this.questionsExpanded = ko.observable(!isProcessed);
        this.questions = ko.observableArray(mapQuestions(this.courseId, this.id(), section.questions));
        this.notContainQuestions = ko.computed(() => this.questions().length === 0, this);
        this.isProcessed = ko.observable(isProcessed);
        this.justCreated = ko.observable(justCreated);

        _sectionTitleUpdated.set(this, section => {
            if (section.id !== this.id() || this.title.isEditing()) {
                return;
            }
            this.title(section.title);
            this.modifiedOn(updateModifiedOn(section.modifiedOn));
        });

        _sectionLearningObjectiveUpdated.set(this, section => {
            if (section.id !== this.id() || this.learningObjective.isEditing()) {
                return;
            }
            this.learningObjective(section.learningObjective);
            this.modifiedOn(updateModifiedOn(section.modifiedOn));
        });

        _sectionImageUrlUpdated.set(this, section => {
            if (section.id !== this.id()) {
                return;
            }
            this.image(section.image);
            this.modifiedOn(updateModifiedOn(section.modifiedOn));
        });

        _questionTitleUpdated.set(this, question => {
            let questionViewModel = _.find(this.questions(), questionItem => questionItem.id() === question.id);
            if (_.isNullOrUndefined(questionViewModel)) {
                return;
            }
            questionViewModel.title(question.title);
            this.modifiedOn(updateModifiedOn(section.modifiedOn));
        });

        _questionDeleted.set(this, (sectionId, questionIds) => {
            if (this.id() !== sectionId) {
                return;
            }
            let questions = _.reject(this.questions(), question => _.indexOf(questionIds, question.id()) !== -1);
            this.questions(questions);
            this.modifiedOn(updateModifiedOn(section.modifiedOn));
        });

        _questionCreatedByCollaborator.set(this, (sectionId, question) => {
            if (this.id() !== sectionId) {
                return;
            }

            this.questions.push(mapQuestion(this.courseId, this.id(), question));
            this.modifiedOn(updateModifiedOn(section.modifiedOn));
        });

        _questionCreated.set(this, (sectionId, question) => {
            if (this.id() !== sectionId || _.some(this.questions(), item => item.id() === '')) {
                return;
            }

            this.questions.push(mapQuestion(this.courseId, this.id(), question));
            this.modifiedOn(updateModifiedOn(section.modifiedOn));
        });

        _questionsReordered.set(this, section => {
            if (section.id !== this.id()) {
                return;
            }

            this.questions(mapQuestions(this.courseId, this.id(), section.questions));

            this.modifiedOn(updateModifiedOn(section.modifiedOn));
        });

        app.on(constants.messages.objective.titleUpdatedByCollaborator, _sectionTitleUpdated.get(this).bind(this));
        app.on(constants.messages.objective.learningObjectiveUpdatedByCollaborator, _sectionLearningObjectiveUpdated.get(this).bind(this));
        app.on(constants.messages.objective.imageUrlUpdatedByCollaborator, _sectionImageUrlUpdated.get(this).bind(this));
        app.on(constants.messages.question.titleUpdatedByCollaborator, _questionTitleUpdated.get(this).bind(this));
        app.on(constants.messages.question.deletedByCollaborator, _questionDeleted.get(this).bind(this));
        app.on(constants.messages.question.createdByCollaborator, _questionCreatedByCollaborator.get(this).bind(this));
        app.on(constants.messages.objective.questionsReorderedByCollaborator, _questionsReordered.get(this).bind(this));
        app.on(constants.messages.question.titleUpdated, _questionTitleUpdated.get(this).bind(this));
        app.on(constants.messages.question.deleted, _questionDeleted.get(this).bind(this));
        app.on(constants.messages.question.created, _questionCreated.get(this).bind(this));
    }
    selectTitle() {
        this.title.isSelected(true);
    }
    startEditingTitle() {
        this.title.isEditing(true);
    }
    async stopEditingTitle() {
        eventTracker.publish(events.updateTitle, eventCategory);
        this.title.isEditing(false);
        this.title.isSelected(false);
        this.title(this.title().trim());
        if (this.title.isValid() && !this.title.isEmpty() && this.title() !== this.originalTitle) {
            await updateSectionTitleCommand.execute(this.id(), this.title());
            this.originalTitle = this.title();
            notify.saved();
        } else {
            this.title(this.originalTitle);
        }
        this.justCreated(false);
    }
    startEditingLearningObjective() {
        this.learningObjective.isEditing(true);
    }
    async stopEditingLearningObjective() {
        eventTracker.publish(events.defineLearningOjective, eventCategory);
        this.learningObjective.isEditing(false);
        this.learningObjective.isSelected(false);
        this.learningObjective(this.learningObjective().trim());
        if (this.learningObjective.isValid() && this.learningObjective() !== this.originalLearningObjective) {
            await updateSectionLearningObjectiveCommand.execute(this.id(), this.learningObjective());
            this.originalLearningObjective = this.learningObjective();
            notify.saved();
        } else {
            this.learningObjective(this.originalLearningObjective);
        }
    }
    toggleLearningObjectiveVisibility() {
        if (this.learningObjective.isEmpty() && !this.learningObjective.isVisible()) {
            this.learningObjective.isSelected(true);
        }
        this.learningObjective.isVisible(!this.learningObjective.isVisible());
    }
    updateFields(section) {
        this.id(section.id);
        this.title(section.title);
        this.originalTitle = this.title();
        this.learningObjective(section.learningObjective || '');
        this.originalLearningObjective = this.learningObjective();
        this.modifiedOn(updateModifiedOn(section.modifiedOn));
        this.image(section.image);
        this.questions(mapQuestions(this.id(), section.questions));
        this.questionsExpanded(true);
        this.isProcessed(false);

        if (this.justCreated()) {
            this.title.isEditing(true);
            this.title('');
        }
    }
    toggleMenu() {
        this.menuExpanded(!this.menuExpanded());
    }
    toggleQuestions() {
        this.questionsExpanded(!this.questionsExpanded());
    }
    updateImage() {
        let that = this;
        eventTracker.publish(events.openChangeObjectiveImageDialog, eventCategory);
        imageUpload.upload({
            startLoading: () => that.imageLoading(true),
            success: async url => {
                let result = await sectionRepository.updateImage(that.id(), url);
                that.image(result.imageUrl);
                that.modifiedOn(updateModifiedOn(result.modifiedOn));
                that.imageLoading(false);
                notify.saved();
            },
            error: () => that.imageLoading(false)
        });
    }
    deleteQuestion(question) {
        if (_.contains(this.questions(), question)) {
            this.questions.remove(question);
        }
    }
    addQuestion(question, index) {
        if (!_.isObject(question)) {
            return undefined;
        }

        let questionViewModel = null;

        if (_.isEmpty(question)) {
            questionViewModel = new QuestionViewModel(this.courseId, this.id(), question, true, true);
        } else if (question instanceof QuestionViewModel) {
            question.sectionId = this.id();
            questionViewModel = question;
        } else {
            questionViewModel = new QuestionViewModel(this.courseId, this.id(), question, true);
        }

        if (_.isNumber(index)) {
            this.questions.splice(index, 0, questionViewModel);
        } else {
            this.questions.push(questionViewModel);
        }

        return questionViewModel;
    }
    expandQuestionsStartTimer(question, section) {
        if (section && section.sectionId === this.id() && section.expandQuestions) {
            this.timeoutId = setTimeout(() => this.questionsExpanded(true), questionsExpandDelay);
        }
    }
    expandQuestionsClearTimer(question, section) {
        if (section && section.sectionId === this.id() && section.expandQuestions && this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}