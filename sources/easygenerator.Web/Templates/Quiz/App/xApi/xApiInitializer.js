define(['eventManager', './routingManager', './requestManager', './activityProvider'],
    function (eventManager, routingManager, requestManager, activityProvider) {

        "use strict";

        var
            isInitialized = false,

            xApiInitializer = {
                init: init,
                getInitStatus: getInitStatus,
                turnOff: turnOff,

                initialize: initialize,

                createActor: activityProvider.createActor
            };

        return xApiInitializer;

        function init(actorData, activityName, activityUrl) {
            return Q.fcall(function () {
                return requestManager.init();
            }).then(function () {
                return activityProvider.init(actorData, activityName, activityUrl);
            }).then(function () {
                isInitialized = true;
            });
        }

        function getInitStatus() {
            return isInitialized;
        }

        function turnOff() {
            eventManager.turnAllEventsOff();
            routingManager.removeRoutes();
            isInitialized = false;
        }

        //Initialization function for moduleManager
        function initialize() {
            return Q.fcall(function () {
                routingManager.mapRoutes(xApiInitializer);
            });
        }

    }
);