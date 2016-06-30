import app from 'durandal/app';
import guard from 'guard';
import constants from 'constants';
import dataContext from 'dataContext';
import _ from 'underscore';

export default function(courseId, ownership) {
    guard.throwIfNotString(courseId, 'courseId is not a string');
    guard.throwIfNotNumber(ownership, 'ownership is not a number');

    var course = _.find(dataContext.courses, function (item) {
        return item.id === courseId;
    });

    guard.throwIfNotAnObject(course, 'Course has not been found');

    course.ownership = ownership;
    app.trigger(constants.messages.course.ownershipUpdated, courseId, ownership);
}