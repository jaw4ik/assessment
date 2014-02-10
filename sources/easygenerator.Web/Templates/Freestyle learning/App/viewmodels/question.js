define(['durandal/app', 'eventManager', 'context', 'plugins/router', 'models/questionResult'],
    function (app, eventManager, context, router, QuestionResultModel) {
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
                var objective = null,
                    question = null;

                objective = _.find(context.course.objectives, function (item) {
                    return item.id == objectiveId;
                });

                if (!objective) {
                    router.navigate('404');
                    return;
                }

                question = _.find(objective.questions, function (item) {
                    return item.id == questionId;
                });

                if (!question) {
                    router.navigate('404');
                    return;
                }

                viewModel.objectiveId = objectiveId;
                viewModel.questionId = questionId;
                viewModel.title = question.title;
                viewModel.content = question.hasContent ? 'content/' + objective.id + '/' + question.id + '/content' : '';
                viewModel.answers = _.map(question.answers, function (answer) {
                    return {
                        id: answer.id,
                        text: answer.text,
                        isCorrect: answer.isCorrect,
                        isChecked: ko.observable(false)
                    };
                });
                viewModel.learningContents = _.map(question.learningContents, function (item) {
                    return { view: 'content/' + objective.id + '/' + question.id + '/' + item.id };
                });
                viewModel.isAnswered(false);
                viewModel.isCorrect(false);
                viewModel.startTime = new Date();
            });
        }

        function checkItem(item) {
            if (viewModel.isAnswered())
                return;

            item.isChecked(!item.isChecked());
        }

        function submit() {
            var objective,
                question,
                result = 0;

            viewModel.isAnswered(true);

            if (viewModel.answers.length > 0) {
                _.each(viewModel.answers, function (answer) {
                    if (answer.isChecked() == answer.isCorrect) {
                        result++;
                    }
                });
                result = (result / viewModel.answers.length) * 100;
            }

            objective = _.find(context.course.objectives, function (item) {
                return item.id == viewModel.objectiveId;
            });

            question = _.find(objective.questions, function (item) {
                return item.id == viewModel.questionId;
            });

            question.score = result;

            eventManager.answersSubmitted({
                question: new QuestionResultModel({
                    id: question.id,
                    title: question.title,
                    answers: _.map(viewModel.answers, function (item) {
                        return {
                            id: item.id,
                            text: item.text,
                            isCorrect: item.isCorrect,
                            isChecked: item.isChecked()
                        };
                    }),
                    score: question.score,
                    objectiveId: objective.id,
                    objectiveTitle: objective.title
                })
            });

            viewModel.isCorrect(question.score == 100);
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
            var endTime = new Date(),

                objective = _.find(context.course.objectives, function (item) {
                    return item.id == viewModel.objectiveId;
                }),

                question = _.find(objective.questions, function (item) {
                    return item.id == viewModel.questionId;
                });

            eventManager.learningContentExperienced({
                objective: {
                    id: objective.id,
                    title: objective.title
                },
                question: {
                    id: question.id,
                    title: question.title
                },
                spentTime: endTime - viewModel.startTime
            });
        }
    }
);