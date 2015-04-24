define(['config', 'models/reportingStatement', 'http/httpRequestSender', 'utils/base64', 'constants'], function (config, ReportingStatement, httpRequestSender, base64, constants) {

    return {
        getReportingStatements: function (courseId) {
            var headers = [];
            headers["X-Experience-API-Version"] = config.lrs.version;
            headers["Content-Type"] = "application/json";
            if (config.lrs.authenticationRequired) {
                var auth = "Basic " + base64.encode(config.lrs.credentials.username + ':' + config.lrs.credentials.password);
                headers["Authorization"] = auth;
            }

            var queryParams = {};
            queryParams[constants.reporting.extensionKeys.courseId] = courseId;
            queryParams['v'] = +new Date();

            return httpRequestSender.get(config.lrs.uri, queryParams, headers).then(function (response) {
                if (response && response.statements) {
                    var finishedStatements = _.filter(response.statements, function (statement) {
                        return statement.verb.id === constants.reporting.xApiVerbIds.passed || statement.verb.id === constants.reporting.xApiVerbIds.failed;
                    });
                    var res =  _.map(finishedStatements, function (statement) {
                        return new ReportingStatement(statement);
                    });
                    return res;
                }
            });
        }
    }
});