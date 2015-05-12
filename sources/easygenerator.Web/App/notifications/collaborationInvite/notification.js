define(['durandal/app', 'notifications/collaborationInvite/commands/acceptInvite', 'notifications/collaborationInvite/commands/declineInvite', 'constants'],
function (app, acceptInvite, declineInvite, constants) {

    "use strict";

    return function (key, id, courseId, firstname, courseAuthorFirstname, courseAuthorLastname, courseTitle) {
        this.key = key;
        this.id = id;
        this.courseId = courseId;
        this.firstname = firstname;
        this.courseTitle = courseTitle;

        this.courseAuthorFirstname = courseAuthorFirstname;
        this.courseAuthorLastname = courseAuthorLastname;
        this.coauthorAvatarLetter = courseAuthorFirstname.charAt(0);
        this.accept = accept;
        this.decline = decline;
        this.isAccepting = ko.observable(false);
        this.isDeclining = ko.observable(false);
        var that = this;

        function accept() {
            that.isAccepting(true);

            return acceptInvite.execute(that.courseId, that.id)
                .then(function () {
                    app.trigger(constants.notification.messages.remove, key);
                })
                .fin(function () {
                    that.isAccepting(false);
                });
        }

        function decline() {
            that.isDeclining(true);

            return declineInvite.execute(that.courseId, that.id)
                .then(function () {
                    app.trigger(constants.notification.messages.remove, key);
                })
                .fin(function () {
                    that.isDeclining(false);
                });
        }
    };

});