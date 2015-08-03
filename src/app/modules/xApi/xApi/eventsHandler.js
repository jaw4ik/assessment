(function () {
    'use strict';

    angular.module('assessment.xApi').factory('xApiEventsHandler', xApiEventsHandler);

    xApiEventsHandler.$inject = ['$rootScope', 'xApiRequestManager', 'xApiDataBuilder', 'xApiSettings', 'StatementsStorage'];

    function xApiEventsHandler($rootScope, requestManager, dataBuilder, xApiSettings, statementsStorage) {
        var unbindFunctions = [];

        unbindFunctions.push($rootScope.$on('course:started', function () {          
            sendStatementIfAllowed(dataBuilder.courseStarted());
        }));

        unbindFunctions.push($rootScope.$on('course:results', function (scope, data) {
            _.each(data.objectives, function (objective) {
                sendStatementIfAllowed(dataBuilder.objectiveMastered(objective));
            });
            sendStatementIfAllowed(dataBuilder.courseResults(data));
        }));

        unbindFunctions.push($rootScope.$on('course:finished', function () {
            return sendStatementIfAllowed(dataBuilder.courseStopped());
        }));

        unbindFunctions.push($rootScope.$on('question:answered', function (scope, data) {
            sendStatementIfAllowed(dataBuilder.questionAnswered(data));
        }));

        unbindFunctions.push($rootScope.$on('learningContent:experienced', function (scope, data) {
            sendStatementIfAllowed(dataBuilder.learningContentExperienced(data));
        }));

        function sendStatementIfAllowed(statement) {
            if (!_.contains(xApiSettings.xApi.allowedVerbs, statement.verb.display['en-US'])) {
                return undefined;
            }

            statementsStorage.push(statement);
            return requestManager.sendStatements();
        }

        function unbindAll() {
            _.each(unbindFunctions, function (func) {
                func.apply();
            });
        }

        return {
            off: unbindAll
        };
    }

}());
