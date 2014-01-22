define(['eventManager', 'APIWrapper'],
    function (eventManager, apiWrapper) {

        "use strict";

        var moduleSettings = null,
            scormInitializer = {
                initialize: initialize
            };

        return scormInitializer;

        //Initialization function for moduleManager

        function initialize(settings) {
            return Q.fcall(function () {
                moduleSettings = settings;

                var result = apiWrapper.doLMSInitialize();
                if (result == "true") {
                    eventManager.subscribeForEvent(eventManager.events.courseFinished).then(sendCourseFinished);
                    eventManager.subscribeForEvent(eventManager.events.courseStopped).then(sendCourseStopped);
                }
            });
        }

        function sendCourseFinished(finishedEventData) {
            apiWrapper.doLMSSetValue("cmi.core.score.min", "0");
            apiWrapper.doLMSSetValue("cmi.core.score.max", "100");
            apiWrapper.doLMSSetValue("cmi.core.score.raw", finishedEventData.result * 100);

            apiWrapper.doLMSCommit();
        }
        
        function sendCourseStopped() {
            apiWrapper.doLMSFinish();
        }
    }
);