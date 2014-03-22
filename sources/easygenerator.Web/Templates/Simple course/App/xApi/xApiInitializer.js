define(['plugins/router', './routingManager', './requestManager', './activityProvider', 'browserSupport', 'xApi/configuration/xApiSettings'],
    function (router, routingManager, requestManager, activityProvider, browserSupport, xApiSettings) {

        "use strict";

        var
            isInitialized = false,
            moduleSettings = null,

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
                return xApiSettings.init(moduleSettings);
            }).then(function () {
                return requestManager.init(moduleSettings);
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
            activityProvider.turnOffSubscriptions();
            routingManager.removeRoutes();
            isInitialized = false;
        }

        //Initialization function for moduleManager
        function initialize(settings) {
            return Q.fcall(function () {
                if (settings.lrs.uri && !isLRSProtocolSupported(settings.lrs.uri)) {
                    routingManager.createGuard(xApiInitializer, 'xapinotsupported');
                } else {
                    moduleSettings = settings;
                    routingManager.createGuard(xApiInitializer, 'login');
                }
                routingManager.mapRoutes();
            });
        }

        function isLRSProtocolSupported(lrsUri) {
            var lrsProtocol = lrsUri.match("^(.*:)");
            return !(browserSupport.isIE9 && lrsProtocol && lrsProtocol[0].toLowerCase() != window.location.protocol.toLowerCase());
        }
    }
);