(function () {
    'use strict';

    var app = angular.module('quiz', ['ngRoute']);

    app.controller('QuizController', ['$http', '$location', function ($http, $location) {
        var that = this;
        that.title = '';
        that.questions = [];

        that.submit = function () {
            $location.path('/summary');
        }

        $http.get('../content/data.js').success(function (response) {
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
                                if (dtq.type == "statement") {
                                    question = new Statement(dtq.title, dtq.answers);
                                }

                                if (question) {
                                    question.title = dtq.title;

                                    if (dtq.hasContent) {
                                        question.contentUrl = '../content/' + dto.id + '/' + dtq.id + '/content.html';
                                        console.log(question.contentUrl);
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

    }
    ]);


    app.controller('SummaryController', function () {

    });

    app.config([
        '$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/questions', {
                    templateUrl: 'views/questions.html',
                    controller: 'QuizController',
                    controllerAs: 'quiz'
                })
                .when('/summary', {
                    templateUrl: 'views/summary.html',
                    controller: 'SummaryController',
                    controllerAs: 'summary'
                })
                .otherwise({
                    redirectTo: '/questions'
                });

        }]);



    app.filter("pad", function () {
        return function (number, length) {
            var str = number + "";
            while (str.length < length) {
                str = "0" + str;
            }
            return str;
        };
    });



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

    app.directive('statement', function () {
        return {
            restrict: 'E',
            templateUrl: 'views/statement.html'
        };
    });

}());