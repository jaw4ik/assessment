define(['context', 'guard'], function (context, guard) {

    return {
        get: get
    };

    function get(objectiveId, questionId) {
        guard.throwIfNotString(objectiveId, 'Objective id is not a string');
        guard.throwIfNotString(questionId, 'Question id is not a string');

        var objective = _.find(context.course.objectives, function (item) {
            return item.id == objectiveId;
        });

        if (!objective) {
            return null;
        }

        var question = _.find(objective.questions, function (item) {
            return item.id == questionId;
        });

        if (!question) {
            return null;
        }

        return question;
    }

})