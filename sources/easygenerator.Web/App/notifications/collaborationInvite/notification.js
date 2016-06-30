define(['durandal/app', './commands/acceptInvite', './commands/declineInvite', 'constants'],
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
        this.collaborationStarted = collaborationStarted;
        this.isAccepting = ko.observable(false);
        this.isDeclining = ko.observable(false);
        var that = this;

        function courseTitleUpdated(title) {
            that.courseTitle(title);
        }

        function removeNotification() {
            app.trigger(constants.notification.messages.remove, that.key);
        }

        function collaborationStarted(course) {
            if (course.id !== courseId)
                return;

            removeNotification();
        }

        function on() {
            app.on(constants.messages.course.collaboration.inviteCourseTitleUpdated + courseId, courseTitleUpdated);
            app.on(constants.messages.course.collaboration.inviteRemoved + courseId, removeNotification);
            app.on(constants.messages.course.collaboration.started, collaborationStarted);
        }

        function off() {
            app.off(constants.messages.course.collaboration.inviteCourseTitleUpdated + courseId, courseTitleUpdated);
            app.off(constants.messages.course.collaboration.inviteRemoved + courseId, removeNotification);
            app.off(constants.messages.course.collaboration.started, collaborationStarted);
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