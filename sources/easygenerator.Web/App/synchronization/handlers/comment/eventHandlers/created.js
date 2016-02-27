import _ from 'underscore';
import guard from 'guard';
import app from 'durandal/app';
import constants from 'constants';
import dataContext from 'dataContext';
import commentMapper from 'mappers/commentModelMapper';

export default function (courseId, commentData) {
    guard.throwIfNotString(courseId, 'CourseId is not a string');
    guard.throwIfNotAnObject(commentData, 'CommentData is not an object');

    var course = _.find(dataContext.courses, function (item) {
        return item.id === courseId;
    });

    guard.throwIfNotAnObject(course, 'Course is not an object');

    let comment = commentMapper.map(commentData);

    if (course.comments) {
        course.comments.push(comment);
    }
            
    app.trigger(constants.messages.course.comment.createdByCollaborator + courseId, comment);
}