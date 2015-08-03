(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('DragAndDropTextViewModel', factory);

    factory.$inject = ['QuestionViewModel', 'settings'];

    function factory(QuestionViewModel, settings) {
        return function DragAndDropTextViewModel(question) {

            QuestionViewModel.call(this, question);

            var that = this;
            that.getType = function () {
                return 'dragAndDropText';
            };

            that.background = question.background;

            that.texts = question.dropspots.map(function (dropspot) {
                return {
                    text: dropspot.text
                };
            });

            if (settings.answers.randomize) {
                that.texts = _.shuffle(that.texts);
            }

            that.texts.acceptValue = function (value) {
                that.texts.push(value);
            };
            that.texts.rejectValue = function (value) {
                var index = that.texts.indexOf(value);
                that.texts.splice(index, 1);

            };

            that.spots = question.dropspots.map(function (dropspot) {
                var spot = {
                    x: dropspot.x,
                    y: dropspot.y,
                    value: undefined,
                    acceptValue: function (value) {
                        spot.value = value;
                    },
                    rejectValue: function () {
                        spot.value = null;
                    }

                };

                return spot;
            });

            that.submitAnswer = function () {
                question.answer(_.map(that.spots, function (spot) {
                    return {
                        x: spot.x,
                        y: spot.y,
                        text: spot.value && spot.value.text
                    };
                }));
            };

        };
    }

}());