(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('QuestionViewModel', factory);

    function factory() {
        return function QuestionViewModel(question) {
            var that = this;

            that.id = question.id;
            that.title = question.title;
            that.contentUrl = question.contentUrl;
            that.hints = question.hints;
            that.hintsDisplayed = false;

            that.showHint = function () {
                that.hintsDisplayed = true;
                that.hintStartTime = new Date();
            };

            that.hideHint = function () {
                that.hintsDisplayed = false;
                that.hintEndTime = new Date();
            };

            that.getType = function () {
                throw 'Could not determine question type for question #' + that.id + ' (' + question.title + ')';
            };

            that.submit = function () {
                if (that.hintsDisplayed) {
                    that.hintEndTime = new Date();
                }
                that.submitAnswer();
            };

            that.submitAnswer = function () {
                throw 'Question #' + that.id + ' could not be submitted';
            };
        };
    }

}());