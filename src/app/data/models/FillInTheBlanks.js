(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('FillInTheBlanks', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function FillInTheBlanks(objectiveId, id, title, hasContent, learningContents, type, groups) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, objectiveId, id, title, hasContent, learningContents, type, _protected);

            that.groups = groups;

            function answer(answers) {
                var correct = 0;
                _.each(that.groups, function (group) {
                    if (_.find(group.answers, function (answer) {
                        return answer.isCorrect &&
                            (answer.matchCase ? answers[group.id] === answer.text : answers[group.id].toLowerCase() === answer.text.toLowerCase());
                    })) {
                        correct++;
                    }
                });

                that.score = correct === that.groups.length ? 100 : 0;
            }
        };

    }
}());