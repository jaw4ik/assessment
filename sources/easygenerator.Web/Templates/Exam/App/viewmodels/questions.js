define(['durandal/app', 'plugins/router', 'eventManager', 'configuration/settings', 'repositories/questionRepository', 'repositories/courseRepository'],
    function (app, router, eventManager, settings, questionRepository, courseRepository) {

        var displayedQuestions = ko.observableArray(),
            totalQuestionsCount = 0,
            isFullyLoaded = ko.observable(false),
            allQuestions = [],
            activeQuestionId = null,
            loadedQuestionsCount = 0,
            courseTitle = '',
            loadQuestions = function () {
                var questionsToLoadContent = [],
                    questionsToLoadCount = loadedQuestionsCount + settings.loadingQuestionsInStepCount;

                for (var i = loadedQuestionsCount; i < questionsToLoadCount; i++) {
                    if (i > allQuestions.length - 1) {
                        isFullyLoaded(true);
                        break;
                    }

                    questionsToLoadContent.push(allQuestions[i]);
                    loadedQuestionsCount++;
                }

                return questionRepository.loadQuestionContentCollection(questionsToLoadContent)
                    .then(function (questions) {
                        _.each(questions, function (question) {
                            displayedQuestions.push(mapQuestion(question));
                        });
                    });
            },
            submit = function () {
                var course = courseRepository.get();
                course.submitAnswers(_.map(displayedQuestions(), function (question) {
                    return {
                        question: questionRepository.get(question.objectiveId, question.id),
                        checkedAnswersIds: _.chain(question.answers)
                            .filter(function (item) {
                                return item.isChecked();
                            })
                            .map(function (item) {
                                return item.id;
                            }).value()
                    };
                }));

                router.navigate('summary');
            },            
            mapQuestion = function (question) {
                var mappedQuestion = {
                    id: question.id,
                    objectiveId: question.objectiveId,
                    title: question.title,
                    hasContent: question.hasContent,
                    content: question.content,
                    answers: _.map(question.answers, function (answer) {
                        return {
                            id: answer.id,
                            text: answer.text,
                            isChecked: ko.observable(false),
                            toggleCheck: function () {
                                this.isChecked(!this.isChecked());
                            }
                        };
                    })
                };

                return mappedQuestion;
            },            
            activate = function () {
                var course = courseRepository.get();

                if (course == null) {
                    router.navigate('404');
                    return;
                }

                allQuestions = _.map(course.getAllQuestions(), function (question) {
                    return mapQuestion(question);
                });

                allQuestions = _.shuffle(allQuestions);
                this.totalQuestionsCount = allQuestions.length;
                this.courseTitle = course.title;
            },
            canActivate = function () {
                var course = courseRepository.get();
                return !course.isAnswered;
            },
            setInitialSettings = function () {
                displayedQuestions([]);
                allQuestions = [];
                isFullyLoaded(false);
                activeQuestionId = null;
                loadedQuestionsCount = 0;
            };

        app.on(eventManager.events.courseRestart, setInitialSettings);

        return {
            activate: activate,
            canActivate: canActivate,
            loadQuestions: loadQuestions,
            submit: submit,
            activeQuestionId: activeQuestionId,

            questions: displayedQuestions,
            totalQuestionsCount: totalQuestionsCount,
            isFullyLoaded: isFullyLoaded,
            courseTitle: courseTitle
        };
    }
);