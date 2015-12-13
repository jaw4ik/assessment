import _ from 'underscore';
import apiHttpWrapper from 'http/apiHttpWrapper';
import guard from 'guard';
import Comment from 'models/comment';

class CommentRepository {
    getCollection(courseId) {
        return Q.fcall(() => {
            guard.throwIfNotString(courseId, 'Course id is not a string');

            return apiHttpWrapper.post('api/comments', { courseId: courseId }).then((response) => {
                guard.throwIfNotAnObject(response, 'Response is not an object');
                guard.throwIfNotArray(response.Comments, 'Comments is not an array');

                return _.map(response.Comments, (comment) => {
                    return new Comment({
                        id: comment.Id,
                        text: comment.Text,
                        email: comment.CreatedBy,
                        name: comment.CreatedByName,
                        createdOn: comment.CreatedOn
                    });
                });
            });
        });
    }

    removeComment(courseId, commentId) {
        return Q.fcall(() => {
            guard.throwIfNotString(courseId, 'Course id is not a string');
            guard.throwIfNotString(commentId, 'Comment id is not a string');

            let data = {
                courseId: courseId,
                commentId: commentId
            };

            return apiHttpWrapper.post('api/comment/delete', data).then((response) => {
                guard.throwIfNotBoolean(response, 'Response is not a boolean');

                return response;
            });
        });
    }

    restoreComment(courseId, comment) {
        return Q.fcall(() => {
            guard.throwIfNotString(courseId, 'Course id is not a string');
            guard.throwIfNotAnObject(comment, 'Comment data is not an object');
            guard.throwIfNotString(comment.text, 'Comment text is not a string');
            guard.throwIfNotString(comment.name, 'Comment name is not a string');
            guard.throwIfNotString(comment.email, 'Comment email is not a string');
            guard.throwIfNotDate(new Date(comment.createdOn), 'Comment createdOn is not a date');

            let data = {
                courseId: courseId,
                text: comment.text,
                createdByName: comment.name,
                createdBy: comment.email,
                createdOn: comment.createdOn
            };
            return apiHttpWrapper.post('api/comment/restore', data).then((response) => {
                guard.throwIfNotString(response, 'Response is not a string');

                return response;
            });
        });
    }
}


let viewModel = new CommentRepository();
export default viewModel;