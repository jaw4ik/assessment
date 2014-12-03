(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('FillInTheBlanks', ['Question', function (Question) {

            return function FillInTheBlanks(id, title, answers) {
                var that = this;
                Question.call(that, id, title);

                that.answers = answers;

                that.answer = function (text) {
                    debugger;
                };
            };

        }]);

}());