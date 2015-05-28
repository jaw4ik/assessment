define(['durandal/app', 'notifications/collaborationInvite/commands/acceptInvite', 'notifications/collaborationInvite/commands/declineInvite', 'constants'],
function (app, acceptInvite, declineInvite, constants) {

    "use strict";

    return function (key, id, courseId, firstname, courseAuthorFirstname, courseAuthorLastname, courseTitle) {
        this.key = key;
        this.firstname = firstname;
        this.courseTitle = ko.observable(courseTitle);

        this.courseAuthorFirstname = courseAuthorFirstname;
        this.courseAuthorLastname = courseAuthorLastname;
        this.coauthorAvatarLetter = courseAuthorFirstname.charAt(0);
        this.on = on;
        this.off = off;
        this.accept = accept;
        this.decline = decline;
        this.courseTitleUpdated = courseTitleUpdated;
        this.isAccepting = ko.observable(false);
        this.isDeclining = ko.observable(false);
        var that = this;

        function courseTitleUpdated(title) {
            that.courseTitle(title);
        }

        function on() {
            app.on(constants.messages.course.collaboration.inviteCourseTitleUpdated + courseId, courseTitleUpdated);
        }

        function off() {
            app.off(constants.messages.course.collaboration.inviteCourseTitleUpdated + courseId, courseTitleUpdated);
        }

        function accept() {
            that.isAccepting(true);

            return acceptInvite.execute(courseId, id)
                .then(function () {
                    app.trigger(constants.notification.messages.remove, key);
                })
                .fin(function () {
                    that.isAccepting(false);
                });
        }

        function decline() {
            that.isDeclining(true);

            return declineInvite.execute(courseId, id)
                .then(function () {
                    app.trigger(constants.notification.messages.remove, key);
                })
                .fin(function () {
                    that.isDeclining(false);
                });
        }
    };

});