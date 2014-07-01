define(['eventTracker', 'localization/localizationManager', 'constants', 'repositories/questionRepository'], function (eventTracker, localizationManager, constants, repository) {
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

        eventTracker: eventTracker,
        localizationManager: localizationManager,

        activate: activate
    };

    return viewModel;

    function createFeedbackObject(callback) {
        var feedbackObject = {
            text: ko.observable(''),
            previousText: '',
            init: function (text) {
                feedbackObject.text(text || '');
                feedbackObject.previousText = text;
            },
            hasFocus: ko.observable(false),
            updateText: function () {
                if (feedbackObject.text() == feedbackObject.previousText) {
                    return;
                }

                if (_.isEmptyHtmlText(feedbackObject.text())) {
                    feedbackObject.text('');
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

    function updateCorrectFeedbackText() {
        eventTracker.publish(events.correctFeedbackUpdated);
        repository.updateCorrectFeedback(viewModel.questionId, viewModel.correctFeedback.text());
    }

    function updateIncorrectFeedbackText() {
        eventTracker.publish(events.incorrectFeedbackUpdated);
        repository.updateIncorrectFeedback(viewModel.questionId, viewModel.incorrectFeedback.text());
    }

    function toggleExpand() {
        viewModel.isExpanded(!viewModel.isExpanded());
    }

    function activate(questionId) {
        return Q.fcall(function () {
            viewModel.isExpanded(true);
            viewModel.questionId = questionId;

            return repository.getQuestionFeedback(questionId).then(function(feedback) {
                viewModel.correctFeedback.init(feedback.correctFeedbackText);
                viewModel.incorrectFeedback.init(feedback.incorrectFeedbackText);
            });
        });
    }

});