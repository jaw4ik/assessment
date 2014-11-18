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

        ReportingStatement.prototype.getFormattedDate = function () {
            var days = this.date.getDate();
            // Internationalization API doesn't supported by all needed browsers, so workaround is used
            var month = this.date.toUTCString().split(' ')[2];
            var year = this.date.getFullYear();

            var hours = this.date.getHours();
            var minutes = this.date.getMinutes();

            minutes = minutes < 10 ? "0" + minutes : minutes;

            var ampm = "AM";

            if (hours >= 12) {
                hours = hours - 12;
                ampm = "PM";
            }

            if (hours == 0) {
                hours = 12;
            }

            return month + ' ' + days + ', ' + year + ' ' + hours + ':' + minutes + ' ' + ampm;
        }

        return ReportingStatement;
    }
);