(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('Objective', factory);

    function factory() {
        return function Objective(id, title, questions) {
            var that = this;

            that.id = id;
            that.title = title;
            that.questions = questions || [];

            that.getResult = function () {
                var result = _.reduce(that.questions, function (memo, question) {
                    return memo + question.score;
                }, 0);
                var questionsLength = that.questions.length;
                return questionsLength === 0 ? 0 : Math.floor(result / questionsLength);
            };
        };
    }

}());