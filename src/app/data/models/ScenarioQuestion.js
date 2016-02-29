(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('ScenarioQuestion', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function ScenarioQuestion(sectionId, id, title, hasContent, learningContents, type, projectId, embedCode, embedUrl, masteryScore) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, sectionId, id, title, hasContent, learningContents, type, _protected);

            that.embedCode = embedCode;

            that.embedUrl = embedUrl;

            that.projectId = projectId;

            that.masteryScore = masteryScore;

            function answer(score) {
                that.score = score >= that.masteryScore ? 100 : 0;
            }
        };

    }
}());