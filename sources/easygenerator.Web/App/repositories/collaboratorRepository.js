define(['http/httpRequestSender', 'guard', 'models/collaborator', 'dataContext', 'mappers/collaboratorModelMapper'],
    function (httpWrapper, guard, Collaborator, dataContext, collaboratorModelMapper) {
        "use strict";

        var repository = {
            add: add
        };

        return repository;

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

                        var course = _.find(dataContext.courses, function (item) {
                            return item.id == courseId;
                        });

                        guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');
                        var collaborator = collaboratorModelMapper.map(data);
                        course.collaborators.push(collaborator);

                        return collaborator;
                    });
            });
        }

    }
);