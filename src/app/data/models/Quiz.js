(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Quiz', factory);

    factory.$inject = ['$rootScope'];

    function factory($rootScope) {
        return function Quiz(id, title, objectives, questions, hasIntroductionContent) {
            var that = this;

            that.id = id;
            that.title = title;
            that.objectives = objectives;
            that.questions = questions || [];
            that.hasIntroductionContent = hasIntroductionContent || false;
            that.isCompleted = false;

            that.getResult = function () {
                if (that.questions.length === 0) {
                    return 0;
                }

                var correct = 0;
                that.questions.forEach(function (question) {
                    correct += question.score;
                });
                return Math.floor(correct / that.questions.length);
            };

            that.courseStarted = function () {
                $rootScope.isCourseStarted = true;
                $rootScope.$emit('course:started');
        };

            that.courseFinished = function (callback) {
                if (!!$rootScope.$$listenerCount['course:finished']) {
                    $rootScope.$emit('course:finished', that, callback);
                } else {
                    callback.apply();
    }
            };

            that.courseResults = function (masteryScore) {
                that.isCompleted = that.getResult() >= masteryScore;
                $rootScope.$emit('course:results', that);
            };
        };
    }

}());