define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'clientContext', 'controls/backButton/backButton'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, clientContext, backButton) {

        var events = {
            navigateToCourses: 'Navigate to courses',
            updateCourseTemplate: 'Change course template to'
        };

        var viewModel = {
            courseId: '',
            currentTemplate: ko.observable(),
            templates: [],

            showProgress: ko.observable(false),
            selectTemplate: selectTemplate,

            navigateToCoursesEvent: navigateToCoursesEvent,

            activate: activate
        };

        return viewModel;

        function navigateToCoursesEvent() {
            eventTracker.publish(events.navigateToCourses);
        }

        function activate(courseId) {
            var goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('courses');
            backButton.enable(goBackTooltip, 'courses', navigateToCoursesEvent);

            return courseRepository.getById(courseId).then(function (course) {
                viewModel.courseId = course.id;
                clientContext.set('lastVistedCourse', course.id);
                clientContext.set('lastVisitedObjective', null);

                return templateRepository.getCollection().then(function (templates) {
                    viewModel.templates = _.chain(templates)
                        .map(function (template) {
                            return {
                                id: template.id,
                                name: template.name,
                                image: template.image,
                                description: template.description,
                                settingsUrl: template.settingsUrl,
                                previewDemoUrl: template.previewDemoUrl,
                                openPreview: function (item, event) {
                                    event.stopPropagation();
                                    router.openUrl(item.previewDemoUrl);
                                }
                            };
                        })
                        .sortBy(function (template) { return template.name; })
                        .value();

                    viewModel.currentTemplate(_.find(viewModel.templates, function (item) { return item.id == course.template.id; }));
                });
            }).fail(function (reason) {
                router.activeItem.settings.lifecycleData = { redirect: '404' };
                throw reason;
            });
        }

        function selectTemplate(template) {
            if (template == viewModel.currentTemplate()) {
                return;
            }

            eventTracker.publish(events.updateCourseTemplate + ' \'' + template.name + '\'');
            viewModel.showProgress(true);

            courseRepository.updateCourseTemplate(viewModel.courseId, template.id)
                .then(function () {
                    viewModel.currentTemplate(template);
                    notify.saved();
                    viewModel.showProgress(false);
                }).fail(function () {
                    viewModel.showProgress(false);
                });

        }

    }
);
