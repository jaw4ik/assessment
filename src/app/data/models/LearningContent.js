(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('LearningContent', factory);

    function factory() {
        return function LearningContent(id, contentUrl) {
            var that = this;

            that.id = id;
            that.contentUrl = contentUrl;
        };
    }
}());