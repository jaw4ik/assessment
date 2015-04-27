define(['constants', 'viewmodels/reporting/expandableStatement', 'viewmodels/reporting/objectiveStatement', 'reporting/xApiProvider'], function (constants, ExpandableStatement, ObjectiveStatement, xApiProvider) {
    "use strict";

    var CourseStatement = function (finishedLrsStatement) {
        ExpandableStatement.call(this, finishedLrsStatement, this.expandLoadAction);
        this.startedLrsStatement = null;
        this.learnerDisplayName = this.lrsStatement.actor.name + ' (' + this.lrsStatement.actor.email + ')';
        this.correct = this.lrsStatement.verb === constants.reporting.xApiVerbIds.passed;
    }

    CourseStatement.prototype = Object.create(ExpandableStatement.prototype);
    CourseStatement.constructor = CourseStatement;

    CourseStatement.prototype.expandLoadAction = function () {
        var that = this;
        return xApiProvider.getMasteredStatements(that.lrsStatement.attemptId).then(function (lrsStatements) {
            return xApiProvider.getStartedStatement(that.lrsStatement.attemptId).then(function (startedStatements) {
                var objectiveStatements = _.map(lrsStatements, function (statement) {
                    return new ObjectiveStatement(statement);
                });
                var uniqueStatements = _.uniq(objectiveStatements, function (item) { return item.lrsStatement.id; });
                // quiz can send multiple mastered statements with try again functionality, we should show unique.
                that.startedLrsStatement = startedStatements[0];
                that.children(uniqueStatements);
                that.isExpanded(true);
            });
        });
    }

    return CourseStatement;
});