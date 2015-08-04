(function () {
    'use strict';

    angular.module('assessment.xApi').factory('hotspotDataBuilder', factory);

    factory.$inject = ['xApiInteractionTypes'];

    function factory(interactionTypes) {
        return function (question, answers, questionUrl) {
            var placedMarkers = _.map(answers, function (mark) {
                return '(' + mark.x + ',' + mark.y + ')';
            }).join('[,]');

            var spots = _.map(question.spots, function (spot) {
                var polygonCoordinates = _.map(spot, function (spotCoordinates) {
                    return '(' + spotCoordinates.x + ',' + spotCoordinates.y + ')';
                });
                return polygonCoordinates.join('[.]');
            }).join('[,]');

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: question.score / 100
                }),
                response: placedMarkers
            });

            var activity = new TinCan.Activity({
                id: questionUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    },
                    type: 'http://adlnet.gov/expapi/activities/cmi.interaction',
                    interactionType: interactionTypes.other,
                    correctResponsesPattern: [spots]
                })
            });

            return {
                object: activity,
                result: result
            };
        };
    }
}());