define(['durandal/app', 'constants', 'http/apiHttpWrapper', 'mappers/courseModelMapper', 'mappers/objectiveModelMapper', 'mappers/templateModelMapper'],
    function (app, constants, apiHttpWrapper, courseModelMapper, objectiveModelMapper, templateModelMapper) {
        "use strict";
        var
            objectives = [],
            courses = [],
            templates = [],

            initialize = function () {
                return Q.fcall(function () {
                    return apiHttpWrapper.post('api/templates')
                        .then(function (response) {
                            _.each(response.data, function (template) {
                                templates.push(templateModelMapper.map(template));
                            });
                        });
                }).then(function () {
                    return apiHttpWrapper.post('api/objectives')
                      .then(function (response) {
                          _.each(response.data, function (item) {
                              objectives.push(objectiveModelMapper.map(item));
                          });
                      });
                }).then(function () {
                    return apiHttpWrapper.post('api/courses')
                    .then(function (response) {
                        _.each(response.data, function (item) {
                            // Temporary - do not display courses if user does not have template
                            if (_.find(templates, function (template) {
                                return item.Template.Id === template.id;
                            })) {
                                courses.push(courseModelMapper.map(item, objectives, templates));
                            }
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
            getQuestions: getQuestions
        };
    });