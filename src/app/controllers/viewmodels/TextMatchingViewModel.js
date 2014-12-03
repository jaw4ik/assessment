(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('TextMatchingViewModel', ['QuestionViewModel', function (QuestionViewModel) {

            return function TextMatchingViewModel(question) {
                QuestionViewModel.call(this, question);

                var that = this;
                that.getType = function () {
                    return 'textMatching';
                }

                that.sources = question.answers.map(function (answer) {
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
                });

                that.targets = question.answers.map(function (answer) {
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
                });

                that.submit = function () {
                    question.answer(_.map(that.sources, function (source) {
                        return {
                            key: source.key,
                            value: source.value
                        };
                    }));
                };
            };

        }]);

}());