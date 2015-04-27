define(['guard', 'durandal/app', 'constants', 'dataContext'], function (guard, app, constants, dataContext) {
    'use strict';

    return function (email, fullName) {
        guard.throwIfNotString(email, 'email is not a string');
        guard.throwIfNotString(fullName, 'fullName is not a string');

        _.each(dataContext.courses, function (course) {
            if (_.isNullOrUndefined(course.collaborators)) {
                return;
            }

            var registeredCollaborator = _.find(course.collaborators, function (item) {
                return item.email == email;
            });

            if (_.isNullOrUndefined(registeredCollaborator)) {
                return;
            }

            registeredCollaborator.registered = true;
            registeredCollaborator.fullName = fullName;
        });

        app.trigger(constants.messages.course.collaboration.collaboratorRegistered + email, { fullName: fullName });
    };
});