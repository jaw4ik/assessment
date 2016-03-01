import app from 'durandal/app';
import userContext from 'userContext';
import eventTracker from 'eventTracker';
import constants from 'constants';
import questionRepository from 'repositories/questionRepository';
import sectionRepository from 'repositories/sectionRepository';
import courseRepository from 'repositories/courseRepository';
import createQuestionCommand from 'commands/createQuestionCommand';
import router from 'plugins/router';
import vmQuestionTitle from 'viewmodels/questions/questionTitle';
import vmContentField from 'viewmodels/common/contentField';
import questionViewModelFactory from 'viewmodels/questions/questionViewModelFactory';
import learningContentsViewModel from 'viewmodels/learningContents/learningContents';
import feedbackViewModel from 'viewmodels/questions/feedback';
import localizationManager from 'localization/localizationManager';
import moveCopyQuestionDialog from 'dialogs/moveCopyQuestion/moveCopyQuestion';
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
        this.questionType= '';

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
        questionRepository.copyQuestion(this.questionId, this.sectionId).then(function (response) {
            router.navigate('courses/' + that.courseId + '/sections/' + that.sectionId + '/questions/' + response.id);
        });
    }

    showMoveCopyDialog() {
        moveCopyQuestionDialog.show(this.courseId, this.sectionId, this.questionId);
    }

    navigateToSectionEvent() {
        eventTracker.publish(events.navigateToSection);
    }

    canActivate() {
        var promises = [];
        if (arguments.length === 3) {
            promises.push(courseRepository.getById(arguments[0]));
            promises.push(sectionRepository.getById(arguments[1]));
            promises.push(questionRepository.getById(arguments[1], arguments[2]));
        } else if (arguments.length === 2) {
            promises.push(sectionRepository.getById(arguments[0]));
            promises.push(questionRepository.getById(arguments[0], arguments[1]));
        } else {
            throw 'Invalid arguments';
        }

        return Promise.all(promises).then(function () {
            return true;
        }).catch(function () {
            return { redirect: '404' };
        });
    }

    activate() {
        if (arguments.length === 3) {
            this.courseId = arguments[0];
            this.sectionId = arguments[1];
            this.questionId = arguments[2];
        } else if (arguments.length === 2) {
            this.courseId = null;
            this.sectionId = arguments[0];
            this.questionId = arguments[1];
        } else {
            throw 'Invalid arguments';
        }

        return questionRepository.getById(this.sectionId, this.questionId).then(question => {

            this.activeQuestionViewModel = this.setActiveViewModel(question);
            this.questionType = question.type;
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
            throw "Question with type " + question.type.toString() + " is not found in questionViewModelFactory";
        }
        return activeViewModel;
    }

    updateQuestionContent(content) {
        return questionRepository.updateContent(this.questionId, content);
    }

    back() {
        if (this.courseId) {
            router.navigate('#courses/' + this.courseId + '/sections/' + this.sectionId);
        } else {
            router.navigate('#library/sections/' + this.sectionId);
        }
    }

    titleUpdatedByCollaborator(questionData) {
        if (questionData.id != this.questionId || this.questionTitle.text.isEditing()) {
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
        return createQuestionCommand.execute(this.sectionId, this.courseId, item.type);
    }

    openUpgradePlanUrl() {
        eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.questions);
        router.openUrl(constants.upgradeUrl);
    }

}

    export default new QuestionViewModel();