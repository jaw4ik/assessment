(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('QuestionController', QuestionController);

    QuestionController.$inject = ['$http', '$location', 'dataContext'];


    function QuestionController($http, $location, dataContext) {
        var that = this;

        dataContext.getQuiz().then(function (quiz) {
            that.title = quiz.title;
            that.questions = quiz.questions;
        });

        that.submit = function () {
            //that.questions.forEach(function (question) {
            //});
            $location.path('/summary');
        };

    }

}());