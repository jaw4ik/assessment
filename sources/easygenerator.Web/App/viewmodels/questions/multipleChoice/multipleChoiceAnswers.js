define(['repositories/answerRepository', 'localization/localizationManager', 'notify', 'eventTracker', 'viewmodels/questions/answers'],
    function (repository, localizationManager, notify, eventTracker, vmAnswers) {

        var events = {
            toggleAnswerCorrectness: 'Change answer option correctness'
        };

        var viewModel = function (questionId, answers) {

            var answersViewModel = vmAnswers(questionId, answers);

            answersViewModel.toggleCorrectness = function (answer) {
                    eventTracker.publish(events.toggleAnswerCorrectness);
                    var currentCorrectAnswer = _.find(answersViewModel.answers(), function (answerOption) {
                        return answerOption.isCorrect();
                    });
                    if (!_.isNullOrUndefined(currentCorrectAnswer) && currentCorrectAnswer != answer) {
                        currentCorrectAnswer.isCorrect(false);
                        repository.updateCorrectness(questionId, currentCorrectAnswer.id(), false).then(function () {
                            notify.saved();
                        });
                    }
                    var isCorrect = !answer.isCorrect();

                    answer.isCorrect(isCorrect);
                };

            return answersViewModel;
        };

        return viewModel;
    });
