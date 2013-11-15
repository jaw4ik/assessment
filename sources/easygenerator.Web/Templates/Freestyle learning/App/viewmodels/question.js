define(['durandal/app', 'eventManager', 'context', 'plugins/router', 'models/questionResult'], function (app, eventManager, context, router, QuestionResultModel) {
    var
        objective = null,
        question = null,

        title = '',
        answers = [],

        submit = function () {
            var result = 0;

            if (this.answers.length > 0) {
                _.each(this.answers, function (answer) {
                    if ((answer.isChecked() && answer.isCorrect) || (!answer.isChecked() && !answer.isCorrect)) {
                        result++;
                    }
                });
                result = (result / this.answers.length) * 100;
            }

            question.score = result;

            app.trigger(eventManager.events.questionSubmitted, {
                question: new QuestionResultModel({
                    id: question.id,
                    title: question.title,
                    answers: this.answers,
                    score: question.score,
                    objectiveId: objective.id,
                    objectiveTitle: objective.title
                })
            });

            showFeedback();
        },

        backToObjectives = function () {
            router.navigate('');
        },
        showLearningContents = function () {
            router.navigate('objective/' + objective.id + '/question/' + question.id + '/learningContents');
        },
        showFeedback = function () {
            router.navigate('objective/' + objective.id + '/question/' + question.id + '/feedback');
        },

        activate = function (objectiveId, questionId) {
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

            this.title = question.title;
            this.answers = _.map(question.answers, function (answer) {
                return {
                    id: answer.id,
                    text: answer.text,
                    isCorrect: answer.isCorrect,
                    isChecked: ko.observable(false),
                    toggleCheck: function () {
                        this.isChecked(!this.isChecked());
                    }
                };
            });
        };

    return {
        activate: activate,

        title: title,
        answers: answers,

        submit: submit,

        backToObjectives: backToObjectives,
        showLearningContents: showLearningContents
    };
});