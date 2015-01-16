(function () {
    'use strict';

    angular.module('quiz.xApi')
        .factory('StatementsStorage', statementsStorage);

    function statementsStorage() {
        var statements = [];

        function push(stmt, callback) {
            statements.push({
                item: stmt,
                callback: callback
            });
        }

        function shift() {
            var tempStatements = statements;
            statements = [];
            return tempStatements;
        }

        return {
            push: push,
            shift: shift
        };
    }
}());