define(['durandal/app', 'plugins/http', 'models/objective', 'models/objective', 'models/question', 'models/experience', 'models/answerOption', 'models/explanation', 'constants'],
    function (app, http, objectiveModel, ObjectiveModel, QuestionModel, ExperienceModel, AnswerOptionModel, ExplanationModel, constants) {

        function parseDateString(str) {
            return new Date(parseInt(str.substr(6), 10));
        }

        var
            objectives = [],
            experiences = [],
            initialize = function () {
                return $.ajax({
                    url: 'data.js?v=' + Math.random(),
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(function (response) {
                    objectives.push.apply(objectives, _.map(response.objectives, function (objective) {
                        return new ObjectiveModel({
                            id: objective.id,
                            title: objective.title,
                            createdOn: parseDateString(objective.createdOn),
                            modifiedOn: parseDateString(objective.modifiedOn),
                            image: constants.defaultObjectiveImage,
                            questions: _.map(objective.questions, function (question) {
                                return new QuestionModel({
                                    id: question.id,
                                    title: question.title,
                                    createdOn: parseDateString(question.createdOn),
                                    modifiedOn: parseDateString(question.modifiedOn),
                                    answerOptions: _.map(question.answerOptions, function (answerOption) {
                                        return new AnswerOptionModel(answerOption);
                                    }),
                                    explanations: _.map(question.explanations, function (explanation) {
                                        return new ExplanationModel(explanation);
                                    })
                                });
                            })
                        });
                    }));
                    experiences.push.apply(experiences, _.map(response.experiences, function (experience) {
                        return new ExperienceModel({
                            id: experience.id,
                            title: experience.title,
                            createdOn: parseDateString(experience.createdOn),
                            modifiedOn: parseDateString(experience.modifiedOn),
                            objectives: _.map(experience.objectives, function (objectiveId) {
                                return _.find(objectives, function (objective) {
                                    return objective.id === objectiveId;
                                });
                            }),
                            buildingStatus: 'notStarted',
                            builtOn: experience.builtOn,
                            packageUrl: experience.packageUrl
                        });
                    }));
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
                                questions: []
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
                                objectives: [],
                                buildingStatus: constants.buildingStatuses.notStarted,
                                builtOn: _.isNullOrUndefined(item.builtOn) ? null : parseDateString(item.builtOn),
                                packageUrl: item.packageUrl
                            }));
                        });
                    });
                }).fail(function () {
                    app.showMessage("Failed to initialize datacontext.");
                });

            };
        return {
            initialize: initialize,
            objectives: objectives,
            experiences: experiences
        };
    });