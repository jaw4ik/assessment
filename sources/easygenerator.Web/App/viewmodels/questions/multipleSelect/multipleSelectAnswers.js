define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app', 'viewmodels/questions/answers'],
    function (repository, localizationManager, notify, constants, eventTracker, app, answersViewModel) {

        var events,
            eventsValues = {
                addAnswerOption: 'Add answer option',
                deleteAnswerOption: 'Delete answer option',
                toggleAnswerCorrectness: 'Change answer option correctness',
            },
            options,
            optionsValues = {
                minAnswersCount: 0
            };

        var multipleselectAnswers = function (questionId, answers, eventsEx, optionsEx) {
            events = _.extend({}, eventsValues, eventsEx);
            options = _.extend({}, optionsValues, optionsEx);

            var viewModel = answersViewModel(questionId, answers, events, options);

            viewModel.addAnswer = function () {
                eventTracker.publish(events.addAnswerOption);
                var answer = viewModel.doAddAnswer();
                answer.hasFocus(true);
                answer.text.isEditing(true);
            };

            viewModel.removeAnswer = function (answer) {
                eventTracker.publish(events.deleteAnswerOption);

                performActionWhenAnswerIdIsSet(answer, function () {
                    viewModel.answers.remove(answer);

                    if (!answer.isDeleted())
                        repository.removeAnswer(questionId, ko.unwrap(answer.id)).then(function () {
                            showNotification();
                        });
                });
            };

            viewModel.updateAnswer = function (answer) {
                var id = ko.unwrap(answer.id);
                var text = ko.unwrap(answer.text);
                var correctness = ko.unwrap(answer.isCorrect);

                return Q.fcall(function () {
                    if (answer.isDeleted()) {
                        viewModel.answers(_.reject(viewModel.answers(), function (item) {
                            return item.id() == answer.id();
                        }));

                        return;
                    }

                    if (_.isEmptyOrWhitespace(text)) {
                        if (viewModel.answers().length == options.minAnswersCount) {
                            answer.text(answer.original.text);
                            return;
                        }

                        viewModel.answers.remove(answer);
                        if (!_.isEmptyOrWhitespace(id)) {
                            repository.removeAnswer(questionId, id).then(function () {
                                showNotification();
                            });
                        }
                        return;
                    }

                    if (_.isEmptyOrWhitespace(id)) {
                        repository.addAnswer(questionId, { text: text, isCorrect: correctness }).then(function (item) {
                            showNotification();
                            answer.id(item.id);
                            answer.original.text = text;
                            answer.original.correctness = correctness;
                        });
                    } else {
                        if (answer.original.text != text || answer.original.correctness != answer.isCorrect()) {
                            repository.updateAnswer(questionId, id, text, answer.isCorrect()).then(function () {
                                showNotification();
                                answer.original.text = text;
                                answer.original.correctness = answer.isCorrect();
                            });
                        }
                    }
                });
            };

            viewModel.toggleCorrectness = function (answer) {
                eventTracker.publish(events.toggleAnswerCorrectness);
                var isCorrect = !answer.isCorrect();

                answer.isCorrect(isCorrect);
            };

            viewModel.deletedByCollaborator = deletedByCollaborator;
            viewModel.answerCorrectnessUpdatedByCollaborator = answerCorrectnessUpdatedByCollaborator;

            app.on(constants.messages.question.answer.deletedByCollaborator, deletedByCollaborator);
            app.on(constants.messages.question.answer.answerCorrectnessUpdatedByCollaborator, answerCorrectnessUpdatedByCollaborator);

            return viewModel;

            function performActionWhenAnswerIdIsSet(answer, action) {
                if (_.isEmptyOrWhitespace(ko.unwrap(answer.id))) {
                    var subscription = answer.id.subscribe(function () {
                        if (!_.isEmptyOrWhitespace(ko.unwrap(answer.id))) {
                            action();
                            subscription.dispose();
                        }
                    });
                } else {
                    action();
                }
            }

            function showNotification() {
                notify.saved();
            }

            function deletedByCollaborator(question, answerId) {
                if (questionId != question.id)
                    return;

                var answer = _.find(viewModel.answers(), function (item) {
                    return item.id() == answerId;
                });
                if (_.isNullOrUndefined(answer))
                    return;

                if (answer.hasFocus()) {
                    answer.isDeleted(true);
                    notify.error(localizationManager.localize('answerOptionHasBeenDeletedByCollaborator'));
                } else {
                    viewModel.answers.remove(answer);
                }
            }

            function answerCorrectnessUpdatedByCollaborator(question, answerId, isCorrect) {
                if (questionId != question.id)
                    return;

                var answer = _.find(viewModel.answers(), function (item) {
                    return item.id() == answerId;
                });
                if (_.isNullOrUndefined(answer))
                    return;

                answer.original.correctness = isCorrect;
                if (!answer.hasFocus())
                    answer.isCorrect(isCorrect);
            }
        };

        return multipleselectAnswers;

    });
