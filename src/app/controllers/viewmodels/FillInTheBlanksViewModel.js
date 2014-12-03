(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('FillInTheBlanksViewModel', ['QuestionViewModel', function (QuestionViewModel) {

            return function FillInTheBlanksViewModel(question) {
                QuestionViewModel.call(this, question);

                var that = this;
                that.getType = function () {
                    return 'fillInTheBlanks';
                };


                that.answers = question.answers.map(function (option) {
                    return {
                        groupId: option.groupId,
                        text: ''
                    };
                });

                that.submit = function () {
                    question.answer(that.answers);
                };
            };

        }]);

}());