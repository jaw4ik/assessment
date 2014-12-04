(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('QuestionController', QuestionController);

    QuestionController.$inject = [
        '$http', '$location',
        'SingleSelectText', 'MultipleSelectText', 'TextMatching', 'DragAndDropText', 'Statement', 'SingleSelectImage', 'FillInTheBlanks', 'Hotspot',
        'SingleSelectTextViewModel', 'MultipleSelectTextViewModel', 'TextMatchingViewModel', 'DragAndDropTextViewModel', 'StatementViewModel', 'SingleSelectImageViewModel', 'FillInTheBlanksViewModel', 'HotspotViewModel',
        'dataContext'
    ];


    function QuestionController($http, $location,
        SingleSelectText, MultipleSelectText, TextMatching, DragAndDropText, Statement, SingleSelectImage, FillInTheBlanks, Hotspot,
        SingleSelectTextViewModel, MultipleSelectTextViewModel, TextMatchingViewModel, DragAndDropTextViewModel, StatementViewModel, SingleSelectImageViewModel, FillInTheBlanksViewModel, HotspotViewModel,
        dataContext) {

        var that = this;

        dataContext.getQuiz().then(function (quiz) {
            that.title = quiz.title;
            that.questions = quiz.questions.map(function (question) {
                if (question instanceof SingleSelectText) {
                    return new SingleSelectTextViewModel(question);
                }
                if (question instanceof MultipleSelectText) {
                    return new MultipleSelectTextViewModel(question);
                }
                if (question instanceof TextMatching) {
                    return new TextMatchingViewModel(question);
                }
                if (question instanceof DragAndDropText) {
                    return new DragAndDropTextViewModel(question);
                }
                if (question instanceof Statement) {
                    return new StatementViewModel(question);
                }
                if (question instanceof SingleSelectImage) {
                    return new SingleSelectImageViewModel(question);
                }
                if (question instanceof FillInTheBlanks) {
                    return new FillInTheBlanksViewModel(question);
                }
                if (question instanceof Hotspot) {
                    return new HotspotViewModel(question);
                }


                throw 'Unknown question type';
            });
        });

        that.submit = function () {
            that.questions.forEach(function (question) {
                question.submit();
            });

            $location.path('/summary');
        };
    }

}());