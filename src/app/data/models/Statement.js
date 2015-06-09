(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Statement', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function Statement(objectiveId, id, title, hasContent, learningContents, type, options) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, objectiveId, id, title, hasContent, learningContents, type, _protected);

            that.options = options;

            function answer(statements) {
                var correct = 0;

                statements.forEach(function (statement) {
                    if (_.find(that.options, function (option) {
                        return option.text === statement.text && option.isCorrect === statement.state;
                    })) {
                        correct++;
                    }
                });

                that.score = (correct === that.options.length) ? 100 : 0;
            }
        };
    }

}());