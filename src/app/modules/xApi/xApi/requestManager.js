(function () {
    'use strict';

    angular.module('assessment.xApi')
        .factory('xApiRequestManager', xApiRequestManager);

    xApiRequestManager.$inject = ['$q', 'StatementsStorage', 'errorsHandler'];

    function xApiRequestManager($q, statementsStorage, errorsHandler) {
        var isPending = false,
            xApi = null,
            defers = [];

        return {
            sendStatements: sendStatements,
            init: init
        };

        function init(xapi) {
            xApi = xapi;
        }

        function sendStatements() {
            var defer = $q.defer();
            defers.push(defer);

            send();

            return defer.promise;
        }

        function send() {
            if (!isPending) {
                var tempArray = [],
                    stmts = statementsStorage.shift();

                if (stmts.length !== 0) {
                    isPending = true;
                    _.each(stmts, function (stmt) {
                        tempArray.push(stmt.item);
                    });

                    xApi.sendStatements(tempArray, function (errors) {
                        _.each(errors, function (error) {
                            if (error.err != null) {
                                errorsHandler.handleError();
                            }
                        });

                        isPending = false;
                        send();
                    });
                } else {
                    _.each(defers, function (defer) {
                        defer.resolve();
                    });

                    defers.length = 0;
                }
            }
        }
    }

}());
