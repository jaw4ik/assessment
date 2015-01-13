(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('dataContext', dataContext);

    dataContext.$inject = ['$q', '$http', 'Quiz', 'SingleSelectText', 'MultipleSelectText', 'TextMatching', 'DragAndDropText', 'Statement', 'SingleSelectImage', 'FillInTheBlanks', 'Hotspot', 'Objective', 'LearningContent'];// jshint ignore:line

    function dataContext($q, $http, Quiz, SingleSelectText, MultipleSelectText, TextMatching, DragAndDropText, Statement, SingleSelectImage, FillInTheBlanks, Hotspot, Objective, LearningContent) { // jshint ignore:line

        var
            self = {
                quiz: undefined
            }
        ;

        return {
            getQuiz: getQuiz
        };

        function getQuiz() {
            var dfd = $q.defer();
            if (self.quiz) {
                dfd.resolve(self.quiz);
            } else {
                $http.get('content/data.js').success(function (response) {
                    var objectives = [];
                    var questions = [];
                    if (Array.isArray(response.objectives)) {
                        var dtoQuestions = [];
                        response.objectives.forEach(function (dto) {
                            if (Array.isArray(dto.questions)) {
                                dto.questions.forEach(function (dtq) {
                                    if (dtq) {
                                        var question;

                                        if (dtq.type === 'singleSelectText') {
                                            question = new SingleSelectText(dtq.id, dtq.title, dtq.type, dtq.answers);
                                        }

                                        if (dtq.type === 'statement') {
                                            question = new Statement(dtq.id, dtq.title, dtq.type, dtq.answers);
                                        }

                                        if (dtq.type === 'singleSelectImage') {
                                            question = new SingleSelectImage(dtq.id, dtq.title, dtq.type, dtq.answers, dtq.correctAnswerId);
                                        }

                                        if (dtq.type === 'dragAndDropText') {
                                            question = new DragAndDropText(dtq.id, dtq.title, dtq.type, dtq.background, dtq.dropspots);
                                        }

                                        if (dtq.type === 'textMatching') {
                                            question = new TextMatching(dtq.id, dtq.title, dtq.type, dtq.answers);
                                        }

                                        if (dtq.type === 'fillInTheBlank') {
                                            question = new FillInTheBlanks(dtq.id, dtq.title, dtq.type, dtq.answerGroups);
                                        }

                                        if (dtq.type === 'hotspot') {
                                            question = new Hotspot(dtq.id, dtq.title, dtq.type, dtq.background, dtq.spots, dtq.isMultiple);
                                        }

                                        if (dtq.type === 'multipleSelect') {
                                            question = new MultipleSelectText(dtq.id, dtq.title, dtq.type, dtq.answers);
                                        }

                                        if (question) {
                                            if (dtq.hasContent) {
                                                question.contentUrl = 'content/' + dto.id + '/' + dtq.id + '/content.html';
                                            }

                                            question.learningContents = getLearningContents(dto, dtq);
                                            questions.push(question);
                                            dtoQuestions.push(question);
                                        }

                                    }

                                });
                                objectives.push(new Objective(dto.id, dto.title, dtoQuestions));
                            }
                        });
                    }

                    self.quiz = new Quiz(response.id, response.title, objectives, questions);

                    dfd.resolve(self.quiz);
                });
            }

            return dfd.promise;
        }

        function getLearningContents(objective, question) {
            var learningContents = [];
            if (Array.isArray(question.learningContents)) {
                question.learningContents.forEach(function (learningContent) {
                    if (learningContent) {
                        var learningContentUrl = 'content/' + objective.id + '/' + question.id + '/' + learningContent.id + '.html';
                        learningContents.push(new LearningContent(learningContent.id, learningContentUrl));
                    }
                });
            }
            return learningContents;
        }
    }

}());