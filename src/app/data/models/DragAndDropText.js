(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('DragAndDropText', factory);

    factory.$inject = ['Question'];

    function factory(Question) {

        return function DragAndDropText(id, title, type, background, dropspots) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, id, title, type, _protected);

            that.background = background;
            that.dropspots = dropspots;

            function answer(spots) {
                var correct = 0;
                spots.forEach(function (spot) {
                    if (_.find(that.dropspots, function (dropspot) {
                        return dropspot.x === spot.x && dropspot.y === spot.y && dropspot.text === spot.text;
                    })) {
                        correct++;
                    }
                });

                that.score = (correct === that.dropspots.length) ? 100 : 0;
            }
        };

    }

}());