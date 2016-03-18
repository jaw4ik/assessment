import config from 'config';
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
static getMasteredStatements(attemptId) {
    return getStatements({ verbs: constants.reporting.xApiVerbIds.mastered, attemptIds: attemptId });
}
static getObjectiveStatements(attemptId, parentActivityId) {
    return getStatements({ verbs: [constants.reporting.xApiVerbIds.answered, constants.reporting.xApiVerbIds.experienced], attemptIds: attemptId, parentId: parentActivityId });
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
                        return embededStatementsGroup.mastered ? {
                            mastered: new Statement(embededStatementsGroup.mastered),
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