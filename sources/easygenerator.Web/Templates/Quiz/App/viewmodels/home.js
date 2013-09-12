define(['context', 'durandal/plugins/router'], function (context, router) {

    var objectives = [],
        questions = [],
        step = 5,
        maxId = 0,
        countQuestionsLoaded = step,
        scrollId = '0',
        isEndScroll = ko.observable(false),
        isEndTest = ko.observable(false),
        countOfQuestions = ko.observable(0),

        getItems = function () {
            if (!isEndScroll()) {
                for (var i = maxId; i < countQuestionsLoaded; i++) {
                    maxId++;
                    if (maxId == questions.length + 1) {
                        isEndScroll(true);
                        break;
                    } else if (maxId == questions.length) {
                        context.testResult.push(questions[i]);
                        isEndScroll(true);
                    } else
                        context.testResult.push(questions[i]);
                }
                countQuestionsLoaded += step;
            }
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
            questions = _.shuffle(questions);

            _.each(questions, function (question, key) {
                question.number = key + 1; 
            });
        },

        getQuestions = function (objectives) {
            _.each(objectives, function (objective) {
                questions = questions.concat(_.map(objective.questions, function (question) {
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
                        title: question.title,
                        number: 0
                    };
                }));
            });
            countOfQuestions(questions.length);
        },

        activate = function () {
            if (this.objectives.length == 0) {

                this.objectives = _.map(context.objectives, function (item) {
                    return {
                        id: item.id,
                        title: item.title,
                        image: item.image,
                        questions: item.questions,
                    };
                });

                this.questions = [];
                getQuestions(this.objectives);

                shuffleAndSetNumber();

                return getItems();
            } else if (context.isTryAgain) {
                _.each(questions, function (question) {
                    _.each(question.answers, function (answer) {
                        answer.isChecked(false);
                    });
                });
                isEndScroll(false);
                context.isTryAgain = false;
                context.testResult([]);
                countQuestionsLoaded = step;
                maxId = 0;
                window.scroll(0, 0);
                return getItems();
            }
        },

        viewAttached = function () {
            if (scrollId != '0') {
                var targetTop = $('#' + scrollId).offset().top || 0;
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
        itemsQuestion: context.testResult,
        getItems: getItems,
        submit: submit,
        showExplanations: showExplanations,
        viewAttached: viewAttached,
        isEndTest: isEndTest,
        titleOfExperience: context.title,
        countOfQuestions: countOfQuestions
    };
});