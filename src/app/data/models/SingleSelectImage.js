(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectImage', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function SingleSelectImage(id, title, answers, correctAnswerId) {
            var that = this;
            Question.call(that, id, title);
            that.correctAnswerId = correctAnswerId;
            that.options = answers;
            that.answer = function (selectedOptionId) {
                that.score = selectedOptionId === that.correctAnswerId ? 100 : 0;
            };
        };
    }

}());