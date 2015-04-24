define(['constants', 'guard'], function (constants, guard) {
        "use strict";

        var ReportingStatement = function (spec) {
            guard.throwIfNotAnObject(spec, 'You should provide specification for reporting statement');

            this.date = new Date(spec.timestamp);
            this.name = spec.actor.name;
            this.email = spec.actor.mbox.replace('mailto:', '');
            this.correct = spec.verb.id === constants.reporting.xApiVerbIds.passed;
            this.score = Math.round(spec.result.score.scaled * 100);
        };

        return ReportingStatement;
    }
);