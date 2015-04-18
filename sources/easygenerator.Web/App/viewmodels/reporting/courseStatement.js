define(['viewmodels/reporting/expandeableStatement', 'viewmodels/reporting/objectiveStatement', 'reporting/xApiProvider'], function (ExpandeableStatement, ObjectiveStatement, xApiProvider) {
    "use strict";

    var CourseStatement = function (finishedLrsStatement) {
        ExpandeableStatement.call(this, finishedLrsStatement, this.expandLoadAction);
        this.startedLrsStatement = null;
    }

    CourseStatement.prototype = Object.create(ExpandeableStatement.prototype);
    CourseStatement.constructor = CourseStatement;

    CourseStatement.prototype.expandLoadAction = function () {
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
    
    return CourseStatement;
});