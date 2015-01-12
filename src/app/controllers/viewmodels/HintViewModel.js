(function() {
    'use strict';

    angular
        .module('quiz')
        .factory('HintViewModel', factory);

    function factory() {
        return function HintViewModel(question) {
            var that = this;

            that.learningContents = question.learningContents;
            that.exists = question.learningContents && question.learningContents.length;
            that.isDisplayed = false;

            that.show = function () {
                that.isDisplayed = true;
                that.hintStartTime = new Date();
            };

            that.hide = function () {
                that.isDisplayed = false;
                sendLearningContentsExperienced();
            };

            that.deactivate = function() {
                if (that.isDisplayed) {
                    sendLearningContentsExperienced();
                }
            };

            function sendLearningContentsExperienced() {
                that.hintEndTime = new Date();
                question.learningContentsExperienced(that.hintEndTime - that.hintStartTime);
            }
        };

    }

}());