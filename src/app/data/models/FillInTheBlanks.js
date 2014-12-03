(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('FillInTheBlanks', ['Question', function (Question) {

            return function FillInTheBlanks(id, title, answers) {
                var that = this;
                Question.call(that, id, title);

                that.answers = answers;

                that.answer = function (userAnswers) {
                    var correct = 0;
                    _.each(that.answers, function (answer) {
                        if (_.find(userAnswers, function (userAnswer) {
                            return answer.groupId == userAnswer.groupId && answer.text == userAnswer.text;
                        })) {
                            correct++;
                        }
                    });                    
                    that.score = correct == that.answers.length ? 100 : 0;
                };
            };

        }]);

}());