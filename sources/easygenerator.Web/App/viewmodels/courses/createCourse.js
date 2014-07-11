define(['repositories/courseRepository', 'repositories/templateRepository', 'plugins/router', 'userContext', 'constants', 'eventTracker', 'uiLocker', 'localization/localizationManager', 'ping', 'models/backButton', 'authorization/limitCoursesAmount'],
function (repository, templateRepository, router, userContext, constants, eventTracker, uiLocker, localizationManager, ping, BackButton, limitCoursesAmount) {

    var
        events = {
            createAndContinue: "Create course and open its properties",
            chooseTemplate: "Choose template",
            defineTitle: "Define title",
            navigateToCourses: 'Navigate to courses'
        },

        templates = ko.observableArray(),

        title = (function() {
            var value = ko.observable('');
            value.isValid = ko.computed(function() {
                var length = value().trim().length;
                return length > 0 && length <= constants.validation.courseTitleMaxLength;
            });
            value.isEditing = ko.observable();
            value.startEditing = function() {
                value.isEditing(true);
            };
            value.init = function() {
                value('');
                value.isEditingSubscription = value.isEditing.subscribe(function(varValue) {
                    if (varValue) {
                        eventTracker.publish(events.defineTitle);
                    }
                });
            };
            value.dispose = function() {
                value.isEditingSubscription.dispose();
            };
            return value;
        })(),


        isFormFilled = function() {
            return title.isValid() && !_.isNullOrUndefined(getSelectedTemplate());
        },

        getSelectedTemplate = function() {
            return _.filter(templates(), function(item) {
                return item.isSelected();
            })[0];
        },

        resetTemplatesSelection = function() {
            _.each(templates(), function(item) {
                item.isSelected(false);
            });
        },

        selectTemplate = function(item) {
            eventTracker.publish(events.chooseTemplate);
            if (item && !_.isUndefined(item.isSelected)) {
                resetTemplatesSelection();
                item.isSelected(true);
            }
        },

        navigateToCoursesEvent = function() {
            eventTracker.publish(events.navigateToCourses);
        },

        createAndContinue = function() {
            eventTracker.publish(events.createAndContinue);
            if (!isFormFilled()) {
                return;
            }
            uiLocker.lock();
            repository.addCourse(title().trim(), getSelectedTemplate().id)
                .then(function(course) {
                    uiLocker.unlock();
                    router.navigate('course/' + course.id);
                })
                .fail(function() {
                    uiLocker.unlock();
                });
        },

        mapTemplate = function(item) {
            return {
                id: item.id,
                name: item.name,
                description: item.description,
                image: item.image,
                isSelected: ko.observable(false),
                previewUrl: item.previewDemoUrl,
                order: item.order,
                openPreview: function(template, event) {
                    event.stopPropagation();
                    router.openUrl(template.previewUrl);
                }
            };
        },

        isAvailable = true,
        hasStarterAccess = true,

        canActivate = function() {
            return ping.execute();
        },

        activate = function() {
            this.title.init();

            var that = this;
            return userContext.identify().then(function() {
                that.isAvailable = limitCoursesAmount.checkAccess();
                that.hasStarterAccess = userContext.hasStarterAccess();

                return templateRepository.getCollection().then(function(templatesResponse) {
                    that.templates(_.chain(templatesResponse)
                        .map(mapTemplate)
                        .sortBy(function(item) {
                            return item.order;
                        }).value());
                });
            });
        },

        deactivate = function() {
            this.title.dispose();
        },

        openUpgradePlanUrl = function () {
            eventTracker.publish(constants.upgradeEvent, constants.upgradeCategory.courseLimitNotification);
            router.openUrl(constants.upgradeUrl);
        };
   
    return {
        canActivate: canActivate,
        activate: activate,
        deactivate: deactivate,
        navigateToCoursesEvent: navigateToCoursesEvent,
        createAndContinue: createAndContinue,
        getSelectedTemplate: getSelectedTemplate,
        resetTemplatesSelection: resetTemplatesSelection,
        selectTemplate: selectTemplate,

        title: title,
        templates: templates,
        courseTitleMaxLength: constants.validation.courseTitleMaxLength,
        isFormFilled: isFormFilled,
        isAvailable: isAvailable,
        hasStarterAccess: hasStarterAccess,

        coursesFreeLimit: limitCoursesAmount.getFreeLimit(),
        coursesStarterLimit: limitCoursesAmount.getStarterLimit(),

        openUpgradePlanUrl: openUpgradePlanUrl,

        backButtonData: new BackButton({
            url: 'courses',
            backViewName: localizationManager.localize('courses'),
            callback: navigateToCoursesEvent
        })
    };
}
);