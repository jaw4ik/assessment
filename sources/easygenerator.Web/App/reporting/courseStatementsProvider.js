define(['constants', 'reporting/xApiProvider', 'reporting/viewmodels/startedStatement', 'reporting/viewmodels/finishStatement', 'reporting/viewmodels/objectiveStatement', 'reporting/viewmodels/questionStatement'], function (constants, xApiProvider, StartedStatement, FinishStatement, ObjectiveStatement, QuestionStatement) {
    'use strict';

    return { getLrsStatements: getLrsStatements };

    function getLrsStatements(spec) {
        return xApiProvider.getCourseStatements(spec.entityId, spec.embeded, spec.take, spec.skip).then(function (statements) {
            return _.map(statements, function (statementGroup) {
                var startedStatement = _.find(statementGroup.root, function(statement) {
                    return statement.verb === constants.reporting.xApiVerbIds.started;
                });

                var finishedStatement = _.find(statementGroup.root, function (statement) {
                    return _.find([constants.reporting.xApiVerbIds.failed, constants.reporting.xApiVerbIds.passed], function (verb) {
                        return verb === statement.verb;
                    });
                });

                if (finishedStatement) {

                    if (spec.embeded) {
                        var mastered = _.map(statementGroup.embeded, function (embededStatementGroup) {
                            if (!embededStatementGroup || !embededStatementGroup.mastered) {
                                return null;
                            }
                            if (!embededStatementGroup.answered || !embededStatementGroup.answered.length) {
                                return new ObjectiveStatement(embededStatementGroup.mastered);
                            }
                            var answered = _.map(embededStatementGroup.answered, function (statement) {
                                return new QuestionStatement(statement);
                            });
                            return new ObjectiveStatement(embededStatementGroup.mastered, answered.length ? answered : null);
                        });

                        return new FinishStatement(finishedStatement, startedStatement || null, mastered.length ? mastered : null);
                    }

                    return new FinishStatement(finishedStatement, startedStatement || null);
                }

                if (startedStatement) {
                    return new StartedStatement(startedStatement);
                }

                return null;
            });
        });
    }
});