(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('SingleSelectTextViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {
        return function SingleSelectTextViewModel(question) {

            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'singleSelectText';
            };

            that.answers = question.options.map(function (option) {
                return {
                    id: option.id,
                    text: option.text,
                    checked: false
                };
            });

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
                question.answer(item ? item.id : null);
            };
        };
    }

}());