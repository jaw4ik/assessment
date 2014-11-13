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
                                    if (dtq.type == "singleSelectText") {
                                        result.push(new SinglselectText(dtq.title, dtq.answers));
                                    }

                                    if (dtq.type == "dragAndDropText") {
                                        result.push(new DragAndDropText(dtq.title, dtq.background));
                                    }
                                }
                            });
                        }

                    });
                }

                that.questions = result;

            });


            function SinglselectText(title, answers) {
                this.title = title;
                this.answers = answers;
                this.type = "SinglselectText";
            }

            function DragAndDropText(title, background) {
                this.title = title;
                this.background = background;
                this.type = "DragAndDropText";
            }

        }
    ]);

    app.directive('singleselectText', function() {
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