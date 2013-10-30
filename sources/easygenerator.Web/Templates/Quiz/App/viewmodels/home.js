define(['context', 'plugins/router', 'xAPI/requestManager', 'events', 'durandal/app'], function (context, router, xApiRequestManager, events, app) {

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
            router.navigate('summary');
        },

        showLearningContents = function (item) {
            scrollId = '' + item.objectiveId + item.id;
            router.navigate('objective/' + item.objectiveId + '/question/' + item.id + '/learningContents');
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
                        learningContents: question.learningContents,
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
                app.trigger(events.events.courseStarted);
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

        compositionComplete = function () {
            if (scrollId != '0') {
                var targetTop = jQuery('#' + scrollId).offset().top;
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
        showLearningContents: showLearningContents,
        compositionComplete: compositionComplete,
        isEndTest: isEndTest,
        titleOfExperience: context.title,
        countOfQuestions: countOfQuestions
    };
});