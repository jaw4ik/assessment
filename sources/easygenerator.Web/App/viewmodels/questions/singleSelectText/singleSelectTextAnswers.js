define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app', 'viewmodels/questions/answers'],
    function (repository, localizationManager, notify, constants, eventTracker, app, answersViewModel) {

        var events = {
            addAnswerOption: 'Add answer option',
            deleteAnswerOption: 'Delete answer option',
            toggleAnswerCorrectness: 'Change answer option correctness',
        };

        var minLengthOfAnswerOptions = 2;

        var singleSelectTextAnswers = function (questionId, answers) {

            var viewModel = answersViewModel(questionId, answers);

            viewModel.showDeleteButton = ko.computed(function () {
                var answersCollection = _.filter(viewModel.answers(), function (item) {
                    return !_.isEmptyOrWhitespace(item.id());
                });
                var length = answersCollection.length;
                return length > minLengthOfAnswerOptions;
            });

            viewModel.addAnswer = function () {
                var emptyAnswer = _.find(viewModel.answers(), function (item) {
                    return _.isEmptyOrWhitespace(item.text());
                });
                if (!_.isNullOrUndefined(emptyAnswer) && viewModel.answers().length == minLengthOfAnswerOptions) {
                    emptyAnswer.text(emptyAnswer.original.text);
                }
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
                            if (answer.isCorrect()) {
                                setFirstAnswerCorrectness();
                                answer.isCorrect(false);
                            }
                            showNotification();
                        });
                });
            };

            viewModel.updateText = function (answer) {
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
                        if (viewModel.answers().length == minLengthOfAnswerOptions) {
                            answer.text(answer.original.text);
                            return;
                        }
                        viewModel.answers.remove(answer);
                        if (!_.isEmptyOrWhitespace(id)) {
                            repository.removeAnswer(questionId, id).then(function () {
                                if (answer.isCorrect()) {
                                    setFirstAnswerCorrectness();
                                }
                                showNotification();
                            });
                        } else {
                            if (answer.isCorrect()) {
                                setPreviousCorrectAnswer();
                            }
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
                        if (answer.original.text != text) {
                            repository.updateText(questionId, id, text).then(function (response) {
                                showNotification();
                                answer.original.text = text;
                            });
                        }
                    }
                });
            };

            viewModel.toggleCorrectness = function (answer) {
                var currentCorrectAnswer = _.find(viewModel.answers(), function (answerOption) {
                    return answerOption.isCorrect();
                });

                if (currentCorrectAnswer == answer) {
                    return;
                }

                eventTracker.publish(events.toggleAnswerCorrectness);
                if (!_.isNullOrUndefined(currentCorrectAnswer)) {
                    currentCorrectAnswer.isCorrect(false);
                }
                var isCorrect = !answer.isCorrect();

                answer.isCorrect(isCorrect);

                return Q.fcall(function () {
                    if (_.isEmptyOrWhitespace(answer.id())) {
                        performActionWhenAnswerIdIsSet(answer, function () {
                            repository.singleSelectTextChangeCorrectAnswer(questionId, answer.id()).then(function () {
                                currentCorrectAnswer.original.correctness = false;
                                answer.original.correctness = true;
                                showNotification();
                            });
                        });
                    } else {
                        repository.singleSelectTextChangeCorrectAnswer(questionId, answer.id()).then(function () {
                            currentCorrectAnswer.original.correctness = false;
                            answer.original.correctness = true;
                            showNotification();
                        });
                    }
                });
            };

            viewModel.singleSelectTextDeleteByCollaborator = singleSelectTextDeleteByCollaborator;

            viewModel.answerCorrectnessUpdatedByCollaborator = answerCorrectnessUpdatedByCollaborator;

            app.on(constants.messages.question.answer.answerCorrectnessUpdatedByCollaborator, answerCorrectnessUpdatedByCollaborator);
            app.on(constants.messages.question.answer.singleSelectTextDeleteByCollaborator, singleSelectTextDeleteByCollaborator);

            return viewModel;

            function singleSelectTextDeleteByCollaborator(question, answerId) {
                if (questionId != question.id)
                    return;

                var answerForRemove = _.find(viewModel.answers(), function (item) {
                    return item.id() == answerId;
                });
                if (_.isNullOrUndefined(answerForRemove))
                    return;

                if (answerForRemove.isCorrect()) {
                    answerForRemove.isCorrect(false);
                    setFirstAnswerCorrectness();
                }

                if (answerForRemove.hasFocus()) {
                    answerForRemove.isDeleted(true);
                    notify.error(localizationManager.localize('answerOptionHasBeenDeletedByCollaborator'));
                } else {
                    viewModel.answers.remove(answerForRemove);
                }
            }

            function answerCorrectnessUpdatedByCollaborator(question, answerId, isCorrect) {
                if (questionId != question.id)
                    return;

                var currentCorrectAnswer = _.find(viewModel.answers(), function (answerOption) {
                    return answerOption.isCorrect();
                });

                var answer = _.find(viewModel.answers(), function (item) {
                    return item.id() == answerId;
                });

                if (!_.isNullOrUndefined(answer) && currentCorrectAnswer != answer) {
                    answer.isCorrect(isCorrect);
                    answer.original.correctness = isCorrect;
                    currentCorrectAnswer.isCorrect(!isCorrect);
                    currentCorrectAnswer.original.correctness = !isCorrect;
                }
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

            function showNotification() {
                notify.saved();
            }

            function setFirstAnswerCorrectness() {
                var firstAnswer = _.chain(viewModel.answers()).filter(function (answer) {
                    return !answer.isDeleted();
                }).first().value();
                if (!_.isNullOrUndefined(firstAnswer)) {
                    firstAnswer.isCorrect(true);
                    firstAnswer.original.correctness = true;
                }
            }

            function setPreviousCorrectAnswer() {
                var prevCorrectAnswer = _.find(viewModel.answers(), function (item) {
                    return item.original.correctness;
                });
                prevCorrectAnswer.isCorrect(true);
            }
        };

        return singleSelectTextAnswers;

    });