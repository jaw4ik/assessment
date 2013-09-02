define([],
    function () {

        var
            experience = {},

            objectives = [],

            initialize = function () {
                var that = this;
                return $.ajax({
                    url: 'content/data.js?v=' + Math.random(),
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(function (response) {

                    that.experience.id = response.id;
                    that.experience.title = response.title;

                    that.objectives = _.map(response.objectives, function (objective) {
                        return {
                            id: objective.id,
                            title: objective.title,
                            image: 'img/objective.png',
                            questions: _.map(objective.questions, function (question) {
                                return {
                                    id: question.id,
                                    title: question.title,
                                    answers: _.map(question.answers, function (answer) {
                                        return {
                                            id: answer.id,
                                            isCorrect: answer.isCorrect,
                                            text: answer.text
                                        };
                                    }),
                                    explanations: _.map(question.explanations, function (explanation) {
                                        return { id: explanation.id };
                                    }),
                                    score: 0
                                };
                            })
                        };
                    });
                });
            };

        return {
            initialize: initialize,

            experience: experience,

            objectives: objectives
        };

    });