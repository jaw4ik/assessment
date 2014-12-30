(function () {
    'use strict';

    angular
        .module('quiz')
        .factory('dataContext', dataContext);

    dataContext.$inject = ['$q', '$http', 'Quiz', 'SingleSelectText', 'MultipleSelectText', 'TextMatching', 'DragAndDropText', 'Statement', 'SingleSelectImage', 'FillInTheBlanks', 'Hotspot'];

    function dataContext($q, $http, Quiz, SingleSelectText, MultipleSelectText, TextMatching, DragAndDropText, Statement, SingleSelectImage, FillInTheBlanks, Hotspot) { // jshint ignore:line

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

                                        if (dtq.type === 'fillInTheBlank') {
                                            question = new FillInTheBlanks(dtq.id, dtq.title, dtq.answerGroups);
                                        }

                                        if (dtq.type === 'hotspot') {
                                            question = new Hotspot(dtq.id, dtq.title, dtq.background, dtq.spots, dtq.isMultiple);
                                        }

                                        if (dtq.type === 'multipleSelect') {
                                            question = new MultipleSelectText(dtq.id, dtq.title, dtq.answers);
                                        }

                                        if (question) {

                                            if (dtq.hasContent) {
                                                question.contentUrl = 'content/' + dto.id + '/' + dtq.id + '/content.html';
                                            }

                                            questions.push(question);
                                        }

                                    }

                                });
                            }

                        });
                    }

                    if (response.hasIntroductionContent) {
                        $http.get('content/content.html').success(function(introductionContent) {
                            self.quiz = new Quiz(response.title, questions, introductionContent);
                            dfd.resolve(self.quiz);
                        });
                    } else {
                        self.quiz = new Quiz(response.title, questions);
                        dfd.resolve(self.quiz);
                    }

                });
            }

            return dfd.promise;
        }

    }

}());