define(['plugins/router', 'eventTracker', 'notify', 'repositories/experienceRepository', 'repositories/templateRepository', 'localization/localizationManager'],
    function (router, eventTracker, notify, experienceRepository, templateRepository, localizationManager) {

        var events = {
            updateExperienceTemplate: 'Change experience template to'
        };

        var
            experienceId = '',
            selectedTemplateId = ko.observable(),
            selectedTemlateImage = ko.observable(),
            selectedTemlateDescription = ko.observable(),
            templates = [],

            activate = function (experienceId) {
                var that = this;

                return experienceRepository.getById(experienceId).then(function (experience) {
                    that.experienceId = experience.id;
                    that.selectedTemplateId(experience.template.id);
                    that.selectedTemlateImage(experience.template.image);
                    that.selectedTemlateDescription(experience.template.description);

                    return templateRepository.getCollection().then(function (templates) {
                        that.templates = templates;
                    });
                }).fail(function () {
                    router.replace('404');
                });
            },

            updateExperienceTemplate = function () {
                var that = this;

                var selectedTemplate = _.find(this.templates, function (item) {
                    return item.id === selectedTemplateId();
                });

                eventTracker.publish(events.updateExperienceTemplate + ' \'' + selectedTemplate.name + '\'');
                experienceRepository.updateExperienceTemplate(this.experienceId, selectedTemplate.id).then(function (response) {
                    notify.info(localizationManager.localize('savedAt') + ' ' + response.modifiedOn.toLocaleTimeString());
                    that.selectedTemlateImage(selectedTemplate.image);
                    that.selectedTemlateDescription(selectedTemplate.description);
                });
            };

        return {
            experienceId: experienceId,
            activate: activate,
            selectedTemplateId: selectedTemplateId,
            selectedTemlateImage: selectedTemlateImage,
            selectedTemlateDescription: selectedTemlateDescription,
            templates: templates,
            updateExperienceTemplate: updateExperienceTemplate
        };
    }
);
