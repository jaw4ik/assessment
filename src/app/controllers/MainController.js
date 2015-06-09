(function () {
    'use strict';

    angular.module('quiz')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$rootScope', '$location', 'quiz', 'settings', 'timer', 'viewmodelsFactory'];

    function MainController($scope, $rootScope, $location, quiz, settings, timer, viewmodelsFactory) {
        var that = this;

        that.title = $rootScope.title = quiz.title;
        that.hasIntroductionContent = quiz.hasIntroductionContent;
        that.logoUrl = settings.logo.url;

        that.questions = quiz.questions.map(function (question) {
            return viewmodelsFactory.createQuestionViewmodel(question); 
        });

        that.submit = function () {
            that.questions.forEach(function (question) {
                question.submit();
            });

            quiz.sendCourseResult(settings.masteryScore.score);

            $location.path('/summary').replace();
        };

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

            $scope.$on('$quizStarted', function () {
                timer.start();
            });

            $scope.$on('$destroy', function() {
                timer.dispose();
            });
        }
    }

}());