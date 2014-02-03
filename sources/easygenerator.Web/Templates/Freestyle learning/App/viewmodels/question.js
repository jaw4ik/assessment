define(['durandal/app', 'eventManager', 'context', 'plugins/router', 'models/questionResult', 'plugins/http'], function (app, eventManager, context, router, QuestionResultModel, http) {
    var viewModel = {
        objectiveId: null,
        questionId: null,
        title: '',
        content: null,
        answers: [],
        learningContents: [],

        backToObjectives: backToObjectives,
        submit: submit,
        checkItem: checkItem,
        activate: activate
    };

    return viewModel;

    function backToObjectives() {
        router.navigate('objectives');
    }

    function activate(objectiveId, questionId) {
        return Q.fcall(function () {
            var objective = null,
                question = null;

            objective = _.find(context.objectives, function (item) {
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
        });
    }

    function checkItem(item) {
        item.isChecked(!item.isChecked());
    }

    function submit() {
        var objectiveId = viewModel.objectiveId,
            questionId = viewModel.questionId,
            objective,
            question,
            result = 0;

        if (viewModel.answers.length > 0) {
            _.each(viewModel.answers, function (answer) {
                if ((answer.isChecked() && answer.isCorrect) || (!answer.isChecked() && !answer.isCorrect)) {
                    result++;
                }
            });
            result = (result / viewModel.answers.length) * 100;
        }

        objective = _.find(context.objectives, function (item) {
            return item.id == objectiveId;
        });

        question = _.find(objective.questions, function (item) {
            return item.id == questionId;
        });

        question.score = result;

        eventManager.answersSubmitted({
            question: new QuestionResultModel({
                id: question.id,
                title: question.title,
                answers: _.map(viewModel.aswers, function (item) {
                    return {
                        id: item.id,
                        isCorrect: item.isCorrect,
                        isChecked: item.isChecked
                    };
                }),
                score: question.score,
                objectiveId: objective.id,
                objectiveTitle: objective.title
            })
        });
        
        router.navigate('objective/' + viewModel.objectiveId + '/question/' + viewModel.questionId + '/feedback');
    }

});