﻿define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'clientContext', 'constants', 'utils/waiter'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, clientContext, constants, waiter) {

        var 
            templateMessageTypes = {
                showSettings: 'show-settings',
                freezeEditor: 'freeze-editor',
                unfreezeEditor: 'unfreeze-editor',
                notification: 'notification'
            },

            templateSettingsErrorNotification = localizationManager.localize('templateSettingsError'),

            delay = 100,
            limit = 100;

        var viewModel = {
            courseId: '',

            currentTemplate: null,
            configureSettingsUrl: null,
            settingsAvailable: false,

            onGetTemplateMessage: onGetTemplateMessage,

            settingsVisibility: ko.observable(false),
            canUnloadSettings: ko.observable(true),

            activate: activate,
            canDeactivate: canDeactivate,

            frameLoaded: frameLoaded
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

        function activate(courseId) {
            viewModel.settingsVisibility(false);

            return courseRepository.getById(courseId).then(function (course) {
                viewModel.courseId = course.id;

                viewModel.currentTemplate = course.template;
                viewModel.configureSettingsUrl = course.template.settingsUrls.configure;
                viewModel.settingsAvailable = viewModel.configureSettingsUrl != null;
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

        function frameLoaded() {
            viewModel.canUnloadSettings(true);
        }
    }
);
