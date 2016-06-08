define(['routing/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'clientContext', 'constants',
    'utils/waiter', 'durandal/app'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, clientContext, constants, waiter, app) {

        var
            templateMessageTypes = {
                showSettings: 'show-settings',
                freezeEditor: 'freeze-editor',
                unfreezeEditor: 'unfreeze-editor',
                notification: 'notification'
            },

            templateSettingsLoadingTimeout = 2000,
            templateSettingsErrorNotification = localizationManager.localize('templateSettingsError'),

            delay = 100,
            limit = 100;

        var viewModel = {
            courseId: '',

            templateId: ko.observable(),
            configureSettingsUrl: ko.observable(),
            settingsAvailable: ko.observable(false),

            onGetTemplateMessage: onGetTemplateMessage,

            settingsVisibility: ko.observable(false),
            canUnloadSettings: ko.observable(true),

            activate: activate,
            deactivate: deactivate,
            canDeactivate: canDeactivate,
            templateUpdated: templateUpdated,
            templateUpdatedByCollaborator: templateUpdatedByCollaborator,
            frameLoaded: frameLoaded,

            settingsLoadingTimeoutId: null,
            settingsVisibilitySubscription: null
        };

        return viewModel;

        function canDeactivate() {
            var defer = Q.defer();
            viewModel.settingsVisibility(false);

            waiter.waitFor(viewModel.canUnloadSettings, delay, limit)
                .fail(function () {
                    notify.error(templateSettingsErrorNotification);
                })
                .fin(function () {
                    viewModel.settingsVisibility(true);
                    defer.resolve(true);
                });

            return defer.promise;
        }

        function deactivate() {
            if (viewModel.settingsVisibilitySubscription) {
                viewModel.settingsVisibilitySubscription.dispose();
            }

            app.off(constants.messages.course.templateUpdated + viewModel.courseId, viewModel.templateUpdated);
            app.off(constants.messages.course.templateUpdatedByCollaborator, viewModel.templateUpdatedByCollaborator);
        }

        function activate(courseId) {
            viewModel.settingsVisibility(false);
            viewModel.settingsVisibilitySubscription = viewModel.settingsVisibility.subscribe(function () {
                if (viewModel.settingsLoadingTimeoutId) {
                    clearTimeout(viewModel.settingsLoadingTimeoutId);
                    viewModel.settingsLoadingTimeoutId = null;
                }
            });

            return courseRepository.getById(courseId).then(function (course) {
                viewModel.courseId = course.id;
                viewModel.templateId(course.template.id);
                viewModel.configureSettingsUrl(course.template.settingsUrls.configure);
                viewModel.settingsAvailable(viewModel.configureSettingsUrl() != null);

                app.on(constants.messages.course.templateUpdated + viewModel.courseId, viewModel.templateUpdated);
                app.on(constants.messages.course.templateUpdatedByCollaborator, viewModel.templateUpdatedByCollaborator);
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        function onGetTemplateMessage(message) {
            if (!message || !message.type) {
                return;
            }

            switch (message.type) {
                case templateMessageTypes.showSettings:
                    viewModel.settingsVisibility(true);
                    break;
                case templateMessageTypes.freezeEditor:
                    viewModel.canUnloadSettings(false);
                    break;
                case templateMessageTypes.unfreezeEditor:
                    viewModel.canUnloadSettings(true);
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


        function templateUpdated(template) {
            if (template.id === viewModel.templateId())
                return;

            viewModel.templateId(template.id);
            viewModel.configureSettingsUrl(template.settingsUrls.configure);
            viewModel.settingsAvailable(viewModel.configureSettingsUrl() != null);
        }

        function templateUpdatedByCollaborator(course) {
            if (course.id !== viewModel.courseId)
                return;

            templateUpdated(course.template);
        }

        function frameLoaded() {
            viewModel.canUnloadSettings(true);
            viewModel.settingsLoadingTimeoutId = _.delay(showSettings, templateSettingsLoadingTimeout);
        }

        function showSettings() {
            viewModel.settingsVisibility(true);
        }
    }
);
