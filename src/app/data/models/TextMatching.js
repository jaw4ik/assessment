(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('TextMatching', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function TextMatching(id, title, answers) {
            var that = this;
            Question.call(that, id, title);

            that.answers = answers;
            that.answer = function (pairs) {
                var correct = 0;

                pairs.forEach(function (pair) {
                    if (_.find(that.answers, function (item) {
                        return item.key === pair.key && item.value === pair.value;
                    })) {
                        correct++;
                    }
                });

                that.score = (correct === that.answers.length) ? 100 : 0;
            };
        };
    }

}());