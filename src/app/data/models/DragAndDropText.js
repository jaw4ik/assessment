(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('DragAndDropText', ['Question', function (Question) {

            return function DragAndDropText(id, title, background, dropspots) {
                var that = this;
                Question.call(that, id, title);

                that.background = background;
                that.dropspots = dropspots;
                that.answer = function (spots) {
                    var correct = 0;
                    spots.forEach(function (spot) {
                        if (_.find(that.dropspots, function (dropspot) {
                            return dropspot.x === spot.x && dropspot.y === spot.y && dropspot.text === spot.text;
                        })) {
                            correct++;
                        }
                    });

                    that.score = (correct === that.dropspots.length) ? 100 : 0;
                };
            };

        }]);

}());