(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('QuestionViewModel', function () {

            return function QuestionViewModel(question) {
                var that = this;

                that.id = question.id;
                that.title = question.title;
                that.contentUrl = question.contentUrl;

                that.getType = function () {
                    throw 'Could not determine question type for question #' + that.id + ' (' + question.title + ')';
                };

                that.submit = function () {
                    throw 'Question #' + that.id + ' could not be submitted';
                };

            };

        });

}());