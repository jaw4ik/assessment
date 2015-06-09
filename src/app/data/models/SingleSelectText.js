(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function SingleSelectText(objectiveId, id, title, hasContent, learningContents, type, options) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, objectiveId, id, title, hasContent, learningContents, type, _protected);

            that.options = options;

            function answer(text) {
                that.score = 0;
                that.options.forEach(function (option) {
                    if (option.text === text && option.isCorrect) {
                        that.score = 100;
                    }
                });
            }
        };

    }

}());