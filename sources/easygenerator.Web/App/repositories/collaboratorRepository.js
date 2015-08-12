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

        function add(courseId, collaboratorEmail) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotString(collaboratorEmail, 'Collaborator email is not a string');

                return apiHttpWrapper.post('api/course/collaborator/add',
                    {
                        courseId: courseId,
                        collaboratorEmail: collaboratorEmail
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
            
        function remove(courseId, collaboratorEmail) {
            return Q.fcall(function () {
                guard.throwIfNotString(courseId, 'Course id is not a string');
                guard.throwIfNotString(collaboratorEmail, 'Collaborator email is not a string');

                var course = _.find(dataContext.courses, function (item) {
                    return item.id == courseId;
                });

                guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');
                
                var collaborator = _.find(course.collaborators, function (item) {
                    return item.email == collaboratorEmail;
                });

                guard.throwIfNotAnObject(collaborator, 'Collaborator does not exist in course');

                if (collaborator.state !== constants.collaboratorStates.deleting) {
                    collaborator.state = constants.collaboratorStates.deleting;

                    return apiHttpWrapper.post('api/course/collaborator/remove',
                        {
                            courseId: courseId,
                            collaboratorEmail: collaboratorEmail
                        })
                        .then(function () {
                            course.collaborators = _.without(course.collaborators, collaborator);
                            return collaborator;
                        })
                        .fin(function () {
                            collaborator.state = '';
                        });
                }
            });
        }
    }
);