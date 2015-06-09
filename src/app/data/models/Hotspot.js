(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('Hotspot', factory);

    factory.$inject = ['Question'];

    function factory(Question) {
        return function Hotspot(objectiveId, id, title, hasContent, learningContents, type, background, spots, isMultiple) {
            var that = this,
                _protected = {
                    answer: answer
                };

            Question.call(that, objectiveId, id, title, hasContent, learningContents, type, _protected);

            that.background = background;

            that.spots = spots;

            that.isMultiple = isMultiple;

            function answer(marks) {
                var score = calculateScore(that.isMultiple, that.spots, marks);

                that.score = score;
            }

            function calculateScore(isMultiple, spots, placedMarks) {
                if (!_.isArray(spots) || spots.length === 0) {
                    return placedMarks.length ? 0 : 100;
                }

                var answerCorrect;
                if (!isMultiple) {
                    answerCorrect = _.some(spots, function (spot) {
                        return _.some(placedMarks, function (mark) {
                            return markIsInSpot(mark, spot);
                        });
                    });
                } else {
                    var spotsWithMarks = [];
                    var marksOnSpots = [];

                    _.each(placedMarks, function (mark) {
                        _.each(spots, function (spot) {
                            if (markIsInSpot(mark, spot)) {
                                spotsWithMarks.push(spot);
                                marksOnSpots.push(mark);
                            }
                        });
                    });

                    answerCorrect = _.uniq(spotsWithMarks).length === spots.length && _.uniq(marksOnSpots).length === placedMarks.length;
                }
                return answerCorrect ? 100 : 0;
            }

            function markIsInSpot(mark, spot) {
                var x = mark.x,
                    y = mark.y;

                var inside = false;
                for (var i = 0, j = spot.length - 1; i < spot.length; j = i++) {
                    var xi = spot[i].x,
                        yi = spot[i].y;
                    var xj = spot[j].x,
                        yj = spot[j].y;

                    var intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                    if (intersect) {
                        inside = !inside;
                    }
                }

                return inside;
            }
        };
    }

}());