(function () {
    'use strict';

    angular.module('assessment.xApi').factory('courseDataBuilder', factory);

    factory.$inject = ['xApiVerbs'];

    function factory(verbs) {
        return {
            courseStartedData: courseStartedData,
            courseResultData: courseResultData,
            courseStoppedData: courseStoppedData
        };

        function courseStartedData() {
            return {
                verb: verbs.started
            };
        }

        function courseResultData(course) {
            var resultVerb = course.isCompleted ? verbs.passed : verbs.failed;

            var result = new TinCan.Result({
                score: new TinCan.Score({
                    scaled: course.getResult() / 100
                })
            });

            return {
                verb: resultVerb,
                result: result
            };
        }

        function courseStoppedData() {
            return {
                verb: verbs.stopped
            };
        }
    }
}());