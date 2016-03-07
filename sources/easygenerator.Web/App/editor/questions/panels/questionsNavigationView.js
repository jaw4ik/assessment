import ko from 'knockout';
import _ from 'underscore';
import app from 'durandal/app';
import constants from 'constants';
import courseRepository from 'repositories/courseRepository';
import router from 'plugins/router';
import eventTracker from 'eventTracker';

let _sectionTitleUpdated = new WeakMap();
let _questionTitleUpdated = new WeakMap();
let _sectionConnected = new WeakMap();
let _sectionsDisconnected = new WeakMap();
let _sectionsReordered = new WeakMap();
let _questionsDeleted = new WeakMap();
let _questionCreated = new WeakMap();
let _questionsReordered = new WeakMap();

class TreeNode{
    constructor(id, title) {
        this.id = id;
        this.title = ko.observable(title);
    }
}

class SectionTreeNode extends TreeNode{
    constructor(id, title, questions) {
        super(id, title);
        this.isExpanded = ko.observable(false);
        this.questions = ko.observableArray(questions);
        this.hasChildren = ko.computed(() => this.questions().length);
        
        _questionTitleUpdated.set(this, section => {
            if (section.id !== this.id) {
                return;
            }
            this.title(section.title);
        });

        _questionsDeleted.set(this, (sectionId, questionIds) => {
            if (this.id !== sectionId) {
                return;
            }

            this.questions(_.reject(this.questions(), question => _.some(questionIds, id => id === question.id)));
        });

        app.on(constants.messages.objective.titleUpdatedByCollaborator, _questionTitleUpdated.get(this).bind(this));
        app.on(constants.messages.objective.titleUpdated, _questionTitleUpdated.get(this).bind(this));
        app.on(constants.messages.question.deleted, _questionsDeleted.get(this).bind(this));
        app.on(constants.messages.question.deletedByCollaborator, _questionsDeleted.get(this).bind(this));
    }
    toggleExpand() {
        this.isExpanded(!this.isExpanded());
    }

    activate(questionId) {
        let activeQuestion = _.find(this.questions(), question => question.id === questionId);
        if (activeQuestion) {
            activeQuestion.isActive(true);
        }
    }
    deactivate() {
        _.each(this.questions(), question => question.isActive(false));
    }
}

class QuestionTreeNode extends TreeNode{
    constructor(id, title, url) {
        super(id, title);
        this.isActive = ko.observable(false);
        this.url = url;

        _sectionTitleUpdated.set(this, question => {
            if (question.id !== this.id) {
                return;
            }
            this.title(question.title);
        });

        app.on(constants.messages.question.titleUpdatedByCollaborator, _sectionTitleUpdated.get(this).bind(this));
        app.on(constants.messages.question.titleUpdated, _sectionTitleUpdated.get(this).bind(this));
    }
    navigateToUrl() {
        eventTracker.publish('[Question event name]', '[control name]');
        router.navigate(this.url);
    }
}

var mapSection = (courseId, section) => new SectionTreeNode(section.id, section.title, _.map(section.questions, question => mapQuestion(courseId, section.id, question)));
var mapQuestion = (courseId, sectionId, question) => new QuestionTreeNode(question.id, question.title, getQuestionLink(courseId, sectionId, question.id));
var getQuestionLink = (courseId, sectionId, questionId) => `#courses/${courseId}/objectives/${sectionId}/questions/${questionId}`;

class ContentTreeView {
    constructor() {
        this.id = '';
        this.activeSectionId = '';
        this.activeQuestionId = '';
        this.sections = ko.observableArray([]);
        this.isExpanded = ko.observable(true);

        _sectionConnected.set(this, (courseId, section, targetIndex) => {
            if (this.id !== courseId) {
                return;
            }

            this.sections(_.reject(this.sections(), item => item.id === section.id));

            if (_.isNullOrUndefined(targetIndex)) {
                this.sections.push(mapSection(this.id, section));
            } else {
                this.sections.splice(targetIndex, 0, mapSection(this.id, section));
            }
        });

        _sectionsDisconnected.set(this, (courseId, sectionIds) => {
            if (this.id !== courseId) {
                return;
            }

            this.sections(_.reject(this.sections(), section => _.some(sectionIds, id => id === section.id)));
        });

        _sectionsReordered.set(this, course => {
            if (course.id !== this.id) {
                return;
            }
            this.sections(_.map(course.objectives, section => mapSection(this.id, section)));
            this.activateQuestion(this.activeSectionId, this.activateQuestionId);
        });

        _questionCreated.set(this, (sectionId, question) => {
            let changedSection = _.find(this.sections(), item => item.id === sectionId);
            if (!changedSection) {
                return;
            }

            changedSection.questions.push(mapQuestion(this.id, sectionId, question));
        });

        _questionsReordered.set(this, section => {
            let changedSection = _.find(this.sections(), item => item.id === section.id);
            if (!changedSection) {
                return;
            }

            changedSection.questions(_.map(section.questions, question => mapQuestion(this.id, section.id, question)));
            if (this.activeSectionId === changedSection.id) {
                changedSection.activate(this.activateQuestionId);
            }
        });

        app.on(constants.messages.course.objectiveRelated, _sectionConnected.get(this).bind(this));
        app.on(constants.messages.course.objectiveRelatedByCollaborator, _sectionConnected.get(this).bind(this));
        app.on(constants.messages.course.objectivesUnrelated, _sectionsDisconnected.get(this).bind(this));
        app.on(constants.messages.course.objectivesUnrelatedByCollaborator, _sectionsDisconnected.get(this).bind(this));
        app.on(constants.messages.course.objectivesReordered, _sectionsReordered.get(this).bind(this));
        app.on(constants.messages.course.objectivesReorderedByCollaborator, _sectionsReordered.get(this).bind(this));

        app.on(constants.messages.question.created, _questionCreated.get(this).bind(this));
        app.on(constants.messages.question.createdByCollaborator, _questionCreated.get(this).bind(this));
        app.on(constants.messages.objective.questionsReordered, _questionsReordered.get(this).bind(this));
        app.on(constants.messages.objective.questionsReorderedByCollaborator, _questionsReordered.get(this).bind(this));
    }
    async initialize(courseId) {
        this.id = courseId;
        let course = await courseRepository.getById(this.id);
        this.sections(_.map(course.objectives, section => mapSection(this.id, section)));
    }
    activate(sectionId, questionId) {
        this.activeSectionId = sectionId;
        this.activateQuestionId = questionId;
        this.activateQuestion(this.activeSectionId, this.activateQuestionId);
    }
    activateQuestion(sectionId, questionId) {
        let activeSection = _.find(this.sections(), section => section.id === sectionId);
        if (activeSection) {
            _.each(this.sections(), section => section.deactivate());
            activeSection.isExpanded(true);
            activeSection.activate(questionId);
        }
    }
}

export default new ContentTreeView();