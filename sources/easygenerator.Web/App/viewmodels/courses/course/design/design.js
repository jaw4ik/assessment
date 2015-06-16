﻿define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'utils/waiter'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, waiter) {

        var
            events = {
                updateCourseTemplate: 'Change course template to'
            },

            templateMessageTypes = {
                freeze: 'freeze',
                notification: 'notification'
            },

            templateSettingsErrorNotification = localizationManager.localize('templateSettingsError'),
            templateChangedNotification = localizationManager.localize('templateChanged'),

            delay = 100,
            limit = 100;

        var viewModel = {
            courseId: '',

            currentTemplate: ko.observable(),
            templates: [],

            onGetTemplateMessage: onGetTemplateMessage,

            settingsVisibility: ko.observable(false),
            canUnloadSettings: ko.observable(true),

            selectTemplate: selectTemplate,

            activate: activate,
            canDeactivate: canDeactivate,

            toggleTemplatesListVisibility: toggleTemplatesListVisibility,
            templatesListCollapsed: ko.observable(false),

            frameLoaded: frameLoaded
        };

        return viewModel;

        function toggleTemplatesListVisibility() {
            viewModel.templatesListCollapsed(!viewModel.templatesListCollapsed());
        }

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

            return courseRepository.getById(courseId).then(function (course) {
                viewModel.courseId = course.id;

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
                                isCustom: template.isCustom,
                                openPreview: function (item, event) {
                                    event.stopPropagation();
                                    router.openUrl(item.previewDemoUrl + '?v=' + window.top.appVersion);
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
                        notify.success(templateChangedNotification);
                    });
                });
        }

        function onGetTemplateMessage(message) {
            if (!message || !message.type || !message.data) {
                return;
            }

            switch (message.type) {
                case templateMessageTypes.freeze:
                    viewModel.canUnloadSettings(message.data.freezeEditor ? !message.data.freezeEditor : true);
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
            viewModel.canUnloadSettings(true);
        }
    }
);