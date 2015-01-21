(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('LearningContent', factory);

    function factory() {
        return function LearningContent(id, content) {
            var that = this;

            that.id = id;
            that.content = content;
        };
    }
}());