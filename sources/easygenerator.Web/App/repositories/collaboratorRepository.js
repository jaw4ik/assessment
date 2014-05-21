define(['http/httpRequestSender', 'guard', 'models/collaborator', 'dataContext', 'durandal/app', 'constants'],
    function (httpWrapper, guard, Collaborator, dataContext, app, constants) {
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
                            return undefined;
                        }

                        guard.throwIfNotString(data.Email, 'Email is not a string');
                        guard.throwIfNotString(data.FullName, 'Fullname is not a string');

                        var course = _.find(dataContext.courses, function (item) {
                            return item.id == courseId;
                        });

                        guard.throwIfNotAnObject(course, 'Course does not exist in dataContext');
                        var collaborator = new Collaborator({
                            email: data.Email,
                            fullName: data.FullName
                        });

                        course.collaborators.push(collaborator);
                        app.trigger(constants.messages.course.collaboration.collaboratorAdded, collaborator);

                        return collaborator;
                    });
            });
        }

    }
);