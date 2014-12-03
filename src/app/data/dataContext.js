(function () {
    'use strict';

    angular.module('quiz').factory('dataContext', [
        '$q', '$http',
        'Quiz', 'SingleSelectText', 'TextMatching', 'DragAndDropText', 'Statement', 'SingleSelectImage', 'FillInTheBlanks',
        dataContext]);

    function dataContext($q, $http, Quiz, SingleSelectText, TextMatching, DragAndDropText, Statement, SingleSelectImage, FillInTheBlanks) {

        var
            self = {
                quiz: undefined
            }
        ;

        return {
            getQuiz: getQuiz
        };

        function getQuiz() {
            if (self.quiz) {
                return $q.when(self.quiz);
            } else {
                return $http.get('../content/data.js').success(function (response) {

                    var questions = [];
                    if (Array.isArray(response.objectives)) {
                        response.objectives.forEach(function (dto) {
                            if (Array.isArray(dto.questions)) {
                                dto.questions.forEach(function (dtq) {
                                    if (dtq) {
                                        var question;
                                        if (dtq.type === 'singleSelectText') {
                                            question = new SingleSelectText(dtq.id, dtq.title, dtq.answers);
                                        }

                                        if (dtq.type === 'statement') {
                                            question = new Statement(dtq.id, dtq.title, dtq.answers);
                                        }

                                        if (dtq.type === 'singleSelectImage') {
                                            question = new SingleSelectImage(dtq.id, dtq.title, dtq.answers, dtq.correctAnswerId);
                                        }

                                        if (dtq.type === 'dragAndDropText') {
                                            question = new DragAndDropText(dtq.id, dtq.title, dtq.background, dtq.dropspots);
                                        }

                                        if (dtq.type === 'textMatching') {
                                            question = new TextMatching(dtq.id, dtq.title, dtq.answers);
                                        }

                                        if (dtq.type == 'fillInTheBlank') {
                                            var answers = [];
                                            _.each(dtq.answerGroups, function (group) {
                                                _.each(group.answers, function (answer) {
                                                    if (answer.isCorrect) {
                                                        answers.push({
                                                            id: answer.id,
                                                            groupId: group.id,
                                                            text: answer.text
                                                        });
                                                    }
                                                });
                                            });
                                            question = new FillInTheBlanks(dtq.id, dtq.title, answers);
                                        }

                                        if (question) {

                                            if (dtq.hasContent) {
                                                question.contentUrl = '../content/' + dto.id + '/' + dtq.id + '/content.html';
                                            }

                                            questions.push(question);
                                        }

                                    }

                                });
                            }

                        });
                    }

                    self.quiz = new Quiz(response.title, questions);

                    return self.quiz;
                });
            }
        }

    }

}());