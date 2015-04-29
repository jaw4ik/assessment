(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('OpenQuestion', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function OpenQuestion(id, title, type) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, id, title, type, _protected);

            function answer(answers) {
                that.score = answers ? 100 : 0;
            }
        };

    }
}());