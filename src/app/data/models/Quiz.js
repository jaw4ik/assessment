(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Quiz', factory);

    factory.$inject = ['$rootScope', 'eventPublisher'];

    function factory($rootScope, eventPublisher) {
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

            that.start = function () {
                eventPublisher.publishRootScopeEvent('course:started');
            };

            that.finish = function (callback) {
                eventPublisher.publishRootScopeEvent('course:finished', that, callback);
            };

            that.sendCourseResult = function (masteryScore) {
                that.isCompleted = that.getResult() >= masteryScore;
                eventPublisher.publishRootScopeEvent('course:results', that);
            };
        };
    }

}());
