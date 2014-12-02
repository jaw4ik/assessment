(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectTextViewModel', ['QuestionViewModel', function (QuestionViewModel) {

            return function SingleSelectTextViewModel(question) {
                var that = this;

                QuestionViewModel.call(that, question);

                that.answers = question.options.map(function (option) {
                    return {
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

                that.submit = function () {
                    var item = _.find(that.answers, function (answer) {
                        return answer.checked;
                    });
                    question.answer(item ? item.text : null);
                };
            };

        }]);

}());