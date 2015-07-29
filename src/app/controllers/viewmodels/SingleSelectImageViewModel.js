(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('SingleSelectImageViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {
        return function SingleSelectImageViewModel(question) {

            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'singleSelectImage';
            };

            that.answers = question.options.map(function (option) {
                return {
                    id: option.id,
                    image: option.image,
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