define(['plugins/router', 'eventTracker', 'notify', 'repositories/experienceRepository', 'repositories/templateRepository', 'localization/localizationManager'],
    function (router, eventTracker, notify, experienceRepository, templateRepository, localizationManager) {

        var events = {
            updateExperienceTemplate: 'Change experience template to'
        };

        var
            experienceId = '',
            templates = [],
            isSwitchTemplateProgressShow = ko.observable(false),

            activate = function (experienceId) {
                var that = this;

                return experienceRepository.getById(experienceId).then(function (experience) {
                    that.experienceId = experience.id;

                    return templateRepository.getCollection().then(function (templates) {
                        that.templates = _.map(templates, function (template) {
                            return {
                                id: template.id,
                                name: template.name,
                                image: template.image,
                                description: template.description,
                                isSelected: ko.observable(template.id === experience.template.id)
                            };
                        });
                        that.templates = _.sortBy(that.templates, function (template) {
                            return template.name;
                        });
                    });
                }).fail(function () {
                    router.replace('404');
                });
            },

            switchTemplate = function (template) {
                var that = this;
                if (!template.isSelected()) {
                    var selectedTemplate = _.find(that.templates, function (item) {
                        return item.id === template.id;
                    });

                    that.isSwitchTemplateProgressShow(true);
                    eventTracker.publish(events.updateExperienceTemplate + ' \'' + selectedTemplate.name + '\'');
                    experienceRepository.updateExperienceTemplate(that.experienceId, selectedTemplate.id).then(function (response) {
                        notify.info(localizationManager.localize('savedAt') + ' ' + response.modifiedOn.toLocaleTimeString());
                        _.each(that.templates, function (template) {
                            template.isSelected(selectedTemplate.id === template.id);
                        });

                    }).finally(function () {
                        that.isSwitchTemplateProgressShow(false);
                    });
                }
            };

        return {
            experienceId: experienceId,
            activate: activate,
            templates: templates,
            switchTemplate: switchTemplate,
            isSwitchTemplateProgressShow: isSwitchTemplateProgressShow
        };
    }
);
