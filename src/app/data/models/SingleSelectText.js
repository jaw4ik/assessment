(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('SingleSelectText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function SingleSelectText(id, title, type, options) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, id, title, type, _protected);

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