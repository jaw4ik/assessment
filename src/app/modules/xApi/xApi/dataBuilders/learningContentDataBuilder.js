(function () {
    'use strict';

    angular.module('assessment.xApi').factory('learningContentDataBuilder', factory);

    factory.$inject = ['xApiVerbs', 'sectionsQueries', 'dateTimeConverter'];

    function factory(verbs, sectionsQueries, dateTimeConverter) {

        return {
            learningContentExperienced: learningContentExperienced
        };

        function learningContentExperienced(question, spentTime, rootUrl) {
            var section = sectionsQueries.getSectionById(question.sectionId),
                questionUrl = rootUrl + '#section/' + section.id + '/question/' + question.id,
                parentUrl = rootUrl + '#sections?section_id=' + section.id,
                learningContentUrl = rootUrl + '#section/' + section.id + '/question/' + question.id + '/learningContents';

            var result = new TinCan.Result({
                duration: dateTimeConverter.timeToISODurationString(spentTime)
            });

            var activity = new TinCan.Activity({
                id: learningContentUrl,
                definition: new TinCan.ActivityDefinition({
                    name: {
                        'en-US': question.title
                    }
                })
            });

            var context = new TinCan.Context({
                contextActivities: new TinCan.ContextActivities({
                    parent: [new TinCan.Activity({
                        id: questionUrl,
                        definition: new TinCan.ActivityDefinition({
                            name: {
                                'en-US': question.title
                            }
                        })
                    })],
                    grouping: [new TinCan.Activity({
                        id: parentUrl,
                        definition: new TinCan.ActivityDefinition({
                            name: {
                                'en-US': section.title
                            }
                        })
                    })]
                })
            });

            return {
                object: activity,
                result: result,
                context: context,
                verb: verbs.experienced
            };
        }
    }
}());