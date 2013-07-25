define(['context'], function (context) {
    var
        objectiveId = '',
        questionId = '',

        title = '',
        answers = [],
        explanations = [],

        activate = function (routeData) {
            this.objectiveId = routeData.objectiveId;
            this.questionId = routeData.questionId;

            var that = this;

            var objective = _.find(context.objectives, function(item) {
                return item.id == that.objectiveId;
            });
            
            var question = _.find(objective.questions, function (item) {
                return item.id == that.questionId;
            });

            this.title = question.title;
            this.answers = question.answers;
            this.explanations = question.explanations;
        };

    return {
        activate: activate,

        objectiveId: objectiveId,
        questionId: questionId,

        title: title,
        answers: answers,
        explanations: explanations
    };
});