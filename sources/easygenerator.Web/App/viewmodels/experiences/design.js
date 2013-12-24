define(['plugins/router', 'eventTracker', 'notify', 'repositories/experienceRepository', 'repositories/templateRepository', 'localization/localizationManager'],
    function (router, eventTracker, notify, experienceRepository, templateRepository, localizationManager) {

        var events = {
            updateExperienceTemplate: 'Change experience template to'
        };

        var viewModel = {
            experienceId: '',
            currentTemplate: ko.observable(),
            templates: [],

            showProgress: ko.observable(false),

            selectTemplate: selectTemplate,

            activate: activate
        };

        return viewModel;


        function activate(experienceId) {
            return experienceRepository.getById(experienceId).then(function (experience) {
                viewModel.experienceId = experience.id;

                return templateRepository.getCollection().then(function (templates) {
                    viewModel.templates = _.chain(templates)
                        .map(function (template) {
                            return {
                                id: template.id,
                                name: template.name,
                                image: template.image,
                                description: template.description,
                                settingsUrl: template.settingsUrl
                            };
                        })
                        .sortBy(function (template) { return template.name; })
                        .value();
                    
                    viewModel.currentTemplate(_.find(viewModel.templates, function (item) { return item.id == experience.template.id; }));
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

            eventTracker.publish(events.updateExperienceTemplate + ' \'' + template.name + '\'');
            viewModel.showProgress(true);

            experienceRepository.updateExperienceTemplate(viewModel.experienceId, template.id).then(function (response) {
                viewModel.currentTemplate(template);
                notify.saved();
            }).finally(function () {
                viewModel.showProgress(false);
            });

        }

    }
);
