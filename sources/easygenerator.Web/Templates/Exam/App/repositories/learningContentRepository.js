define(['context', 'guard', 'plugins/http'], function (context, guard, http) {

    return {
        getCollection: getCollection
    };

    function getCollection(objectiveId, questionId) {
        return Q.fcall(function () {

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

            var requests = [];
            var learningContents = [];
            _.each(question.learningContents, function (item, index) {
                requests.push(http.get('content/' + objectiveId + '/' + questionId + '/' + item.id + '.html')
                    .then(function (response) {
                        learningContents.push({ index: index, learningContent: response });
                    }));
            });

            return Q.allSettled(requests).then(function () {
                return learningContents;
            });
        });
    };

})