define(['userContext', 'constants', 'notifications/collaborationInvite/notification', 'durandal/app', './queries/getInvites'],
    function (userContext, constants, Notification, app, getInvitesQuery) {
        "use strict";

        var controller = {
            execute: execute,
            pushNotification: pushNotification,
            removeNotification: removeNotification
        };

        return controller;

        function execute() {
            return Q.fcall(function () {
                if (_.isNullOrUndefined(userContext.identity)) {
                    return;
                }

                app.on(constants.messages.course.collaboration.inviteCreated, controller.pushNotification);
                app.on(constants.messages.course.collaboration.inviteRemoved, controller.removeNotification);

                return getInvitesQuery.execute().then(function (invites) {
                    _.each(invites, function (invite) {
                        controller.pushNotification(invite);
                    });
                });
            });
        }

        function pushNotification(invite) {
            var notification = new Notification(constants.notification.keys.collaborationInvite + invite.Id,
                invite.Id,
                invite.CourseId,
                userContext.identity.firstname,
                invite.CourseAuthorFirstName,
                invite.CourseAuthorLastName,
                invite.CourseTitle);

            app.trigger(constants.notification.messages.push, notification);
        }

        function removeNotification(inviteId) {
            app.trigger(constants.notification.messages.remove, constants.notification.keys.collaborationInvite + inviteId);
        }
    });