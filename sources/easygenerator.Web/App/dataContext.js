define(['durandal/app', 'plugins/http', 'models/objective', 'models/objective', 'models/question', 'models/course', 'models/answerOption', 'models/learningContent', 'models/template', 'constants'],
    function (app, http, objectiveModel, ObjectiveModel, QuestionModel, CourseModel, AnswerOptionModel, LearningContentModel, TemplateModel, constants) {

        var
            objectives = [],
            courses = [],
            templates = [],
            userSettings = {
                isRegisteredOnAim4You: false
            },

            initialize = function () {
                var that = this;
                return Q.fcall(function () {
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
                                        description: template.Description,
                                        previewDemoUrl: template.PreviewDemoUrl
                                    }));
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
                                createdOn: new Date(item.CreatedOn),
                                modifiedOn: new Date(item.ModifiedOn),
                                image: constants.defaultObjectiveImage,
                                questions: _.map(item.Questions, function (question) {
                                    return new QuestionModel({
                                        id: question.Id,
                                        title: question.Title,
                                        content: question.Content,
                                        createdOn: new Date(question.CreatedOn),
                                        modifiedOn: new Date(question.ModifiedOn)
                                    });
                                })
                            }));
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
                            courses.push(new CourseModel({
                                id: item.Id.split('-').join(''),
                                title: item.Title,
                                createdOn: new Date(item.CreatedOn),
                                modifiedOn: new Date(item.ModifiedOn),
                                objectives: _.map(item.RelatedObjectives, function (relatedObjective) {
                                    return _.find(objectives, function (objective) {
                                        return objective.id == relatedObjective.Id.split('-').join('');
                                    });
                                }),
                                publishedPackageUrl: item.PublishedPackageUrl,
                                builtOn: _.isNullOrUndefined(item.builtOn) ? null : new Date(item.builtOn),
                                packageUrl: item.PackageUrl,
                                reviewUrl: item.ReviewUrl,
                                template: _.find(templates, function (tItem) {
                                    return tItem.id === item.Template.Id;
                                }),
                                introductionContent: item.IntroductionContent
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
                            userSettings.isRegisteredOnAim4You = response.data.IsRegisteredOnAim4You;
                        }
                    });
                }).fail(function () {
                    app.showMessage("Failed to initialize datacontext.");
                });
            };

        return {
            initialize: initialize,
            objectives: objectives,
            courses: courses,
            templates: templates,
            userSettings: userSettings
        };
    });