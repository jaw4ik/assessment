(function (angular) {
    'use strict';

    angular
        .module('assessment')
        .factory('RankingTextViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {        
        return function RankingTextViewModel(question) {

            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'rankingText';
            };

            that.answers = question.answers.map(function (answer) {
                return {
                    text: answer.text
                };
            });

            that.submitAnswer = function () {
                question.answer(that.answers);
            };
        };
    }

}(window.angular));