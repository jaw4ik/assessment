define(['repositories/objectiveRepository', 'plugins/router', 'eventTracker', 'constants', 'notify', 'uiLocker', 'localization/localizationManager',
    'repositories/courseRepository', 'models/backButton'],
    function (objectiveRepository, router, eventTracker, constants, notify, uiLocker, localizationManager, courseRepository, BackButton) {

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                navigateToCourse: 'Navigate to course',
                createAndContinue: "Create learning objective and open it properties"
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var title = ko.observable(''),
            contextCourseId = null,
            contextCourseTitle = null;

        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.objectiveTitleMaxLength;
        });

        var isTitleEditing = ko.observable(false),

            navigateToCourseEvent = function () {
                sendEvent(events.navigateToCourse);
            },

            navigateToObjectivesEvent = function () {
                sendEvent(events.navigateToObjectives);
            },

            activate = function (queryParams) {
                var that = this;

                that.contextCourseId = null;
                that.contextCourseTitle = null;
                that.title('');

                if (!_.isNullOrUndefined(queryParams) && _.isString(queryParams.courseId)) {
                    return courseRepository.getById(queryParams.courseId).then(function (course) {
                        if (_.isNull(course)) {
                            router.replace('404');
                            return;
                        }

                        that.contextCourseId = course.id;
                        that.contextCourseTitle = course.title;

                        that.backButtonData.configure({
                            url: 'course/' + course.id,
                            backViewName: '\'' + course.title + '\'',
                            callback: navigateToCourseEvent,
                            alwaysVisible: false
                        });
                    });
                }

                return Q.fcall(function () {
                    that.backButtonData.configure({
                        url: 'objectives',
                        backViewName: localizationManager.localize('learningObjectives'),
                        callback: navigateToObjectivesEvent,
                        alwaysVisible: true
                    });
                });
            },

            createAndContinue = function () {
                sendEvent(events.createAndContinue);
                var that = this;
                title(title().trim());

                if (!title.isValid()) {
                    return Q.fcall(function () { });
                }

                uiLocker.lock();
                return objectiveRepository.addObjective({ title: title() }).then(function (createdObjective) {
                    title('');
                    if (_.isString(that.contextCourseId)) {
                        return objectiveRepository.getById(createdObjective.id).then(function (objective) {
                            return courseRepository.relateObjectives(that.contextCourseId, [objective]).then(function () {
                                navigateToObjectiveEditor.call(that, createdObjective);
                            });
                        });
                    } else {
                        navigateToObjectiveEditor.call(that, createdObjective);
                    }
                });
            };

        function navigateToObjectiveEditor(createdObjective) {
            var navigateUrl = 'objective/' + createdObjective.id;
            uiLocker.unlock();
            if (_.isString(this.contextCourseId)) {
                router.navigateWithQueryString(navigateUrl);
            } else {
                router.navigate(navigateUrl);
            }
        }

        return {
            title: title,
            contextCourseId: contextCourseId,
            contextCourseTitle: contextCourseTitle,
            objectiveTitleMaxLength: constants.validation.objectiveTitleMaxLength,
            isTitleEditing: isTitleEditing,

            activate: activate,

            navigateToCourseEvent: navigateToCourseEvent,
            navigateToObjectivesEvent: navigateToObjectivesEvent,
            createAndContinue: createAndContinue,

            backButtonData: new BackButton({})
        };
    }
);