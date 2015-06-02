define(['durandal/app', 'constants', 'notify', 'localization/localizationManager', 'http/apiHttpWrapper', 'http/storageHttpWrapper', 'mappers/courseModelMapper',
    'mappers/objectiveModelMapper', 'mappers/templateModelMapper', 'mappers/videoModelMapper', 'mappers/learningPathModelMapper'],
    function (app, constants, notify, localizationManager, apiHttpWrapper, storageHttpWrapper, courseModelMapper, objectiveModelMapper, templateModelMapper, videoModelMapper, learningPathModelMapper) {
        "use strict";
        var
            objectives = [],
            courses = [],
            templates = [],
            learningPaths = [],
            videos = [],

            initialize = function () {
                return Q.fcall(function () {
                    return apiHttpWrapper.post('api/templates')
                        .then(function (data) {
                            _.each(data, function (template) {
                                templates.push(templateModelMapper.map(template));
                            });
                        });
                }).then(function () {
                    return apiHttpWrapper.post('api/objectives')
                      .then(function (data) {
                          _.each(data, function (item) {
                              objectives.push(objectiveModelMapper.map(item));
                          });
                      });
                }).then(function () {
                    return apiHttpWrapper.post('api/courses')
                    .then(function (data) {
                        _.each(data, function (item) {
                            // Temporary - do not display courses if user does not have template
                            if (_.find(templates, function (template) {
                                return item.Template.Id === template.id;
                            })) {
                                courses.push(courseModelMapper.map(item, objectives, templates));
                            }
                        });
                    });
                }).then(function () {
                    return apiHttpWrapper.post('api/learningpaths')
                    .then(function (data) {
                        _.each(data, function (item) {
                            learningPaths.push(learningPathModelMapper.map(item, courses));
                        });
                    });
                }).then(function () {
                        return storageHttpWrapper.get(constants.storage.host + constants.storage.mediaUrl)
                            .then(function (data) {
                                _.each(data.Videos, function (video) {
                                    videos.push(videoModelMapper.map(video));
                                });
                            }).fail(function () {
                                notify.error(localizationManager.localize('storageFailed'));
                            });
                    }).fail(function () {
                        app.showMessage("Failed to initialize datacontext.");
                    });
            },


            getQuestions = function () {
                var questions = [];
                _.each(objectives, function (objective) {
                    questions.push.apply(questions, objective.questions);
                });
                return questions;
            };

        return {
            initialize: initialize,
            objectives: objectives,
            courses: courses,
            templates: templates,
            learningPaths: learningPaths,
            videos: videos,
            getQuestions: getQuestions
        };
    });