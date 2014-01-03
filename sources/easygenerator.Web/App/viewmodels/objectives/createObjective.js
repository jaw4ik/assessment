define(['repositories/objectiveRepository', 'plugins/router', 'eventTracker', 'constants', 'notify', 'uiLocker', 'localization/localizationManager', 'repositories/courseRepository'],
    function (objectiveRepository, router, eventTracker, constants, notify, uiLocker, localizationManager, courseRepository) {

        var
            events = {
                navigateToObjectives: 'Navigate to objectives',
                navigateToCourse: 'Navigate to course',
                createAndNew: "Create learning objective and create new",
                createAndContinue: "Create learning objective and open it properties",
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var title = ko.observable(''),
            goBackTooltip = '',
            goBackLink = '',
            contextCourseId = null,
            contextCourseTitle = null;
        
        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.objectiveTitleMaxLength;
        });

        var isTitleEditing = ko.observable(false),

            navigateBack = function () {
                if (_.isString(this.contextCourseId)) {
                    sendEvent(events.navigateToCourse);
                    router.navigate('course/' + this.contextCourseId);
                } else {
                    sendEvent(events.navigateToObjectives);
                    router.navigate('objectives');
                }
            },

            activate = function (queryParams) {
                var that = this;

                that.contextCourseId = null;
                that.contextCourseTitle = null;
                that.title('');

                if (!_.isNullOrUndefined(queryParams) && _.isString(queryParams.courseId)) {
                    return courseRepository.getById(queryParams.courseId).then(function(course) {
                        if (_.isNull(course)) {
                            router.replace('404');
                            return;
                        }

                        that.contextCourseId = course.id;
                        that.contextCourseTitle = course.title;

                        that.goBackTooltip = localizationManager.localize('backTo') + ' \'' + course.title + '\'';
                        that.goBackLink = '#course/' + course.id;
                    });
                }
                
                return Q.fcall(function () {
                    that.goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('learningObjectives');
                    that.goBackLink = '#objectives';
                });
            },

            createAndNew = function () {
                sendEvent(events.createAndNew);
                var that = this;
                createObjective.call(that, function (createdObjective) {
                    isTitleEditing(true);
                    notify.saved();
                });
            },

            createAndContinue = function () {
                sendEvent(events.createAndContinue);
                var that = this;
                createObjective.call(that, function (createdObjective) {
                    var navigateUrl = 'objective/' + createdObjective.id;
                    if (_.isString(that.contextCourseId)) {
                        router.navigateWithQueryString(navigateUrl);
                    } else {
                        router.navigate(navigateUrl);
                    }
                });
            };

        function createObjective(callback) {
            title(title().trim());

            if (!title.isValid()) {
                return;
            }
            
            var that = this;
            uiLocker.lock();
            objectiveRepository.addObjective({ title: title() }).then(function (createdObjective) {
                title('');
                uiLocker.unlock();
                
                if (_.isString(that.contextCourseId)) {
                    objectiveRepository.getById(createdObjective.id).then(function (objective) {
                        courseRepository.relateObjectives(that.contextCourseId, [objective]).then(function () {
                            callback(createdObjective);
                        });
                    });
                } else {
                    callback(createdObjective);
                }
            });
        }

        return {
            title: title,
            contextCourseId: contextCourseId,
            contextCourseTitle: contextCourseTitle,
            objectiveTitleMaxLength: constants.validation.objectiveTitleMaxLength,
            isTitleEditing: isTitleEditing,

            goBackTooltip: goBackTooltip,
            goBackLink: goBackLink,

            activate: activate,
            navigateBack: navigateBack,
            createAndNew: createAndNew,
            createAndContinue: createAndContinue
        };
    }
);