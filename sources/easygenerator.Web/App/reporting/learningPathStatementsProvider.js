define(['reporting/xApiProvider'], function (xApiProvider) {
    'use strict';

    return { getLrsStatements: getLrsStatements };

    function getLrsStatements(entityId, take, skip) {
        return xApiProvider.getLearningPathFinishedStatements(entityId, take, skip).then(function (statements) {
            return { finished: statements };
        });
    }
});