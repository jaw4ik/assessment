(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectTextViewModel', factory);

    factory.$inject = ['QuestionViewModel', 'settings'];

    function factory(QuestionViewModel, settings) {
        return function SingleSelectTextViewModel(question) {

            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'singleSelectText';
            };

            that.answers = question.options.map(function (option) {
                return {
                    text: option.text,
                    checked: false
                };
            });

            if (settings.answers.randomize) {
                that.answers = _.shuffle(that.answers);
            }

            that.checkAnswer = function (answer) {
                that.answers.forEach(function (item) {
                    item.checked = false;
                });
                answer.checked = true;
            };

            that.submitAnswer = function () {
                var item = _.find(that.answers, function (answer) {
                    return answer.checked;
                });
                question.answer(item ? item.text : null);
            };
        };
    }

}());