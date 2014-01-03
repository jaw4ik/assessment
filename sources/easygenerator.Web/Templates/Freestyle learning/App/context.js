define([],
    function () {

        var
            course = {},

            objectives = [],

            initialize = function () {
                var that = this;
                return $.ajax({
                    url: 'content/data.js?v=' + Math.random(),
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(function (response) {

                    that.course.id = response.id;
                    that.course.title = response.title;

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
                                    learningContents: _.map(question.learningContents, function (learningContent) {
                                        return { id: learningContent.id };
                                    }),
                                    score: 0,
                                    hasContent: question.hasContent
                                };
                            })
                        };
                    });

                    return {
                        course: course,

                        objectives: objectives
                    };
                });
            };

        return {
            initialize: initialize,

            course: course,

            objectives: objectives
        };

    });