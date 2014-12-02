(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectImageViewModel', ['QuestionViewModel', function (QuestionViewModel) {

            return function SingleSelectImageViewModel(question) {
                var that = this;

                QuestionViewModel.call(that, question);

                that.submit = function () {

                };

            };

        }]);

}());