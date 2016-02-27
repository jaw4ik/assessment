import _ from 'underscore';
import guard from 'guard';
import app from 'durandal/app';
import constants from 'constants';
import dataContext from 'dataContext';

export default function (courseId, commentId){
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotString(commentId, 'CommentId is not a string');

    var course = _.find(dataContext.courses, function (item) {
        return item.id === courseId;
    });

    guard.throwIfNotAnObject(course, 'Course is not an object');

    if (course.comments) {
        course.comments = _.reject(course.comments, function (item) {
            return item.id === commentId;
        });
    }
            
    app.trigger(constants.messages.course.comment.deletedByCollaborator + courseId, commentId);
}