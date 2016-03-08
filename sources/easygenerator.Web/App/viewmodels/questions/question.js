import app from 'durandal/app';
import eventTracker from 'eventTracker';
import constants from 'constants';
import questionRepository from 'repositories/questionRepository';
import objectiveRepository from 'repositories/objectiveRepository';
import courseRepository from 'repositories/courseRepository';
import router from 'plugins/router';
import vmQuestionTitle from 'viewmodels/questions/questionTitle';
import vmContentField from 'viewmodels/common/contentField';
import questionViewModelFactory from 'viewmodels/questions/questionViewModelFactory';
import learningContentsViewModel from 'viewmodels/learningContents/learningContents';
import feedbackViewModel from 'viewmodels/questions/feedback';
import localizationManager from 'localization/localizationManager';
import moveCopyQuestionDialog from 'dialogs/moveCopyQuestion/moveCopyQuestion';
import VoiceOver from 'viewmodels/questions/voiceOver';

var events = {
    navigateToObjective: 'Navigate to objective details',
    duplicateItem: 'Duplicate item'
};

var eventsForQuestionContent = {
    addContent: 'Add extra question content',
    beginEditText: 'Start editing question content',
    endEditText: 'End editing question content'
};

class QuestionViewModel{
    constructor() {
        this.courseId = null;
        this.objectiveId = null;
        this.questionId = null;
        this.questionType = '';

        this.viewCaption = null;
        this.questionTitle = null;
        this.voiceOver = null;
        this.questionContent = null;

        this.activeQuestionViewModel = null;
        this.learningContentsViewModel = learningContentsViewModel;
        this.feedbackViewModel = feedbackViewModel;

        this.isInformationContent = false;

        this.eventTracker = eventTracker;
        this.localizationManager = localizationManager;

        app.on(constants.messages.question.titleUpdatedByCollaborator, this.titleUpdatedByCollaborator);
        app.on(constants.messages.question.contentUpdatedByCollaborator, this.contentUpdatedByCollaborator);
    }

    async duplicateQuestion() {
        eventTracker.publish(events.duplicateItem);
        let response = await questionRepository.copyQuestion(this.questionId, this.objectiveId);
        router.navigate(`courses/${this.courseId}/objectives/${this.objectiveId}/questions/${response.id}`);
    }

    showMoveCopyDialog() {
        moveCopyQuestionDialog.show(this.courseId, this.objectiveId, this.questionId);
    }

    navigateToObjectiveEvent() {
        eventTracker.publish(events.navigateToObjective);
    }

    setActiveViewModel(question) {
        var activeViewModel = questionViewModelFactory[question.type];
        if (!activeViewModel) {
            throw `Question with type ${question.type} is not found in questionViewModelFactory`;
        }
        return activeViewModel;
    }

    canActivate(courseId, objectiveId, questionId) {
        if (!courseId || !objectiveId || !questionId) {
            throw 'Invalid arguments';
        }

        return Promise.all([
            courseRepository.getById(courseId),
            objectiveRepository.getById(objectiveId),
            questionRepository.getById(objectiveId, questionId)
        ]).then(() => { return true; },
            () => { return { redirect: '404' }; }
        );
    }

    async activate(courseId, objectiveId, questionId) {
        if (!courseId || !objectiveId || !questionId) {
            throw 'Invalid arguments';
        }
        
        this.courseId = courseId;
        this.objectiveId = objectiveId;
        this.questionId = questionId;

        let question = await questionRepository.getById(this.objectiveId, this.questionId);

        this.activeQuestionViewModel = this.setActiveViewModel(question);
        this.questionType = question.type;
        this.voiceOver = new VoiceOver(this.questionId, question.voiceOver);

        let viewModelData = await this.activeQuestionViewModel.initialize(this.objectiveId, question);

        this.viewCaption = viewModelData.viewCaption;
        this.questionTitle = vmQuestionTitle(this.objectiveId, question);
        this.hasQuestionView = viewModelData.hasQuestionView;
        this.questionContent = viewModelData.hasQuestionContent ? vmContentField(question.content, eventsForQuestionContent, true, this.updateQuestionContent.bind(this)) : null;
        this.hasFeedback = viewModelData.hasFeedback;
        this.feedbackCaptions = viewModelData.feedbackCaptions;

        await this.learningContentsViewModel.initialize(question);
        await this.feedbackViewModel.initialize({ questionId: question.id, captions: this.feedbackCaptions });
    }

    updateQuestionContent(content) {
        return questionRepository.updateContent(this.questionId, content);
    }

    back() {
        router.navigate(`#courses/${this.courseId}/objectives/${this.objectiveId}`);
    }

    titleUpdatedByCollaborator(questionData) {
        if (questionData.id !== this.questionId || this.questionTitle.text.isEditing()) {
            return;
        }

        this.questionTitle.text(questionData.title);
    }

    contentUpdatedByCollaborator(question) {
        if (question.id !== this.questionId) {
            return;
        }

        this.questionContent.originalText(question.content);

        if (!this.questionContent.isEditing()) {
            this.questionContent.text(question.content);
        }
    }
}

export default new QuestionViewModel();