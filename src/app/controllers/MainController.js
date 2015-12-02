(function () {
    'use strict';

    angular.module('assessment')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$rootScope', '$location', 'assessment', 'settings', 'timer', 'viewmodelsFactory'];

    var cachedQuestions = [];

    function MainController($scope, $rootScope, $location, assessment, settings, timer, viewmodelsFactory) {
        var submitted = false;
        var that = this;

        that.title = $rootScope.title = assessment.title;
        that.hasIntroductionContent = assessment.hasIntroductionContent;
        that.logoUrl = settings.logo.url;
        that.mode = settings.assessmentMode;
        that.showGivenAnswers = settings.showGivenAnswers;

        if (that.showGivenAnswers && cachedQuestions.length) {
            _.each(cachedQuestions, function(item, index) {
                if (item.getType() === 'scenarioQuestion') {
                    var questionModel = _.find(assessment.questions, function (quest) { return quest.id === item.id });
                    if (questionModel) {
                        cachedQuestions[index] = viewmodelsFactory.createQuestionViewmodel(questionModel);
                    }
                }
            });
            that.questions = cachedQuestions;
        } else {
            that.questions = assessment.questions.map(function (question) {
                return viewmodelsFactory.createQuestionViewmodel(question);
            });
            cachedQuestions = that.questions;
        }

        that.submit = function () {
            if (submitted) {
                return;
            }

            submitted = true;
            that.questions.forEach(function (question) {
                question.submit();
            });

            assessment.sendCourseResult(settings.masteryScore.score);

            $location.path('/summary').replace();
        };

        assessment.start();

        // timer definition
        $scope.timerEnabled = settings.timer.enabled;
        if (settings.timer.enabled) {
            var time = settings.timer.time,
                timeInSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;

            timer.setTime(timeInSeconds);
            $scope.timerRemainingTime = timeInSeconds;

            timer.onTick(function (remainingTime) {
                $scope.timerRemainingTime = remainingTime;
                $scope.$apply();
            });

            timer.onStopped(function () {
                that.submit();
                $scope.$apply();
            });

            $scope.$on('$assessmentStarted', function () {
                timer.start();
            });

            $scope.$on('$destroy', function () {
                timer.dispose();
            });
        }
    }

}());