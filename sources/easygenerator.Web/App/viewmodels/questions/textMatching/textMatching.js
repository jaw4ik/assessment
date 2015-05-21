define(['durandal/app',
    'notify',
    'constants',
    'eventTracker',
    'localization/localizationManager',
    'viewmodels/questions/textMatching/queries/getTextMatchingAnswersById',
    'viewmodels/questions/textMatching/commands/addAnswer',
    'viewmodels/questions/textMatching/commands/removeAnswer',
    'viewmodels/questions/textMatching/textMatchingAnswer'],
    function (app, notify, constants, eventTracker, localizationManager, getTextMatchingAnswersById, addAnswerCommand, removeAnswerCommand, TextMatchingAnswer) {
        "use strict";

        var minLengthOfAnswerOptions = 2;

        var viewModel = {
            initialize: initialize,
            objectiveId: '',
            questionId: '',

            answers: ko.observableArray(),
            addAnswer: addAnswer,
            removeAnswer: removeAnswer,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,
            endEditAnswer: endEditAnswer,

            answerCreatedByCollaborator: answerCreatedByCollaborator,
            answerDeletedByCollaborator: answerDeletedByCollaborator,
            answerKeyChangedByCollaborator: answerKeyChangedByCollaborator,
            answerValueChangedByCollaborator: answerValueChangedByCollaborator,

            events: {
                addAnswer: 'Add key-answer pair (text matching)',
                deleteAnswer: 'Delete key-answer pair (text matching)'
            }
        };

        app.on(constants.messages.question.textMatching.answerCreatedByCollaborator, answerCreatedByCollaborator);
        app.on(constants.messages.question.textMatching.answerDeletedByCollaborator, answerDeletedByCollaborator);
        app.on(constants.messages.question.textMatching.answerKeyChangedByCollaborator, answerKeyChangedByCollaborator);
        app.on(constants.messages.question.textMatching.answerValueChangedByCollaborator, answerValueChangedByCollaborator);

        viewModel.showDeleteButton = ko.computed(function() {
            return viewModel.answers().length > minLengthOfAnswerOptions;
        });

        return viewModel;
        
        function endEditAnswer(answer) {
            if (answer.isDeleted) {
                viewModel.answers.remove(answer);
            }
        }

        function answerCreatedByCollaborator(questionId, answerId, key, value) {
            if (viewModel.questionId != questionId)
                return;

            viewModel.answers.push(new TextMatchingAnswer(answerId, key, value));
        }

        function answerDeletedByCollaborator(questionId, answerId) {
            if (viewModel.questionId != questionId)
                return;

            var answer = _.find(viewModel.answers(), function (item) {
                return item.id == answerId;
            });
            if (_.isNullOrUndefined(answer))
                return;

            if (answer.key.hasFocus() || answer.value.hasFocus()) {
                answer.isDeleted = true;
                notify.error(localizationManager.localize('answerOptionHasBeenDeletedByCollaborator'));
            } else {
                viewModel.answers.remove(answer);
            }
        }

        function answerKeyChangedByCollaborator(questionId, answerId, key) {
            if (viewModel.questionId != questionId)
                return;

            var answer = _.find(viewModel.answers(), function (item) {
                return item.id == answerId;
            });
            if (_.isNullOrUndefined(answer))
                return;

            answer.changeOriginalKey(key);
            if (!answer.key.hasFocus())
                answer.key(key);
        }

        function answerValueChangedByCollaborator(questionId, answerId, value) {
            if (viewModel.questionId != questionId)
                return;

            var answer = _.find(viewModel.answers(), function (item) {
                return item.id == answerId;
            });
            if (_.isNullOrUndefined(answer))
                return;

            answer.changeOriginalValue(value);
            if (!answer.value.hasFocus())
                answer.value(value);
        }

        function addAnswer() {
            eventTracker.publish(viewModel.events.addAnswer);
            return addAnswerCommand.execute(viewModel.questionId).then(function (response) {
                notify.saved();
                viewModel.answers.push(new TextMatchingAnswer(response.Id, response.Key, response.Value, true));
            });
        }

        function removeAnswer(answer) {
            eventTracker.publish(viewModel.events.deleteAnswer);
            return removeAnswerCommand.execute(viewModel.questionId, answer.id).then(function () {
                notify.saved();
                viewModel.answers.remove(function (item) { return item.id == answer.id; });
            });
        }

        function initialize(objectiveId, question) {
            viewModel.objectiveId = objectiveId;
            viewModel.questionId = question.id;
            viewModel.isExpanded(true);

            return getTextMatchingAnswersById.execute(question.id).then(function (response) {
                if (!_.isNullOrUndefined(response)) {
                    var sortedAnswers = _.sortBy(response.answers, function(item) {
                        return item.CreatedOn;
                    });

                    viewModel.answers(_.map(sortedAnswers, function(answer) {
                        return new TextMatchingAnswer(answer.Id, answer.Key, answer.Value);
                    }));
                } else {
                    viewModel.answers([]);
                }
                
                return {
                    viewCaption: localizationManager.localize('textMatchingEditor'),
                    hasQuestionView: true,
                    hasQuestionContent: true,
                    hasFeedback: true
                };
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }
    }
);