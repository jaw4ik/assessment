define(['repositories/experienceRepository', 'repositories/templateRepository', 'plugins/router', 'constants', 'eventTracker', 'notify', 'localization/localizationManager'],
    function (repository, templateRepository, router, constants, eventTracker, notify, localizationManager) {

        var
            defaultTemplateImage = '/Content/images/undefinedTemplate.png',
            events = {
                navigateToExperiences: 'Navigate to experiences',
                createAndNew: "Create learning experience and create new",
                createAndEdit: "Create learning experience and open its properties",
            },

            sendEvent = function (eventName) {
                eventTracker.publish(eventName);
            };

        var template = { id: ko.observable() },
            templates = ko.observableArray(),
            title = ko.observable(''),
            chooseTemplateText = '';

        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.experienceTitleMaxLength;
        });
        title.isEditing = ko.observable();

        template.image = ko.computed(function () {

            if (_.isNullOrUndefined(template.id()))
                return defaultTemplateImage;

            var selectedTemplate = _.find(templates(), function (item) {
                return item.id === template.id();
            });

            return _.isNullOrUndefined(selectedTemplate) ? defaultTemplateImage : selectedTemplate.image;
        });

        var navigateToExperiences = function () {
            sendEvent(events.navigateToExperiences);
            router.navigate('experiences');
        },
            createAndNew = function () {
                sendEvent(events.createAndNew);
                createExperience.call(this, function () {
                    title.isEditing(true);
                    notify.info(localizationManager.localize('lastSaving') + ': ' + new Date().toLocaleTimeString());
                });
            },
            createAndEdit = function () {
                sendEvent(events.createAndEdit);
                createExperience.call(this, function (experienceId) {
                    router.navigate('experience/' + experienceId);
                });
            },
            activate = function () {
                var that = this;
                return templateRepository.getCollection().then(function (templatesResponse) {
                    that.templates(_.chain(templatesResponse)
                        .map(function (item) {
                            return {
                                id: item.id,
                                name: item.name,
                                image: item.image
                            };
                        })
                        .sortBy(function (item) { return item.name.toLowerCase(); })
                        .value());

                    that.title('');
                    that.template.id(null);

                    that.chooseTemplateText = localizationManager.localize('chooseTemplate');
                });
            };

        function createExperience(callback) {
            if (!title.isValid() || !_.isString(template.id())) {
                return;
            }

            repository.addExperience({ title: title().trim(), template: { id: template.id() } }).then(function (experienceId) {
                title('');
                callback(experienceId);
            });
        }

        return {
            activate: activate,
            title: title,
            templates: templates,
            template: template,
            chooseTemplateText: chooseTemplateText,
            experienceTitleMaxLength: constants.validation.experienceTitleMaxLength,

            navigateToExperiences: navigateToExperiences,
            createAndNew: createAndNew,
            createAndEdit: createAndEdit
        };
    }
);