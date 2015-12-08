define(['http/apiHttpWrapper', 'guard', 'models/comment'],
    function (apiHttpWrapper, guard, Comment) {
        "use strict";

        var repository = {
            getCollection: getCollection,
            removeComment: removeComment
        };

        return repository;

        function getCollection(courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');

                return apiHttpWrapper.post('api/comments', { courseId: courseId }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotArray(response.Comments, 'Comments is not an array');

                    return _.map(response.Comments, function (comment) {
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

        function removeComment(courseId, commentId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotString(commentId, 'Comment id is not a string');

                var data = {
                    courseId: courseId,
                    commentId: commentId
                };

                return apiHttpWrapper.post('api/comment/delete', data).then(function (response) {
                    guard.throwIfNotBoolean(response, 'Response is not a boolean');

                    return response;
                });
            });
        }
    }
);