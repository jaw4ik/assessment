define(['guard', 'repositories/objectiveRepository'], function (guard, objectiveRepository) {

    var buildAnswersSubmittedEventData = function (question) {
        guard.throwIfNotAnObject(question, 'Question is not an object');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            question: {
                id: question.id,
                title: question.title,
                answers: _.map(question.answers, function (item) {
                    return {
                        id: item.id,
                        text: item.text
                    };
                }),
                score: question.score,
                selectedAnswersIds: getItemsIds(question.answers, function (item) {
                    return item.isChecked;
                }),
                correctAnswersIds: getItemsIds(question.answers, function (item) {
                    return item.isCorrect;
                })
            },
            objective: {
                id: objective.id,
                title: objective.title
            }
        };
    };

    var buildLearningContentExperiencedEventData = function (question, spentTime) {
        guard.throwIfNotAnObject(question, 'Question is not an object');
        guard.throwIfNotAnObject(spentTime, 'SpentTime is not and object');

        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            objective: {
                id: objective.id,
                title: objective.title
            },
            question: {
                id: question.id,
                title: question.title
            },
            spentTime: spentTime
        };
    };

    var getItemsIds = function (items, filter) {
        return _.chain(items)
           .filter(function (item) {
               return filter(item);
           })
           .map(function (item) {
               return item.id;
           }).value();
    };

    return {
        buildAnswersSubmittedEventData: buildAnswersSubmittedEventData,
        buildLearningContentExperiencedEventData: buildLearningContentExperiencedEventData
    };
});