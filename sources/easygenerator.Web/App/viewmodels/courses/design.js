define(['plugins/router', 'eventTracker', 'notify', 'repositories/courseRepository', 'repositories/templateRepository', 'localization/localizationManager'],
    function (router, eventTracker, notify, courseRepository, templateRepository, localizationManager) {

        var events = {
            updateCourseTemplate: 'Change course template to'
        };

        var viewModel = {
            courseId: '',
            currentTemplate: ko.observable(),
            templates: [],

            showProgress: ko.observable(false),

            selectTemplate: selectTemplate,

            activate: activate
        };

        return viewModel;


        function activate(courseId) {
            return courseRepository.getById(courseId).then(function (course) {
                viewModel.courseId = course.id;

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
            });;
        }

        function selectTemplate(template) {
            if (template == viewModel.currentTemplate()) {
                return;
            }

            eventTracker.publish(events.updateCourseTemplate + ' \'' + template.name + '\'');
            viewModel.showProgress(true);

            courseRepository.updateCourseTemplate(viewModel.courseId, template.id).then(function (response) {
                viewModel.currentTemplate(template);
                notify.saved();
            }).finally(function () {
                viewModel.showProgress(false);
            });

        }

    }
);
