define(['eventManager', 'plugins/router', 'repositories/questionRepository'],
    function (eventManager, router, repository) {
        var viewModel = {
            objectiveId: null,
            questionId: null,
            title: '',
            content: null,
            answers: [],
            learningContents: [],
            isAnswered: ko.observable(false),
            isCorrect: ko.observable(false),
            startTime: null,

            backToObjectives: backToObjectives,
            submit: submit,
            checkItem: checkItem,
            tryAnswerAgain: tryAnswerAgain,
            navigateNext: navigateNext,
            activate: activate,
            deactivate: deactivate
        };

        viewModel.isCorrectAnswered = ko.computed(function () {
            return viewModel.isAnswered() && viewModel.isCorrect();
        });

        viewModel.isWrongAnswered = ko.computed(function () {
            return viewModel.isAnswered() && !viewModel.isCorrect();
        });

        return viewModel;

        function backToObjectives() {
            router.navigate('objectives');
        }

        function activate(objectiveId, questionId) {
            return Q.fcall(function () {
                var question = repository.get(objectiveId, questionId);
                if (question == null) {
                    router.navigate('404');
                    return;
                }

                viewModel.objectiveId = objectiveId;
                viewModel.questionId = questionId;
                viewModel.title = question.title;
                viewModel.content = question.hasContent ? 'content/' + objectiveId + '/' + question.id + '/content' : '';
                viewModel.answers = _.map(question.answers, function (answer) {
                    return {
                        id: answer.id,
                        text: answer.text,
                        isChecked: ko.observable(answer.isChecked)
                    };
                });
                viewModel.learningContents = _.map(question.learningContents, function (item) {
                    return { view: 'content/' + objectiveId + '/' + question.id + '/' + item.id };
                });
                viewModel.isAnswered(question.isAnswered);
                viewModel.isCorrect(question.isCorrectAnswered);
                viewModel.startTime = new Date();
            });
        }

        function checkItem(item) {
            if (viewModel.isAnswered())
                return;

            item.isChecked(!item.isChecked());
        }

        function submit() {
            var question = repository.get(viewModel.objectiveId, viewModel.questionId);

            question.submitAnswer(
                _.chain(viewModel.answers)
                .filter(function (item) {
                    return item.isChecked();
                })
                .map(function (item) {
                    return item.id;
                }).value());

            viewModel.isAnswered(question.isAnswered);
            viewModel.isCorrect(question.isCorrectAnswered);
        }

        function tryAnswerAgain() {
            viewModel.isAnswered(false);
            _.each(viewModel.answers, function (answer) {
                answer.isChecked(false);
            });
        }

        function navigateNext() {
            router.navigate('objectives');
        }

        function deactivate() {
            var question = repository.get(viewModel.objectiveId, viewModel.questionId);
            question.learningContentExperienced(new Date() - viewModel.startTime);
        }
    }
);