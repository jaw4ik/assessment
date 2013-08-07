﻿define(['context', 'durandal/plugins/router'], function (context, router) {

    var objectives = [],
        questions = ko.observableArray([]),
        itemsQuestion = ko.observableArray([]),
        titleOfExperience = '',
        step = 5,
        maxId = 0,
        countQuestionsLoaded = step,
        scrollId = '0',
        isEndScroll = ko.observable(false),
        isTryAgain = ko.observable(false),
        isEndTest = ko.observable(false),

        getItems = function () {
            for (var i = maxId; i < countQuestionsLoaded; i++) {
                maxId++;
                if (maxId == questions().length + 1) {
                    isEndScroll(true);
                    break;
                } else if (maxId == questions().length) {
                    itemsQuestion.push(questions()[i]);
                    isEndScroll(true);
                } else
                    itemsQuestion.push(questions()[i]);
            }
            countQuestionsLoaded += step;
        },

        submit = function () {
            scrollId = '0';
            isEndTest(true);
            router.navigateTo('#/summary');
        },

        showExplanations = function (item) {
            router.navigateTo('#/objective/' + item.objectiveId + '/question/' + item.id + '/explanations');
            scrollId = '' + item.objectiveId + item.id;
        },

        shuffleAndSetNumber = function () {
            questions(_.shuffle(questions()));

            var countOfQuestions = questions().length;
            _.each(questions(), function (question, key) {
                question.title = question.title + ' (Question ' + (key + 1) + ' of ' + countOfQuestions + ')';
            });
        },

        getQuestions = function (objectives) {
            var questionsTemp = [];
            _.each(objectives, function (objective) {
                questionsTemp.push(_.map(objective.questions, function (question) {
                    return {
                        id: question.id,
                        objectiveId: objective.id,
                        answers: _.map(question.answers, function (answer) {
                            return {
                                id: answer.id,
                                text: answer.text,
                                isCorrect: answer.isCorrect,
                                isChecked: ko.observable(false),
                                toggleCheck: function () {
                                    this.isChecked(!this.isChecked());
                                }
                            };
                        }),
                        explanations: question.explanations,
                        title: question.title
                    };
                }));
            });

            _.each(questionsTemp, function (item) {
                _.each(item, function (question) {
                    questions.push(question);
                });
            });
        },

        activate = function () {
            if (this.objectives.length == 0) {
                this.titleOfExperience = context.title;

                this.objectives = _.map(context.objectives, function (item) {
                    return {
                        id: item.id,
                        title: item.title,
                        image: item.image,
                        questions: item.questions,
                    };
                });

                getQuestions(this.objectives);

                shuffleAndSetNumber();

                return getItems();
            } else if (isTryAgain()) {
                _.each(questions(), function (question) {
                    _.each(question.answers, function (answer) {
                        answer.isChecked(false);
                    });
                });
                isEndScroll(false);
                isTryAgain(false);
                itemsQuestion([]);
                countQuestionsLoaded = step;
                maxId = 0;
                window.scroll(0, 0);
                return getItems();
            }
        },

        viewAttached = function () {
            if (scrollId != '0') {
                var targetTop = $('div[id="' + scrollId + '"]').offset().top;
                $('html, body').animate({
                    scrollTop: targetTop - 5
                });
                scrollId = '0';
            }
        };

    return {
        activate: activate,
        questions: questions,
        objectives: objectives,
        isEndScroll: isEndScroll,
        itemsQuestion: itemsQuestion,
        getItems: getItems,
        submit: submit,
        showExplanations: showExplanations,
        viewAttached: viewAttached,
        isEndTest: isEndTest,
        titleOfExperience: titleOfExperience,
        isTryAgain: isTryAgain
    };
});