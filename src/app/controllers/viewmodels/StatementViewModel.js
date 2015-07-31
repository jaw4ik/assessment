(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('StatementViewModel', factory);

    factory.$inject = ['QuestionViewModel', 'settings'];

    function factory(QuestionViewModel, settings) {
        return function StatementViewModel(question) {
            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'statement';
            };

            that.statements = question.options.map(function (option) {
                return {
                    text: option.text,
                    state: undefined
                };
            });

            if (settings.questionPool.randomizeAnswerOptions) {
                that.statements = _.shuffle(that.statements);
            }

            that.setTrueState = function (statement) {
                statement.state = statement.state === true ? undefined : true;
            };

            that.setFalseState = function (statement) {
                statement.state = statement.state === false ? undefined : false;
            };

            that.submitAnswer = function () {
                question.answer(that.statements.map(function (statement) {
                    return {
                        text: statement.text,
                        state: statement.state
                    };
                }));
            };
        };
    }

}());