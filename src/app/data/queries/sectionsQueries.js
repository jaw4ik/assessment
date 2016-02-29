(function () {
    'use strict';

    angular.module('assessment').factory('sectionsQueries', factory);

    factory.$inject = ['dataContext'];

    function factory(dataContext) {
        return {
            getSectionById: getSectionById
        };

        function getSectionById(sectionId) {
            var assessment = dataContext.getAssessment(),
                currentSection = null;

            currentSection = _.find(assessment.sections, function (section) {
                return section.id === sectionId;
            });

            return currentSection;
        }
    }
}());
