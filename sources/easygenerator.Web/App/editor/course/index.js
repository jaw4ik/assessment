import ko from 'knockout';
import _ from 'underscore';
import eventTracker from 'eventTracker';
import notify from 'notify';
import localizationManager from 'localization/localizationManager';
import courseRepository from 'repositories/courseRepository';
import vmContentField from 'viewmodels/common/contentField';
import moment from 'moment';
import constants from 'constants';
import router from 'plugins/router';
import userContext from 'userContext';
import imageUpload from 'imageUpload';
import createSectionCommand from 'editor/course/commands/createSectionCommand';
import createQuestionCommand from 'editor/course/commands/createQuestionCommand';
import deleteQuestionCommand from 'editor/course/commands/deleteQuestionCommand';
import reorderQuestionCommand from 'editor/course/commands/reorderQuestionCommand';
import moveQuestionCommand from 'editor/course/commands/moveQuestionCommand';
import reorderSectionCommand from 'editor/course/commands/reorderSectionCommand';
import unrelateSectionCommand from 'editor/course/commands/unrelateSectionCommand';
import sectionRepository from 'repositories/objectiveRepository';


class CreateBar{
    constructor() {
        this.sectionExpanded = ko.observable(true);
        this.questionsExpanded = ko.observable(true);
        this.questions = [
            {
                type: constants.questionType.informationContent.type,
                hasAccess: true
            },
            {
                type: constants.questionType.singleSelectText.type,
                hasAccess: true
            },
            {
                type: constants.questionType.multipleSelect.type,
                hasAccess: true
            },
            {
                type: constants.questionType.singleSelectImage.type,
                hasAccess: userContext.hasStarterAccess()
            },
            {
                type: constants.questionType.fillInTheBlank.type,
                hasAccess: userContext.hasStarterAccess()
            },
            {
                type: constants.questionType.textMatching.type,
                hasAccess: userContext.hasStarterAccess()
            },
            {
                type: constants.questionType.dragAndDropText.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.statement.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.hotspot.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.openQuestion.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.scenario.type,
                hasAccess: userContext.hasAcademyAccess()
            }
        ];
    }
    toggleSection() {
        this.sectionExpanded(!this.sectionExpanded());
    }
    toggleQuestions() {
        this.questionsExpanded(!this.questionsExpanded());
    }
    openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.questions);
        router.openUrl(constants.upgradeUrl);
    }
    activate() {
        this.sectionExpanded(true);
        this.questionsExpanded(true);
    }
}

const eventsForCourseContent = {
    addContent: 'Define introduction',
    beginEditText: 'Start editing introduction',
    endEditText: 'End editing introduction'
};

var mapQuestions = (sectionId, questions) => _.map(questions, question => questionViewModelmapper(sectionId, question));

var mapSections = sections => _.map(sections, section => sectionViewModelMapper(section));

var sectionViewModelMapper = section => {
    let mappedSection = {
        id: section.id,
        title: section.title,
        modifiedOn: ko.observable(moment(section.modifiedOn).format('DD/MM/YY')),
        image: ko.observable(section.image),
        isImageLoading: ko.observable(false),
        menuExpanded: ko.observable(false),
        toggleMenu: self => self.menuExpanded(!self.menuExpanded()),
        questionsExpanded: ko.observable(true),
        toggleQuestions: self => self.questionsExpanded(!self.questionsExpanded()),
        questions: ko.observableArray(mapQuestions(section.id, section.questions))
    };
    mappedSection.notContainQuestions = ko.computed(() => mappedSection.questions().length === 0);
    return mappedSection;
};

var questionViewModelmapper = (sectionId, question) => {
    return {
        sectionId: sectionId,
        id: question.id,
        title: question.title,
        type: question.type,
        canBeDeleted: ko.observable(false),
        markToDelete: self => self.canBeDeleted(true),
        cancel: self => self.canBeDeleted(false)
    };
};

