define(['durandal/app', 'notifications/collaborationInvite/commands/acceptInvite', 'notifications/collaborationInvite/commands/declineInvite', 'constants'],
function (app, acceptInvite, declineInvite, constants) {

    "use strict";

    return function (key, id, firstname, courseAuthorFirstname, courseAuthorLastname, courseTitle) {
        this.key = key;
        this.firstname = firstname;
        this.courseTitle = courseTitle;

        this.courseAuthorFirstname = courseAuthorFirstname;
        this.courseAuthorLastname = courseAuthorLastname;
        this.coauthorAvatarLetter = courseAuthorFirstname.charAt(0);
        this.accept = accept;
        this.decline = decline;

        function accept() {
            return acceptInvite.execute(id).then(function () {
                app.trigger(constants.notification.messages.remove, key);
            });
        }

        function decline() {
            return declineInvite.execute(id).then(function () {
                app.trigger(constants.notification.messages.remove, key);
            });
        }
    };

});