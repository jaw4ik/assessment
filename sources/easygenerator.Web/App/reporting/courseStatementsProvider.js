define(['reporting/xApiProvider'], function (xApiProvider) {
    'use strict';

    return { getLrsStatements: getLrsStatements };

    function getLrsStatements(entityId, take, skip) {
        if (!take && !skip) {
            return Q.all([xApiProvider.getCourseStartedStatements(entityId), xApiProvider.getCourseFinishedStatements(entityId)])
                .spread(function (startedStatements, finishedStatements) {
                    return { started: startedStatements, finished: finishedStatements };
                });
        }

        return xApiProvider.getCourseStartedStatements(entityId, take, skip).then(function (startedStatements) {
            return xApiProvider.getCourseFinishedStatementsByAttempts(_.map(startedStatements, function (item) { return item.attemptId; }))
                .then(function (finishedStatements) {
                    return { started: startedStatements, finished: finishedStatements };
                });
        });
    }
});