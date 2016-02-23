(function (angular, _) {
    'use strict';

    angular
        .module('assessment')
        .factory('RankingText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function RankingText(objectiveId, id, title, hasContent, learningContents, type, answers) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, objectiveId, id, title, hasContent, learningContents, type, _protected);

            that.answers = _.shuffle(answers);
            that.correctOrderAnswers = answers;

            function answer(_answers) {
                that.score = 100;
                that.correctOrderAnswers.forEach(function (answer, index) {
                    if (answer.text !== _answers[index].text) {
                        that.score = 0;
                    }
                });
            }
        };

    }

}(window.angular, window._));