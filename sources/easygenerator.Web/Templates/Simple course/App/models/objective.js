﻿define(['modules/courseSettings'],
    function (courseSettings) {

        var ctor = function (spec) {

            var objective = {
                id: spec.id,
                title: spec.title,
                image: spec.image,
                questions: ko.observableArray(spec.questions)
            };

            objective.score = ko.computed(function () {
                var result = _.reduce(objective.questions(), function (memo, question) { return memo + question.score(); }, 0);
                var questionsLength = objective.questions().length;
                return questionsLength == 0 ? 0 : result / questionsLength;
            });

            objective.isCompleted = ko.computed(function () {
                return objective.score() >= courseSettings.masteryScore.score;
            });

            return objective;
        };

        return ctor;
    }
);