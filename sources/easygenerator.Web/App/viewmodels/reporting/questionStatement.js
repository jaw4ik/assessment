define(['viewmodels/reporting/expandableStatement'], function (ExpandableStatement) {
    "use strict";

    var QuestionStatement = function (answeredLrsStatement) {
        ExpandableStatement.call(this, answeredLrsStatement, null);

        this.isExpandable = false;
        this.isExpanded = null;
        this.children = null;
        this.correct = this.lrsStatement.score === 100;
    }

    return QuestionStatement;
});