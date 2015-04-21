define(['viewmodels/reporting/reportingStatement'], function (ReportingStatement) {
    "use strict";

    var QuestionStatement = function (answeredLrsStatement) {
        ReportingStatement.call(this, answeredLrsStatement);

        this.correct = this.lrsStatement.score === 100;
    }

    return QuestionStatement;
});