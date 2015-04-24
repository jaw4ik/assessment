define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'clientContext', 'constants', 'utils/waiter'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, clientContext, constants, waiter) {

        var events = {
            navigateToCourses: 'Navigate to courses',
            updateCourseTemplate: 'Change course template to'
        },

            templateMessageTypes = {
                freeze: 'freeze',
                notification: 'notification'
            },

            templateSettingsErrorNotification = localizationManager.localize('templateSettingsError'),

            delay = 100,
            limit = 100;

        var viewModel = {
            courseId: '',
            currentTemplate: ko.observable(),
            loadingTemplate: ko.observable(false),
            templates: [],

            onGetTemplateMessage: onGetTemplateMessage,

            settingsVisibility: ko.observable(false),
            displaySettings: ko.observable(true),
            settingsSaved: ko.observable(true),
            selectTemplate: selectTemplate,

            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate,
            canDeactivate: canDeactivate,

            frameLoaded: frameLoaded
        };

        return viewModel;

        function canDeactivate() {
            var defer = Q.defer();
            viewModel.displaySettings(false);

            waiter.waitFor(viewModel.settingsSaved, delay, limit)
                .fail(function () {
                    notify.error(templateSettingsErrorNotification);
                })
                .fin(function () {
                    viewModel.displaySettings(true);
                    defer.resolve(true);
                });

            return defer.promise;
        }

        function activate(courseId) {

            return courseRepository.getById(courseId).then(function (course) {
                viewModel.courseId = course.id;
                clientContext.set(constants.clientContextKeys.lastVistedCourse, course.id);
                clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);

            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        function onGetTemplateMessage(message) {
            if (!message || !message.type || !message.data) {
                return;
            }

            switch (message.type) {
                case templateMessageTypes.freeze:
                    viewModel.settingsSaved(message.data.freezeEditor ? !message.data.freezeEditor : true);
                    break;
                case templateMessageTypes.notification:
                    var data = message.data;

                    if (data.success) {
                        data.message ? notify.success(data.message) : notify.saved();
                    } else {
                        notify.error(data.message || templateSettingsErrorNotification);
                    }
                    break;
            }
        }

        function frameLoaded() {
            viewModel.settingsVisibility(true);
            viewModel.settingsSaved(true);
        }
    }
);
