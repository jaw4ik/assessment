define(['repositories/experienceRepository', 'repositories/templateRepository', 'plugins/router', 'constants', 'eventTracker', 'notify', 'localization/localizationManager'],
    function (repository, templateRepository, router, constants, eventTracker, notify, localizationManager) {

        var
            events = {
                navigateToExperiences: 'Navigate to experiences',
                createAndNew: "Create learning experience and create new",
                createAndEdit: "Create learning experience and open its properties",
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var templateId = ko.observable(),
            templates = [],
            title = ko.observable(''),
            chooseTemplateText = '';

        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.experienceTitleMaxLength;
        });
        title.isEditing = ko.observable();

        var navigateToExperiences = function () {
            sendEvent(events.navigateToExperiences);
            router.navigate('experiences');
        },

            createAndNew = function () {
                sendEvent(events.createAndNew);
                createExperience(function () {
                    title.isEditing(true);
                    notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                });
            },

            createAndEdit = function () {
                sendEvent(events.createAndEdit);
                createExperience(function (experienceId) {
                    router.navigate('experience/' + experienceId);
                });
            },

            activate = function () {
                var that = this;
                return templateRepository.getCollection().then(function (templatesResponse) {
                    that.templates = _.chain(templatesResponse)
                       .map(function (template) {
                           return {
                               id: template.id,
                               name: template.name
                           };
                       })
                       .sortBy(function (template) { return template.name.toLowerCase(); })
                       .value();

                    that.title('');
                    that.templateId(null);
                    that.chooseTemplateText = localizationManager.localize('chooseTemplate');
                });
            };

        function createExperience(callback) {
            if (!title.isValid() || !_.isString(templateId())) {
                return;
            }

            repository.addExperience({ title: title().trim(), templateId: templateId() }).then(function (experienceId) {
                title('');
                callback(experienceId);
            });
        }

        return {
            activate: activate,
            title: title,
            templates: templates,
            templateId: templateId,
            chooseTemplateText: chooseTemplateText,
            experienceTitleMaxLength: constants.validation.experienceTitleMaxLength,

            navigateToExperiences: navigateToExperiences,
            createAndNew: createAndNew,
            createAndEdit: createAndEdit
        };
    }
);