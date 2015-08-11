define(['repositories/courseRepository', 'localization/localizationManager', 'eventTracker', 'plugins/router', 'clientContext', 'constants'],
    function (repository, localizationManager, eventTracker, router, clientContext, constants) {

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