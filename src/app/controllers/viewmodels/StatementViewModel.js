(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('StatementViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {
        return function StatementViewModel(question) {
            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'statement';
            };

            that.statements = question.options.map(function (option) {
                return {
                    id: option.id,
                    text: option.text,
                    state: undefined
                };
            });

            that.setTrueState = function (statement) {
                statement.state = statement.state === true ? undefined : true;
            };

            that.setFalseState = function (statement) {
                statement.state = statement.state === false ? undefined : false;
            };

            that.submitAnswer = function () {
                question.answer(that.statements.map(function (statement) {
                    return {
                        id: statement.id,
                        text: statement.text,
                        state: statement.state
                    };
                }));
            };
        };
    }

}());