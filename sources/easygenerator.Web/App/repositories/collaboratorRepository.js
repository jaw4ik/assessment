define(['http/apiHttpWrapper', 'guard', 'dataContext', 'mappers/collaboratorModelMapper', 'constants'],
    function (apiHttpWrapper, guard, dataContext, collaboratorModelMapper, constants) {
        "use strict";

        var repository = {
            getCollection: getCollection,
            add: add,
            remove: remove
        };

        return repository;

        function getCollection(courseId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'CourseId is not a string');

                var course = _.find(dataContext.courses, function (item) {
                    return item.id == courseId;
                });

                guard.throwIfNotAnObject(course, 'Course does not exist');

                if (!_.isNullOrUndefined(course.collaborators)) {
                    return course.collaborators;
                }

                return apiHttpWrapper.post('api/course/collaborators', { courseId: courseId }).then(function (data) {
                    guard.throwIfNotArray(data, 'Response data is not an array');
                    var collaborators = _.map(data, function (collaborator) {
                        return collaboratorModelMapper.map(collaborator);
                    });

                    course.collaborators = collaborators;
                    return collaborators;
                });
            });
        }

        function add(courseId, email) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotString(email, 'Email is not a string');

                return apiHttpWrapper.post('api/course/collaborator/add',
                    {
                        courseId: courseId,
                        email: email
                    })
                    .then(function (data) {
                        if (!_.isObject(data)) {
                            return null;
                        }

                        guard.throwIfNotString(data.Email, 'Email is not a string');

                        var course = _.find(dataContext.courses, function (item) {
                            return item.id == courseId;
                        });

                        guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

                        var collaborator = collaboratorModelMapper.map(data);
                        if (!_.isNullOrUndefined(course.collaborators)) {
                            course.collaborators.push(collaborator);
                        }

                        return collaborator;
                    });
            });
        }

        function remove(courseId, collaborationId) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotString(collaborationId, 'Collaboration id is not a string');

                var course = _.find(dataContext.courses, function (item) {
                    return item.id == courseId;
                });

                guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');

                var collaboration = _.find(course.collaborators, function (item) {
                    return item.id == collaborationId;
                });

                guard.throwIfNotAnObject(collaboration, 'Collaborator does not exist in course');

                if (collaboration.state !== constants.collaboratorStates.deleting) {
                    collaboration.state = constants.collaboratorStates.deleting;

                    return apiHttpWrapper.post('api/course/collaborator/remove',
                        {
                            courseId: courseId,
                            courseCollaboratorId: collaborationId
                        })
                        .then(function () {
                            course.collaborators = _.without(course.collaborators, collaboration);
                            return collaboration;
                        })
                        .fin(function () {
                            collaboration.state = '';
                        });
                }
            });
        }
    }
);