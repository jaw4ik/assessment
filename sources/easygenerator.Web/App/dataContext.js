define(['durandal/app', 'plugins/http', 'models/objective', 'models/objective', 'models/question', 'models/experience', 'models/answerOption', 'models/learningContent', 'models/template', 'constants'],
    function (app, http, objectiveModel, ObjectiveModel, QuestionModel, ExperienceModel, AnswerOptionModel, LearningContentModel, TemplateModel, constants) {

        function parseDateString(str) {
            return new Date(parseInt(str.substr(6), 10));
        }

        var
            objectives = [],
            experiences = [],
            templates = [],
            isTryMode = false,
            userEmail = '',
            helpHints = [],

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
                                id: template.Id,
                                name: template.Name,
                                image: template.Image,
                                settingsUrl: template.SettingsUrl,
                                description: template.Description
                            }));
                    });
                }).then(function () {
                    return $.ajax({
                        url: 'api/helpHints',
                        type: 'POST',
                        contentType: 'application/json',
                        dataType: 'json'
                    }).then(function (response) {
                        _.each(response.data.HelpHints, function (helpHint) {
                            helpHints.push({
                                id: helpHint.Id,
                                name: helpHint.Name,
                                localizationKey: helpHint.Name + 'HelpHint'
                            });
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
                            objectives.push(new ObjectiveModel({
                                id: item.Id,
                                title: item.Title,
                                createdOn: parseDateString(item.CreatedOn),
                                modifiedOn: parseDateString(item.ModifiedOn),
                                image: constants.defaultObjectiveImage,
                                questions: _.map(item.Questions, function (question) {
                                    return new QuestionModel({
                                        id: question.Id,
                                        title: question.Title,
                                        content: question.Content,
                                        createdOn: parseDateString(question.CreatedOn),
                                        modifiedOn: parseDateString(question.ModifiedOn)
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
                                publishedPackageUrl: item.PublishedPackageUrl,
                                builtOn: _.isNullOrUndefined(item.builtOn) ? null : parseDateString(item.builtOn),
                                packageUrl: item.PackageUrl,
                                template: _.find(templates, function (tItem) {
                                    return tItem.id === item.Template.Id;
                                })
                            }));
                        });
                    });
                }).then(function () {
                    return $.ajax({
                        url: 'api/user',
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        cache: false
                    }).then(function (response) {
                        if (response.data) {
                            that.isTryMode = response.data.IsTryMode;
                            that.userEmail = response.data.Email;
                        }
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
            isTryMode: isTryMode,
            userEmail: userEmail,
            helpHints: helpHints
        };
    });