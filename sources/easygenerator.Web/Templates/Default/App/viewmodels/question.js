define(['context', 'durandal/plugins/router'], function (context, router) {
    var
        objective = null,
        question = null,

        title = '',
        answers = [],

        submit = function () {
            var result = 0;
            _.each(this.answers, function (answer) {
                if ((answer.isChecked() && answer.isCorrect) || (!answer.isChecked() && !answer.isCorrect)) {
                    result++;
                }
            });
            this.question.score = Math.round((result / this.answers.length) * 100);

            this.showExplanations();
        },

        backToObjectives = function () {
            router.navigateTo('#/');
        },
        showExplanations = function () {
            router.navigateTo('#/');
        },

        activate = function (routeData) {
            this.objective = _.find(context.objectives, function (item) {
                return item.id == routeData.objectiveId;
            });

            this.question = _.find(this.objective.questions, function (item) {
                return item.id == routeData.questionId;
            });

            this.title = this.question.title;
            this.answers = _.map(this.question.answers, function (answer) {
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
        showExplanations: showExplanations
    };
});