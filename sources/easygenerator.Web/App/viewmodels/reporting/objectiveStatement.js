define(['viewmodels/reporting/expandeableStatement', 'viewmodels/reporting/reportingStatement', 'reporting/xApiProvider'], function (ExpandeableStatement, ReportingStatement, xApiProvider) {
    "use strict";

    var ObjectiveStatement = function (masteredLrsStatement) {
        ExpandeableStatement.call(this, masteredLrsStatement, this.expandLoadAction);
    }

    ObjectiveStatement.prototype = Object.create(ExpandeableStatement.prototype);
    ObjectiveStatement.constructor = ObjectiveStatement;

    ObjectiveStatement.prototype.expandLoadAction = function () {
        var that = this;
        return xApiProvider.getAnsweredStatements(that.lrsStatement.attemptId, that.lrsStatement.id).then(function (statements) {
            var questionStatements = _.map(statements, function (statement) {
                return new ReportingStatement(statement);
            });
            that.children(questionStatements);
            that.isExpanded(true);
        });
    }

    return ObjectiveStatement;
});