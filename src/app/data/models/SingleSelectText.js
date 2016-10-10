(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('SingleSelectText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function SingleSelectText(sectionId, id, title, hasContent, learningContents, type, options, isSurvey) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, sectionId, id, title, hasContent, learningContents, type, _protected, isSurvey);

            that.options = options;

            function answer(id) {
                that.score = 0;
                that.options.forEach(function (option) {
                    if (option.id === id && option.isCorrect) {
                        that.score = 100;
                    }
                });
            }
        };

    }

}());