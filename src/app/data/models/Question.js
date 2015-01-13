(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Question', factory);

    factory.$inject = ['$rootScope'];

    function factory($rootScope) {
        return function Question(id, title, type, _protected) {
            var that = this;
            that.id = id;
            that.title = title;
            that.type = type;
            that.score = 0;

            that.answer = function () {
                _protected.answer.apply(this, arguments);

                $rootScope.$emit('question:answered', {
                    question: that,
                    answers: arguments[0]
                });
            };
        };
    }

}());