define(['durandal/app', 'plugins/router', 'eventManager', 'configuration/settings', 'repositories/questionRepository', 'repositories/courseRepository'],
    function (app, router, eventManager, settings, questionRepository, courseRepository) {

        var self = {
            questions: [],
            loadedQuestionsCount: 0
        };

        var viewModel = {
            courseTitle: '',

            questions: ko.observableArray([]),
            totalQuestionsCount: 0,
            loadQuestions: loadQuestions,
            isFullyLoaded: ko.observable(false),

            submit: submit,

            activate: activate,
            canActivate: canActivate
        }

        return viewModel;

        function submit() {
            var course = courseRepository.get();
            course.submitAnswers(_.map(viewModel.questions(), function (question) {
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
        }


        function loadQuestions() {
            var
                questionsToLoadContent = [],
                questionsToLoadCount = self.loadedQuestionsCount + settings.loadingQuestionsInStepCount
            ;
            for (var i = self.loadedQuestionsCount; i < questionsToLoadCount; i++) {
                if (i > viewModel.totalQuestionsCount - 1) {
                    viewModel.isFullyLoaded(true);
                    break;
                }

                questionsToLoadContent.push(self.questions[i]);
                self.loadedQuestionsCount++;
            }

            return questionRepository.loadQuestionContentCollection(questionsToLoadContent)
                .then(function (questions) {
                    _.each(questions, function (question) {
                        viewModel.questions.push(mapQuestion(question));
                    });
                });
        }


        function mapQuestion(question) {
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
        }


        function canActivate() {
            var course = courseRepository.get();
            return !course.isAnswered;
        }

        function activate() {
            var course = courseRepository.get();

            if (course == null) {
                router.navigate('404');
                return;
            }

            self.questions = _.map(course.allQuestions, function (question) {
                return mapQuestion(question);
            });

            viewModel.totalQuestionsCount = self.questions.length;
            viewModel.courseTitle = course.title;
        }

    }
);