﻿define(['constants', 'guard', 'models/reporting/actor'], function (constants, guard, Actor) {
    "use strict";

    var Statement = function (spec) {
        guard.throwIfNotAnObject(spec, 'You should provide specification for reporting statement');

        this.name = spec.object.definition.name['en-US'];
        this.date = new Date(spec.timestamp);
        this.actor = new Actor(spec.actor);
        this.correct = spec.verb.id === constants.reporting.xApiVerbIds.passed;
        if (spec.result && spec.result.score && spec.result.score.scaled) {
            this.score = Math.round(spec.result.score.scaled * 100);
        }
        this.verb = spec.verb.id;

        this.id = spec.object.id;

        if (spec.context) {
            this.attemptId = spec.context.registration;
            if (spec.context.contextActivities && spec.context.contextActivities.parent) {
                this.parentId = spec.context.contextActivities.parent[0].id;
            }
        }
    };

    return Statement;
});