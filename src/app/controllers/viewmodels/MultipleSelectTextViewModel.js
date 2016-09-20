(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('MultipleSelectTextViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {
        return function MultipleSelectTextViewModel(question) {

            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'multipleSelectText';
            };

            that.answers = question.options.map(function (option) {
                return {
                    id: option.id,
                    text: option.text,
                    checked: false
                };
            });

            that.checkAnswer = function (answer) {
                answer.checked = !answer.checked;
            };

            that.submitAnswer = function () {
                question.answer(_.chain(that.answers)
                    .filter(function (answer) {
                        return answer.checked;
                    })
                    .map(function (answer) {
                        return answer.id;
                    }).value());
            };
        };
    }
}());