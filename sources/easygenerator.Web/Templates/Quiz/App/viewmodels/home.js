﻿define(['context', 'durandal/plugins/router'], function (context, router) {

    var objectives = [],
        questions = ko.observableArray([]),
        maxId = 0,
        step = 5,
        itemsQuestion = ko.observableArray([]),
        scrollId = '0',
        isEndTest = ko.observable(false),
        activate = function () {
            if (this.objectives.length == 0) {
                this.objectives = _.map(context.objectives, function (item) {
                    return {
                        id: item.id,
                        title: item.title,
                        image: item.image,
                        questions: item.questions,
                        isExpanded: ko.observable(false),
                        toggleExpand: function () { this.isExpanded(!this.isExpanded()); }
                    };
                });

                var questionTemp = [];
                _.each(this.objectives, function (objective) {
                    questionTemp.push(_.map(objective.questions, function (question) {
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

                _.each(questionTemp, function (item) {
                    _.each(item, function (qustion) {
                        questions.push(qustion);
                    });
                });
                questions(_.shuffle(questions()));
                getItems();
            }
        },
        getItems = function () {
            var entries = [];
            for (var i = maxId; i < step; i++) {
                maxId++;
                if (maxId == questions().length + 1) {
                    isEndScroll(true);
                    break;
                } else
                    entries.push(questions()[i]);
            }
            step += 5;
            _.each(entries, function (item) {
                itemsQuestion.push(item);
            });
        },
        isEndScroll = ko.observable(false),
        submit = function () {
            scrollId = '0';
            isEndTest(true);
            router.navigateTo('#/summary');
        },
        showExplanations = function (item) {
            router.navigateTo('#/objective/' + item.objectiveId + '/question/' + item.id + '/explanations');
            scrollId = item.objectiveId + item.id;
        },
        viewAttached = function () {
            if (scrollId != '0') {
                var targetTop = $('div[id="' + scrollId + '"]').offset().top;
                $('html, body').animate({
                    scrollTop: targetTop - 70
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
        isEndTest: isEndTest
    };
});