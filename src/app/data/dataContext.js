(function () {
    'use strict';

    angular.module('quiz')
        .factory('dataContext', dataContext);

    dataContext.$inject = ['$rootScope', '$q', '$http', 'Quiz', 'Objective', '$templateCache', 'questionsFactory', 'questionPool'];// jshint ignore:line

    function dataContext($rootScope, $q, $http, Quiz, Objective, $templateCache, questionsFactory, questionPool) { // jshint ignore:line
        
        var self = {
            isInited: false,
            quiz: null,

            id: null,
            title: null,
            hasIntroductionContent: false,
            objectives: [],
            questions: []
        };

        return {
            getQuiz: getQuiz
        };

        function init() {
            return $http.get('content/data.js').success(function (response) {
                var promises = [];

                self.id = response.id;
                self.title = response.title;
                self.hasIntroductionContent = response.hasIntroductionContent;

                if (response.hasIntroductionContent) {
                    promises.push($http.get('content/content.html', { cache: $templateCache }));
                }

                if (_.isArray(response.objectives)) {
                    readObjectives(response.objectives);
                }

                return $q.all(promises);
            });
        }

        function readObjectives(objectives) {
            objectives.forEach(function (objective) {

                if (_.isArray(objective.questions)) {
                    var objectiveQuestions = _.chain(objective.questions)
                        .map(function (questionData) {
                            return questionsFactory.createQuestion(objective.id, questionData);
                        })
                        .compact()
                        .value();

                    self.objectives.push(new Objective(objective.id, objective.title, objectiveQuestions));
                    self.questions = self.questions.concat(objectiveQuestions);
                }
            });
        }

        function getQuiz() {
            if (!self.isInited) {
                self.isInited = true;
                return init().then(function () {
                    return getQuiz();
                });
            }

            if (!self.quiz || questionPool.isRefreshed()) {
                var questionsForCourse = questionPool.getQuestions(self.questions);
                var objectivesForCourse = questionPool.getObjectives(self.objectives, questionsForCourse);

                return $q.all(questionsForCourse.map(function (question) {
                    return question.loadContent();
                })).then(function () {
                    return self.quiz = new Quiz(self.id, self.title, objectivesForCourse, questionsForCourse, self.hasIntroductionContent);
                });
            }

            return self.quiz;
        }
    }

} ());
