(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Quiz', function () {

            return function Quiz(title, questions) {
                var that = this;

                that.title = title;
                that.questions = questions || [];

                that.getResult = function () {
                    var correct = 0;
                    that.questions.forEach(function (question) {
                        correct += question.score;
                    });
                    return correct / that.questions.length;
                };

            };

        });

}());