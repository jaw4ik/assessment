define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app', 'viewmodels/questions/answers'],
    function (repository, localizationManager, notify, constants, eventTracker, app, answersViewModel) {

        var events = {
            addAnswerOption: 'Add answer option',
            deleteAnswerOption: 'Delete answer option',
            toggleAnswerCorrectness: 'Change answer option correctness',
        };

        var multipleselectAnswers = function (questionId, answers) {

            var viewModel = answersViewModel(questionId, answers);

            viewModel.addAnswer = function () {
                eventTracker.publish(events.addAnswerOption);
                var answer = doAddAnswer();
                return viewModel.selectAnswer(answer);
            };

            viewModel.removeAnswer = function(answer) {
                eventTracker.publish(events.deleteAnswerOption);

                return viewModel.clearSelection().then(function () {
                    performActionWhenAnswerIdIsSet(answer, function () {
                        viewModel.answers.remove(answer);
                        repository.removeAnswer(questionId, ko.unwrap(answer.id)).then(function () {
                            showNotification();
                        });
                    });
                });
            };

            viewModel.updateAnswer = function(answer) {
                var id = ko.unwrap(answer.id);
                var text = ko.unwrap(answer.text);
                var correctness = ko.unwrap(answer.isCorrect);

                return Q.fcall(function() {
                    if (answer.isDeleted()) {
                        viewModel.answers(_.reject(viewModel.answers(), function(item) {
                            return item.id() == answer.id();
                        }));

                        return;
                    }

                    if (_.isEmptyOrWhitespace(text)) {
                        viewModel.answers.remove(answer);
                        if (!_.isEmptyOrWhitespace(id)) {
                            repository.removeAnswer(questionId, id).then(function(response) {
                                showNotification();
                            });
                        }
                        return;
                    }

                    if (_.isEmptyOrWhitespace(id)) {
                        repository.addAnswer(questionId, { text: text, isCorrect: correctness }).then(function(item) {
                            showNotification();
                            answer.id(item.id);
                            answer.original.text = text;
                            answer.original.correctness = correctness;
                        });
                    } else {
                        if (answer.original.text != text || answer.original.correctness != answer.isCorrect()) {
                            repository.updateAnswer(questionId, id, text, answer.isCorrect()).then(function (response) {
                                showNotification();
                                answer.original.text = text;
                                answer.original.correctness = answer.isCorrect();
                            });
                        }
                    }
                });
            };

            viewModel.toggleCorrectness = function(answer) {
                eventTracker.publish(events.toggleAnswerCorrectness);
                var isCorrect = !answer.isCorrect();

                answer.isCorrect(isCorrect);
            };

            viewModel.selectAnswer = function (newAnswer) {
                return Q.fcall(function () {
                    var oldAnswer = viewModel.selectedAnswer();
                    if (oldAnswer == newAnswer)
                        return;

                    viewModel.selectedAnswer(newAnswer);
                    if (oldAnswer != null) {
                        viewModel.updateAnswer(oldAnswer);
                    }
                });
            };

            viewModel.deletedByCollaborator = deletedByCollaborator;

            viewModel.clearSelection = function () {
                return viewModel.selectAnswer(null);
            };

            viewModel.multipleselectAnswerCorrectnessUpdatedByCollaborator = multipleselectAnswerCorrectnessUpdatedByCollaborator;

            app.on(constants.messages.question.answer.deletedByCollaborator, deletedByCollaborator);
            app.on(constants.messages.question.answer.multipleselectAnswerCorrectnessUpdatedByCollaborator, multipleselectAnswerCorrectnessUpdatedByCollaborator);

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

            function multipleselectAnswerCorrectnessUpdatedByCollaborator(question, answerId, isCorrect) {
                if (questionId != question.id)
                    return;

                var selectedAnswer = viewModel.selectedAnswer();
                if (!_.isNullOrUndefined(selectedAnswer) && selectedAnswer.id() == answerId) {
                    selectedAnswer.original.correctness = isCorrect;
                    return;
                }

                var answer = _.find(viewModel.answers(), function (item) {
                    return item.id() == answerId;
                });

                if (!_.isNullOrUndefined(answer)) {
                    answer.original.correctness = isCorrect;
                    answer.isCorrect(isCorrect);
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

        return multipleselectAnswers;

    });
