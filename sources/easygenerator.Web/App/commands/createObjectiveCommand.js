define(['repositories/objectiveRepository', 'repositories/courseRepository', 'localization/localizationManager', 'eventTracker', 'plugins/router', 'clientContext', 'constants', 'durandal/app', 'uiLocker'],
    function (objectiveRepository, courseRepository, localizationManager, eventTracker, router, clientContext, constants, app, uiLocker) {

        return {
            execute: function (courseId) {
                eventTracker.publish('Create learning objective and open it properties');
                var title = localizationManager.localize('objectiveDefaultTitle');

                uiLocker.lock();
                return objectiveRepository.addObjective({ title: title }).then(function (createdObjective) {
                    clientContext.set(constants.clientContextKeys.lastCreatedObjectiveId, createdObjective.id);

                    var navigateUrl = 'objectives/' + createdObjective.id;
                    if (_.isString(courseId)) {
                        return courseRepository.relateObjective(courseId, createdObjective.id).then(function () {
                            app.trigger(constants.messages.objective.createdInCourse);
                            uiLocker.unlock();
                            router.navigate('courses/' + courseId + '/' + navigateUrl);
                        });
                    } else {
                        uiLocker.unlock();
                        router.navigate('library/' + navigateUrl);
                    }
                }).fail(function () {
                    uiLocker.unlock();
                });
            }
        };
    }
);