define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'utils/waiter',
    'viewmodels/courses/course/design/templateBrief', 'constants', 'durandal/app'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, waiter, TemplateBrief, constants, app) {
        debugger;
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
            previewUrl: ko.observable(null),

            template: ko.observable(),
            loadingTemplate: ko.observable(false),

            onGetTemplateMessage: onGetTemplateMessage,

            settingsVisibility: ko.observable(false),
            canUnloadSettings: ko.observable(true),

            settingsTabs: ko.observableArray([]),
            currentSettingsTabUrl: ko.observable(''),

            changeTab: changeTab,
            updateSettingsUrls: updateSettingsUrls,

            reloadPreview: reloadPreview,

            activate: activate,
            deactivate: deactivate,
            canDeactivate: canDeactivate,

            settingsFrameLoaded: settingsFrameLoaded,

            settingsLoadingTimeoutId: null,
            settingsVisibilitySubscription: null,
            templateUpdated: templateUpdated,
            templateUpdatedByCollaborator: templateUpdatedByCollaborator
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
                viewModel.previewUrl('/preview/' + viewModel.courseId);

                viewModel.template(new TemplateBrief(course.template));
                updateSettingsUrls(course.template);

                app.on(constants.messages.course.templateUpdated + viewModel.courseId, viewModel.templateUpdated);
                app.on(constants.messages.course.templateUpdatedByCollaborator, viewModel.templateUpdatedByCollaborator);
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        function templateUpdated(template) {

            if (template.id === viewModel.template().id)
                return;

            viewModel.template().isLoading(true);
            viewModel.loadingTemplate(true);

            updateSettingsUrls(template);

            return waiter.waitFor(viewModel.canUnloadSettings, delay, limit)
            .fail(function () {
                notify.error(templateSettingsErrorNotification);
            })
            .fin(function () {
                viewModel.settingsVisibility(false);
                viewModel.template(new TemplateBrief(template));
                viewModel.loadingTemplate(false);
            });
        }

        function templateUpdatedByCollaborator(course) {
            if (course.id !== viewModel.courseId)
                return;

            templateUpdated(course.template);
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
                        viewModel.reloadPreview();
                    } else {
                        notify.error(data.message || templateSettingsErrorNotification);
                    }
                    break;
            }
        }

        function reloadPreview() {
            viewModel.previewUrl.valueHasMutated();
        }

        function settingsFrameLoaded() {
            viewModel.canUnloadSettings(true);
            viewModel.settingsLoadingTimeoutId = _.delay(showSettings, templateSettingsLoadingTimeout);
        }

        function showSettings() {
            viewModel.settingsVisibility(true);
        }

        function changeTab(tab) {
            if (!tab || tab.isSelected()) {
                return;
            }

            viewModel.settingsVisibility(false);

            _.find(viewModel.settingsTabs(), function (tab) {
                return tab.url === viewModel.currentSettingsTabUrl()
            }).isSelected(false);

            viewModel.currentSettingsTabUrl(tab.url)
            tab.isSelected(true);
        }

        function updateSettingsUrls(template) {
            viewModel.settingsTabs.removeAll();
            viewModel.settingsTabs(_.map(template.settingsUrls.design, function (tab) {
                if (tab.isSelected) {
                    viewModel.currentSettingsTabUrl(tab.url);
                }
                return {
                    name: tab.name,
                    isSelected: ko.observable(tab.isSelected),
                    title: localizationManager.localize(tab.name),
                    url: tab.url
                }
            }));
        }
    });