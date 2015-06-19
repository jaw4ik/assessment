(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('SummaryController', SummaryController);

    SummaryController.$inject = ['$rootScope', '$scope', 'dataContext', '$location', '$timeout', 'settings', '$window', 'quiz', 'questionPool', 'attemptsLimiter'];

    function SummaryController($rootScope, $scope, dataContext, $location, $timeout, settings, $window, quiz, questionPool, attemptsLimiter) {
        var that = this;
        $rootScope.title = 'Summary | ' + quiz.title;
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
        that.isSendingRequest = false;
        that.attemptsLimited = attemptsLimiter.hasLimit;
        that.availableAttemptCount = attemptsLimiter.getAvailableAttemptCount();
        that.canTryAgain = attemptsLimiter.hasAvailableAttempt();

        that.tryAgain = function () {
            if (that.finished) {
                return;
            }
            that.isSendingRequest = true;
            that.finished = true;

            quiz.finish(function () {
                that.isSendingRequest = false;
                questionPool.refresh();
                $location.path('/').search('tryAgain');
            });
        };

        that.finish = function () {
            if (that.finished) {
                return;
            }
            that.finished = true;
            that.isSendingRequest = true;

            quiz.finish(function () {
                that.isSendingRequest = false;
                $scope.$applyAsync();
                $window.close();
                $timeout(function () {
                    alert('Thank you, you can close the page now');
                }, 100);
            });
        };
    }

}());
