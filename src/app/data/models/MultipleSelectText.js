(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('MultipleSelectText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function MultipleSelectText(id, title, type, options) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, id, title, type, _protected);

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