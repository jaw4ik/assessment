(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('QuestionController', ['$http', '$location', QuestionController]);

    function QuestionController($http, $location) {
        var that = this;
        that.title = '';
        that.questions = [];

        that.submit = function () {
            $location.path('/summary');
        };

        $http.get('../content/data.js').success(function (response) {
            that.title = response.title;

            var result = [];
            if (Array.isArray(response.objectives)) {
                response.objectives.forEach(function (dto) {
                    if (Array.isArray(dto.questions)) {
                        dto.questions.forEach(function (dtq) {
                            if (dtq) {
                                var question;

                                if (dtq.type === 'singleSelectText') {
                                    question = new SinglselectText(dtq.title, dtq.answers);
                                }

                                if (dtq.type === 'dragAndDropText') {
                                    question = new DragAndDropText();
                                }
                                if (dtq.type === 'statement') {
                                    question = new Statement(dtq.title, dtq.answers);
                                }

                                if (question) {
                                    question.title = dtq.title;

                                    if (dtq.hasContent) {
                                        question.contentUrl = '../content/' + dto.id + '/' + dtq.id + '/content.html';
                                    }

                                    result.push(question);
                                }

                            }
                        });
                    }

                });
            }

            that.questions = result;
        });

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

    function DragAndDropText() {

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