﻿import config from 'config';
import Statement from 'models/reporting/statement';
import httpRequestSender from 'http/httpRequestSender';
import base64 from 'utils/base64';
import constants from 'constants';
import _ from 'underscore';
import FilterCriteriaFactory from 'reporting/xApiFilterCriteriaFactory';

export default class {
    static getCourseStatements(courseId, embeded, take, skip) {
        return getGroupedStatements({ courseId: courseId, embeded: embeded, limit: take, skip: skip });
    }
    static getLearningPathFinishedStatements(learningPathId, take, skip) {
        return getStatements({ learningPathId: learningPathId, verbs: [constants.reporting.xApiVerbIds.passed, constants.reporting.xApiVerbIds.failed], limit: take, skip: skip });
    }
    static async getObjectiveStatements(attemptId, latestDate) {
        return filterObjectiveStatements(filterStatementsByLatestDate(await getStatements({
             verbs: [constants.reporting.xApiVerbIds.mastered, constants.reporting.xApiVerbIds.progressed], type: constants.reporting.xApiActivityTypes.objective, attemptIds: attemptId
        }), latestDate));
    }
    static async getQuestionStatements(attemptId, parentActivityId, latestDate) {
        return filterStatementsByLatestDate(await getStatements({
             verbs: [constants.reporting.xApiVerbIds.answered, constants.reporting.xApiVerbIds.experienced], attemptIds: attemptId, parentId: parentActivityId
        }), latestDate);
    }
}

function mapStatements(statements) {
    return _.map(statements, statement => new Statement(statement));
}

async function getStatementsBase(filterCriteriaSpec, uri, handler) {
    var headers = [];
    headers["X-Experience-API-Version"] = config.lrs.version;
    headers["Content-Type"] = "application/json";

    if (config.lrs.authenticationRequired) {
        let auth = `Basic ${base64.encode(config.lrs.credentials.username)}:${config.lrs.credentials.password}`;
        headers["Authorization"] = auth;
    }

    var filterCriteria = FilterCriteriaFactory.create(filterCriteriaSpec);
    var response = await httpRequestSender.get(uri, filterCriteria, headers);
    return handler(response);
}

function getStatements(filterCriteriaSpec) {
    return getStatementsBase(filterCriteriaSpec, config.lrs.uri + config.lrs.statementsPath, response => {
        if (!response || !response.statements) {
            return null;
        }
        return mapStatements(response.statements);
    });
}

function getGroupedStatements(filterCriteriaSpec) {
    return getStatementsBase(filterCriteriaSpec, config.lrs.uri + config.lrs.resultsPath, response => {
        if (!response || !response.statements) {
            return null;
        }

        if (filterCriteriaSpec.embeded) {
            return _.map(response.statements, statementGroup => {
                return {
                    root: mapStatements(statementGroup.root),
                    embeded: _.map(statementGroup.embeded, embededStatementsGroup => {
                        return embededStatementsGroup.root ? {
                            root: mapStatements(embededStatementsGroup.root),
                            answered: mapStatements(embededStatementsGroup.answered),
                            experienced: mapStatements(embededStatementsGroup.experienced)
                        } : null;
                    })
                }
            });
        }

        return _.map(response.statements, statementGroup => {
            return {
                root: mapStatements(statementGroup.root)
            }
        });
    });
}

function filterStatementsByLatestDate(statements, latestDate) {
    if (!latestDate) {
        return statements;
    }
    return _.filter(statements, statement => statement.date.getTime() <= latestDate);
}

function filterObjectiveStatements(statements) {
    var sortedStatements = _.sortBy(statements, statement => statement.id);
    var resultStatements = [];
    if (!sortedStatements.length) {
        return resultStatements;
    }

    resultStatements.push(sortedStatements[0]);
    for (let i = 1; i < sortedStatements.length; i++) {
        var lastStatement = resultStatements[resultStatements.length - 1];
        if (sortedStatements[i].id && sortedStatements[i].id === lastStatement.id) {
            if (sortedStatements[i].date.getTime() >= lastStatement.date.getTime()) {
                resultStatements[resultStatements.length - 1] = sortedStatements[i];
            }
        } else {
            resultStatements.push(sortedStatements[i]);
        }
    }

    return _.sortBy(resultStatements, statement => -statement.date.getTime());
}