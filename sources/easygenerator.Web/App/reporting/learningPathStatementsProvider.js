define(['reporting/xApiProvider', 'reporting/viewmodels/finishStatement'], function (xApiProvider, FinishStatement) {
    'use strict';

    return { getLrsStatements: getLrsStatements };

    function getLrsStatements(spec) {
        return xApiProvider.getLearningPathFinishedStatements(spec.entityId, spec.take, spec.skip).then(function(statements) {
            return _.map(statements, function(statement) {
                return new FinishStatement(statement);
            });
        });
    }
});