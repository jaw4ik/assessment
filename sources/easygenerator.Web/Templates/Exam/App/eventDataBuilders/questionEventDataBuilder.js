define(['guard', 'repositories/objectiveRepository'], function (guard, objectiveRepository) {

    var buildLearningContentExperiencedEventData = function (question, spentTime) {
        guard.throwIfNotAnObject(question, 'Question is not an object');
        guard.throwIfNotNumber(spentTime, 'SpentTime is not a number');

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

    return {
        buildLearningContentExperiencedEventData: buildLearningContentExperiencedEventData
    };
});