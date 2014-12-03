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

                that.submit = function () {
                    debugger;
                    question.answer();
                };
            };

        }]);

}());