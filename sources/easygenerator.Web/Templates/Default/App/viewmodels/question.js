define(['context', 'durandal/plugins/router'], function (context, router) {
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
                result = Math.round((result / this.answers.length) * 100);
            }

            question.score = result;
            showFeedback();
        },

        backToObjectives = function () {
            router.navigateTo('#/');
        },
        showLearningObjects = function () {
            router.navigateTo('#/objective/' + objective.id + '/question/' + question.id + '/learningObjects');
        },
        showFeedback = function () {
            router.navigateTo('#/objective/' + objective.id + '/question/' + question.id + '/feedback');
        },

        activate = function (routeData) {
            objective = _.find(context.objectives, function (item) {
                return item.id == routeData.objectiveId;
            });

            question = _.find(objective.questions, function (item) {
                return item.id == routeData.questionId;
            });

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
        showLearningObjects: showLearningObjects
    };
});