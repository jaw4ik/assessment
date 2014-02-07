define(['models/course', 'models/objective', 'models/question', 'models/answer', 'models/learningContent'],
    function (Course, Objective, Question, Answer, LearningContent) {

        var course = {},

            initialize = function () {
                var that = this;

                return $.ajax({
                    url: 'content/data.js?v=' + Math.random(),
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(function (response) {
                    that.course = new Course({
                        id: response.id,
                        title: response.title,
                        hasIntroductionContent: response.hasIntroductionContent,
                        objectives: _.map(response.objectives, function (objective) {
                            return new Objective({
                                id: objective.id,
                                title: objective.title,
                                image: 'img/objective.png',
                                questions: _.map(objective.questions, function (question) {
                                    return new Question({
                                        id: question.id,
                                        title: question.title,
                                        answers: _.map(question.answers, function (answer) {
                                            return new Answer({
                                                id: answer.id,
                                                isCorrect: answer.isCorrect,
                                                text: answer.text
                                            });
                                        }),
                                        learningContents: _.map(question.learningContents, function (learningContent) {
                                            return new LearningContent({ id: learningContent.id });
                                        }),
                                        score: 0,
                                        hasContent: question.hasContent
                                    });
                                })
                            });
                        })
                    });

                    return {
                        course: course,
                    };
                });
            };

        return {
            initialize: initialize,

            course: course
        };

    });