(function () {
    'use strict';

    angular.module('quiz').factory('dataContext', [
        '$q', '$http',
        'Quiz', 'SingleSelectText', 'TextMatching', 'DragAndDropText', 'Statement', 'SingleSelectImage',
        dataContext]);

    function dataContext($q, $http, Quiz, SingleSelectText, TextMatching, DragAndDropText, Statement, SingleSelectImage) {

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
                                            question = new SingleSelectImage(dtq.title, dtq.answers);
                                        }

                                        if (dtq.type === 'dragAndDropText') {
                                            question = new DragAndDropText(dtq.id, dtq.title, dtq.background, dtq.dropspots);
                                        }

                                        if (dtq.type === 'textMatching') {
                                            question = new TextMatching(dtq.id, dtq.title, dtq.answers);
                                        }

                                        if (question) {
                                            question.title = dtq.title;

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