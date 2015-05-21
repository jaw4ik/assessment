define(['reporting/viewmodels/expandableStatement'], function (ExpandableStatement) {
    "use strict";

    var QuestionStatement = function (answeredLrsStatement) {
        ExpandableStatement.call(this, answeredLrsStatement, null);

        this.isExpandable = false;
        this.isExpanded = null;
        this.children = null;
        this.correct = this.lrsStatement.score === 100;
        this.hasScore = this.lrsStatement.score != null;
        this.hasAnswer = this.lrsStatement.response != null;

        this.answerShown = ko.observable(false);
        this.showAnswer = function() {
            this.answerShown(true);
        };
        this.hideAnswer = function () {
            this.answerShown(false);
        };
    }

    return QuestionStatement;
});