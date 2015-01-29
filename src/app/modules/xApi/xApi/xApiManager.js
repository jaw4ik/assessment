(function () {
    'use strict';

    angular.module('quiz.xApi')
        .service('xAPIManager', xAPIManager);

    xAPIManager.$inject = ['errorsHandler', 'xApiDataBuilder', 'xApiEventsHandler', 'xApiSettings', 'xApiRequestManager'];

    function xAPIManager(errorsHandler, xApiDataBuilder, xApiEventsHandler, xApiSettings, xApiRequestManager) {
        var xApi = null,
            actor = null;

        return {
            init: init,
            off: off
        };

        function init(id, title, absUrl, email, username) {
            xApiSettings.init();
            
            xApi = new TinCan();
            xApi.addRecordStore(createLRS());
            xApi.actor = createActor(username, email);
            
            xApiRequestManager.init(xApi);
            xApiDataBuilder.init(id, title, absUrl, xApi.actor);
        }

        function off() {
            xApiEventsHandler.off();
        }

        function createLRS() {
            var xApi = xApiSettings.xApi;
            var lrsUrl = xApi.lrs.uri.split('/statements')[0];
            var endpointUrl = lrsUrl;
            if (lrsUrl.slice(0,4) !== 'http') {
                endpointUrl = location.protocol + endpointUrl;
            }
            return new TinCan.LRS({
                endpoint: endpointUrl,
                version: xApi.version,
                username: xApi.lrs.credentials.username,
                password: xApi.lrs.credentials.password,
                allowFail: false
            });
        }

        function createActor(username, email) {
            try {
                actor = new TinCan.Agent({
                    name: username,
                    mbox: 'mailto:' + email
                });
            } catch (e) {
                errorsHandler.handleError();
            }
            return actor;
        }
    }
}());