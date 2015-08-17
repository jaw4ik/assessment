define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'utils/waiter'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, waiter) {

        var
            events = {
                updateCourseTemplate: 'Change course template to',
                navigateToTemplatesSection: 'Navigate to \'choose template\' section',
                navigateToSettingsSection: 'Navigate to \'design settings\' section'
            },
            eventCategory = 'Design step',

            templateMessageTypes = {
                showSettings: 'show-settings',
                freezeEditor: 'freeze-editor',
                unfreezeEditor: 'unfreeze-editor',
                notification: 'notification'
            },

            templateSettingsLoadingTimeout = 2000,
            templateSettingsErrorNotification = localizationManager.localize('templateSettingsError'),
            templateChangedNotification = localizationManager.localize('templateChanged'),

            delay = 100,
            limit = 100;

        var viewModel = {
            courseId: '',
            previewUrl: ko.observable(null),

            currentTemplate: ko.observable(),
            loadingTemplate: ko.observable(false),
            templates: [],

            onGetTemplateMessage: onGetTemplateMessage,

            settingsVisibility: ko.observable(false),
            canUnloadSettings: ko.observable(true),

            selectTemplate: selectTemplate,
            reloadPreview: reloadPreview,
            templatesSectionSelected: ko.observable(true),
            selectTemplatesSection: selectTemplatesSection,
            selectSettingsSection: selectSettingsSection,

            activate: activate,
            deactivate: deactivate,
            canDeactivate: canDeactivate,

            settingsFrameLoaded: settingsFrameLoaded,

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
                viewModel.templatesSectionSelected(true);

                eventTracker.publish(events.navigateToTemplatesSection, eventCategory);

                return templateRepository.getCollection().then(function (templates) {
                    viewModel.templates = _.chain(templates)
                        .map(function (template) {
                            return {
                                id: template.id,
                                name: template.name,
                                thumbnail: template.thumbnail,
                                previewImages: template.previewImages,
                                description: template.description,
                                designSettingsUrl: template.settingsUrls.design,
                                settingsAvailable: template.settingsUrls.design != null,
                                previewDemoUrl: template.previewDemoUrl,
                                order: template.order,
                                isNew: template.isNew,
                                isDeprecated: template.isDeprecated,
                                isCustom: template.isCustom,
                                openPreview: function (item, event) {
                                    event.stopPropagation();
                                    router.openUrl(item.previewDemoUrl + '?v=' + window.appVersion);
                                },
                                loadingTemplate: ko.observable(false)
                            };
                        })
                        .sortBy(function (template) { return template.order; })
                        .value();

                    return Q.fcall(function () {
                        viewModel.currentTemplate(_.find(viewModel.templates, function (item) { return item.id == course.template.id; }));
                    });
                });
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        function selectTemplate(template) {
            if (template == viewModel.currentTemplate()) {
                return Q.fcall(function () { });
            }

            template.loadingTemplate(true);
            viewModel.loadingTemplate(true);

            eventTracker.publish(events.updateCourseTemplate + ' \'' + (template.isCustom ? 'custom' : template.name) + '\'');

            return waiter.waitFor(viewModel.canUnloadSettings, delay, limit)
                .fail(function () {
                    notify.error(templateSettingsErrorNotification);
                })
                .fin(function () {
                    viewModel.settingsVisibility(false);

                    return courseRepository.updateCourseTemplate(viewModel.courseId, template.id).then(function () {
                        viewModel.currentTemplate(template);
                        template.loadingTemplate(false);
                        viewModel.loadingTemplate(false);
                        notify.success(templateChangedNotification);
                    });
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
                        viewModel.reloadPreview();
                    } else {
                        notify.error(data.message || templateSettingsErrorNotification);
                    }
                    break;
            }
        }

        function selectTemplatesSection() {
            viewModel.settingsVisibility(false);
            viewModel.templatesSectionSelected(true);
            eventTracker.publish(events.navigateToTemplatesSection, eventCategory);
        }

        function selectSettingsSection() {
            viewModel.templatesSectionSelected(false);
            eventTracker.publish(events.navigateToSettingsSection, eventCategory);
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
    }
);