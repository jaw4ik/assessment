import ko from 'knockout';
import _ from 'underscore';
import app from 'durandal/app';
import constants from 'constants';
import eventTracker from 'eventTracker';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import courseRepository from 'repositories/courseRepository';
import questionRepository from 'repositories/questionRepository';
import sectionRepository from 'repositories/sectionRepository';
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
import clientContext from 'clientContext';
import questionModalView from 'editor/questions/questionModalView';

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

var mapSections = (courseId, sections) => _.map(sections, (section, index) => mapSection(courseId, section, index === 0));
var mapSection = (courseId, section, isExpanded) => new SectionViewModel(courseId, section, false, false, isExpanded);

var _introductionContentUpdated = new WeakMap();
var _sectionConnected = new WeakMap();
var _sectionsDisconnected = new WeakMap();
var _sectionsReordered = new WeakMap();
var _sectionDeleted = new WeakMap();
var _navigateToSection = new WeakMap();

var instance = null;

var sectionCreating = false;

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
        this.highlightedSectionId = ko.observable(null);
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
            this.sections(mapSections(course.id, course.sections));
        });

        _sectionDeleted.set(this, sectionId => {
            let sectionToRemove = _.find(this.sections(), section => section.id() === sectionId);
            if (!_.isNullOrUndefined(sectionToRemove)) {
                this.sections.remove(sectionToRemove);
            }
        });

        _navigateToSection.set(this, () => {
            this.hightlightSectionIfNeeded();
        });

        app.on(constants.messages.course.introductionContentUpdatedByCollaborator, _introductionContentUpdated.get(this).bind(this));
        app.on(constants.messages.course.sectionRelatedByCollaborator, _sectionConnected.get(this).bind(this));
        app.on(constants.messages.course.sectionsUnrelatedByCollaborator, _sectionsDisconnected.get(this).bind(this));
        app.on(constants.messages.course.sectionsUnrelated, _sectionsDisconnected.get(this).bind(this));
        app.on(constants.messages.course.sectionsReorderedByCollaborator, _sectionsReordered.get(this).bind(this));
        app.on(constants.messages.section.deleted, _sectionDeleted.get(this).bind(this));
        app.on(constants.messages.section.navigated, _navigateToSection.get(this).bind(this));

        return instance;
    }
    async activate(courseId, sectionId, questionId) {
        if (!this.canReuseForRoute(courseId)) {
            let course = await courseRepository.getById(courseId);
            this.id = course.id;
            this.createBar.activate();
            this.createdBy = course.createdBy;
            this.sections(mapSections(this.id, course.sections));
            this.notContainSections = ko.computed(() => this.sections().length === 0, this);
            this.courseIntroductionContent = new vmContentField(course.introductionContent, eventsForCourseContent, false, content => courseRepository.updateIntroductionContent(course.id, content));
            await questionModalView.initialize(courseId);
        }

        this.hightlightSectionIfNeeded();
        await questionModalView.open(sectionId, questionId);
    }
    async createSection(section) {
        eventTracker.publish(events.createSection, eventCategory);
        let emptySectionViewModel = new SectionViewModel(this.id, {}, true, true);
        this.sections.push(emptySectionViewModel);
        let type = section && section.type;
        if (type === 'section') {
            let createdSection = await createSectionCommand.execute(this.id);
            emptySectionViewModel.updateFields(createdSection);
            this.createBar.createSectionTooltip.hide();
            notify.saved();
        }
    }
    async createSectionAtFirstPosition() {
        if (sectionCreating) {
            return;
        }
        sectionCreating = true;
        eventTracker.publish(events.createSection, eventCategory);
        let emptySectionViewModel = new SectionViewModel(this.id, {}, true, true);
        this.sections.unshift(emptySectionViewModel);
        let createdSection = await createSectionCommand.execute(this.id);
        emptySectionViewModel.updateFields(createdSection);
        await reorderSectionCommand.execute(this.id, this.sections());
        sectionCreating = false;
        notify.saved();
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
        this.createBar.createSectionTooltip.hide();
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
        let createdQuestion = await createQuestionCommand.execute(sectionId, questionType, eventCategory);
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
    async reorderQuestion(question, nextQuestion, target, source) {
        let questionId = question && question.id;
        let nextQuestionId = nextQuestion && nextQuestion.id;
        let targetSectionId = target && target.sectionId;
        let sourceSectionId = source && source.sectionId;

        if (targetSectionId !== sourceSectionId) {
            await this.moveQuestion(questionId, targetSectionId, sourceSectionId, nextQuestionId);
        } else {
            await this.changeQuestionOrder(questionId, nextQuestionId, sourceSectionId);
        }
    }
    async changeQuestionOrder(questionId, nextQuestionId, sectionId) {
        let section = _.find(this.sections(), section => section.id() === sectionId);

        if (!section) {
            return;
        }

        let question = _.find(section.questions(), item => item.id() === questionId);
        section.deleteQuestion(question);
        section.addQuestion(question, nextQuestionId);
        eventTracker.publish(events.changeOrderOfQuestions, eventCategory);
        await reorderQuestionCommand.execute(section.id(), section.questions());
        notify.saved();
    }
    async moveQuestion(questionId, targetSectionId, sourceSectionId, nextQuestionId) {
        let sourceSection = _.find(this.sections(), section => section.id() === sourceSectionId);
        let targetSection = _.find(this.sections(), section => section.id() === targetSectionId);

        if (!sourceSection || !targetSection) {
            return;
        }

        let question = _.find(sourceSection.questions(), item => item.id() === questionId);
        sourceSection.deleteQuestion(question);
        targetSection.addQuestion(question, nextQuestionId);
        eventTracker.publish(events.moveQuestion, eventCategory);
        await moveQuestionCommand.execute(questionId, sourceSectionId, targetSectionId);

        if (nextQuestionId) {
            await reorderQuestionCommand.execute(targetSection.id(), targetSection.questions());
        }
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
            createdQuestionViewModel = section.addQuestion({}, nextQuestionId);
        } else {
            createdQuestionViewModel = section.addQuestion({});
        }

        let createdQuestion = await createQuestionCommand.execute(sectionId, questionType, eventCategory);
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

    hightlightSectionIfNeeded() {
        let sectionId = clientContext.get(constants.clientContextKeys.highlightedSectionId);
        if(sectionId) {
            clientContext.remove(constants.clientContextKeys.highlightedSectionId);
            this.highlightedSectionId(sectionId);
        }
    }
    canReuseForRoute(courseId) {
        return this.id === courseId;
    }
    canActivate(courseId, sectionId, questionId) {
        if (!courseId) {
            throw 'Invalid arguments';
        }

        let promises = [];
        promises.push(courseRepository.getById(courseId));
        
        if (sectionId) {
            promises.push(sectionRepository.getById(sectionId));

            if (questionId) {
                promises.push(questionRepository.getById(sectionId, questionId));
            }
        }

        return Promise.all(promises)
            .then(() => { return true; })
            .catch(() => { return { redirect: '404' }; });
    }
};