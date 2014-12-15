(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Question', factory);

    function factory() {
        return function Question(id, title) {
            var that = this;
            that.id = id;
            that.title = title;
            that.score = 0;
        };
    }

}());