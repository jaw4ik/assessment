(function () {
    'use strict';

    var app = angular.module('quiz', []);

    app.controller('QuizController', [
        '$http', function ($http) {
            var that = this;

            that.title = '';
            that.questions = [];

            $http.get('/content/data.js').success(function (response) {
                that.title = response.title;

                var result = [];
                if (Array.isArray(response.objectives)) {
                    response.objectives.forEach(function (dto) {
                        if (Array.isArray(dto.questions)) {
                            dto.questions.forEach(function (dtq) {
                                if (dtq) {
                                    var question;

                                    if (dtq.type == "singleSelectText") {
                                        question = new SinglselectText(dtq.title, dtq.answers);
                                    }

                                    if (dtq.type == "dragAndDropText") {
                                        question = new DragAndDropText();
                                    }

                                    if (question) {
                                        question.title = dtq.title;
                                        question.content = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";

                                        result.push(question);
                                    }
                                }
                            });
                        }

                    });
                }

                that.questions = result;

            });


            function SinglselectText(title, options) {
                var
                    that = this
                ;

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

            function DragAndDropText() { }

        }
    ]);

    app.directive('singleselectText', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/singleSelectText.html'
        };
    });

    app.directive('dragAndDropText', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/dragAndDropText.html'
        };
    });

}());