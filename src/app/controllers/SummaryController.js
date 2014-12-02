(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('SummaryController', ['dataContext', '$location', SummaryController]);

    function SummaryController(dataContext, $location) {
        var that = this;

        dataContext.getQuiz().then(function (quiz) {
            that.title = '"' + quiz.title + '"';
            that.questions = quiz.questions;

            that.progress = quiz.getResult();
        });

        that.tryAgain = function () {
            $location.path('/');
        };

        that.finish = function () {
            window.close();
            alert('Course can be closed');
        };
    }

}());