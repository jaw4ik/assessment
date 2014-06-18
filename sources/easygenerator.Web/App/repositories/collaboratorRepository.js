﻿define(['http/httpRequestSender', 'guard', 'dataContext', 'mappers/collaboratorModelMapper'],
    function (httpWrapper, guard, dataContext, collaboratorModelMapper) {
        "use strict";

        var repository = {
            getCollection: getCollection,
            add: add
        };

        return repository;

        function getCollection(courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'CourseId is not a string');

                return httpWrapper.post('api/course/collaborators', { courseId: courseId }).then(function (response) {
                    guard.throwIfNotAnObject(response, 'Response is not an object');
                    guard.throwIfNotArray(response.data, 'Response data is not an array');
                    return _.map(response.data, function (collaborator) {
                        return collaboratorModelMapper.map(collaborator);
                    });
                });
            });
        }

        function add(courseId, email) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotString(email, 'Email is not a string');

                return httpWrapper.post('api/course/collaborator/add',
                    {
                        courseId: courseId,
                        email: email
                    })
                    .then(function (response) {
                        guard.throwIfNotAnObject(response, 'Response is not an object');

                        if (!response.success) {
                            throw response.errorMessage;
                        }

                        var data = response.data;
                        if (!_.isObject(data)) {
                            return null;
                        }

                        guard.throwIfNotString(data.Email, 'Email is not a string');

                        return collaboratorModelMapper.map(data);
                    });
            });
        }

    }
);