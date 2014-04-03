define(['eventManager', 'guard', 'eventDataBuilders/questionEventDataBuilder'], function (eventManager, guard, eventDataBuilder) {

    var model = function (spec) {
        return {
            id: spec.id,
            objectiveId: spec.objectiveId,
            title: spec.title,
            hasContent: spec.hasContent,
            score: ko.observable(spec.score),
            answers: spec.answers,
            learningContents: spec.learningContents,
            isAnswered: false,
            isCorrectAnswered: false,
            submitAnswer: submitAnswer,
            learningContentExperienced: learningContentExperienced
        };
    };

    var submitAnswer = function (checkedAnswerIds) {
        guard.throwIfNotArray(checkedAnswerIds, 'Checked answer ids is not an array');

        _.each(this.answers, function (answer) {
            answer.isChecked = _.contains(checkedAnswerIds, answer.id);
        });

        this.score(calculateScore(this.answers));
        this.isAnswered = true;
        this.isCorrectAnswered = this.score() == 100;

        eventManager.answersSubmitted(
            eventDataBuilder.buildAnswersSubmittedEventData(this)
        );
    };

    var learningContentExperienced = function (spentTime) {
        eventManager.learningContentExperienced(
            eventDataBuilder.buildLearningContentExperiencedEventData(this, spentTime)
        );
    };

    var calculateScore = function (answers) {
        var hasIncorrectCheckedAnswer = _.some(answers, function (answer) {
            return answer.isChecked != answer.isCorrect;
        });

        return hasIncorrectCheckedAnswer ? 0 : 100;
    };

    return model;
});