define(['durandal/app', 'eventManager', 'context', 'plugins/router', 'models/questionResult', 'plugins/http'], function (app, eventManager, context, router, QuestionResultModel, http) {
    var
        objective = null,
        question = null,

        title = '',
        answers = [],
        content = null,

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

            eventManager.answersSubmitted({
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
            router.navigate('objectives');
        },
        showLearningContents = function () {
            router.navigate('objective/' + objective.id + '/question/' + question.id + '/learningContents');
        },
        showFeedback = function () {
            router.navigate('objective/' + objective.id + '/question/' + question.id + '/feedback');
        },

        activate = function (objectiveId, questionId) {
            var that = this;

            return Q.fcall(function () {
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

                that.title = question.title;
                that.answers = _.map(question.answers, function (answer) {
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

                if (!question.hasContent) {
                    that.content = '';
                    return;
                }

                return http.get('content/' + objective.id + '/' + question.id + '/content.html').then(function (response) {
                    that.content = response;
                }).fail(function () {
                    that.content = '';
                });
            });
        };

    return {
        activate: activate,

        title: title,
        answers: answers,
        content: content,

        submit: submit,

        backToObjectives: backToObjectives,
        showLearningContents: showLearningContents
    };
});