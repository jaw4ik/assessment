(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('SummaryController', SummaryController);

    SummaryController.$inject = ['$scope', 'dataContext', '$location', '$timeout', 'settings', '$window', 'quiz'];

    function SummaryController($scope, dataContext, $location, $timeout, settings, $window, quiz) {
        var that = this;
        that.title = '"' + quiz.title + '"';
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

        that.tryAgain = function () {
            if (that.finished) {
                return;
            }
            $location.path('/').replace();
        };

        that.finish = function () {
            if (that.finished) {
                return;
            }
            that.finished = true;
            that.isSendingRequest = true;

            quiz.finish(function () {
                that.isSendingRequest = false;
                $scope.$apply();
                $window.close();
                $timeout(function () {
                    alert('Thank you, you can close the page now');
                }, 100);
            });
        };
    }

}());