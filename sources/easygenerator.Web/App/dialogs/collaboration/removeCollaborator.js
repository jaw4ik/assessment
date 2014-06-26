define(['eventTracker', 'plugins/dialog', 'repositories/collaboratorRepository', 'durandal/app', 'constants', 'plugins/router'],
    function (eventTracker, dialog, collaboratorRepository, app, constants, router) {
        "use strict";

        var events = {
            removeCollaborator: 'Remove collaborator'
        };

        var ctor = function (collaboratorId, avatarLetter, name) {
            this.collaborationId = collaboratorId;
            this.isShown = ko.observable(false);
            this.avatarLetter = avatarLetter;
            this.displayName = name;

            this.show = function () {
                this.isShown(true);
            }

            this.hide = function () {
                this.isShown(false);
            }

            this.removeCollaborator = function () {
                this.hide();
                eventTracker.publish(events.removeCollaborator);
                var collaborationId = this.collaborationId;
                var courseId = router.routeData().courseId;;
                app.trigger(constants.messages.course.collaboration.deleting.started + collaborationId, collaborationId);
                return collaboratorRepository.remove(courseId, this.collaborationId).then(function (collaboration) {
                    app.trigger(constants.messages.course.collaboration.deleting.completed + collaborationId, collaboration);
                    app.trigger(constants.messages.course.collaboration.collaboratorRemoved + courseId, collaboration.email);
                }).fail(function (errorMessage) {
                    app.trigger(constants.messages.course.collaboration.deleting.failed + collaborationId, errorMessage);
                });
            }
        };

        return ctor;
    });