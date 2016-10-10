(function () {
    'use strict';

    angular
        .module('assessment')
        .factory('QuestionViewModel', factory);

    factory.$inject = ['HintViewModel'];

    function factory(HintViewModel) {
        return function QuestionViewModel(question) {
            var that = this;

            that.id = question.id;
            that.title = question.title;
            that.content = question.content;
            that.hint = new HintViewModel(question);

            that.isSurveyMode = question.hasOwnProperty('isSurvey') && question.isSurvey;
            
            that.getType = function () {
                throw 'Could not determine question type for question #' + that.id + ' (' + question.title + ')';
            };

            that.submit = function () {
                that.hint.deactivate();
                that.submitAnswer();
            };

            that.submitAnswer = function () {
                throw 'Question #' + that.id + ' could not be submitted';
            };
        };
    }

}());