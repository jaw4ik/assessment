(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Quiz', factory);

    function factory() {
        return function Quiz(title, questions, introductionContent) {
            var that = this;

            that.title = title;
            that.questions = questions || [];
            that.introductionContent = introductionContent || null;

            that.getResult = function () {
                var correct = 0;
                that.questions.forEach(function (question) {
                    correct += question.score;
                });
                return correct / that.questions.length;
            };

        };
    }

}());