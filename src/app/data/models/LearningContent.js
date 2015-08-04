(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('LearningContent', factory);

    function factory() {
        return function LearningContent(id, contentUrl) {
            var that = this;

            that.id = id;
            that.contentUrl = contentUrl;
        };
    }
}());