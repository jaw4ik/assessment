(function () {
    'use strict';

    angular
        .module('quiz')
        .controller('MainController', MainController);

    MainController.$inject = [
        '$location', '$rootScope',
        'SingleSelectText', 'MultipleSelectText', 'TextMatching', 'DragAndDropText',
        'Statement', 'SingleSelectImage', 'FillInTheBlanks', 'Hotspot', 'OpenQuestion',
        'SingleSelectTextViewModel', 'MultipleSelectTextViewModel', 'TextMatchingViewModel', 'DragAndDropTextViewModel',
        'StatementViewModel', 'SingleSelectImageViewModel', 'FillInTheBlanksViewModel', 'HotspotViewModel', 'OpenQuestionViewModel',
        'quiz', 'settings'
    ];
    
    function MainController($location, $rootScope,
        SingleSelectText, MultipleSelectText, TextMatching, DragAndDropText,
        Statement, SingleSelectImage, FillInTheBlanks, Hotspot, OpenQuestion,
        SingleSelectTextViewModel, MultipleSelectTextViewModel, TextMatchingViewModel, DragAndDropTextViewModel,
        StatementViewModel, SingleSelectImageViewModel, FillInTheBlanksViewModel, HotspotViewModel, OpenQuestionViewModel,
        quiz, settings) {
        var that = this;

        that.title = $rootScope.title = quiz.title;
        that.hasIntroductionContent = quiz.hasIntroductionContent;
        that.logoUrl = settings.logo.url;
        
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
            if (question instanceof OpenQuestion) {
                return new OpenQuestionViewModel(question);
            }

            throw 'Unknown question type';
        });

        that.submit = function () {
            that.questions.forEach(function (question) {
                question.submit();
            });

            quiz.sendCourseResult(settings.masteryScore.score);

            $location.path('/summary').replace();
        };
    }

}());