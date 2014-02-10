define([],
    function () {

        var QuestionResult = function (spec) {
            return {
                id: spec.id,
                title: spec.title,
                answers: spec.answers,
                score: spec.score,

                getSelectedAnswersId: getSelectedAnswersId,
                getCorrectAnswersIds: getCorrectAnswersIds,

                objectiveId: spec.objectiveId,
                objectiveTitle: spec.objectiveTitle
            };
        };

       var getCorrectAnswersIds = function () {
            return _.chain(this.answers)
                .filter(function (item) {
                    return item.isCorrect;
                })
                .map(function (item) {
                    return item.id;
                }).value();
        };

        var getSelectedAnswersId = function () {
            return _.chain(this.answers)
                .filter(function (item) {
                    return item.isChecked;
                })
                .map(function (item) {
                    return item.id;
                }).value();
        };

        return QuestionResult;
    }
);