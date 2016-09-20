import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import dataContext from 'dataContext';
import _ from 'underscore';

export default function(courseId, userIdentities, withInvitation) {
    guard.throwIfNotString(courseId, 'courseId is not a string');
    guard.throwIfNotArray(userIdentities, 'userIdentities is not an array');
    guard.throwIfNotBoolean(withInvitation, 'withInvitation is not a boolean');

    var course = _.find(dataContext.courses, function (item) {
        return item.id === courseId;
    });

    guard.throwIfNotAnObject(course, 'Course has not been found');

    _.each(userIdentities, userIdentity => {
        let entry = _.find(course.publicationAccessControlList, entry => entry.userIdentity === userIdentity);
        if (!entry) {
            course.publicationAccessControlList.unshift({
                userIdentity: userIdentity,
                userInvited: withInvitation
            });
        } else if (withInvitation) {
            entry.userInvited = withInvitation;
        }
    });

    app.trigger(constants.messages.course.accessGranted, courseId, userIdentities, withInvitation);
}