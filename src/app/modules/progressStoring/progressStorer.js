(function () {
    'use strict';

    angular.module('quiz.progressStorer', []).run(runBlock);

    runBlock.$inject = ['$rootScope', 'dataContext'];

    function runBlock($rootScope, dataContext) {
        $rootScope.$on('course:finished', function () {
            saveResult();
        });

        function saveResult() {
            var quiz = dataContext.getQuiz();
            var resultKey = 'course_result' + quiz.id + quiz.createdOn;

            var result = {
                score: quiz.getResult(),
                status: quiz.getStatus()
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