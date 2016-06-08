import app from 'durandal/app';
import eventTracker from 'eventTracker';
import constants from 'constants';
import questionRepository from 'repositories/questionRepository';
import sectionRepository from 'repositories/sectionRepository';
import courseRepository from 'repositories/courseRepository';
import router from 'routing/router';
import vmQuestionTitle from 'viewmodels/questions/questionTitle';
import vmContentField from 'viewmodels/common/contentField';
import questionViewModelFactory from 'viewmodels/questions/questionViewModelFactory';
import learningContentsViewModel from 'viewmodels/learningContents/learningContents';
import feedbackViewModel from 'viewmodels/questions/feedback';
import localizationManager from 'localization/localizationManager';
import moveCopyQuestionDialog from 'dialogs/moveCopyQuestion/moveCopyQuestion';
import VoiceOver from 'viewmodels/questions/voiceOver';

var events = {
    navigateToSection: 'Navigate to objective details',
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
        this.sectionId = null;
        this.questionId = null;
        this.questionType = '';
        this.isContent = false;

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
        let response = await questionRepository.copyQuestion(this.questionId, this.sectionId);
        router.navigate(`courses/${this.courseId}/sections/${this.sectionId}/questions/${response.id}`);
    }

    showMoveCopyDialog() {
        moveCopyQuestionDialog.show(this.courseId, this.sectionId, this.questionId, this.isContent);
    }

    navigateToSectionEvent() {
        eventTracker.publish(events.navigateToSection);
    }

    setActiveViewModel(question) {
        var activeViewModel = questionViewModelFactory[question.type];
        if (!activeViewModel) {
            throw `Question with type ${question.type} is not found in questionViewModelFactory`;
        }
        return activeViewModel;
    }

    canActivate(courseId, sectionId, questionId) {
        if (!courseId || !sectionId || !questionId) {
            throw 'Invalid arguments';
        }

        return Promise.all([
            courseRepository.getById(courseId),
            sectionRepository.getById(sectionId),
            questionRepository.getById(sectionId, questionId)
        ]).then(() => { return true; },
            () => { return { redirect: '404' }; }
        );
    }

    async activate(courseId, sectionId, questionId) {
        if (!courseId || !sectionId || !questionId) {
            throw 'Invalid arguments';
        }
        
        this.courseId = courseId;
        this.sectionId = sectionId;
        this.questionId = questionId;

        let question = await questionRepository.getById(this.sectionId, this.questionId);

        this.activeQuestionViewModel = this.setActiveViewModel(question);
        this.questionType = question.type;
        this.isContent = this.questionType === constants.questionType.informationContent.type;
        this.voiceOver = new VoiceOver(this.questionId, question.voiceOver);

        let viewModelData = await this.activeQuestionViewModel.initialize(this.sectionId, question);

        this.viewCaption = viewModelData.viewCaption;
        this.questionTitle = vmQuestionTitle(this.sectionId, question);
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
        router.navigate(`#courses/${this.courseId}/sections/${this.sectionId}`);
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