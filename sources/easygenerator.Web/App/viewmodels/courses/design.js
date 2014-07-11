define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager', 'clientContext', 'ping', 'models/backButton'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager, clientContext, ping, BackButton) {

        var events = {
            navigateToCourses: 'Navigate to courses',
            updateCourseTemplate: 'Change course template to'
        };

        var viewModel = {
            courseId: '',
            currentTemplate: ko.observable(),
            templates: [],

            settingsVisibility: ko.observable(false),
            lockTemplateChoosing: ko.observable(false),
            selectTemplate: selectTemplate,

            navigateToCoursesEvent: navigateToCoursesEvent,

            canActivate: canActivate,
            activate: activate,

            resizeFrame: resizeFrame,

            backButtonData: new BackButton({
                url: 'courses',
                backViewName: localizationManager.localize('courses'),
                callback: navigateToCoursesEvent
            })
        };

        return viewModel;

        function navigateToCoursesEvent() {
            eventTracker.publish(events.navigateToCourses);
        }

        function canActivate() {
            return ping.execute();
        }

        function activate(courseId) {

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
                                order: template.order,
                                openPreview: function (item, event) {
                                    event.stopPropagation();
                                    router.openUrl(item.previewDemoUrl);
                                }
                            };
                        })
                        .sortBy(function (template) { return template.order; })
                        .value();

                    _.defer(function () {
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
                return;
            }

            eventTracker.publish(events.updateCourseTemplate + ' \'' + template.name + '\'');
            viewModel.lockTemplateChoosing(true);
            viewModel.settingsVisibility(false);

            courseRepository.updateCourseTemplate(viewModel.courseId, template.id)
                .then(function () {
                    viewModel.currentTemplate(template);
                    notify.saved();
                }).fin(function () {
                    viewModel.lockTemplateChoosing(false);
                });
        }

        function resizeFrame(vm, event) {
            var $iframe = $(event.target);
            $iframe.height(0);

            var iframeDocumentHeight = $iframe.contents().find('body').height();
            $iframe.height(iframeDocumentHeight);

            viewModel.settingsVisibility(true);
        }

    }
);
