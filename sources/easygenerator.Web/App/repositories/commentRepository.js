﻿define(['httpWrapper', 'guard', 'models/comment'], function (httpWrapper, guard, Comment) {

    var
        getCollection = function (courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');

                return httpWrapper.post('api/comments', { courseId: courseId }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotArray(response.Comments, 'Comments is not an array');

                    return _.map(response.Comments, function (comment) {
                        return new Comment({
                            id: comment.Id,
                            text: comment.Text,
                            createdOn: comment.CreatedOn
                        });
                    });
                });
            });
        };

    return {
        getCollection: getCollection
    };

});