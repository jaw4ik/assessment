define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'constants', 'eventTracker', 'durandal/app', 'viewmodels/questions/multipleSelect/multipleSelectAnswers'],
    function (repository, localizationManager, notify, constants, eventTracker, app, answersViewModel) {

        var events = {
            addAnswerOption: 'Add statement',
            deleteAnswerOption: 'Delete statement',
            toggleAnswerCorrectness: 'Change statement correctness',
            editText: 'Edit statement'
        };

        var options = {
            minAnswersCount: 1,
            newAnswerDefaultValues: {
                isCorrect: true,
                text: ''
            }
        }

        return function (questionId, answers) {

            var viewModel = answersViewModel(questionId, answers, events, options);

            viewModel.statementCorrectnessUpdated = function () {
                eventTracker.publish(events.toggleAnswerCorrectness);
            }

            viewModel.canRemoveAnswer = ko.computed(function () {
                var answersCollection = _.filter(viewModel.answers(), function (item) {
                    return !_.isEmptyOrWhitespace(item.id());
                });

                return answersCollection.length > options.minAnswersCount;
            });

            return viewModel;
        };

    });
