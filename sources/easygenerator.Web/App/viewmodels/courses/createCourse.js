﻿define(['repositories/courseRepository', 'repositories/templateRepository', 'plugins/router', 'constants', 'eventTracker', 'uiLocker', 'localization/localizationManager', 'controls/backButton/backButton'],
    function (repository, templateRepository, router, constants, eventTracker, uiLocker, localizationManager, backButton) {

        var
            events = {
                createAndContinue: "Create course and open its properties",
                chooseTemplate: "Choose template",
                defineTitle: "Define title",
                navigateToCourses: 'Navigate to courses'
            },

            templates = ko.observableArray(),
            
            title = (function () {
                var value = ko.observable('');
                value.isValid = ko.computed(function () {
                    var length = value().trim().length;
                    return length > 0 && length <= constants.validation.courseTitleMaxLength;
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

            navigateToCoursesEvent = function () {
                eventTracker.publish(events.navigateToCourses);
            },

            createAndContinue = function () {
                eventTracker.publish(events.createAndContinue);
                if (!isFormFilled()) {
                    return;
                }
                uiLocker.lock();
                repository.addCourse(title().trim(), getSelectedTemplate().id)
                    .then(function (course) {
                        uiLocker.unlock();
                        router.navigate('course/' + course.id);
                    })
                    .fail(function () {
                        uiLocker.unlock();
                    });
            },

            mapTemplate = function (item) {
                return {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    image: item.image,
                    isSelected: ko.observable(false),
                    previewUrl: item.previewDemoUrl,
                    openPreview: function (template, event) {
                        event.stopPropagation();
                        router.openUrl(template.previewUrl);
                    }
                };
            },

            activate = function () {
                var goBackTooltip = localizationManager.localize('backTo') + ' ' + localizationManager.localize('courses');
                backButton.enable(goBackTooltip, 'courses', navigateToCoursesEvent);

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
            navigateToCoursesEvent: navigateToCoursesEvent,
            createAndContinue: createAndContinue,
            getSelectedTemplate: getSelectedTemplate,
            resetTemplatesSelection: resetTemplatesSelection,
            selectTemplate: selectTemplate,

            title: title,
            templates: templates,
            courseTitleMaxLength: constants.validation.courseTitleMaxLength,
            isFormFilled: isFormFilled
        };
    }
);