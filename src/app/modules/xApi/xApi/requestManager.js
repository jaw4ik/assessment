(function () {
    'use strict';

    angular.module('quiz.xApi')
        .factory('xApiRequestManager', xApiRequestManager);

    xApiRequestManager.$inject = ['StatementsStorage', 'errorsHandler'];

    function xApiRequestManager(statementsStorage, errorsHandler) {
        var isPending = false,
            xApi = null;

        return {
            sendStatement: sendStatement,
            init: init
        };

        function init(xapi) {
            xApi = xapi;
        }

        function sendStatement() {
            send();
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
                        _.each(stmts, function (item) {
                            if (typeof item.callback === 'function') {
                                item.callback.apply();
                            }
                        });
                        send();
                    });
                } else {
                    return;
                }
            }
        }
    }

}());