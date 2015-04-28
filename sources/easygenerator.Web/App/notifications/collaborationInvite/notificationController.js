define(['userContext', 'constants', 'notifications/collaborationInvite/notification', 'durandal/app', 'notifications/collaborationInvite/queries/getInvites'],
    function (userContext, constants, Notification, app, getInvitesQuery) {
        "use strict";

        var controller = {
            execute: execute,
            pushNotification: pushNotification
        };

        return controller;

        function execute() {
            return Q.fcall(function () {
                if (_.isNullOrUndefined(userContext.identity)) {
                    return;
                }

                return getInvitesQuery.execute().then(function (invites) {
                    _.each(invites, function (invite) {
                        pushNotification(invite.Id, invite.CourseAuthorFirstName, invite.CourseAuthorLastName, invite.CourseTitle);
                    });
                });
            });
        }

        function pushNotification(inviteId, courseAuthorFirstName, courseAuthorLastName, courseTitle) {
            var notification = new Notification(constants.notification.keys.collaborationInvite + inviteId,
                inviteId,
                userContext.identity.firstname,
                courseAuthorFirstName,
                courseAuthorLastName,
                courseTitle);

            app.trigger(constants.notification.messages.push, notification);
        }
    });