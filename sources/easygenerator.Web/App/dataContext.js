define(['durandal/app', 'constants', 'userContext', 'http/apiHttpWrapper', 'http/storageHttpWrapper', 'mappers/courseModelMapper', 'mappers/objectiveModelMapper', 'mappers/templateModelMapper', 'mappers/videoModelMapper'],
    function (app, constants, userContext, apiHttpWrapper, storageHttpWrapper, courseModelMapper, objectiveModelMapper, templateModelMapper, videoModelMapper) {
        "use strict";
        var
            objectives = [],
            courses = [],
            templates = [],
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
                    return storageHttpWrapper.post(constants.course.video.storage.host + constants.course.video.storage.videosUrl)
                   .then(function (data) {
                       userContext.availableStorageSpace = data.AvailableStorageSpace;
                       _.each(data.media.videos, function (item) {
                           videos.push(videoModelMapper.map(item));
                       });
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
            videos: videos,
            getQuestions: getQuestions
        };
    });