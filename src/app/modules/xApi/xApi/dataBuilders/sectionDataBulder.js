(function () {
    'use strict';

    angular.module('assessment.xApi').factory('sectionDataBuilder', factory);

    factory.$inject = ['xApiVerbs'];

    function factory(verbs) {
        return {
            sectionMasteredData: sectionMasteredData
        };

        function sectionMasteredData(section, rootUrl) {
            var sectionUrl = rootUrl + '#sections?section_id=' + section.id;

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: section.getResult() / 100
                })
            });

            var activity = new TinCan.Activity({
                id: sectionUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': section.title
                    }
                })
            });

            return {
                verb: verbs.mastered,
                object: activity,
                result: result,
            };
        }
    }
}());