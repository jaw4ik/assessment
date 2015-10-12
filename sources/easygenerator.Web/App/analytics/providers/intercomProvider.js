define(['userContext'], function (userContext) {
    'use strict';

    return function () {
        var
            identify = function () {
                var intercom = window.Intercom;

                if (!intercom) {
                    return;
                }

                var username = _.isObject(userContext.identity) ? userContext.identity.email : '';
                var fullname = _.isObject(userContext.identity) ? userContext.identity.firstname + ' ' + userContext.identity.lastname : '';

                intercom('boot', { app_id: window.analytics.intercomapp_id, email: username, name: fullname });
            },

            trackEvent = function () {
                var intercom = window.Intercom;

                if (!intercom) {
                    return;
                }

                intercom('update');
            };


        return {
            trackEvent: trackEvent,
            identify: identify
        };
    };
});