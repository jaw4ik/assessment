import ko from 'knockout';
import _ from 'underscore';
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
import unrelateSectionCommand from './commands/unrelateSectionCommand';
import CreateBar from './viewmodels/CreateBarViewModel';
import SectionViewModel from './viewmodels/SectionViewModel';

const eventsForCourseContent = {
    addContent: 'Define introduction',
    beginEditText: 'Start editing introduction',
    endEditText: 'End editing introduction'
};

var mapSections = (courseId, sections) => _.map(sections, section => new SectionViewModel(courseId, section, false));

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
        this.eventTracker = eventTracker;
        this.localizationManager = localizationManager;
        this.courseIntroductionContent = null;
        this.notContainSections = ko.observable(false);
        this.createBar = new CreateBar();
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
        let emptySectionViewModel = new SectionViewModel(this.id, {}, true);
        this.sections.push(emptySectionViewModel);
        let type = section && section.type;
        if (type === 'section') {
            let createdSection = await await createSectionCommand.execute(this.id);
            emptySectionViewModel.updateFields(createdSection);
        }
    }
    async reorderSection(section, nextSection) {
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
        let emptySectionViewModel = new SectionViewModel(this.id, {}, true);
        if (nextSectionId) {
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
    async unrelateSection(section) {
        await unrelateSectionCommand.execute(this.id, section);
        let sectionInCourse = _.find(this.sections(), item => item.id() === section.id());
        if (sectionInCourse) {
            this.sections.remove(sectionInCourse);
        }
        notify.saved();
    }
    async createQuestion(question, nexQuestion, targetSection) {
        let questionType = question && question.type;
        let sectionId = targetSection && targetSection.sectionId;
        let sectionInViewModel = _.find(this.sections(), section => section.id() === sectionId);
        if (!sectionInViewModel) {
            return;
        }
        let createdQuestionViewModel = sectionInViewModel.addQuestion({});
        let createdQuestion = await createQuestionCommand.execute(sectionId, questionType);
        createdQuestionViewModel.updateFields(createdQuestion);
    }
    deleteQuestion(question) {
        deleteQuestionCommand.execute(question.sectionId, question.id());
        let section = _.find(this.sections(), section => section.id() === question.sectionId);
        if (section) {
            section.deleteQuestion(question);
        }
        notify.saved();
    }
    async reorderQuestion(question, nexQuestion, targetSection, sourceSection) {
        let questionId = question && question.id;
        let nextQuestionId = nexQuestion && nexQuestion.id;
        let targetSectionId = targetSection && targetSection.sectionId;
        let sourceSectionId = sourceSection && sourceSection.sectionId;

        let sectionInCourse = _.find(this.sections(), section => section.id() === sourceSectionId);
        if (!sectionInCourse) {
            return;
        }
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

        let createdQuestion = await createQuestionCommand.execute(sectionId, questionType);

        if (nextQuestionId) {
            //TODO: check next question
            let nextQuestionInSection = _.find(section.questions(), question => question.id() === nextQuestionId);
            let nextQuestionIndex = section.questions.indexOf(nextQuestionInSection);
            section.addQuestion(createdQuestion, nextQuestionIndex);
        } else {
            section.addQuestion(createdQuestion);
        }
        await reorderQuestionCommand.execute(section.id(), section.questions());
        notify.saved();
    }
};