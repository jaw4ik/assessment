define([],
    function () {

        var
            objectives = [],
            title = '',
            testResult = ko.observableArray([]),
            isTryAgain = false,
            
            initialize = function () {
                var that = this;
                
                return $.ajax({
                    url: 'content/data.js?v=' + Math.random(),
                    contentType: 'application/json',
                    dataType: 'json'
                }).then(function (response) {
                    that.title = response.title;
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
                                    learningObjects: _.map(question.learningObjects, function (learningObject) {
                                        return { id: learningObject.id };
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
            isTryAgain: isTryAgain
        };

    });