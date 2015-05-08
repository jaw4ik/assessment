define(['eventTracker', 'viewmodels/questions/fillInTheBlank/fibControl', 'repositories/questionRepository', 'localization/localizationManager', 'constants', 'durandal/app'],
    function (eventTracker, fibControl, questionRepository, localizationManager, constants, app) {
        "use strict";

        var eventsForQuestionContent = {
            addFillInTheBlank: 'Add fill in the blank content',
            beginEditText: 'Start editing fill in the blank content',
            endEditText: 'End editing fill in the blank content'
        };

        var viewModel = {
            initialize: initialize,
            objectiveId: '',
            questionId: '',
            
            eventTracker: eventTracker,
            localizationManager: localizationManager,
            fillInTheBlank: null,
            
            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            updatedByCollaborator: updatedByCollaborator
        };

        app.on(constants.messages.question.fillInTheBlank.updatedByCollaborator, updatedByCollaborator);

        return viewModel;

        function initialize(objectiveId, question) {
            viewModel.objectiveId = objectiveId;
            viewModel.questionId = question.id;
            
            return questionRepository.getFillInTheBlank(question.id).then(function (questionData) {
                viewModel.fillInTheBlank = new fibControl(questionData.content, questionData.answers, eventsForQuestionContent, true, function (template, answers) {
                    return questionRepository.updateFillInTheBlank(question.id, template, answers);
                });

                return {
                    viewCaption: localizationManager.localize('fillInTheBlanksEditor')
                };
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function updatedByCollaborator(questionId, questionData) {
            if (questionId != viewModel.questionId) {
                return;
            }

            viewModel.fillInTheBlank.updatedByCollaborator(questionData);
        }

    }
);