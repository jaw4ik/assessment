define(['localization/localizationManager', 'eventTracker', 'fileUpload', 'notify', 'dataContext', 'mappers/courseModelMapper',
    'mappers/sectionModelMapper', 'durandal/app', 'constants'],
    function (localizationManager, eventTracker, fileUpload, notify, dataContext, courseModelMapper, sectionModelMapper, app, constants) {

        return {
            execute: function (options) {
                eventTracker.publish('Open "choose PowerPoint file" dialogue', options.eventCategory);

                return fileUpload.upload({
                    action: 'api/course/import/presentation',
                    supportedExtensions: ['pptx'],
                    acceptedTypes: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    notSupportedFileMessage: localizationManager.localize('presentationIsNotSupported'),

                    startLoading: function () {
                        eventTracker.publish('Import from PowerPoint file', options.eventCategory);
                        options.startLoading();
                    },
                    success: function (response) {
                        if (!response || !response.data)
                            return;

                        var data = response.data;
                        var course = processImportedCourse(data.course, data.sections);
                        options.success(course);
                    },
                    error: function (event) {
                        var resourceKey = "responseFailed";

                        if (event && event.status) {
                            switch (event.status) {
                                case 400:
                                    resourceKey = "pptxUploadError";
                                    break;
                                case 413:
                                    resourceKey = "pptxSizeIsTooLarge";
                                    break;
                            }
                        }

                        notify.error(localizationManager.localize(resourceKey));
                    },
                    complete: function () {
                        options.complete();
                    }
                });
            }
        };

        function processImportedCourse(courseData, sectionsData) {
            _.each(sectionsData, function (sectionData) {
                var section = sectionModelMapper.map(sectionData);
                dataContext.sections.push(section);
            });

            var course = courseModelMapper.map(courseData, dataContext.sections, dataContext.templates);
            dataContext.courses.push(course);

            app.trigger(constants.messages.course.created, course);
            if (course.sections.length) {
                app.trigger(constants.messages.section.createdInCourse);
            }

            if (course.sections.length && course.sections[0].questions.length) {
                app.trigger(constants.messages.question.created, course.sections[0].id, course.sections[0].questions[0]);
            }

            return course;
        }
    }
);