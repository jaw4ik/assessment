(function () {
    'use strict';

    angular.module('quiz').factory('dataContext', dataContext);

    function dataContext($q, $http) {
        common.$q = $q;
        common.$http = $http;

        return {
            initialize: initialize,
            getQuiz: getQuiz
        };
    }

    var
        self = {
            quiz: undefined
        },
        common = {
            $q: undefined,
            $http: undefined
        }
    ;

    function initialize() {
        return common.$http.get('../content/data.js').success(function (response) {

            var questions = [];
            if (Array.isArray(response.objectives)) {
                response.objectives.forEach(function (dto) {
                    if (Array.isArray(dto.questions)) {
                        dto.questions.forEach(function (dtq) {
                            if (dtq) {
                                var question;

                                if (dtq.type === 'singleSelectText') {
                                    question = new SinglselectText(dtq.title, dtq.answers);
                                }
                                if (dtq.type === 'statement') {
                                    question = new Statement(dtq.title, dtq.answers);
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

    function getQuiz() {
        return common.$q.when(self.quiz);
    }

    function Quiz(title, questions) {
        var that = this;

        that.title = '';
        that.questions = questions || [];
    }

    function SinglselectText(title, options) {
        var that = this;
        that.title = title;

        that.answers = options.map(function (option) {
            return {
                text: option.text,
                checked: false
            };
        });
        that.checkAnswer = function (answer) {
            that.answers.forEach(function (item) {
                item.checked = false;
            });
            answer.checked = true;
        };
    }

    function Statement(title, options) {
        var that = this;
        that.title = title;

        that.answers = options.map(function (option) {
            return {
                text: option.text,
                state: undefined
            };
        });
        that.checkAnswer = function (answer) {
            answer.checked = true;
        };
    }

}());