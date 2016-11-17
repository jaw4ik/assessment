(function () {
    'use strict';

    angular
        .module('assessment')
        .controller('SummaryController', SummaryController);

    SummaryController.$inject = ['$rootScope', '$scope', 'dataContext', '$location', '$timeout', 'settings', '$window', 'assessment', 'questionPool', 'attemptsLimiter'];

    function SummaryController($rootScope, $scope, dataContext, $location, $timeout, settings, $window, assessment, questionPool, attemptsLimiter) {
        var that = this;
        $rootScope.title = 'Summary | ' + assessment.title;
        that.title = assessment.title;
        that.logoUrl = settings.logo.url;
        that.questions = _.chain(assessment.questions).filter(function(question){
            return question.affectProgress || question.isSurvey;
        }).map(function(question){
            return {
                title: question.title,
                isCorrect: question.score === 100,
                isSurvey: question.isSurvey
            };
        }).value();

        that.progress = assessment.getResult();
        that.masteryScore = settings.masteryScore.score;
        that.reachMasteryScore = that.progress >= that.masteryScore;
        that.finished = false;
        that.isSendingRequest = false;
        that.attemptsLimited = attemptsLimiter.hasLimit;
        that.singleAttempt = attemptsLimiter.limit === 1;
        that.availableAttemptCount = attemptsLimiter.getAvailableAttemptCount();
        that.canTryAgain = attemptsLimiter.hasAvailableAttempt();

        that.tryAgain = function () {
            if (that.finished) {
                return;
            }
            that.isSendingRequest = true;
            that.finished = true;

            assessment.restart(function () {
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

            assessment.finish(function () {
                that.isSendingRequest = false;
                $scope.$applyAsync();
                $window.close();
                if (!inIframe()) {
                    $timeout(function () {
                        alert('Thank you, you can close the page now');
                    }, 100);
                }
            });
        };
        
        function inIframe() {
            // browsers can block access to window.top due to same origin policy, so exception can be thrown here.
            try {
                return $window.self !== $window.top;
            } catch (e) {
                return true;
            }
        }
    }

}());
