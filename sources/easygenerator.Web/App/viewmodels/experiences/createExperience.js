define(['repositories/experienceRepository', 'repositories/templateRepository', 'plugins/router', 'constants', 'eventTracker', 'notify', 'localization/localizationManager'],
    function (repository, templateRepository, router, constants, eventTracker, notify, localizationManager) {

        var
            events = {
                createAndContinue: "Create learning experience and open its properties",
                chooseTemplate: "Choose template",
                defineTitle: "Define title"
            },
            

            goBackTooltip = '',

            templates = ko.observableArray(),
            
            title = (function () {
                var value = ko.observable('');
                value.isValid = ko.computed(function () {
                    var length = value().trim().length;
                    return length > 0 && length <= constants.validation.experienceTitleMaxLength;
                });
                value.isEditing = ko.observable();
                value.startEditing = function() {
                    eventTracker.publish(events.defineTitle);
                    value.isEditing(true);
                };
                return value;
            })(),
            

            isFormFilled = function () {
                return title.isValid() && !_.isNullOrUndefined(getSelectedTemplate());
            },

            getSelectedTemplate = function () {
                return _.filter(templates(), function (item) {
                    return item.isSelected();
                })[0];
            },
            
            resetTemplatesSelection = function () {
                _.each(templates(), function (item) {
                    item.isSelected(false);
                });
            },

            selectTemplate = function (item) {
                eventTracker.publish(events.chooseTemplate);
                if (item && !_.isUndefined(item.isSelected)) {
                    resetTemplatesSelection();
                    item.isSelected(true);
                }
            },

            navigateToExperiences = function () {
                router.navigate('experiences');
            },

            createAndContinue = function () {
                eventTracker.publish(events.createAndContinue);
                if (!isFormFilled()) {
                    return;
                }
                notify.lockContent();
                repository.addExperience(title().trim(), getSelectedTemplate().id)
                    .then(function (experience) {
                        notify.unlockContent();
                        router.navigate('experience/' + experience.id);
                    })
                    .fail(function () {
                        notify.unlockContent();
                    });
            },

            mapTemplate = function (item) {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    image: item.image,
                    isSelected: ko.observable(false)
                };
            },

            activate = function () {
                this.goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('experiences');
                this.title('');

                var that = this;
                return templateRepository.getCollection().then(function (templatesResponse) {
                    that.templates(_.chain(templatesResponse)
                        .map(mapTemplate)
                        .sortBy(function (item) {
                            return item.name.toLowerCase();
                        }).value());
                });
            };

        return {
            activate: activate,
            navigateToExperiences: navigateToExperiences,
            createAndContinue: createAndContinue,
            getSelectedTemplate: getSelectedTemplate,
            resetTemplatesSelection: resetTemplatesSelection,
            selectTemplate: selectTemplate,

            title: title,
            templates: templates,
            experienceTitleMaxLength: constants.validation.experienceTitleMaxLength,
            goBackTooltip: goBackTooltip,
            isFormFilled: isFormFilled
        };
    }
);