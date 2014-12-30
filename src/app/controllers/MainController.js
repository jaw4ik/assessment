(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('MainController', MainController);

    MainController.$inject = [
        '$sce', '$location',
        'SingleSelectText', 'MultipleSelectText', 'TextMatching', 'DragAndDropText',
        'Statement', 'SingleSelectImage', 'FillInTheBlanks', 'Hotspot',
        'SingleSelectTextViewModel', 'MultipleSelectTextViewModel', 'TextMatchingViewModel',
        'DragAndDropTextViewModel', 'StatementViewModel', 'SingleSelectImageViewModel', 'FillInTheBlanksViewModel', 'HotspotViewModel',
        'quiz'
    ];
    
    function MainController($sce, $location,
        SingleSelectText, MultipleSelectText, TextMatching, DragAndDropText,
        Statement, SingleSelectImage, FillInTheBlanks, Hotspot,
        SingleSelectTextViewModel, MultipleSelectTextViewModel, TextMatchingViewModel,
        DragAndDropTextViewModel, StatementViewModel, SingleSelectImageViewModel, FillInTheBlanksViewModel, HotspotViewModel,
        quiz) {

        var that = this;

        that.title = quiz.title;
        that.introductionContent = quiz.introductionContent;
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

        that.submit = function () {
            that.questions.forEach(function (question) {
                question.submit();
            });

            $location.path('/summary');
        };
    }

}());