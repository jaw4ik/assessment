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
                var role = _.isObject(userContext.identity) ? userContext.identity.role : '';
                var phone = _.isObject(userContext.identity) ? userContext.identity.phone : '';
                var profileLink = _.isObject(userContext.identity) ? 'http://' + window.location.host + '/dashboard/users?email=' + encodeURIComponent(userContext.identity.email): '';

                var plan = _.isObject(userContext.identity) && _.isObject(userContext.identity.subscription) ? userContext.identity.subscription.accessType : '';
                var userPlan = '';

                switch (plan) {
                    case 0:
                        {
                            userPlan = 'Free';
                            break;
                        }
                    case 1:
                        {
                            userPlan = 'Starter';
                            break;
                        }
                    case 2:
                        {
                            userPlan = 'Plus';
                            break;
                        }
                    case 3:
                        {
                            userPlan = 'Academy';
                            break;
                        }
                    case 4:
                        {
                            userPlan = 'AcademyBT';
                            break;
                        }
                    case 100:
                        {
                            userPlan = 'Trial';
                            break;
                        }
                    default:
                        {
                            userPlan = '';
                            break;
                        }
                }

                intercom('boot', { app_id: window.analytics.intercomapp_id, email: username, name: fullname, role: role, phone: phone, plan: userPlan, profile: profileLink });
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