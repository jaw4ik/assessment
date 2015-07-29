(function () {
    'use strict';

    angular.module('assessment.progressStorer', []).run(runBlock);

    runBlock.$inject = ['$rootScope', 'dataContext'];

    function runBlock($rootScope, dataContext) {
        $rootScope.$on('course:finished', function () {
            saveResult();
        });

        function saveResult() {
            var assessment = dataContext.getAssessment();
            var resultKey = 'course_result' + assessment.id + assessment.createdOn;

            var result = {
                score: assessment.getResult(),
                status: assessment.getStatus()
            };

            try {
                var string = JSON.stringify(result);
                localStorage.setItem(resultKey, string);
            } catch (e) {
                console.log('Failed to store course result');
            }
            return true;
        }
    }

}());