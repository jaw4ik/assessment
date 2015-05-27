(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('OpenQuestionViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {
        return function OpenQuestionViewModel(question) {
            QuestionViewModel.call(this, question);

            var that = this;

            that.getType = function () {
                return 'openQuestion';
            };

            that.answeredText = '';

            that.submitAnswer = function () {
                question.answer(that.answeredText);
            };
        };
    }

}());