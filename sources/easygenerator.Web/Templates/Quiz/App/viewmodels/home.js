define(['durandal/app', 'plugins/http', 'plugins/router', 'context', 'eventManager', 'models/question', 'configuration/settings'],
    function (app, http, router, context, eventManager, Question, settings) {

        var
            displayedQuestions = ko.observableArray(),
            totalQuestionsCount = 0,
            isFullyLoaded = ko.observable(false),

            allQuestionsList = [],
            loadedQuestionsCount = 0,
            activeQuestionId = null,


            loadQuestions = function () {
                var promises = [],
                    questionsToLoadCount = loadedQuestionsCount + settings.loadingQuestionsInStepCount;

                for (var i = loadedQuestionsCount; i < questionsToLoadCount; i++) {
                    if (i > allQuestionsList.length - 1) {
                        isFullyLoaded(true);
                        break;
                    }

                    promises.push(loadQuestionContent(allQuestionsList[i]));

                    loadedQuestionsCount++;
                }

                return Q.allSettled(promises).then(function (results) {
                    _.chain(results)
                        .map(function (item) {
                            return item.value;
                        })
                        .sortBy(function (item) {
                            return item.number;
                        })
                        .each(function (item) {
                            displayedQuestions.push(item);
                        });
                });
            },

            submit = function () {
                app.trigger(eventManager.events.answersSubmitted, {
                    questions: _.map(displayedQuestions(), function (question) {
                        return new Question(question);
                    })
                });

                context.testResult(displayedQuestions());
                router.navigate('summary');
            },

            showLearningContents = function (item) {
                activeQuestionId = item.id;
                router.navigate('objective/' + item.objectiveId + '/question/' + item.id + '/learningContents');
            },

            shuffleAndSetNumber = function (questionsList) {
                questionsList = _.shuffle(questionsList);

                _.each(questionsList, function (question, key) {
                    question.number = key + 1;
                });

                return questionsList;
            },

            loadQuestionContent = function (question) {
                var defer = Q.defer();

                if (question.hasContent) {
                    var contentUrl = 'content/' + question.objectiveId + '/' + question.id + '/content.html';
                    http.get(contentUrl)
                        .done(function (response) {
                            question.content = response;
                        })
                        .fail(function () {
                            question.content = settings.questionContentNonExistError;
                        })
                        .always(function () {
                            defer.resolve(question);
                        });
                } else {
                    defer.resolve(question);
                }

                return defer.promise;
            },

            mapQuestion = function (question, objective) {
                var mappedQuestion = {
                    id: question.id,
                    title: question.title,
                    hasContent: question.hasContent,
                    content: "",
                    objectiveId: objective.id,
                    objectiveTitle: objective.title,
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
                    number: 0
                };

                return mappedQuestion;
            },

            getQuestions = function (objectives) {
                var questionsList = [];

                _.each(objectives, function (objective) {
                    questionsList = questionsList.concat(_.map(objective.questions, function (question) {
                        return mapQuestion(question, objective);
                    }));
                });

                return questionsList;
            },

            compositionComplete = function () {
                if (_.isNull(activeQuestionId)) {
                    return;
                }

                var targetTopPosition = jQuery('#' + activeQuestionId).offset().top;
                jQuery('html, body').animate({
                    scrollTop: targetTopPosition - 5
                });

                activeQuestionId = null;
            },

            resetCourse = function () {
                displayedQuestions([]);
                allQuestionsList = [];
                loadedQuestionsCount = 0;
                isFullyLoaded(false);
                activeQuestionId = null;
            },

            activate = function () {

                if (context.isTryAgain) {
                    resetCourse();
                    context.isTryAgain = false;
                    app.trigger(eventManager.events.courseStarted);
                }

                if (context.objectives.length > 0) {
                    allQuestionsList = shuffleAndSetNumber(getQuestions(context.objectives));
                    this.totalQuestionsCount = allQuestionsList.length;
                }
            },

            canActivate = function () {
                return _.isNullOrUndefined(context.testResult) || _.isNullOrUndefined(context.testResult()) || context.testResult().length == 0;
            };

        return {
            activate: activate,
            canActivate: canActivate,
            loadQuestions: loadQuestions,
            submit: submit,
            showLearningContents: showLearningContents,
            compositionComplete: compositionComplete,

            questions: displayedQuestions,
            totalQuestionsCount: totalQuestionsCount,
            isFullyLoaded: isFullyLoaded,
            courseTitle: context.title,
        };
    }
);