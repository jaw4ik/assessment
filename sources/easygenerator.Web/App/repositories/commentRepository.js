define(['http/apiHttpWrapper', 'guard', 'models/comment'],
    function (apiHttpWrapper, guard, Comment) {
        "use strict";

        var repository = {
            getCollection: getCollection
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
                            createdOn: comment.CreatedOn
                        });
                    });
                });
            });
        }

    }
);