(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Quiz', factory);

    factory.$inject = ['$rootScope'];

    function factory($rootScope) {
        return function Quiz(id, title, objectives, questions) {
            var that = this;

            that.id = id;
            that.title = title;
            that.objectives = objectives;
            that.questions = questions || [];
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
                $rootScope.$emit('course:finished', that, callback);
            };

            that.restartCourse = function () {
                $rootScope.$emit('course:restart');
            };
        };
    }

}());