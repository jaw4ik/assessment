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

                that.submit = function () {

                };

            };

        });

}());