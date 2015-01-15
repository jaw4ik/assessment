﻿(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('SummaryController', SummaryController);

    SummaryController.$inject = ['$location', '$timeout', 'settings', 'quiz'];

    function SummaryController($location, $timeout, settings, quiz) {
        var that = this;
            that.title = quiz.title;
        that.logoUrl = settings.logo.url;
        that.questions = quiz.questions.map(function (question) {
            return {
                title: question.title,
                isCorrect: question.score === 100
            };
        });

        that.progress = quiz.getResult();
        that.masteryScore = settings.masteryScore.score;
        that.reachMasteryScore = that.progress >= that.masteryScore;
        that.finished = false;

        that.tryAgain = function () {
            if (that.finished) return;
           $location.path('/').search('tryAgain');
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