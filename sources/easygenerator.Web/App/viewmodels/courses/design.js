﻿define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'clientContext', 'ping',
    'models/backButton', 'constants', 'utils/waiter'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, clientContext, ping, BackButton, constants, waiter) {

        var events = {
            navigateToCourses: 'Navigate to courses',
            updateCourseTemplate: 'Change course template to'
        },

            templateMessageTypes = {
                startSave: 'startSave',
                finishSave: 'finishSave'
            },

            templateSettingsErrorNotification = localizationManager.localize('templateSettingsError'),
            templateChangedNotification = localizationManager.localize('templateChanged'),

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

            canActivate: canActivate,
            activate: activate,
            canDeactivate: canDeactivate,
            toggleTemplatesListVisibility: toggleTemplatesListVisibility,
            templatesListCollapsed: ko.observable(false),

            frameLoaded: frameLoaded,

            backButtonData: new BackButton({
                url: 'courses',
                backViewName: localizationManager.localize('courses'),
                callback: navigateToCoursesEvent
            })
        };

        return viewModel;

        function toggleTemplatesListVisibility() {
            viewModel.templatesListCollapsed(!viewModel.templatesListCollapsed());
        }

        function navigateToCoursesEvent() {
            eventTracker.publish(events.navigateToCourses);
        }

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

        function canActivate() {
            return ping.execute();
        }

        function activate(courseId) {

            return courseRepository.getById(courseId).then(function (course) {
                viewModel.courseId = course.id;
                clientContext.set(constants.clientContextKeys.lastVistedCourse, course.id);
                clientContext.set(constants.clientContextKeys.lastVisitedObjective, null);

                return templateRepository.getCollection().then(function (templates) {
                    viewModel.templates = _.chain(templates)
                        .map(function (template) {
                            return {
                                id: template.id,
                                name: template.name,
                                thumbnail: template.thumbnail,
                                previewImages: template.previewImages,
                                description: template.description,
                                settingsUrl: template.settingsUrl,
                                previewDemoUrl: template.previewDemoUrl,
                                order: template.order,
                                openPreview: function (item, event) {
                                    event.stopPropagation();
                                    router.openUrl(item.previewDemoUrl + '?v=' + window.top.appVersion);
                                }
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
            if (viewModel.loadingTemplate()) {
                return false;
            }
            if (template == viewModel.currentTemplate()) {
                return Q.fcall(function () { });
            }

            eventTracker.publish(events.updateCourseTemplate + ' \'' + template.name + '\'');
            return waiter.waitFor(viewModel.settingsSaved, delay, limit)
                .fail(function () {
                    notify.error(templateSettingsErrorNotification);
                })
                .fin(function () {
                    viewModel.settingsVisibility(false);

                    return courseRepository.updateCourseTemplate(viewModel.courseId, template.id)
                    .then(function () {
                        viewModel.currentTemplate(template);
                        notify.success(templateChangedNotification);
                        viewModel.loadingTemplate(false);
                    });
                });
        }

        function onGetTemplateMessage(message) {

            if (!message) {
                return;
            }

            if (message.type == templateMessageTypes.startSave) {
                viewModel.settingsSaved(false);
            } else if (message.type == templateMessageTypes.finishSave) {
                var data = message.data;
                viewModel.settingsSaved(true);

                if (!data) {
                    return;
                }
                if (data.success) {
                    data.message ? notify.success(data.message) : notify.saved();
                } else {
                    notify.error(data.message || templateSettingsErrorNotification);
                }
            }
        }

        function frameLoaded() {
            viewModel.settingsVisibility(true);
            viewModel.settingsSaved(true);
        }
    }
);
