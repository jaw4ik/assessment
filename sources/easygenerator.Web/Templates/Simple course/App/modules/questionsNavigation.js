define(['repositories/objectiveRepository'], function (objectiveRepository) {
    function getNavigationContext(objectiveId, questionId, questionUrlBuilder) {
        var objective = objectiveRepository.get(objectiveId);

        if (objective && objective.questions) {
            var currentItemIndex = _getItemIndexById(objective.questions(), questionId);
            if (currentItemIndex > -1) {
                return {
                    previousQuestionUrl: _getQuestionUrl(objective, objective.questions()[currentItemIndex - 1], questionUrlBuilder),
                    nextQuestionUrl: _getQuestionUrl(objective, objective.questions()[currentItemIndex + 1], questionUrlBuilder),
                    questionsCount : objective.questions().length,
                    currentQuestionIndex : currentItemIndex + 1
                };
            }
        }
    }

    function _getItemIndexById(collection, itemId) {
        for (var i = 0, count = collection.length; i < count; i++) {
            if (collection[i].id === itemId) {
                return i;
            }
        }
        return -1;
    }

    function _getQuestionUrl(objective, question, questionUrlBuilder) {
        if (objective && question) {
            return questionUrlBuilder(objective.id, question.id);
        }
        return undefined;
    }

    return {
        getNavigationContext: getNavigationContext
    };
});