﻿define(['eventManager', 'guard', 'eventDataBuilders/courseEventDataBuilder', 'plugins/http'],
    function (eventManager, guard, eventDataBuilder, http) {

        function Course(spec) {
            this.id = spec.id;
            this.title = spec.title;
            this.hasIntroductionContent = spec.hasIntroductionContent;
            this.content = null;
            this.objectives = spec.objectives;
            this.score = spec.score;
            this.isAnswered = false;
            this.getAllQuestions = getAllQuestions;
            this.finish = finish;
            this.calculateScore = calculateScore;
            this.start = start;
            this.restart = restart;
            this.submitAnswers = submitAnswers;
            this.loadContent = loadContent;
        }

        function getAllQuestions() {
            var questionsList = [];

            _.each(this.objectives, function (objective) {
                questionsList = questionsList.concat(objective.questions);
            });

            return questionsList;
        }

        var finish = function (callback) {
            eventManager.courseFinished(
                eventDataBuilder.buildCourseFinishedEventData(this), function () {
                    eventManager.turnAllEventsOff();
                    callback();
                });
        };

        var submitAnswers = function (questions) {
            guard.throwIfNotArray(questions, 'Questions is not an array');

            _.each(questions, function (item) {
                var question = item.question;
                question.submitAnswer(item.checkedAnswersIds);
            });

            this.isAnswered = true;
            eventManager.answersSubmitted(
                eventDataBuilder.buildAnswersSubmittedEventData(this)
            );
        };

        var start = function() {
            this.isAnswered = false;
            this.score = 0;
            eventManager.courseStarted();
        };

        var restart = function () {
            eventManager.courseRestart();
            this.start();
        };

        var calculateScore = function () {
            var result = _.reduce(this.objectives, function (memo, objective) {
                objective.calculateScore();
                return memo + objective.score;
            }, 0);

            var objectivesLength = this.objectives.length;
            this.score = objectivesLength == 0 ? 0 : result / objectivesLength;
        };

        var loadContent = function () {
            var that = this;
            return Q.fcall(function () {
                if (!that.hasIntroductionContent) {
                    return null;
                }

                return http.get('content/content.html')
                    .then(function (response) {
                        that.content = response;
                        return that.content;
                    })
                    .fail(function () {
                        that.content = null;
                        return that.content;
                    });
            });
        };

        return Course;
    }
);