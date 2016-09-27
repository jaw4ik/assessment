import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import dataContext from 'dataContext';
import _ from 'underscore';

export default function(courseId, userIdentity) {
    guard.throwIfNotString(courseId, 'courseId is not a string');
    guard.throwIfNotString(userIdentity, 'userIdentity is not a string');

    var course = _.find(dataContext.courses, function (item) {
        return item.id === courseId;
    });

    guard.throwIfNotAnObject(course, 'Course has not been found');

    let entry = _.find(course.publicationAccessControlList, entry => entry.userIdentity === userIdentity);
    if (entry) {
        entry.userInvited = true;
    }

    app.trigger(constants.messages.course.invitationSended, courseId, userIdentity);
}