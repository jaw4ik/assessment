define(['repositories/courseRepository', 'eventTracker', 'clientContext', 'constants'],
    function (repository, eventTracker, clientContext, constants) {

        return {
            execute: function (id, eventCategory) {
                eventTracker.publish('Duplicate course', eventCategory);
                return repository.duplicateCourse(id).then(function (course) {
                    clientContext.set(constants.clientContextKeys.lastCreatedCourseId, course.id);
                    return course;
                });
            }
        };
    }
);