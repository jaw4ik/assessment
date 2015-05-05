define(['repositories/courseRepository', 'localization/localizationManager', 'eventTracker', 'fileUpload', 'notify', 'dataContext', 'mappers/courseModelMapper',
    'mappers/objectiveModelMapper', 'durandal/app', 'constants'],
    function (repository, localizationManager, eventTracker, fileUpload, notify, dataContext, courseModelMapper, objectiveModelMapper, app, constants) {

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
                        var course = processImportedCourse(data.course, data.objectives);
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

        function processImportedCourse(courseData, objectivesData) {
            _.each(objectivesData, function (objectiveData) {
                var objective = objectiveModelMapper.map(objectiveData);
                dataContext.objectives.push(objective);
            });

            var course = courseModelMapper.map(courseData, dataContext.objectives, dataContext.templates);
            dataContext.courses.push(course);

            app.trigger(constants.messages.course.created, course);
            if (course.objectives.length) {
                app.trigger(constants.messages.objective.createdInCourse);
            }

            if (course.objectives.length && course.objectives[0].questions.length) {
                app.trigger(constants.messages.question.created, course.objectives[0].id, course.objectives[0].questions[0]);
            }

            return course;
        }
    }
);