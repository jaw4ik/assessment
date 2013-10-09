﻿define(['durandal/app', 'plugins/http', 'models/objective', 'models/objective', 'models/question', 'models/experience', 'models/answerOption', 'models/learningObject', 'models/template', 'constants'],
    function (app, http, objectiveModel, ObjectiveModel, QuestionModel, ExperienceModel, AnswerOptionModel, LearningObjectModel, TemplateModel, constants) {

        function parseDateString(str) {
            return new Date(parseInt(str.substr(6), 10));
        }

        var
            objectives = [],
            experiences = [],
            templates = [],
            isTryMode = false,
            initialize = function () {
                var that = this;
                return $.ajax({
                    url: 'api/templates',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(function (response) {
                    _.each(response.data, function (template) {
                        templates.push(
                            new TemplateModel(
                            {
                                id: template.Id.split('-').join(''),
                                name: template.Name,
                                image: template.Image
                            }));
                    });
                }).then(function () {
                    return $.ajax({
                        url: 'api/objectives',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        _.each(response.data, function (item) {
                            objectives.push(new ObjectiveModel({
                                id: item.Id.split('-').join(''),
                                title: item.Title,
                                createdOn: parseDateString(item.CreatedOn),
                                modifiedOn: parseDateString(item.ModifiedOn),
                                image: constants.defaultObjectiveImage,
                                questions: _.map(item.Questions, function (question) {
                                    return new QuestionModel({
                                        id: question.Id.split('-').join(''),
                                        title: question.Title,
                                        createdOn: parseDateString(question.CreatedOn),
                                        modifiedOn: parseDateString(question.ModifiedOn),
                                        answerOptions: _.map(question.Answers, function (answer) {
                                            return new AnswerOptionModel({
                                                id: answer.Id,
                                                text: answer.Text,
                                                isCorrect: answer.IsCorrect
                                            });
                                        }),
                                        learningObjects: _.map(question.LearningObjects, function (learningObject) {
                                            return new LearningObjectModel({
                                                id: learningObject.Id,
                                                text: learningObject.Text,
                                            });
                                        })
                                    });
                                })
                            }));
                        });
                    });
                }).then(function () {
                    return $.ajax({
                        url: 'api/experiences',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        _.each(response.data, function (item) {
                            experiences.push(new ExperienceModel({
                                id: item.Id.split('-').join(''),
                                title: item.Title,
                                createdOn: parseDateString(item.CreatedOn),
                                modifiedOn: parseDateString(item.ModifiedOn),
                                objectives: _.map(item.RelatedObjectives, function (relatedObjective) {
                                    return _.find(objectives, function (objective) {
                                        return objective.id == relatedObjective.Id.split('-').join('');
                                    });
                                }),
                                buildingStatus: constants.buildingStatuses.notStarted,
                                builtOn: _.isNullOrUndefined(item.builtOn) ? null : parseDateString(item.builtOn),
                                packageUrl: item.packageUrl,
                                template: _.find(templates, function (tItem) {
                                    return tItem.id === item.Template.Id.split('-').join('');
                                })
                            }));
                        });
                    });
                }).then(function() {
                    return $.ajax({
                        url: 'api/user/istrymode',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        that.isTryMode = response.data;
                    });
                }).fail(function () {
                    app.showMessage("Failed to initialize datacontext.");
                });

            };

        return {
            initialize: initialize,
            objectives: objectives,
            experiences: experiences,
            templates: templates,
            isTryMode: isTryMode
        };
    });