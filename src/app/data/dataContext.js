(function () {
    'use strict';

    angular.module('assessment')
        .factory('dataContext', dataContext);

    dataContext.$inject = ['$rootScope', '$q', '$http', 'Assessment', 'Section', '$templateCache', 'questionsFactory', 'questionPool', 'questionDataProcessor'];// jshint ignore:line

    function dataContext($rootScope, $q, $http, Assessment, Section, $templateCache, questionsFactory, questionPool, questionDataProcessor) { // jshint ignore:line

        var self = {
            isInited: false,
            assessment: null,

            id: null,
            templateId: null,
            title: null,
            hasIntroductionContent: false,
            sections: []
        };

        return {
            getAssessment: getAssessment
        };

        function init() {
            return $http.get('content/data.js').success(function (response) {
                var promises = [];
                self.id = response.id;
                self.templateId = response.templateId;
                self.title = response.title;
                self.createdOn = new Date(response.createdOn);
                self.hasIntroductionContent = response.hasIntroductionContent;

                if (response.hasIntroductionContent) {
                    promises.push($http.get('content/content.html', { cache: $templateCache }));
                }

                if (_.isArray(response.sections)) {
                    readSections(response.sections);
                }

                return $q.all(promises);
            });
        }

        function readSections(sections) {
            sections.forEach(function (section) {
                if (_.isArray(section.questions)) {
                    var sectionQuestions = _.chain(section.questions)
                        .map(function (questionData) {
                            return questionsFactory.createQuestion(section.id, questionDataProcessor.process(questionData));
                        })
                        .compact()
                        .value();

                    self.sections.push(new Section(section.id, section.title, sectionQuestions));
                }
            });
        }

        function getAllQuestions() {
            return _.chain(self.sections)
                .pluck('questions')
                .flatten()
                .value();
        }

        function generateSections(questions) {
            var sectionsIds = _.chain(questions)
                .pluck('sectionId')
                .uniq()
                .value();

            return _.chain(self.sections)
                .filter(function (section) {
                    return _.contains(sectionsIds, section.id);
                })
                .map(function (section) {
                    return new Section(section.id, section.title, _.intersection(section.questions, questions));
                })
                .value();
        }

        function getAssessment() {
            if (!self.isInited) {
                self.isInited = true;
                return init().then(function () {
                    return getAssessment();
                });
            }

            if (!self.assessment || questionPool.isRefreshed()) {
                var questionsForCourse = questionPool.getQuestions(getAllQuestions()),
                    sectionsForCourse = generateSections(questionsForCourse);

                return $q.all(questionsForCourse.map(function (question) {
                    return question.loadContent();
                })).then(function () {
                    return self.assessment = new Assessment(self.id, self.templateId, self.title, self.createdOn, sectionsForCourse, questionsForCourse, self.hasIntroductionContent);
                });
            }

            return self.assessment;
        }
    }

}());
