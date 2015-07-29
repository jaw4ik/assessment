(function () {
    'use strict';

    angular.module('assessment.xApi').factory('xApiVerbs', xApiVerbs);

    function xApiVerbs() {
        var verbs = {
            started: {
                id: 'http://adlnet.gov/expapi/verbs/launched',
                display: {
                    'en-US': 'started'
                }
            },
            stopped: {
                id: 'http://adlnet.gov/expapi/verbs/exited',
                display: {
                    'en-US': 'stopped'
                }
            },
            passed: {
                id: 'http://adlnet.gov/expapi/verbs/passed',
                display: {
                    'en-US': 'passed'
                }
            },
            failed: {
                id: 'http://adlnet.gov/expapi/verbs/failed',
                display: {
                    'en-US': 'failed'
                }
            },
            experienced: {
                id: 'http://adlnet.gov/expapi/verbs/experienced',
                display: {
                    'en-US': 'experienced'
                }
            },
            answered: {
                id: 'http://adlnet.gov/expapi/verbs/answered',
                display: {
                    'en-US': 'answered'
                }
            },
            mastered: {
                id: 'http://adlnet.gov/expapi/verbs/mastered',
                display: {
                    'en-US': 'mastered'
                }
            }
        };

        return verbs;
    }

}());