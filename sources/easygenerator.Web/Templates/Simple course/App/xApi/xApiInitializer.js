define(['plugins/router', './routingManager', './requestManager', './activityProvider', 'browserSupport', 'xApi/configuration/xApiSettings', './statementQueueHandler'],
    function (router, routingManager, requestManager, activityProvider, browserSupport, xApiSettings, statementQueueHandler) {
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
            return Q.all([
                xApiSettings.init(moduleSettings),
                requestManager.init(moduleSettings),
                activityProvider.init(actorData, activityName, activityUrl)
            ]).spread(function () {
                isInitialized = true;
                statementQueueHandler.handle();
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