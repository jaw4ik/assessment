define([],
    function () {

        var
            experienceId = '',
            objectives = [],
            title = '',
            testResult = ko.observableArray([]),
            isTryAgain = false,
            isRestartExperience = false,

            initialize = function () {
                var that = this;

                return $.ajax({
                    url: 'content/data.js?v=' + Math.random(),
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(function (response) {
                    that.title = response.title;
                    that.experienceId = response.id;
                    that.objectives = _.map(response.objectives, function (objective) {
                        return {
                            id: objective.id,
                            title: objective.title,
                            image: objective.image,
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
                                    learningContents: _.map(question.learningContents, function (learningContent) {
                                        return { id: learningContent.id };
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
            title: title,
            objectives: objectives,
            testResult: testResult,
            isTryAgain: isTryAgain,
            isRestartExperience: isRestartExperience,
            experienceId: experienceId
        };

    });