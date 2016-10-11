import guard from 'guard';
import app from 'durandal/app';
import constants from 'constants';
import dataContext from 'dataContext';

export default function(courseId, modifiedOn) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotDate(new Date(modifiedOn), 'ModifiedOn is not a date');

    let course = _.find(dataContext.courses, item => item.id === courseId);
    
    if(!_.isUndefined(course)) {
        course.modifiedOn = modifiedOn;
    
        app.trigger(constants.messages.course.modified, course);
    }
};