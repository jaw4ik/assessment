define(['eventManager', 'APIWrapper'],
    function (eventManager, apiWrapper) {

        "use strict";

        var initialized = null,
            moduleSettings = null,
            scormInitializer = {
                initialize: initialize,
                dispose: dispose
            };

        return scormInitializer;

        //Initialization function for moduleManager

        function initialize(settings) {
            return Q.fcall(function () {
                moduleSettings = settings;

                initialized = apiWrapper.doLMSInitialize();
                if (initialized == "true") {
                    eventManager.subscribeForEvent(eventManager.events.courseFinished).then(sendCourseFinished);
                }
            });
        }
        
        function dispose() {
            if (initialized) {
                apiWrapper.doLMSFinish();
            }
        }

        function sendCourseFinished(finishedEventData) {
            apiWrapper.doLMSSetValue("cmi.core.score.min", "0");
            apiWrapper.doLMSSetValue("cmi.core.score.max", "100");
            apiWrapper.doLMSSetValue("cmi.core.score.raw", finishedEventData.result * 100);

            apiWrapper.doLMSCommit();
        }
    }
);