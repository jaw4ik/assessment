import ko from 'knockout';
import _ from 'underscore';
import app from 'durandal/app';
import constants from 'constants';
import eventTracker from 'eventTracker';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import courseRepository from 'repositories/courseRepository';
import vmContentField from 'viewmodels/common/contentField';
import createSectionCommand from './commands/createSectionCommand';
import createQuestionCommand from './commands/createQuestionCommand';
import deleteQuestionCommand from './commands/deleteQuestionCommand';
import reorderQuestionCommand from './commands/reorderQuestionCommand';
import moveQuestionCommand from './commands/moveQuestionCommand';
import reorderSectionCommand from './commands/reorderSectionCommand';
import CreateBar from './viewmodels/CreateBarViewModel';
import SectionViewModel from './viewmodels/SectionViewModel';
import deleteSectionDialog from 'editor/course/dialogs/deleteSection/deleteSection';

const eventsForCourseContent = {
    addContent: 'Define introduction',
    beginEditText: 'Start editing introduction',
    endEditText: 'End editing introduction'
};

const events = {
    createSection: 'Create learning objective and open it properties',
    changeOrderOfSections: 'Change order of learning objectives',
    changeOrderOfQuestions: 'Change order of questions',
    moveQuestion: 'Move item'
};

const eventCategory = 'Course editor (drag and drop)';

var mapSections = (courseId, sections) => _.map(sections, section => mapSection(courseId, section));
var mapSection = (courseId, section) => new SectionViewModel(courseId, section, false);

var _introductionContentUpdated = new WeakMap();
var _sectionConnected = new WeakMap();
var _sectionsDisconnected = new WeakMap();
var _sectionsReordered = new WeakMap();
var _sectionDeleted = new WeakMap();

var instance = null;

