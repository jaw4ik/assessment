(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectImageViewModel', factory);

    factory.$inject = ['QuestionViewModel', 'settings'];

    function factory(QuestionViewModel, settings) {
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
                question.answer(item ? item.id : null);
            };
        };
    }

}());