define(['viewmodels/reporting/expandableStatement', 'viewmodels/reporting/questionStatement', 'reporting/xApiProvider'], function (ExpandableStatement, QuestionStatement, xApiProvider) {
    "use strict";

    var ObjectiveStatement = function (masteredLrsStatement) {
        ExpandableStatement.call(this, masteredLrsStatement, this.expandLoadAction);
    }

    ObjectiveStatement.prototype = Object.create(ExpandableStatement.prototype);
    ObjectiveStatement.constructor = ObjectiveStatement;

    ObjectiveStatement.prototype.expandLoadAction = function () {
        var that = this;
        return xApiProvider.getAnsweredStatements(that.lrsStatement.attemptId, that.lrsStatement.id).then(function (statements) {
            if (statements && statements.length) {
                var questionStatements = _.map(statements, function(statement) {
                    return new QuestionStatement(statement);
                });
                that.children(questionStatements);
            } else {
                that.children = null;
            }
            that.isExpanded(true);
        });
    }

    return ObjectiveStatement;
});