var createSection = async courseId => await createSectionCommand.execute(courseId);

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
        this.sections(mapSections(course.objectives));
        this.notContainSections = ko.computed(() => this.sections().length === 0, this);
        this.courseIntroductionContent = new vmContentField(course.introductionContent, eventsForCourseContent, false, content => courseRepository.updateIntroductionContent(course.id, content));
    }
    async createSection(section) {
        let type = section && section.type;
        if (type === 'section') {
            let createdSection = await createSection(this.id);
            this.sections.push(sectionViewModelMapper(createdSection));
        }
    }
    async reorderSection(section, nextSection) {
        let sectionId = section && section.sectionId;
        let nextSectionId = nextSection && nextSection.sectionId;

        if (!sectionId) {
            return;
        }
        let sectionInCourse = _.find(this.sections(), section => section.id === sectionId);
        this.sections.remove(sectionInCourse);
        if (nextSectionId) {
            let nextSectionInCourse = _.find(this.sections(), section => section.id === nextSectionId);
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
        let nextSectionId = nextSection && nextSection.id;
        if (!type) {
            return;
        }
        let createdSection = await createSection(this.id);
        if (nextSectionId) {
            let nextSectionInCourse = _.find(this.sections(), section => section.id === nextSectionId);
            let nextSectionInCourseIndex = this.sections.indexOf(nextSectionInCourse);
            this.sections.splice(nextSectionInCourseIndex, 0, sectionViewModelMapper(createdSection));
        } else {
            this.sections.push(sectionViewModelMapper(createdSection));
        }
        await reorderSectionCommand.execute(this.id, this.sections());
        notify.saved();
    }
    updateSectionImage(section) {
        imageUpload.upload({
            startLoading: () => section.isImageLoading(true),
            success: async url => {
                let result = await sectionRepository.updateImage(section.id, url);
                section.image(result.imageUrl);
                section.modifiedOn(moment(result.modifiedOn).format('DD/MM/YY'));
                section.isImageLoading(false);
                notify.saved();
            },
            error: () => section.isImageLoading(false)
        });
    }
    async unrelateSection(section) {
        await unrelateSectionCommand.execute(this.id, section);
        let sectionInCourse = _.find(this.sections(), item => item.id === section.id);
        if (sectionInCourse) {
            this.sections.remove(sectionInCourse);
        }
        notify.saved();
    }
    showDeleteSectionDialog() {
        
    }
    async createQuestion(question, s, section) {
        let questionType = question && question.type;
        let sectionId = section && section.sectionId;
        let createdQuestion = await createQuestionCommand.execute(sectionId, questionType);
        let sectionInViewModel = _.find(this.sections(), section => section.id === sectionId);
        if (!sectionInViewModel) {
            return;
        }
        sectionInViewModel.questions.push(questionViewModelmapper(sectionInViewModel.id, createdQuestion));
    }
    deleteQuestion(question) {
        deleteQuestionCommand.execute(question.sectionId, question.id);
        let section = _.find(this.sections(), section => section.id === question.sectionId);
        if (section) {
            section.questions.remove(question);
        }
        notify.saved();
    }
    async reorderQuestion(question, nexQuestion, targetSection, sourceSection) {
        let questionId = question && question.id;
        let nextQuestionId = nexQuestion && nexQuestion.id;
        let targetSectionId = targetSection && targetSection.sectionId;
        let sourceSectionId = sourceSection && sourceSection.sectionId;

        let sectionInCourse = _.find(this.sections(), section => section.id === sourceSectionId);
        if (!sectionInCourse) {
            return;
        }
        let questionInSection = _.find(sectionInCourse.questions(), question => question.id === questionId);
        sectionInCourse.questions.remove(questionInSection);

        if (targetSectionId !== sourceSectionId) {
            sectionInCourse = _.find(this.sections(), section => section.id === targetSectionId);
            await moveQuestionCommand.execute(questionId, sourceSectionId, targetSectionId);
        }

        if (nextQuestionId) {
            //TODO: check next question
            let nextQuestionInSection = _.find(sectionInCourse.questions(), question => question.id === nextQuestionId);
            let nextQuestionIndex = sectionInCourse.questions.indexOf(nextQuestionInSection);
            sectionInCourse.questions.splice(nextQuestionIndex, 0, questionViewModelmapper(sectionInCourse.id, questionInSection));
        } else {
            sectionInCourse.questions.push(questionViewModelmapper(sectionInCourse.id, questionInSection));
        }
        await reorderQuestionCommand.execute(sectionInCourse.id, sectionInCourse.questions());
        notify.saved();
    }
    async createQuestionWithOrder(question, nextQuestion, targetSection) {
        let questionType = question && question.type;
        let nextQuestionId = nextQuestion && nextQuestion.id;
        let sectionId = targetSection && targetSection.sectionId;
        
        if (!questionType || !sectionId) {
            return;
        }

        let section = _.find(this.sections(), section => section.id === sectionId);

        if (!section) {
            return;
        }

        let createdQuestion = await createQuestionCommand.execute(sectionId, questionType);

        if (nextQuestionId) {
            //TODO: check next question
            let nextQuestionInSection = _.find(section.questions(), question => question.id === nextQuestionId);
            let nextQuestionIndex = section.questions.indexOf(nextQuestionInSection);
            section.questions.splice(nextQuestionIndex, 0, questionViewModelmapper(section.id, createdQuestion));
        } else {
            section.questions.push(questionViewModelmapper(section.id, createdQuestion));
        }
        await reorderQuestionCommand.execute(section.id, section.questions());
        notify.saved();
    }
};