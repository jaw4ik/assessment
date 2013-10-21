define(['repositories/experienceRepository', 'repositories/templateRepository', 'plugins/router', 'constants', 'eventTracker', 'notify', 'localization/localizationManager'],
    function (repository, templateRepository, router, constants, eventTracker, notify, localizationManager) {

        var
            defaultTemplateImage = '/Content/images/undefinedTemplate.png',
            events = {
                navigateToExperiences: 'Navigate to experiences',
                createAndNew: "Create learning experience and create new",
                createAndEdit: "Create learning experience and open its properties",
            };

        var
            template = { id: ko.observable() },
            templates = ko.observableArray(),
            title = ko.observable(''),
            chooseTemplateText = '';

        title.isValid = ko.computed(function () {
            var length = title().trim().length;
            return length > 0 && length <= constants.validation.experienceTitleMaxLength;
        });

        title.isEditing = ko.observable();

        template.image = ko.computed(function () {
            if (_.isNullOrUndefined(template.id())) {
                return defaultTemplateImage;
            }

            var selectedTemplate = _.find(templates(), function (item) {
                return item.id === template.id();
            });

            return _.isNullOrUndefined(selectedTemplate) ? defaultTemplateImage : selectedTemplate.image;
        });

        var
            navigateToExperiences = function () {
                eventTracker.publish(events.navigateToExperiences);
                router.navigate('experiences');
            },

            createAndNew = function () {
                eventTracker.publish(events.createAndNew);
                createExperience.call(this, function (experience) {
                    title.isEditing(true);
                    template.id(null);
                    notify.info(localizationManager.localize('savedAt') + ' ' + experience.createdOn.toLocaleTimeString());
                });
            },

            createAndEdit = function () {
                eventTracker.publish(events.createAndEdit);
                createExperience.call(this, function (experience) {
                    router.navigate('experience/' + experience.id);
                });
            },

            activate = function () {
                var that = this;
                return templateRepository.getCollection().then(function (templatesResponse) {
                    that.templates(_.chain(templatesResponse).map(function (item) {
                        return {
                            id: item.id,
                            name: item.name,
                            image: item.image
                        };
                    }).sortBy(function (item) {
                        return item.name.toLowerCase();
                    }).value());

                    that.title('');
                    that.template.id(null);
                    that.chooseTemplateText = localizationManager.localize('chooseTemplate');
                });
            },

            compositionComplete = function () {
                setWidthSelector();

                $(window).resize(function () {
                    setWidthSelector();
                });

                function setWidthSelector() {
                    var selector = $(".create-experience .experience-template-selector");
                    var button = $(".saveAndNew");
                    var totalWidth = button.width();
                    totalWidth += parseInt(button.css("padding-left"), 10) + parseInt(button.css("padding-right"), 10);
                    totalWidth += parseInt(button.css("borderRightWidth"), 10) + parseInt(button.css("borderLeftWidth"), 10);
                    selector.width(totalWidth);
                }
            };

        function createExperience(callback) {
            if (!title.isValid() || !_.isString(template.id())) {
                return;
            }
            notify.lockContent();
            repository.addExperience(title().trim(), template.id()).then(function (experience) {
                title('');
                notify.unlockContent();
                callback(experience);
            });
        }

        return {
            activate: activate,
            compositionComplete: compositionComplete,
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