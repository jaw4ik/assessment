(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('Assessment', factory);

    factory.$inject = ['$rootScope', 'eventPublisher'];

    function factory($rootScope, eventPublisher) {
        return function Assessment(id, templateId, title, createdOn, sections, questions, hasIntroductionContent) {
            var that = this;

            that.id = id;
            that.templateId = templateId;
            that.title = title;
            that.createdOn = createdOn;
            that.sections = sections;
            that.questions = questions || [];
            that.hasIntroductionContent = hasIntroductionContent || false;
            that.isCompleted = false;
            that.isFinished = false;

            that.getResult = function () {
                if (that.questions.length === 0) {
                    return 0;
                }

                var questionsThatAffectTheProgress = 0;
                _.each(that.questions, function(question){
                    if(question.affectProgress){
                        questionsThatAffectTheProgress++;
                    }
                });

                if(questionsThatAffectTheProgress === 0){
                    return 0;
                }

                var correct = 0;
                that.questions.forEach(function (question) {
                    if(question.affectProgress){
                        correct += question.score;
                    }
                });
                return Math.floor(correct / questionsThatAffectTheProgress);
            };

            that.start = function () {
                eventPublisher.publishRootScopeEvent('course:started');
            };

            that.restart = function (callback) {
                that.isFinished = true;
                eventPublisher.publishRootScopeEvent('course:finished', that, callback);
            };

            that.finish = function (callback) {
                that.isFinished = true;
                eventPublisher.publishRootScopeEvent('course:finished', that, function() {
                    eventPublisher.publishRootScopeEvent('course:finalized', that, callback);
                });
            };

            that.sendCourseResult = function (masteryScore) {
                that.isCompleted = that.getResult() >= masteryScore;
                eventPublisher.publishRootScopeEvent('course:results', that);
            };

            that.getStatus = function () {
                if (!that.isFinished) {
                    return 'inProgress';
                }

                return that.isCompleted ? 'completed' : 'failed';
            };
        };
    }

}());
