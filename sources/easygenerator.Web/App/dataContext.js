define(['durandal/app', 'durandal/http', 'models/objective', 'configuration/images', 'models/objective', 'models/question', 'models/experience'],
    function (app, http, objectiveModel, images, ObjectiveModel, QuestionModel, ExperienceModel) {

        var
            objectives = [],
            experiences = [],
            initialize = function () {
                return http.post('api/data').then(function (response) {
                    objectives.push.apply(objectives, _.map(response.objectives, function (objective) {
                        return new ObjectiveModel({
                            id: objective.id,
                            title: objective.title,
                            image: objective.image,
                            questions: _.map(objective.questions, function (question) {
                                return new QuestionModel({ id: question.id, title: question.title, answerOptions: question.answerOptions, explanations: question.explanations });
                            })
                        });
                    }));
                    experiences.push.apply(experiences, _.map(response.experiences, function (experience) {
                        return new ExperienceModel({
                            id: experience.id,
                            title: experience.title,
                            objectives: []
                        });
                    }));
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