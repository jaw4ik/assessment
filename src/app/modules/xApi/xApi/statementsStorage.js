(function () {
    'use strict';

    angular.module('quiz.xApi')
        .factory('StatementsStorage', statementsStorage);

    function statementsStorage() {
        var statements = [];

        function push(stmt) {
            statements.push({
                item: stmt
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