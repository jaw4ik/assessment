define(['guard', 'durandal/app', 'constants'],
    function (guard, app, constants) {
        "use strict";

        return function (courseId, commentId) {
            guard.throwIfNotString(courseId, 'CourseId is not a string');
            guard.throwIfNotString(commentId, 'CommentId is not a string');
            
            app.trigger(constants.messages.course.comment.deletedByCollaborator, courseId, commentId);
        }
    });