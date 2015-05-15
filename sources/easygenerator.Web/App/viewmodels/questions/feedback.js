define(['durandal/app', 'eventTracker', 'localization/localizationManager', 'constants', 'notify', 'repositories/questionRepository'],
    function (app, eventTracker, localizationManager, constants, notify, repository) {
        "use strict";

        var events = {
            correctFeedbackUpdated: 'Update feedback content (correct answer)',
            incorrectFeedbackUpdated: 'Update feedback content (incorrect answer)'
        };

        var viewModel = {
            questionId: null,

            autosaveInterval: constants.autosaveTimersInterval.feedbackText,
            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            correctFeedback: createFeedbackObject(updateCorrectFeedbackText),
            incorrectFeedback: createFeedbackObject(updateIncorrectFeedbackText),

            correctFeedbackUpdatedByCollaborator: correctFeedbackUpdatedByCollaborator,
            incorrectFeedbackUpdatedByCollaborator: incorrectFeedbackUpdatedByCollaborator,

            eventTracker: eventTracker,
            localizationManager: localizationManager,

            activate: activate
        };

        app.on(constants.messages.question.correctFeedbackUpdatedByCollaborator, correctFeedbackUpdatedByCollaborator);
        app.on(constants.messages.question.incorrectFeedbackUpdatedByCollaborator, incorrectFeedbackUpdatedByCollaborator);

        return viewModel;

        function createFeedbackObject(callback) {
            var feedbackObject = {
                text: ko.observable(''),
                previousText: '',
                init: function (text) {
                    feedbackObject.text(text || '');
                    feedbackObject.previousText = text || '';
                },
                hasFocus: ko.observable(false),
                updateText: function () {
                    if (feedbackObject.text() == feedbackObject.previousText) {
                        return;
                    }

                    if (_.isEmptyHtmlText(feedbackObject.text())) {
                        feedbackObject.text(' ');
                    }

                    feedbackObject.previousText = feedbackObject.text();

                    if (_.isFunction(callback)) {
                        callback();
                    }
                }
            };
            feedbackObject.isEmpty = ko.computed(function () {
                return feedbackObject.text().length === 0;
            });

            return feedbackObject;
        }

        function correctFeedbackUpdatedByCollaborator(question, feedbackText) {
            if (question.id != viewModel.questionId) {
                return;
            }

            viewModel.correctFeedback.text(feedbackText);
        }

        function updateCorrectFeedbackText() {
            eventTracker.publish(events.correctFeedbackUpdated);
            repository.updateCorrectFeedback(viewModel.questionId, viewModel.correctFeedback.text()).then(function() {
                notify.saved();
            });
        }

        function incorrectFeedbackUpdatedByCollaborator(question, feedbackText) {
            if (question.id != viewModel.questionId) {
                return;
            }

            viewModel.incorrectFeedback.text(feedbackText);
        }

        function updateIncorrectFeedbackText() {
            eventTracker.publish(events.incorrectFeedbackUpdated);
            repository.updateIncorrectFeedback(viewModel.questionId, viewModel.incorrectFeedback.text()).then(function() {
                notify.saved();
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }

        function activate(activationData) {
            return Q.fcall(function () {
                viewModel.isExpanded(true);
                viewModel.questionId = activationData.questionId;

                return repository.getQuestionFeedback(viewModel.questionId).then(function (feedback) {
                    viewModel.correctFeedback.init(feedback.correctFeedbackText);
                    viewModel.incorrectFeedback.init(feedback.incorrectFeedbackText);
                });
            });
        }

    }
);