(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('TextMatchingViewModel', factory);

    factory.$inject = ['QuestionViewModel', 'settings'];

    function factory(QuestionViewModel, settings) {
        return function TextMatchingViewModel(question) {
            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'textMatching';
            };


            that.sources = _.map(question.answers, function(answer) {
                    var source = {
                        id: answer.id,
                        key: answer.key,
                        value: null,

                        acceptValue: function(value) {
                            source.value = value;
                        },
                        rejectValue: function() {
                            source.value = null;
                        }
                    };

                    return source;
                });

            if (settings.answers.randomize) {
                that.sources = _.shuffle(that.sources);
            }


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