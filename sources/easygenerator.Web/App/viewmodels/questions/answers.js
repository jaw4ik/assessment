define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app'],
    function (repository, localizationManager, notify, constants, eventTracker, app) {

        var events = {
            beginEditText: 'Start editing answer option',
            endEditText: 'End editing answer option'
        };

        var answersViewModel = function (questionId, answers) {
            var viewModel = {
                selectedAnswer: ko.observable(null),
                answers: ko.observableArray([]),
                isExpanded: ko.observable(true),
                beginEditText: beginEditText,
                endEditText: endEditText,
                toggleExpand: toggleExpand,
                addedByCollaborator: addedByCollaborator,
                textUpdatedByCollaborator: textUpdatedByCollaborator,
                autosaveInterval: constants.autosaveTimersInterval.answerOption,
            };

            _.each(answers, function (item) {
                doAddAnswer(item);
            });

            app.on(constants.messages.question.answer.addedByCollaborator, addedByCollaborator);
            app.on(constants.messages.question.answer.textUpdatedByCollaborator, textUpdatedByCollaborator);

            return viewModel;

            function beginEditText(answer) {
                eventTracker.publish(events.beginEditText);
                answer.hasFocus(true);
            }

            function endEditText(answer) {
                eventTracker.publish(events.endEditText);
                answer.hasFocus(false);
            }

            function toggleExpand() {
                viewModel.isExpanded(!viewModel.isExpanded());
            }

            function addedByCollaborator(question, answer) {
                if (questionId != question.id)
                    return;

                var item = {
                    id: ko.observable(answer.id),
                    text: ko.observable(answer.text),
                    original: { text: answer.text, correctness: answer.isCorrect },
                    isCorrect: ko.observable(answer.isCorrect),
                    isDeleted: ko.observable(false),
                    hasFocus: ko.observable(false)
                };

                viewModel.answers.push(item);
            }

            function textUpdatedByCollaborator(question, answerId, text) {
                if (questionId != question.id)
                    return;

                var selectedAnswer = viewModel.selectedAnswer();
                if (!_.isNullOrUndefined(selectedAnswer) && selectedAnswer.id() == answerId) {
                    return;
                }

                var answer = _.find(viewModel.answers(), function (item) {
                    return item.id() == answerId;
                });

                if (!_.isNullOrUndefined(answer)) {
                    answer.text(text);
                }
            }

            function doAddAnswer(answer) {
                answer = answer || { id: '', text: '', isCorrect: false };

                var item = {
                    id: ko.observable(answer.id),
                    text: ko.observable(answer.text),
                    original: { text: answer.text, correctness: answer.isCorrect },
                    isCorrect: ko.observable(answer.isCorrect),
                    isDeleted: ko.observable(false),
                    hasFocus: ko.observable(true)
                };

                viewModel.answers.push(item);
                return item;
            }

        };

        return answersViewModel;

    });
