(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('SummaryController', SummaryController);

    SummaryController.$inject = ['dataContext', '$location', 'quiz', 'settings'];

    function SummaryController(dataContext, $location, quiz, settings) {
        var that = this;
        that.title = '"' + quiz.title + '"';
        that.questions = quiz.questions.map(function (question) {
            return {
                title: question.title,
                isCorrect: question.score === 100
            };
        });

        that.progress = quiz.getResult();
        that.masteryScore = settings.masteryScore.score;
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