define(['constants', 'reporting/viewmodels/expandableStatement', 'reporting/viewmodels/objectiveStatement', 'reporting/xApiProvider'], function (constants, ExpandableStatement, ObjectiveStatement, xApiProvider) {
    "use strict";

    var FinishStatement = function (finishedLrsStatement) {
        ExpandableStatement.call(this, finishedLrsStatement, this.expandLoadAction);
        this.startedLrsStatement = null;
        this.learnerDisplayName = this.lrsStatement.actor.name + ' (' + this.lrsStatement.actor.email + ')';
        this.started = false;
        this.passed = this.lrsStatement.verb === constants.reporting.xApiVerbIds.passed;
    }

    FinishStatement.prototype = Object.create(ExpandableStatement.prototype);

    FinishStatement.prototype.expandLoadAction = function () {
        var that = this;
        return xApiProvider.getMasteredStatements(that.lrsStatement.attemptId).then(function (lrsStatements) {
            return xApiProvider.getStartedStatement(that.lrsStatement.attemptId).then(function (startedStatements) {
                var objectiveStatements = _.map(lrsStatements, function (statement) {
                    return new ObjectiveStatement(statement);
                });
                that.startedLrsStatement = startedStatements[0];
                that.children(objectiveStatements);
                that.isExpanded(true);
            });
        });
    }

    return FinishStatement;
});