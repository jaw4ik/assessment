define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker'],
    function (repository, localizationManager, notify, constants, eventTracker) {

        var events = {
            addAnswerOption: 'Add answer option',
            deleteAnswerOption: 'Delete answer option',
            toggleAnswerCorrectness: 'Change answer option correctness',
            beginEditText: 'Start editing answer option',
            endEditText: 'End editing answer option',
        };

        var viewModel = function (questionId, answers) {

            var
                answerOptions = ko.observableArray([]),
                addAnswer = function () {
                    eventTracker.publish(events.addAnswerOption);
                    doAddAnswer();
                },

                removeAnswer = function (answer) {
                    eventTracker.publish(events.deleteAnswerOption);

                    performActionWhenAnswerIdIsSet(answer, function () {
                        answerOptions.remove(answer);
                        repository.removeAnswer(questionId, ko.unwrap(answer.id)).then(function (response) {
                            showNotification(response.modifiedOn);
                        });
                    });
                },

                beginEditText = function (answer) {
                    eventTracker.publish(events.beginEditText);
                    answer.hasFocus(true);
                },

                updateText = function (answer) {
                    var text = ko.unwrap(answer.text);

                    if (_.isEmptyOrWhitespace(text)) {
                        return;
                    }

                    if (_.isEmptyOrWhitespace(ko.unwrap(answer.id))) {
                        return repository.addAnswer(questionId, { text: text, isCorrect: false }).then(function (item) {
                            showNotification(item.createdOn);
                            answer.id(item.id);
                            answer.originalText = text;
                        });
                    } else {
                        if (answer.originalText != text) {
                            return repository.updateText(questionId, ko.unwrap(answer.id), text).then(function (response) {
                                showNotification(response.modifiedOn);
                                answer.originalText = text;
                            });
                        }
                    }
                },

                endEditText = function (answer) {
                    eventTracker.publish(events.endEditText);
                    answer.hasFocus(false);

                    var id = ko.unwrap(answer.id);
                    var text = ko.unwrap(answer.text);

                    if (_.isEmptyOrWhitespace(text)) {
                        answerOptions.remove(answer);
                        if (!_.isEmptyOrWhitespace(id)) {
                            repository.removeAnswer(questionId, id).then(function (response) {
                                showNotification(response.modifiedOn);
                            });
                        }
                    }
                },

                toggleCorrectness = function (answer) {
                    eventTracker.publish(events.toggleAnswerCorrectness);
                    var isCorrect = !answer.isCorrect();

                    performActionWhenAnswerIdIsSet(answer, function () {
                        repository.updateCorrectness(questionId, answer.id(), isCorrect).then(function (response) {
                            showNotification(response.modifiedOn);
                        });
                    });

                    answer.isCorrect(isCorrect);
                },

                isExpanded = ko.observable(true),

                toggleExpand = function () {
                    isExpanded(!isExpanded());
                }
            ;

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
                answerOptions.push({
                    id: ko.observable(answer.id),
                    text: ko.observable(answer.text),
                    originalText: answer.text,
                    isCorrect: ko.observable(answer.isCorrect),
                    hasFocus: ko.observable(true)
                });
            }

            function showNotification(date) {
                notify.info(localizationManager.localize('savedAt') + ' ' + date.toLocaleTimeString());
            }

            _.each(answers, function (item) {
                doAddAnswer(item);
            });

            return {
                answers: answerOptions,
                isExpanded: isExpanded,
                toggleExpand: toggleExpand,

                addAnswer: addAnswer,
                removeAnswer: removeAnswer,

                beginEditText: beginEditText,
                endEditText: endEditText,

                updateText: updateText,
                toggleCorrectness: toggleCorrectness,

                autosaveInterval: constants.autosaveTimersInterval.answerOption
            };

        };

        return viewModel;
    });
