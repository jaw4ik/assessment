﻿
define(['durandal/app', 'eventTracker', 'constants',
        'repositories/questionRepository', 'repositories/objectiveRepository',
        'plugins/router',
        'viewmodels/questions/questionTitle',
        'viewmodels/common/contentField',
        'viewmodels/questions/questionViewModelFactory',
        'localization/localizationManager',
        'dialogs/moveCopyQuestion/moveCopyQuestion'],
    function (app, eventTracker, constants, questionRepository, objectiveRepository, router, vmQuestionTitle, vmContentField,
        questionViewModelFactory, localizationManager, moveCopyQuestionDialog) {
        "use strict";

        var events = {
            navigateToObjective: 'Navigate to objective details',
            duplicateItem: 'Duplicate item'
        };

        var eventsForQuestionContent = {
            addContent: 'Add extra question content',
            beginEditText: 'Start editing question content',
            endEditText: 'End editing question content'
        };

        var viewmodel = {
            courseId: null,
            objectiveId: null,
            questionId: null,
            questionType: '',

            viewCaption: null,
            questionTitle: null,
            questionContent: null,
            activeQuestionViewModel: null,
            isInformationContent: false,

            eventTracker: eventTracker,
            localizationManager: localizationManager,

            navigateToObjectiveEvent: navigateToObjectiveEvent,

            titleUpdatedByCollaborator: titleUpdatedByCollaborator,
            contentUpdatedByCollaborator: contentUpdatedByCollaborator,

            moveCopyQuestionDialog: moveCopyQuestionDialog,
            showMoveCopyDialog: showMoveCopyDialog,
            duplicateQuestion: duplicateQuestion,

            canActivate: canActivate,
            activate: activate,

            back: back
        };

        app.on(constants.messages.question.titleUpdatedByCollaborator, titleUpdatedByCollaborator);
        app.on(constants.messages.question.contentUpdatedByCollaborator, contentUpdatedByCollaborator);

        return viewmodel;

        function duplicateQuestion() {
            eventTracker.publish(events.duplicateItem);
            questionRepository.copyQuestion(viewmodel.questionId, viewmodel.objectiveId).then(function (response) {
                if (!_.isNullOrUndefined(viewmodel.courseId)) {
                    router.navigate('courses/' + viewmodel.courseId + '/objectives/' + viewmodel.objectiveId + '/questions/' + response.id);
                } else {
                    router.navigate('library/objectives/' + viewmodel.objectiveId + '/questions/' + response.id);
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

        function canActivate() {
            return true;
        }

        function activate() {
            if (arguments.length === 3) {
                viewmodel.courseId = arguments[0];
                viewmodel.objectiveId = arguments[1];
                viewmodel.questionId = arguments[2];
            } else if (arguments.length === 2) {
                viewmodel.courseId = null;
                viewmodel.objectiveId = arguments[0];
                viewmodel.questionId = arguments[1];
            } else {
                throw 'Invalid arguments';
            }

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
        }

        function back() {
            if (viewmodel.courseId) {
                router.navigate('#courses/' + viewmodel.courseId + '/objectives/' + viewmodel.objectiveId);
            } else {
                router.navigate('#library/objectives/' + viewmodel.objectiveId);
            }
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