define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app'],
    function (repository, localizationManager, notify, constants, eventTracker, app) {

        var events = {
            beginEditText: 'Start editing answer option',
            endEditText: 'End editing answer option'
        };

        var answersViewModel = function (questionId, answers) {
            var viewModel = {
                answers: ko.observableArray([]),
                isExpanded: ko.observable(true),
                beginEditText: beginEditText,
                endEditText: endEditText,
                toggleExpand: toggleExpand,
                addedByCollaborator: addedByCollaborator,
                textUpdatedByCollaborator: textUpdatedByCollaborator,
                autosaveInterval: constants.autosaveTimersInterval.answerOption,
                doAddAnswer: doAddAnswer
            };

            _.each(answers, function (item) {
                doAddAnswer(item);
            });

            app.on(constants.messages.question.answer.addedByCollaborator, addedByCollaborator);
            app.on(constants.messages.question.answer.textUpdatedByCollaborator, textUpdatedByCollaborator);

            return viewModel;

            function beginEditText(answer) {
                eventTracker.publish(events.beginEditText);
                answer.text.isEditing(true);
            }

            function endEditText(answer) {
                eventTracker.publish(events.endEditText);
                answer.text.isEditing(false);
            }

            function toggleExpand() {
                viewModel.isExpanded(!viewModel.isExpanded());
            }

            function addedByCollaborator(question, answer) {
                if (questionId != question.id)
                    return;

                doAddAnswer(answer);
            }

            function textUpdatedByCollaborator(question, answerId, text) {
                if (questionId != question.id)
                    return;

                var answer = _.find(viewModel.answers(), function (item) {
                    return item.id() == answerId;
                });
                if (_.isNullOrUndefined(answer))
                    return;

                answer.original.text = text;
                if (!answer.hasFocus())
                    answer.text(text);
            }

            function doAddAnswer(answer) {
                answer = answer || { id: '', text: '', isCorrect: false };

                var item = {
                    id: ko.observable(answer.id),
                    text: ko.observable(answer.text),
                    original: { text: answer.text, correctness: answer.isCorrect },
                    isCorrect: ko.observable(answer.isCorrect),
                    isDeleted: ko.observable(false),
                    hasFocus: ko.observable(false)
                };
                item.text.isEditing = ko.observable(false);

                viewModel.answers.push(item);
                return item;
            }

        };

        return answersViewModel;

    });
