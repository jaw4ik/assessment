(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('OpenQuestion', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function OpenQuestion(objectiveId, id, title, hasContent, learningContents, type) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, objectiveId, id, title, hasContent, learningContents, type, _protected);

            function answer(answers) {
                that.score = answers ? 100 : 0;
            }
        };

    }
}());