export default class {
    constructor () {
        if (instance) {
            return instance;
        }
        instance = this;

        this.id = '';
        this.createdBy = '';
        this.sections = ko.observableArray([]);
        this.lastDraggingSectionState = null;
        this.eventTracker = eventTracker;
        this.localizationManager = localizationManager;
        this.courseIntroductionContent = null;
        this.notContainSections = ko.observable(false);
        this.createBar = new CreateBar();

        _introductionContentUpdated.set(this, course => {
            if (this.id !== course.id) {
                return;
            }
            this.courseIntroductionContent.originalText(course.introductionContent);
            if (!this.courseIntroductionContent.isEditing()) {
                this.courseIntroductionContent.text(course.introductionContent);
                this.courseIntroductionContent.isEditing.valueHasMutated();
            }
        });

        _sectionConnected.set(this, (courseId, section, targetIndex) => {
            if (this.id !== courseId) {
                return;
            }

            let isConnected = _.some(this.sections(), item => item.id() === section.id);


            if (isConnected) {
                this.sections(_.reject(this.sections(), item => item.id() === section.id));
            }

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

            this.sections(_.reject(this.sections(), section => _.some(sectionIds, id => id === section.id())));
        });

        _sectionsReordered.set(this, course => {
            if (course.id !== this.id) {
                return;
            }
            this.sections(mapSections(course.id, course.objectives));
        });

        _sectionDeleted.set(this, sectionId => {
            let sectionToRemove = _.find(this.sections(), section => section.id() === sectionId);
            if (!_.isNullOrUndefined(sectionToRemove)) {
                this.sections.remove(sectionToRemove);
            }
        });

        app.on(constants.messages.course.introductionContentUpdatedByCollaborator, _introductionContentUpdated.get(this).bind(this));
        app.on(constants.messages.course.objectiveRelatedByCollaborator, _sectionConnected.get(this).bind(this));
        app.on(constants.messages.course.objectivesUnrelatedByCollaborator, _sectionsDisconnected.get(this).bind(this));
        app.on(constants.messages.course.objectivesUnrelated, _sectionsDisconnected.get(this).bind(this));
        app.on(constants.messages.course.objectivesReorderedByCollaborator, _sectionsReordered.get(this).bind(this));
        app.on(constants.messages.objective.deleted, _sectionDeleted.get(this).bind(this));

        return instance;
    }
    async activate(courseId) {
        let course = await courseRepository.getById(courseId);
        this.id = course.id;
        this.createBar.activate();
        this.createdBy = course.createdBy;
        this.sections(mapSections(this.id, course.objectives));
        this.notContainSections = ko.computed(() => this.sections().length === 0, this);
        this.courseIntroductionContent = new vmContentField(course.introductionContent, eventsForCourseContent, false, content => courseRepository.updateIntroductionContent(course.id, content));
    }
    async createSection(section) {
        eventTracker.publish(events.createSection, eventCategory);
        let emptySectionViewModel = new SectionViewModel(this.id, {}, true, true);
        this.sections.push(emptySectionViewModel);
        let type = section && section.type;
        if (type === 'section') {
            let createdSection = await createSectionCommand.execute(this.id);
            emptySectionViewModel.updateFields(createdSection);
        }
    }
    async reorderSection(section, nextSection) {
        eventTracker.publish(events.changeOrderOfSections, eventCategory);
        let sectionId = section && section.sectionId;
        let nextSectionId = nextSection && nextSection.sectionId;

        if (!sectionId) {
            return;
        }
        let sectionInCourse = _.find(this.sections(), section => section.id() === sectionId);
        this.sections.remove(sectionInCourse);
        if (nextSectionId) {
            let nextSectionInCourse = _.find(this.sections(), section => section.id() === nextSectionId);
            let nextSectionInCourseIndex = this.sections.indexOf(nextSectionInCourse);
            this.sections.splice(nextSectionInCourseIndex, 0, sectionInCourse);
        } else {
            this.sections.push(sectionInCourse);
        }
        await reorderSectionCommand.execute(this.id, this.sections());
        notify.saved();
    }
    async createSectionWithOrder(section, nextSection) {
        let type = section && section.type;
        let nextSectionId = nextSection && nextSection.sectionId;
        if (!type) {
            return;
        }
        eventTracker.publish(events.createSection, eventCategory);
        let emptySectionViewModel = new SectionViewModel(this.id, {}, true, true);
        if (nextSectionId) {
            eventTracker.publish(events.changeOrderOfSections, eventCategory);
            let nextSectionInCourse = _.find(this.sections(), section => section.id() === nextSectionId);
            let nextSectionInCourseIndex = this.sections.indexOf(nextSectionInCourse);
            this.sections.splice(nextSectionInCourseIndex, 0, emptySectionViewModel);
        } else {
            this.sections.push(emptySectionViewModel);
        }
        let createdSection = await createSectionCommand.execute(this.id);
        emptySectionViewModel.updateFields(createdSection);
        await reorderSectionCommand.execute(this.id, this.sections());
        notify.saved();
    }
    async deleteSection(section) {
        deleteSectionDialog.show(this.id, section.id(), section.title(), section.createdBy);
    }
    async createQuestion(question, nexQuestion, targetSection) {
        let questionType = question && question.type;
        let sectionId = targetSection && targetSection.sectionId;
        let sectionViewModel = _.find(this.sections(), section => section.id() === sectionId);
        if (!sectionViewModel) {
            return;
        }
        let createdQuestionViewModel = sectionViewModel.addQuestion({});
        let createdQuestion = await createQuestionCommand.execute(sectionId, questionType);
        createdQuestionViewModel.updateFields(createdQuestion);
    }
    async deleteQuestion(question) {
        await deleteQuestionCommand.execute(question.sectionId, question.id());
        let section = _.find(this.sections(), section => section.id() === question.sectionId);
        if (section) {
            section.deleteQuestion(question);
        }
        notify.saved();
    }
    async reorderQuestion(question, nextQuestion, targetSection, sourceSection) {
        let questionId = question && question.id;
        let nextQuestionId = nextQuestion && nextQuestion.id;
        let targetSectionId = targetSection && targetSection.sectionId;
        let sourceSectionId = sourceSection && sourceSection.sectionId;

        let sectionInCourse = _.find(this.sections(), section => section.id() === sourceSectionId);
        if (!sectionInCourse) {
            return;
        }
        eventTracker.publish(events.changeOrderOfQuestions, eventCategory);
        let questionInSection = _.find(sectionInCourse.questions(), question => question.id() === questionId);
        sectionInCourse.deleteQuestion(questionInSection);

        if (targetSectionId !== sourceSectionId) {
            sectionInCourse = _.find(this.sections(), section => section.id() === targetSectionId);
            await moveQuestionCommand.execute(questionId, sourceSectionId, targetSectionId);
        }

        if (nextQuestionId) {
            let nextQuestionInSection = _.find(sectionInCourse.questions(), question => question.id() === nextQuestionId);
            let nextQuestionIndex = sectionInCourse.questions.indexOf(nextQuestionInSection);
            sectionInCourse.addQuestion(questionInSection, nextQuestionIndex);
        } else {
            sectionInCourse.addQuestion(questionInSection);
        }
        await reorderQuestionCommand.execute(sectionInCourse.id(), sectionInCourse.questions());
        notify.saved();
    }
    async createQuestionWithOrder(question, nextQuestion, targetSection) {
        let questionType = question && question.type;
        let nextQuestionId = nextQuestion && nextQuestion.id;
        let sectionId = targetSection && targetSection.sectionId;

        if (!questionType || !sectionId) {
            return;
        }

        let section = _.find(this.sections(), section => section.id() === sectionId);

        if (!section) {
            return;
        }
        
        let createdQuestionViewModel = null;

        if (nextQuestionId) {
            eventTracker.publish(events.changeOrderOfQuestions, eventCategory);
            let nextQuestionInSection = _.find(section.questions(), question => question.id() === nextQuestionId);
            let nextQuestionIndex = section.questions.indexOf(nextQuestionInSection);
            createdQuestionViewModel = section.addQuestion({}, nextQuestionIndex);
        } else {
            createdQuestionViewModel = section.addQuestion({});
        }

        let createdQuestion = await createQuestionCommand.execute(sectionId, questionType);
        createdQuestionViewModel.updateFields(createdQuestion, true);
        await reorderQuestionCommand.execute(section.id(), section.questions());
        createdQuestionViewModel.isProcessed(false);
        notify.saved();
    }
    hideQuestions(section) {
        let sectionId = section && section.sectionId;
        if (_.isNullOrUndefined(sectionId)) {
            return;
        }
        let sectionInCourse = _.find(this.sections(), section => section.id() === sectionId);
        if (_.isNullOrUndefined(sectionInCourse)) {
            return;
        }
        this.lastDraggingSectionState = sectionInCourse.questionsExpanded();
        sectionInCourse.questionsExpanded(false);
    }
    restoreQuestionsExpandingState(section) {
        let sectionId = section && section.sectionId;
        if (_.isNullOrUndefined(sectionId)) {
            return;
        }
        let sectionInCourse = _.find(this.sections(), section => section.id() === sectionId);
        if (_.isNullOrUndefined(sectionInCourse)) {
            return;
        }
        sectionInCourse.questionsExpanded(this.lastDraggingSectionState);
    }
};