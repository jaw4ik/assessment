(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('MultipleSelectText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function MultipleSelectText(id, title, options) {
            var that = this;
            Question.call(that, id, title);

            that.options = options;
            that.answer = function (answers) {
                that.score = 100;
                that.options.forEach(function (option) {
                    if (_.contains(answers, option.text) !== option.isCorrect) {
                        that.score = 0;
                    }
                });
            };
        };
    }

}());