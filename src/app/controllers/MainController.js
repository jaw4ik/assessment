(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('MainController', MainController);

    MainController.$inject = [
        '$scope', '$rootScope', '$location',
        'SingleSelectText', 'MultipleSelectText', 'TextMatching', 'DragAndDropText',
        'Statement', 'SingleSelectImage', 'FillInTheBlanks', 'Hotspot', 'OpenQuestion',
        'SingleSelectTextViewModel', 'MultipleSelectTextViewModel', 'TextMatchingViewModel', 'DragAndDropTextViewModel',
        'StatementViewModel', 'SingleSelectImageViewModel', 'FillInTheBlanksViewModel', 'HotspotViewModel', 'OpenQuestionViewModel',
        'quiz', 'settings', 'timer'
    ];

    function MainController($scope, $rootScope, $location,
        SingleSelectText, MultipleSelectText, TextMatching, DragAndDropText,
        Statement, SingleSelectImage, FillInTheBlanks, Hotspot, OpenQuestion,
        SingleSelectTextViewModel, MultipleSelectTextViewModel, TextMatchingViewModel, DragAndDropTextViewModel,
        StatementViewModel, SingleSelectImageViewModel, FillInTheBlanksViewModel, HotspotViewModel, OpenQuestionViewModel,
        quiz, settings, timer) {
        var that = this;

        that.title = $rootScope.title = quiz.title;
        that.hasIntroductionContent = quiz.hasIntroductionContent;
        that.logoUrl = settings.logo.url;

        that.questions = quiz.questions.map(function (question) {
            if (question instanceof SingleSelectText) {
                return new SingleSelectTextViewModel(question);
            }
            if (question instanceof MultipleSelectText) {
                return new MultipleSelectTextViewModel(question);
            }
            if (question instanceof TextMatching) {
                return new TextMatchingViewModel(question);
            }
            if (question instanceof DragAndDropText) {
                return new DragAndDropTextViewModel(question);
            }
            if (question instanceof Statement) {
                return new StatementViewModel(question);
            }
            if (question instanceof SingleSelectImage) {
                return new SingleSelectImageViewModel(question);
            }
            if (question instanceof FillInTheBlanks) {
                return new FillInTheBlanksViewModel(question);
            }
            if (question instanceof Hotspot) {
                return new HotspotViewModel(question);
            }
            if (question instanceof OpenQuestion) {
                return new OpenQuestionViewModel(question);
            }

            throw 'Unknown question type';
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
        }
    }

}());