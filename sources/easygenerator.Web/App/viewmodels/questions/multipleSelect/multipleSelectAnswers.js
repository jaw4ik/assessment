define(['repositories/answerRepository', 'localization/localizationManager', 'eventTracker', 'viewmodels/questions/answers'],
    function (repository, localizationManager, eventTracker, vmAnswers) {

        var events = {
            toggleAnswerCorrectness: 'Change answer option correctness'
        };

        var viewModel = function (questionId, answers) {

            var answersViewModel = vmAnswers(questionId, answers);

            answersViewModel.toggleCorrectness = function (answer) {
                eventTracker.publish(events.toggleAnswerCorrectness);
                var isCorrect = !answer.isCorrect();

                answer.isCorrect(isCorrect);
            };

            return answersViewModel;

        };

        return viewModel;
    });
