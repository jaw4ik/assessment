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

    course.publicationAccessControlList = _.reject(course.publicationAccessControlList, accessEntry => accessEntry.userIdentity === userIdentity);

    app.trigger(constants.messages.course.accessRemoved, courseId, userIdentity);
}