define(['repositories/courseRepository', 'routing/router', 'clientContext', 'constants'],
    function (repository, router, clientContext, constants) {

        return {
            execute: function (title, templateId) {
                return repository.addCourse(title, templateId).then(function (course) {
                    clientContext.set(constants.clientContextKeys.lastCreatedCourseId, course.id);
                    return course;
                });
            }
        };
    }
);