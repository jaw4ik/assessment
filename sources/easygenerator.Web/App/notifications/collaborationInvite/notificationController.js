define(['userContext', 'constants', 'notifications/collaborationInvite/notification', 'durandal/app'],
    function (userContext, constants, Notification, app) {
        "use strict";

        var controller = {
            execute: execute,
            updateNotification: updateNotification
        };

        return controller;

        function execute() {
            return Q.fcall(function () {
                if (_.isNullOrUndefined(userContext.identity)) {
                    return;
                }

                controller.updateNotification();
            });
        }

        function updateNotification() {
            var notification = new Notification(constants.notification.keys.collaborationInvite, userContext.identity.firstname, 'trace@neo.com', 'Mega course');
            app.trigger(constants.notification.messages.push, notification);
        }
    });