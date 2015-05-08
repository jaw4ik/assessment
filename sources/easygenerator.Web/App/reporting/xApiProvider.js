define(['config', 'models/reporting/statement', 'http/httpRequestSender', 'utils/base64', 'constants', 'reporting/xApiFilterCriteriaFactory'],
    function (config, Statement, httpRequestSender, base64, constants, filterCriteriaFactory) {

        function getStatements(filterCriteriaSpec) {
            var headers = [];
            headers["X-Experience-API-Version"] = config.lrs.version;
            headers["Content-Type"] = "application/json";

            if (config.lrs.authenticationRequired) {
                var auth = "Basic " + base64.encode(config.lrs.credentials.username + ':' + config.lrs.credentials.password);
                headers["Authorization"] = auth;
            }

            var filterCriteria = filterCriteriaFactory.create(filterCriteriaSpec);

            return httpRequestSender.get(config.lrs.uri, filterCriteria, headers).then(function (response) {
                if (response && response.statements) {
                    return _.map(response.statements, function (statement) {
                        return new Statement(statement);
                    });
                }
            });
        };

        function getCourseCompletedStatements(courseId, take, skip) {
            return getStatements({ courseId: courseId, verbs: [constants.reporting.xApiVerbIds.passed, constants.reporting.xApiVerbIds.failed], limit: take, skip: skip });
        }

        function getMasteredStatements(attemptId) {
            return getStatements({ verbs: constants.reporting.xApiVerbIds.mastered, attemptId: attemptId });
        }

        function getStartedStatement(attemptId) {
            return getStatements({ verbs: constants.reporting.xApiVerbIds.started, attemptId: attemptId });
        }

        function getAnsweredStatements(attemptId, parentActivityId) {
            return getStatements({ verbs: constants.reporting.xApiVerbIds.answered, attemptId: attemptId, parentId: parentActivityId });
        }

        return {
            getCourseCompletedStatements: getCourseCompletedStatements,
            getMasteredStatements: getMasteredStatements,
            getAnsweredStatements: getAnsweredStatements,
            getStartedStatement: getStartedStatement
        }
    });