(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('LearningContent', factory);

    function factory() {
        return function LearningContent(id, url) {
            var that = this;

            that.id = id;
            that.url = url;
        };
    }
}());