define(['repositories/courseRepository', 'localization/localizationManager', 'eventTracker', 'plugins/router', 'clientContext', 'constants'],
    function (repository, localizationManager, eventTracker, router, clientContext, constants) {

        return {
            execute: function (eventCategory) {
                eventTracker.publish('Create course and open its properties', eventCategory);
                var title = localizationManager.localize('courseDefaultTitle');
                return repository.addCourse(title).then(function (course) {
                    clientContext.set(constants.clientContextKeys.lastCreatedCourseId, course.id);
                    return course;
                });
            }
        };
    }
);