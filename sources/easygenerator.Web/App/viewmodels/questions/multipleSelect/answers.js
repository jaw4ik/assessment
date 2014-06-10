define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker'],
    function (repository, localizationManager, notify, constants, eventTracker) {

        var events = {
            addAnswerOption: 'Add answer option',
            deleteAnswerOption: 'Delete answer option',
            toggleAnswerCorrectness: 'Change answer option correctness',
            beginEditText: 'Start editing answer option',
            endEditText: 'End editing answer option'
        };

        var viewModel = function (questionId, answers) {

            var
                selectedAnswer = ko.observable(null),

                selectAnswer = function (newAnswer) {
                    return Q.fcall(function () {
                        var oldAnswer = selectedAnswer();
                        if (oldAnswer == newAnswer)
                            return;

                        selectedAnswer(newAnswer);
                        if (oldAnswer != null)
                            updateAnswer(oldAnswer);
                    });
                },

                clearSelection = function () {
                    return selectAnswer(null);
                },

                answerOptions = ko.observableArray([]),

                addAnswer = function () {
                    eventTracker.publish(events.addAnswerOption);
                    var answer = doAddAnswer();
                    return selectAnswer(answer);
                },

                removeAnswer = function (answer) {
                    eventTracker.publish(events.deleteAnswerOption);

                    return clearSelection().then(function () {
                        performActionWhenAnswerIdIsSet(answer, function () {
                            answerOptions.remove(answer);
                            repository.removeAnswer(questionId, ko.unwrap(answer.id)).then(function (response) {
                                showNotification();
                            });
                        });
                    });
                },

                beginEditText = function (answer) {
                    eventTracker.publish(events.beginEditText);
                    answer.hasFocus(true);
                },

                updateAnswer = function (answer) {

                    var id = ko.unwrap(answer.id);
                    var text = ko.unwrap(answer.text);
                    var correctness = ko.unwrap(answer.isCorrect);

                    return Q.fcall(function () {
                        if (_.isEmptyOrWhitespace(text)) {
                            answerOptions.remove(answer);
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
                },

                endEditText = function (answer) {
                    eventTracker.publish(events.endEditText);
                    answer.hasFocus(false);
                },

                toggleCorrectness = function (answer) {
                    eventTracker.publish(events.toggleAnswerCorrectness);
                    var isCorrect = !answer.isCorrect();

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

                var item = {
                    id: ko.observable(answer.id),
                    text: ko.observable(answer.text),
                    original: { text: answer.text, correctness: answer.isCorrect },
                    isCorrect: ko.observable(answer.isCorrect),
                    hasFocus: ko.observable(true)
                };

                answerOptions.push(item);
                return item;
            }

            function showNotification() {
                notify.saved();
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
                updateAnswer: updateAnswer,
                selectAnswer: selectAnswer,

                selectedAnswer: selectedAnswer,
                clearSelection: clearSelection,

                beginEditText: beginEditText,
                endEditText: endEditText,
                toggleCorrectness: toggleCorrectness,

                autosaveInterval: constants.autosaveTimersInterval.answerOption
            };

        };

        return viewModel;
    });
