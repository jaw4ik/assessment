﻿define(['durandal/app', 'plugins/http', 'constants', 'mappers/courseModelMapper', 'mappers/objectiveModelMapper', 'mappers/templateModelMapper'],
    function (app, http, constants, courseModelMapper, objectiveModelMapper, templateModelMapper) {
        "use strict";

        var
            objectives = [],
            courses = [],
            templates = [],

            initialize = function () {
                return Q.fcall(function () {
                    return $.ajax({
                        url: 'api/templates',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        _.each(response.data, function (template) {
                            templates.push(templateModelMapper.map(template));
                        });
                    });
                }).then(function () {
                    return $.ajax({
                        url: 'api/objectives',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        _.each(response.data, function (item) {
                            objectives.push(objectiveModelMapper.map(item));
                        });
                    });
                }).then(function () {
                    return $.ajax({
                        url: 'api/courses',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        _.each(response.data, function (item) {
                            courses.push(courseModelMapper.map(item, objectives, templates));
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