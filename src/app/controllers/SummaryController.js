(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('SummaryController', SummaryController);

    SummaryController.$inject = ['dataContext', '$location', '$timeout', 'quiz'];

    function SummaryController(dataContext, $location, $timeout, quiz) {
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
        that.finished = false;

        that.tryAgain = function () {
            if (that.finished) return;
            $location.path('/');
        };

        that.finish = function () {
            if (that.finished) return;
            that.finished = true;
            window.close();
            $timeout(function() {
                 alert('Thank you, you can close the page now');
            }, 100);
        };
    }

}());