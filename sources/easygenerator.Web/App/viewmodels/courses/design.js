define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'clientContext', 'ping',
    'models/backButton', 'constants'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, clientContext, ping, BackButton, constants) {

        var events = {
            navigateToCourses: 'Navigate to courses',
            updateCourseTemplate: 'Change course template to'
        };

        var viewModel = {
            courseId: '',
            currentTemplate: ko.observable(),
            templates: [],

            settingsVisibility: ko.observable(false),
            selectTemplate: selectTemplate,

            navigateToCoursesEvent: navigateToCoursesEvent,

            canActivate: canActivate,
            activate: activate,
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
            if (template == viewModel.currentTemplate()) {
                return Q.fcall(function () { });
            }

            eventTracker.publish(events.updateCourseTemplate + ' \'' + template.name + '\'');
            viewModel.settingsVisibility(false);

            return courseRepository.updateCourseTemplate(viewModel.courseId, template.id)
                .then(function() {
                    viewModel.currentTemplate(template);
                    notify.saved();
                });
        }

        function frameLoaded() {
            viewModel.settingsVisibility(true);
        }

    }
);
