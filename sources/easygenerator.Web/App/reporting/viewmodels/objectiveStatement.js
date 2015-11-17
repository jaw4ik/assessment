﻿define(['reporting/viewmodels/expandableStatement', 'reporting/viewmodels/questionStatement', 'reporting/xApiProvider'], function (ExpandableStatement, QuestionStatement, xApiProvider) {
    "use strict";

    var ObjectiveStatement = function (masteredLrsStatement) {
        ExpandableStatement.call(this, masteredLrsStatement, this.expandLoadAction);
        this.hasScore = this.lrsStatement.score != null;
    }

    ObjectiveStatement.prototype = Object.create(ExpandableStatement.prototype);

    ObjectiveStatement.prototype.expandLoadAction = function (preventExpand) {
        var that = this;
        return xApiProvider.getAnsweredStatements(that.lrsStatement.attemptId, that.lrsStatement.id).then(function (statements) {
            if (statements && statements.length) {
                var questionStatements = _.map(statements, function (statement) {
                    return new QuestionStatement(statement);
                });
                that.children(questionStatements);
            } else {
                that.children = null;
            }
            if (preventExpand !== true) {
                that.isExpanded(true);
            }
        });
    }

    return ObjectiveStatement;
});