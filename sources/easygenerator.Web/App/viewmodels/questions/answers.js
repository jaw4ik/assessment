define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app'],
    function (repository, localizationManager, notify, constants, eventTracker, app) {

        var events = {
            addAnswerOption: 'Add answer option',
            deleteAnswerOption: 'Delete answer option',
            toggleAnswerCorrectness: 'Change answer option correctness',
            beginEditText: 'Start editing answer option',
            endEditText: 'End editing answer option'
        };


        var answers = function (questionId, answers) {

            var viewModel = {
                selectedAnswer: ko.observable(null),
                answers: ko.observableArray([]),
                isExpanded: ko.observable(true),
                selectAnswer: selectAnswer,
                clearSelection: clearSelection,
                addAnswer: addAnswer,
                removeAnswer: removeAnswer,
                beginEditText: beginEditText,
                endEditText: endEditText,
                toggleExpand: toggleExpand,
                updateAnswer: updateAnswer,
                autosaveInterval: constants.autosaveTimersInterval.answerOption,
                addedByCollaborator: addedByCollaborator,
                deletedByCollaborator: deletedByCollaborator,
                textUpdatedByCollaborator: textUpdatedByCollaborator,
                correctnessUpdatedByCollaborator: correctnessUpdatedByCollaborator
            };

            _.each(answers, function (item) {
                doAddAnswer(item);
            });

            app.on(constants.messages.question.answer.addedByCollaborator, addedByCollaborator);
            app.on(constants.messages.question.answer.deletedByCollaborator, deletedByCollaborator);
            app.on(constants.messages.question.answer.textUpdatedByCollaborator, textUpdatedByCollaborator);
            app.on(constants.messages.question.answer.correctnessUpdatedByCollaborator, correctnessUpdatedByCollaborator);

            return viewModel;

            function updateAnswer(answer) {
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
                        viewModel.answers.remove(answer);
                        if (!_.isEmptyOrWhitespace(id)) {
                            repository.removeAnswer(questionId, id).then(function (response) {
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
                        if (answer.original.text != text || answer.original.correctness != answer.isCorrect())
                            repository.updateAnswer(questionId, id, text, answer.isCorrect()).then(function (response) {
                                showNotification();
                                answer.original.text = text;
                                answer.original.correctness = answer.isCorrect();
                            });
                    }
                });
            }

            function selectAnswer(newAnswer) {
                return Q.fcall(function () {
                    var oldAnswer = viewModel.selectedAnswer();
                    if (oldAnswer == newAnswer)
                        return;

                    viewModel.selectedAnswer(newAnswer);
                    if (oldAnswer != null) {
                        updateAnswer(oldAnswer);
                    }
                });
            }

            function clearSelection() {
                return viewModel.selectAnswer(null);
            }

            function addAnswer() {
                eventTracker.publish(events.addAnswerOption);
                var answer = doAddAnswer();
                return viewModel.selectAnswer(answer);
            }

            function addedByCollaborator(question, answer) {
                if (questionId != question.id)
                    return;

                doAddAnswer(answer);
            }

            function deletedByCollaborator(question, answerId) {
                if (questionId != question.id)
                    return;

                var selectedAnswer = viewModel.selectedAnswer();
                if (!_.isNullOrUndefined(selectedAnswer) && selectedAnswer.id() == answerId) {
                    notify.error(localizationManager.localize('answerOptionHasBeenDeletedByCollaborator'));
                    selectedAnswer.isDeleted(true);
                    return;
                }

                viewModel.answers(_.reject(viewModel.answers(), function (item) {
                    return item.id() == answerId;
                }));
            }

            function textUpdatedByCollaborator(question, answerId, text) {
                if (questionId != question.id)
                    return;

                var selectedAnswer = viewModel.selectedAnswer();
                if (!_.isNullOrUndefined(selectedAnswer) && selectedAnswer.id() == answerId) {
                    return;
                }

                var answer = _.find(viewModel.answers(), function(item) {
                    return item.id() == answerId;
                });

                if (!_.isNullOrUndefined(answer)) {
                    answer.text(text);
                }
            }

            function correctnessUpdatedByCollaborator(question, answerId, isCorrect) {
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
                    answer.isCorrect(isCorrect);
                }
            }

            function removeAnswer(answer) {
                eventTracker.publish(events.deleteAnswerOption);

                return clearSelection().then(function () {
                    performActionWhenAnswerIdIsSet(answer, function () {
                        viewModel.answers.remove(answer);
                        repository.removeAnswer(questionId, ko.unwrap(answer.id)).then(function () {
                            showNotification();
                        });
                    });
                });
            }

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

            function showNotification() {
                notify.saved();
            }

        };

        return answers;

    });
