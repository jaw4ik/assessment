(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Question', factory);

    factory.$inject = ['$rootScope'];

    function factory($rootScope) {
        return function Question(id, title) {
            var that = this;
            that.id = id;
            that.title = title;
            that.score = 0;

            that.learningContentsExperienced = function (time) {
                $rootScope.$emit('learningContent:experienced', {
                    question: that,
                    time: time
                });
            };
        };
    }

}());