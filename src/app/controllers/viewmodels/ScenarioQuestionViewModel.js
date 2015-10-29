(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('ScenarioQuestionViewModel', factory);

    factory.$inject = ['QuestionViewModel'];

    function factory(QuestionViewModel) {
        return function ScenarioQuestionViewModel(question) {
            QuestionViewModel.call(this, question);

            var that = this,
                branchtrackInstance = Branchtrack.create(question.projectId);

            that.getType = function () {
                return 'scenarioQuestion';
            };

            that.embedCode = question.embedCode;

            that.submitAnswer = function () {
                question.answer(branchtrackInstance.score);
                branchtrackInstance.destroy();
            };
        };
    }

}());