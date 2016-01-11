define(['repositories/courseRepository', 'plugins/router', 'clientContext', 'constants'],
    function (repository, router, clientContext, constants) {

        return {
            execute: function (type, title, embedCode) {
                return repository.addCourse(title, templateId).then(function (course) {
                    clientContext.set(constants.clientContextKeys.lastCreatedCourseId, course.id);
                    return course;
                });
            }
        };
    }
);