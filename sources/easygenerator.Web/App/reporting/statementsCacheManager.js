import _ from 'underscore';

export default {
    applyLoadedChanges: applyLoadedChanges,
    clearProgressedHistory: clearProgressedHistory
}

function applyLoadedChanges(viewResults, loadedResults, strictCheck) {
    _.each(viewResults, viewResult => {
        if (!viewResult.isExpandable || viewResult.children === null)
            return;

        var loadedResult = _.find(loadedResults, result => strictCheck ? strictComparator(viewResult, result): nonStrictComparator(viewResult, result));
        if (!loadedResult)
            return;

        var loadedChildren = loadedResult.children && loadedResult.children().length ? loadedResult.children() : null;
        if (!loadedChildren) {
            viewResult.children = null;
            return;
        }

        var filteredLoadedChildren = [];
        if (!loadedChildren[0] || !loadedChildren[0].length) {
            filteredLoadedChildren = loadedChildren;
        } else {
            for (var i = 0; i < loadedChildren.length; i++) {
                var latestFilteredStatement = _.find(loadedChildren[i], item => item.lrsStatement.date.getTime() <= viewResult.lrsStatement.date.getTime());
                if (!latestFilteredStatement)
                    continue;

                if (loadedChildren[i][0].children === null || !loadedChildren[i][0].children().length) {
                    latestFilteredStatement.children = null;
                } else {
                    let filteredChildren = _.filter(loadedChildren[i][0].children(), child => child.lrsStatement.date.getTime() <= latestFilteredStatement.lrsStatement.date.getTime());
                    filteredChildren.length ? latestFilteredStatement.children(filteredChildren) : latestFilteredStatement.children = null;
                }
                filteredLoadedChildren.push(latestFilteredStatement);
            }
        }
        if (viewResult.children().length) {
            applyLoadedChanges(viewResult.children(), filteredLoadedChildren, true);
            return;
        }
        filteredLoadedChildren.length ? viewResult.children(filteredLoadedChildren) : viewResult.children = null;
    });
}

function clearProgressedHistory(statements) {
    for (let statement of statements) {
        if (!statement.children || !statement.children().length || !statement.children()[0].length) {
            continue;
        }
        statement.children(_.map(statement.children(), items => items[0]));
    }
    return statements;
}

function nonStrictComparator(statement1, statement2) {
    return statement1.lrsStatement.attemptId && statement1.lrsStatement.attemptId === statement2.lrsStatement.attemptId;
}

function strictComparator(statement1, statement2) {
    return statement1.lrsStatement.attemptId === statement2.lrsStatement.attemptId &&
           statement1.lrsStatement.id === statement2.lrsStatement.id &&
           statement1.lrsStatement.verb === statement2.lrsStatement.verb &&
           statement1.lrsStatement.date.getTime() === statement2.lrsStatement.date.getTime();
}