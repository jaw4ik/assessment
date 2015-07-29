(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('TextMatchingViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {
        return function TextMatchingViewModel(question) {
            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'textMatching';
            };

            that.sources = _.chain(question.answers)
                .map(function (answer) {
                    var source = {
                        id: answer.id,
                        key: answer.key,
                        value: null,

                        acceptValue: function (value) {
                            source.value = value;
                        },
                        rejectValue: function () {
                            source.value = null;
                        }
                    };

                    return source;
                })
                .shuffle()
                .value();

            that.targets = _.chain(question.answers)
                .map(function (answer) {
                    var target = {
                        value: answer.value,
                        acceptValue: function (value) {
                            target.value = value;
                        },
                        rejectValue: function () {
                            target.value = null;
                        }
                    };
                    return target;
                })
                .shuffle()
                .value();

            that.submitAnswer = function () {
                question.answer(_.map(that.sources, function (source) {
                    return {
                        key: source.key,
                        value: source.value
                    };
                }));
            };
        };
    }

}());