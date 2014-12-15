(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Statement', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function Statement(id, title, options) {
            var that = this;
            Question.call(that, id, title);

            that.options = options;
            that.answer = function (statements) {
                var correct = 0;

                statements.forEach(function (statement) {
                    if (_.find(that.options, function (option) {
                        return option.text === statement.text && option.isCorrect === statement.state;
                    })) {
                        correct++;
                    }
                });

                that.score = (correct === that.options.length) ? 100 : 0;
            };
        };
    }

}());