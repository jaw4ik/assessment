
define(['durandal/app', 'eventTracker', 'constants',
        'repositories/questionRepository', 'repositories/objectiveRepository',
        'models/backButton', 'plugins/router',
        'viewmodels/questions/questionTitle',
        'viewmodels/common/contentField',
        'viewmodels/questions/questionViewModelFactory',
        'localization/localizationManager',
        'dialogs/moveCopyQuestion/moveCopyQuestion'],
    function (app, eventTracker, constants, questionRepository, objectiveRepository, BackButton, router, vmQuestionTitle, vmContentField,
        questionViewModelFactory, localizationManager, moveCopyQuestionDialog) {
        "use strict";

        var events = {
            navigateToObjective: 'Navigate to objective details'
        };

        var eventsForQuestionContent = {
            addContent: 'Add extra question content',
            beginEditText: 'Start editing question content',
            endEditText: 'End editing question content'
        };

        var viewmodel = {
            courseId: null,
            objectiveId: '',
            questionId: '',
            questionType: '',

            viewCaption: null,
            questionTitle: null,
            questionContent: null,
            activeQuestionViewModel: null,
            isInformationContent: false,

            eventTracker: eventTracker,
            localizationManager: localizationManager,
            backButtonData: new BackButton({}),

            navigateToObjectiveEvent: navigateToObjectiveEvent,

            titleUpdatedByCollaborator: titleUpdatedByCollaborator,
            contentUpdatedByCollaborator: contentUpdatedByCollaborator,

            moveCopyQuestionDialog: moveCopyQuestionDialog,
            showMoveCopyDialog: showMoveCopyDialog,
            duplicateQuestion: duplicateQuestion,

            activate: activate
        };

        app.on(constants.messages.question.titleUpdatedByCollaborator, titleUpdatedByCollaborator);
        app.on(constants.messages.question.contentUpdatedByCollaborator, contentUpdatedByCollaborator);

        return viewmodel;

        function duplicateQuestion() {
            questionRepository.copyQuestion(viewmodel.questionId, viewmodel.objectiveId).then(function (response) {
                if (!_.isNullOrUndefined(viewmodel.courseId)) {
                    router.navigate('objective/' + viewmodel.objectiveId + '/question/' + response.id + '?courseId=' + viewmodel.courseId);
                } else {
                    router.navigate('objective/' + viewmodel.objectiveId + '/question/' + response.id);
                }
            });
        }

        function showMoveCopyDialog() {
            viewmodel.moveCopyQuestionDialog.show(viewmodel.courseId, viewmodel.objectiveId, viewmodel.questionId);
        }

        function navigateToObjectiveEvent() {
            eventTracker.publish(events.navigateToObjective);
        }

        function setActiveViewModel(question) {
            var activeViewModel = questionViewModelFactory[question.type];
            if (!activeViewModel) throw "Question with type " + question.type.toString() + " is not found in questionViewModelFactory";
            return activeViewModel;
        }

        function activate(objectiveId, questionId, queryParams) {
            viewmodel.objectiveId = objectiveId;
            viewmodel.questionId = questionId;
            viewmodel.courseId = !_.isNullOrUndefined(queryParams) ? queryParams.courseId : null;
            return objectiveRepository.getById(objectiveId).then(function (objective) {
                viewmodel.backButtonData.configure({
                    url: 'objective/' + objective.id,
                    backViewName: '\'' + objective.title + '\'',
                    callback: navigateToObjectiveEvent,
                    alwaysVisible: _.isNullOrUndefined(queryParams) || !_.isString(queryParams.courseId)
                });
                return questionRepository.getById(viewmodel.objectiveId, viewmodel.questionId).then(function (question) {
                    viewmodel.activeQuestionViewModel = setActiveViewModel(question);
                    viewmodel.questionType = question.type;
                    return viewmodel.activeQuestionViewModel.initialize(viewmodel.objectiveId, question).then(function (viewModelData) {
                        viewmodel.viewCaption = viewModelData.viewCaption;

                        viewmodel.questionTitle = vmQuestionTitle(viewmodel.objectiveId, question);
                        viewmodel.isInformationContent = viewModelData.isInformationContent;
                        if (viewModelData.isQuestionContentNeeded) {
                            viewmodel.questionContent = vmContentField(question.content, eventsForQuestionContent, true, function (content) {
                                return questionRepository.updateContent(question.id, content);
                            });
                        } else {
                            viewmodel.questionContent = null;
                        }
                    });
                });
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        function titleUpdatedByCollaborator(questionData) {
            if (questionData.id != viewmodel.questionId || viewmodel.questionTitle.text.isEditing()) {
                return;
            }

            viewmodel.questionTitle.text(questionData.title);
        }

        function contentUpdatedByCollaborator(question) {
            if (question.id != viewmodel.questionId)
                return;

            viewmodel.questionContent.originalText(question.content);
            if (!viewmodel.questionContent.isEditing())
                viewmodel.questionContent.text(question.content);
        }
    }
);