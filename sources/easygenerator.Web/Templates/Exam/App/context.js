define(['models/course', 'models/objective', 'models/question', 'models/answer'],
    function (Course, Objective, Question, Answer) {

        var
            courseId = '',
            objectives = [],
            title = '',

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
                                image: objective.image,
                                questions: _.map(objective.questions, function (question) {
                                    return new Question({
                                        id: question.id,
                                        objectiveId: objective.id,
                                        title: question.title,
                                        answers: _.map(question.answers, function (answer) {
                                            return new Answer({
                                                id: answer.id,
                                                isCorrect: answer.isCorrect,
                                                text: answer.text
                                            });
                                        }),
                                        score: 0,
                                        hasContent: question.hasContent
                                    });
                                })
                            });
                        })
                    });
                    return that;
                });
            };

        return {
            initialize: initialize,
            title: title,
            objectives: objectives,
            courseId: courseId
        };

    });