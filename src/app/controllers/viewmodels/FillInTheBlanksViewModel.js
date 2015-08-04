(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('FillInTheBlanksViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {
        return function FillInTheBlanksViewModel(question) {
            QuestionViewModel.call(this, question);

            var that = this;

            that.template = question.content;
            delete that.content;

            that.getType = function () {
                return 'fillInTheBlanks';
            };

            that.groups = question.groups.map(function (group) {
                return {
                    groupId: group.id,
                    answer: '',
                    answers: group.answers.map(function (answer) {
                        return {
                            text: answer.text
                        };
                    })
                };
            });

            that.submitAnswer = function () {
                question.answer(_.chain(that.groups)
                    .map(function (group) {
                        return {
                            groupId: group.groupId,
                            answer: group.answer
                        };
                    })
                    .reduce(function (obj, ctx) {
                        obj[ctx.groupId] = ctx.answer;
                        return obj;
                    }, {})
                    .value());
            };
        };
    }

}());