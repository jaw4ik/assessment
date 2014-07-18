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

        var viewModel = {
            initialize: initialize,
            objectiveId: '',
            questionId: '',

            answers: ko.observableArray(),
            addAnswer: addAnswer,
            removeAnswer: removeAnswer,

            isExpanded: ko.observable(true),
            toggleExpand: toggleExpand,

            events: {
                addAnswer: 'Add answer option',
                deleteAnswer: 'Delete answer option'
            }
        };

        return viewModel;

        function addAnswer() {
            eventTracker.publish(viewModel.events.addAnswer);
            return addAnswerCommand.execute(viewModel.questionId).then(function (response) {
                notify.saved();
                viewModel.answers.push(new TextMatchingAnswer(response.Id, response.Key, response.Value));
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
                    isQuestionContentNeeded: true
                };
            });
        }

        function toggleExpand() {
            viewModel.isExpanded(!viewModel.isExpanded());
        }
    }
);