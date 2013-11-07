define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/summary'),
        router = require('plugins/router'),
        context = require('context'),
        app = require('durandal/app');

    describe('viewModel [summary]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when context.testResult does not have data', function () {

                it('should navigate to \'\'', function () {
                    context.testResult([]);
                    spyOn(router, 'navigate');
                    viewModel.activate();
                    expect(router.navigate).toHaveBeenCalledWith('');
                });

            });

            describe('when context.testResult have data', function () {

                beforeEach(function () {
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
                    context.testResult([{
                        id: 0,
                        objectiveId: 0,
                        answers: [{
                            id: 0,
                            isCorrect: false,
                            isChecked: function () {
                                this.isCorrect = !this.isCorrect;
                            }
                        }, {
                            id: 1,
                            isCorrect: true,
                            isChecked: function () {
                                this.isCorrect = !this.isCorrect;
                            }
                        }],
                        learningContents: [],
                        title: 'Questions 1',
                        score: 46
                    }, {
                        id: 1,
                        objectiveId: 1,
                        answers: [{
                            id: 0,
                            isCorrect: false,
                            isChecked: function () {
                                this.isCorrect = !this.isCorrect;
                            }
                        }, {
                            id: 1,
                            isCorrect: true,
                            isChecked: function () {
                                this.isCorrect = !this.isCorrect;
                            }
                        }],
                        learningContents: [],
                        title: 'Questions 2',
                        score: 89
                    }]);
                });

                it('should be set objectives', function () {
                    viewModel.activate();
                    expect(viewModel.objectives[0].id).toBe(context.objectives[0].id);
                });

                it('should be set overallProgress to 50%', function () {
                    viewModel.activate();
                    expect(viewModel.overallScore).toBe(50);
                });

            });
        });

        describe('tryAgain:', function () {

            it('should be function', function () {
                expect(viewModel.tryAgain).toBeFunction();
            });

            describe('when click "Try Again"', function () {

                beforeEach(function () {
                    spyOn(router, 'navigate');
                    context.isTryAgain = false;
                });

                it('should be set context.isTryAgain to true', function () {
                    viewModel.tryAgain();
                    expect(context.isTryAgain).toBeTruthy();
                });

                it('should navigate to \'\'', function () {
                    viewModel.tryAgain();
                    expect(router.navigate).toHaveBeenCalledWith('');
                });

            });
        });

        describe('finish', function () {

            it('should be function', function () {
                expect(viewModel.finish).toBeFunction();
            });


            beforeEach(function () {
                spyOn(app, 'trigger');
                spyOn(app, 'off');
                spyOn(window, 'close');
            });

            it('should trigger \'events.courseFinished\' event', function () {
                viewModel.finish();
                expect(app.trigger).toHaveBeenCalled();
            });

        });
    });
});