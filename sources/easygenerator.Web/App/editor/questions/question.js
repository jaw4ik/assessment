import app from 'durandal/app';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import constants from 'constants';
import questionRepository from 'repositories/questionRepository';
import sectionRepository from 'repositories/sectionRepository';
import courseRepository from 'repositories/courseRepository';
import createQuestionCommand from 'commands/createQuestionCommand';
import createNextQuestionCommand from 'editor/questions/commands/createNextQuestion';
import duplicateQuestionCommand from 'editor/questions/commands/duplicateQuestion';
import router from 'plugins/router';
import vmQuestionTitle from 'viewmodels/questions/questionTitle';
import vmContentField from 'viewmodels/common/contentField';
import questionViewModelFactory from 'viewmodels/questions/questionViewModelFactory';
import learningContentsViewModel from 'viewmodels/learningContents/learningContents';
import feedbackViewModel from 'viewmodels/questions/feedback';
import localizationManager from 'localization/localizationManager';
import moveCopyQuestionDialog from 'dialogs/moveCopyQuestion/moveCopyQuestion';
import deleteQuestionDialog from 'editor/questions/dialogs/deleteQuestion/deleteQuestion';
import VoiceOver from 'viewmodels/questions/voiceOver';

const events = {
    navigateToSection: 'Navigate to objective details',
    duplicateItem: 'Duplicate item'
};

const eventsForQuestionContent = {
    addContent: 'Add extra question content',
    beginEditText: 'Start editing question content',
    endEditText: 'End editing question content'
};

class QuestionViewModel  {
    constructor() {
        this.courseId =  null;
        this.sectionId =  null;
        this.questionId = null;
        this.questionType = '';
        this.isContent = false;

        this.viewCaption= null;
        this.questionTitle= null;
        this.voiceOver = null;
        this.questionContent = null;

        this.eventTracker = eventTracker;
        this.localizationManager = localizationManager;

        this.activeQuestionViewModel= null;
        this.learningContentsViewModel= learningContentsViewModel;
        this.feedbackViewModel= feedbackViewModel;

        this.viewUrl = 'editor/questions/question';

        this.isInformationContent= false;
        this.questions = [
            {
                type: constants.questionType.informationContent.type,
                hasAccess: true
            },
            {
                type: constants.questionType.dragAndDropText.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.singleSelectText.type,
                hasAccess: true
            },
            {
                type: constants.questionType.statement.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.multipleSelect.type,
                hasAccess: true
            },
            {
                type: constants.questionType.hotspot.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.singleSelectImage.type,
                hasAccess: userContext.hasStarterAccess()
            },
            {
                type: constants.questionType.openQuestion.type,
                hasAccess: userContext.hasPlusAccess()
            },
            {
                type: constants.questionType.fillInTheBlank.type,
                hasAccess: userContext.hasStarterAccess()
            },
            {
                type: constants.questionType.scenario.type,
                hasAccess: userContext.hasAcademyAccess()
            },
            {
                type: constants.questionType.textMatching.type,
                hasAccess: userContext.hasStarterAccess()
            },
            {
                type: constants.questionType.rankingText.type,
                hasAccess: userContext.hasAcademyAccess()
            }
        ];

        this.createQuestion = this.createQuestion.bind(this);

        app.on(constants.messages.question.titleUpdatedByCollaborator, this.titleUpdatedByCollaborator.bind(this));
        app.on(constants.messages.question.contentUpdatedByCollaborator, this.contentUpdatedByCollaborator.bind(this));
    }

    duplicateQuestion() {
        this.eventTracker.publish(events.duplicateItem);
        let that = this;
        duplicateQuestionCommand.execute(this.questionId, this.sectionId).then(function (response) {
            router.navigate(`courses/${that.courseId}/sections/${that.sectionId}/questions/${response.id}`);
        });
    }

    showMoveCopyDialog() {
        moveCopyQuestionDialog.show(this.courseId, this.sectionId, this.questionId, this.isContent);
    }
    showDeleteDialog() {
        deleteQuestionDialog.show(this.courseId, this.sectionId, this.questionId, this.questionTitle.text(), this.isContent);
    }
    navigateToSectionEvent() {
        eventTracker.publish(events.navigateToSection);
    }

    activate(courseId, sectionId, questionId) {
        if (!courseId || !sectionId || !questionId) {
            throw 'Invalid arguments';
        }

        this.courseId = courseId;
        this.sectionId = sectionId;
        this.questionId = questionId;

        return questionRepository.getById(this.sectionId, this.questionId).then(question => {

            this.activeQuestionViewModel = this.setActiveViewModel(question);
            this.questionType = question.type;
            this.isContent = question.type === constants.questionType.informationContent.type;
            this.voiceOver = new VoiceOver(this.questionId, question.voiceOver);

            return this.activeQuestionViewModel.initialize(this.sectionId, question).then(viewModelData => {

                this.viewCaption = viewModelData.viewCaption;
                this.questionTitle = vmQuestionTitle(this.sectionId, question);
                this.hasQuestionView = viewModelData.hasQuestionView;
                this.questionContent = viewModelData.hasQuestionContent ? vmContentField(question.content, eventsForQuestionContent, true, this.updateQuestionContent.bind(this)) : null;
                this.hasFeedback = viewModelData.hasFeedback;
                this.feedbackCaptions = viewModelData.feedbackCaptions;

                var promises = [];
                promises.push(this.learningContentsViewModel.initialize(question));
                promises.push(this.feedbackViewModel.initialize({ questionId: question.id, captions: this.feedbackCaptions }));

                return Promise.all(promises);
            });
        });
    }

    setActiveViewModel(question) {
        var activeViewModel = questionViewModelFactory[question.type];
        if (!activeViewModel) {
            throw `Question with type ${question.type} is not found in questionViewModelFactory`;
        }
        return activeViewModel;
    }

    updateQuestionContent(content) {
        return questionRepository.updateContent(this.questionId, content);
    }

    titleUpdatedByCollaborator(questionData) {
        if (questionData.id !== this.questionId || this.questionTitle.text.isEditing()) {
            return;
        }

        this.questionTitle.text(questionData.title);
    }

    contentUpdatedByCollaborator(question) {
        if (question.id != this.questionId)
            return;

        this.questionContent.originalText(question.content);
        if (!this.questionContent.isEditing())
            this.questionContent.text(question.content);
    }

    createQuestion(item) {
        let that = this;
        createNextQuestionCommand.execute(this.sectionId, item.type, '', this.questionId)
            .then(response => {
                router.navigate(`courses/${that.courseId}/sections/${that.sectionId}/questions/${response.id}`);
            });
    }

    openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.questions);
        router.openUrl(constants.upgradeUrl);
    }

}

    export default new QuestionViewModel();