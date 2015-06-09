(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('MultipleSelectText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function MultipleSelectText(objectiveId, id, title, hasContent, learningContents, type, options) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, objectiveId, id, title, hasContent, learningContents, type, _protected);

            that.options = options;

            function answer(answers) {
                that.score = 100;
                that.options.forEach(function (option) {
                    if (_.contains(answers, option.text) !== option.isCorrect) {
                        that.score = 0;
                    }
                });
            }
        };
    }

}());