﻿define(['durandal/app', 'eventTracker', 'constants', 'repositories/questionRepository', 'repositories/objectiveRepository', 'ping', 'models/backButton', 'plugins/router',
        'viewmodels/questions/questionTitle', 'viewmodels/common/contentField', 'viewmodels/questions/multipleSelect/multipleSelect',
        'viewmodels/questions/fillInTheBlank/fillInTheBlank', 'viewmodels/questions/dragAndDrop/dragAndDrop', 'viewmodels/questions/singleSelectText/singleSelectText', 'viewmodels/questions/textMatching/textMatching',
 'viewmodels/questions/singleSelectImage/singleSelectImage', 'viewmodels/questions/informationContent/informationContent','localization/localizationManager'],
    function (app, eventTracker, constants, questionRepository, objectiveRepository, ping, BackButton, router, vmQuestionTitle, vmContentField,
        multipleSelect, fillInTheBlank, dragAndDrop, singleSelectText, textMatching, singleSelectImage, informationContent, localizationManager) {
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
            objectiveId: '',
            questionId: '',
            questionType: '',

            viewCaption: null,
            questionTitle: null,
            questionContent: null,
            activeQuestionViewModel: null,
            isInformationContent: false,

            backButtonData: new BackButton({}),

            navigateToObjectiveEvent: navigateToObjectiveEvent,

            titleUpdatedByCollaborator: titleUpdatedByCollaborator,
            contentUpdatedByCollaborator: contentUpdatedByCollaborator,

            canActivate: canActivate,
            activate: activate,
            localizationManager: localizationManager
        };

        app.on(constants.messages.question.titleUpdatedByCollaborator, titleUpdatedByCollaborator);
        app.on(constants.messages.question.contentUpdatedByCollaborator, contentUpdatedByCollaborator);

        return viewmodel;

        function navigateToObjectiveEvent() {
            eventTracker.publish(events.navigateToObjective);
        }

        function canActivate() {
            return ping.execute();
        }

        function setActiveViewModel(question) {
            switch (question.type) {
                case constants.questionType.multipleSelect.type:
                    return multipleSelect;
                case constants.questionType.fillInTheBlank.type:
                    return fillInTheBlank;
                case constants.questionType.dragAndDropText.type:
                    return dragAndDrop;
                case constants.questionType.singleSelectText.type:
                    return singleSelectText;
                case constants.questionType.singleSelectImage.type:
                    return singleSelectImage;
                case constants.questionType.textMatching.type:
                    return textMatching;
                case constants.questionType.informationContent.type:
                    return informationContent;
            }
        }

        function activate(objectiveId, questionId, queryParams) {
            viewmodel.objectiveId = objectiveId;
            viewmodel.questionId = questionId;

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