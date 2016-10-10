(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('MultipleSelectText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function MultipleSelectText(sectionId, id, title, hasContent, learningContents, type, options, isSurvey) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, sectionId, id, title, hasContent, learningContents, type, _protected, isSurvey);

            that.options = options;

            function answer(answers) {
                that.score = 100;
                that.options.forEach(function (option) {
                    if (_.contains(answers, option.id) !== option.isCorrect) {
                        that.score = 0;
                    }
                });
            }
        };
    }

}());