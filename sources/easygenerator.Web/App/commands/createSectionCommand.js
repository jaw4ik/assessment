define(['repositories/sectionRepository', 'repositories/courseRepository', 'localization/localizationManager', 'eventTracker', 'routing/router', 'clientContext', 'constants', 'durandal/app', 'uiLocker'],
    function (sectionRepository, courseRepository, localizationManager, eventTracker, router, clientContext, constants, app, uiLocker) {

        return {
            execute: function (courseId) {
                eventTracker.publish('Create learning section and open it properties');
                var title = localizationManager.localize('sectionDefaultTitle');

                uiLocker.lock();
                return sectionRepository.addSection({ title: title }).then(function (createdSection) {
                    clientContext.set(constants.clientContextKeys.lastCreatedSectionId, createdSection.id);

                    var navigateUrl = 'sections/' + createdSection.id;
                    if (_.isString(courseId)) {
                        return courseRepository.relateSection(courseId, createdSection.id).then(function () {
                            app.trigger(constants.messages.section.createdInCourse);
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