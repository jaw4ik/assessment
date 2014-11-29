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

    function getQuiz() {
        return common.$q.when(self.quiz);
    }

    function Quiz(title, questions) {
        var that = this;

        that.title = title;
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

        that.statements = options.map(function (option) {
            return {
                text: option.text,
                state: undefined
            };
        });

        that.setTrueState = function (statement) {
            statement.state = statement.state === true ? undefined : true;
        };

        that.setFalseState = function (statement) {
            statement.state = statement.state === false ? undefined : false;
        };
    }

    function DragAndDropText(id, title, background, dropspots) {
        var that = this;
        that.id = id;
        that.title = title;
        that.background = background;

        that.texts = dropspots.map(function (dropspot) {
            return dropspot.text;
        });
        that.texts.acceptValue = function (value) {
            that.texts.push(value);
        };
        that.texts.rejectValue = function (value) {
            var index = that.texts.indexOf(value);
            that.texts.splice(index, 1);

        };

        that.spots = dropspots.map(function (dropspot) {
            var spot = {
                x: dropspot.x,
                y: dropspot.y,
                value: undefined,
                acceptValue: function (value) {
                    spot.value = value;
                },
                rejectValue: function () {
                    spot.value = null;
                }

            };

            return spot;
        });

    }

    function SingleSelectImage(title, options) {
        var that = this;
        that.title = title;

        that.answers = options.map(function (option) {
            return {
                image: option.image,
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

    function TextMatching(id, title, answers) {
        var that = this;
        that.id = id;
        that.title = title;
        that.sources = answers.map(function (answer) {
            var source = {
                id: answer.id,
                key: answer.key,
                value: null,

                acceptValue: function (value) {
                    source.value = value;
                },
                rejectValue: function () {
                    source.value = null;
                }
            };

            return source;
        });

        that.targets = answers.map(function (answer) {
            var target = {
                value: answer.value,
                acceptValue: function (value) {
                    target.value = value;
                },
                rejectValue: function () {
                    target.value = null;
                }
            };
            return target;
        });
    }

}());