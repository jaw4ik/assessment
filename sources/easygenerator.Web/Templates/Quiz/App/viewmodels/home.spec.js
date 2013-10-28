define(function (require) {
    "use strict";
    
    var
        viewModel = require('viewmodels/home'),
        router = require('plugins/router'),
        context = require('context');

    describe('viewModel [home]', function () {

        beforeEach(function() {
            context.objectives = [{
                "id": 0,
                "title": "The learner is able to appreciate the easy and powerful features of easygenerator",
                "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSquMn3u84SWcQvKAbmrlUicfv2bYY3197JsNsilftexOQYce-Z",
                "questions": [{
                    "id": 0,
                    "title": "Which of the following statements fits the WYSIWYG feature best?",
                    "answers": [{
                        "id": 0,
                        "isCorrect": false,
                        "text": "The e-Learning in our platform will look exactly the same to the authors as it will be presented to the learners."
                    }, {
                        "id": 1,
                        "isCorrect": true,
                        "text": "You always will see the direct effect of your actions in the editing screen of easygenerator."
                    }],
                    "learningContents": [{
                        "id": 0
                    }, {
                        "id": 1
                    }]
                }]
            }];
            context.title = "titleOfExperience";
        });

        it('should be defined', function() {
            expect(viewModel).toBeDefined();
        });

        
        it('should be defined activate', function () {
            expect(viewModel.activate).toBeDefined();
        });
        
        it('should be defined questions', function () {
            expect(viewModel.questions).toBeDefined();
        });
        
        it('should be defined objectives', function () {
            expect(viewModel.objectives).toBeDefined();
        });
        
        it('should be defined isEndScroll', function () {
            expect(viewModel.isEndScroll).toBeDefined();
        });
        
        it('should be defined itemsQuestion', function () {
            expect(viewModel.itemsQuestion).toBeDefined();
        });
        
        it('should be defined getItems', function () {
            expect(viewModel.getItems).toBeDefined();
        });
        
        it('should be defined submit', function () {
            expect(viewModel.submit).toBeDefined();
        });
        
        it('should be defined showlearningContents', function () {
            expect(viewModel.showLearningContents).toBeDefined();
        });
        
        it('should be defined compositionComplete', function () {
            expect(viewModel.compositionComplete).toBeDefined();
        });
        
        it('should be defined isEndTest', function () {
            expect(viewModel.isEndTest).toBeDefined();
        });
        
        it('should be defined titleOfExperience', function () {
            expect(viewModel.titleOfExperience).toBeDefined();
        });

        describe('activate:', function () {
            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when objectives is empty', function () {
                beforeEach(function () {
                    viewModel.objectives = [];
                    viewModel.activate();
                });

                it('should be set objectives', function () {
                    var objectives = _.map(context.objectives, function (item) {
                        return {
                            id: item.id,
                            title: item.title,
                            image: item.image,
                            questions: item.questions,
                        };
                    });
                    expect(viewModel.objectives[0].id).toBe(objectives[0].id);
                });

                it('should be set questions', function () {
                    expect(viewModel.questions).toNotBe([]);
                });

                it('should be set itemsQuestion', function () {
                    expect(ko.utils.unwrapObservable(viewModel.itemsQuestion())).toNotBe([]);
                });
            });

            describe('when context.isTryAgain', function() {
                beforeEach(function() {
                    context.isTryAgain = true;
                    viewModel.objectives = _.map(context.objectives, function (item) {
                        return {
                            id: item.id,
                            title: item.title,
                            image: item.image,
                            questions: item.questions,
                        };
                    });
                    spyOn(window, 'scroll').andCallThrough();
                });
                
                it('should be set context.isTryAgain to false', function () {
                    context.isTryAgain = true;
                    viewModel.activate();
                    expect(context.isTryAgain).toBeFalsy();
                });
                
                it('should be set isEndScroll to true', function () {
                    viewModel.isEndTest(false);
                    viewModel.activate();
                    expect(viewModel.isEndTest).toBeTruthy();
                });
                
                it('should scroll window to 0, 0', function () {
                    viewModel.activate();
                    expect(window.scroll).toHaveBeenCalledWith(0, 0);
                });
            });
        });

        describe('compositionComplete:', function () {
            it('should be function', function () {
                expect(viewModel.compositionComplete).toBeFunction();
            });
        });

        describe('submit:', function () {
            beforeEach(function() {
                spyOn(router, 'navigate');
            });
            it('should be function', function() {
                expect(viewModel.submit).toBeFunction();
            });
            
            it('should navigate to summary', function () {
                viewModel.submit();
                expect(router.navigate).toHaveBeenCalledWith('summary');
            });

            it('should be set isEndTest to true', function () {
                viewModel.isEndTest(false);
                viewModel.submit();
                expect(viewModel.isEndTest()).toBe(true);
            });
        });

        describe('showLearningContents:', function () {
            beforeEach(function () {
                spyOn(router, 'navigate');
            });
            
            it('should be function', function () {
                expect(viewModel.showLearningContents).toBeFunction();
            });
            
            it('should navigate to objective/:objectiveId/question/:questionid/learningContents', function () {
                var learningContents = { objectiveId: 'obj1', id: 'ques1' };
                viewModel.showLearningContents(learningContents);
                expect(router.navigate).toHaveBeenCalledWith('objective/obj1/question/ques1/learningContents');
            });
        });
    });
});