(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('SummaryController', ['dataContext', '$location', 'quiz', SummaryController]);

    function SummaryController(dataContext, $location, quiz) {
        var that = this;

        that.title = '"' + quiz.title + '"';
        that.questions = quiz.questions.map(function (question) {
            return {
                title: question.title,
                isCorrect: question.score === 100
            };
        });

        that.progress = quiz.getResult().toFixed();
        that.masteryScore = 90;
        that.reachMasteryScore = that.progress >= that.masteryScore;

        that.tryAgain = function () {
            $location.path('/');
        };

        that.finish = function () {
            window.close();
            alert('Course can be closed');
        };
    }

}());