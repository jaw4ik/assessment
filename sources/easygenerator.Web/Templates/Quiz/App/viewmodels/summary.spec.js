define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/summary'),
        router = require('plugins/router'),
        context = require('context'),
        app = require('durandal/app'),
        eventManager = require('eventManager'),
        windowOperations = require('windowOperations');

    describe('viewModel [summary]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('canActivate:', function () {

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            describe('when context.testResult is empty', function () {

                it('should return false', function () {
                    context.testResult([]);
                    expect(viewModel.canActivate()).toBeFalsy();
                });

            });

            describe('when context.testResult is not empty', function () {

                it('should return true', function () {
                    context.testResult([{}, {}]);
                    expect(viewModel.canActivate()).toBeTruthy();
                });

            });

        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

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

            it('should set objectives', function () {
                viewModel.activate();
                expect(viewModel.objectives[0].id).toBe(context.objectives[0].id);
            });

            it('should set overallProgress to 50%', function () {
                viewModel.activate();
                expect(viewModel.overallScore).toBe(50);
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

                it('should set context.isTryAgain to true', function () {
                    viewModel.tryAgain();
                    expect(context.isTryAgain).toBeTruthy();
                });

                it('should navigate to \'\'', function () {
                    viewModel.tryAgain();
                    expect(router.navigate).toHaveBeenCalledWith('');
                });

                it('should reset context.testResult', function () {
                    context.testResult([{}, {}]);
                    viewModel.tryAgain();
                    expect(context.testResult().length).toBe(0);
                });

            });
        });

        describe('finish', function () {

            it('should be function', function () {
                expect(viewModel.finish).toBeFunction();
            });

            beforeEach(function () {
                spyOn(eventManager, 'turnAllEventsOff');
                spyOn(windowOperations, 'close');
            });

            describe('when app.callbacks is undefined', function () {

                beforeEach(function () {
                    app.callbacks = undefined;
                });

                it('should turn off all events', function () {
                    viewModel.finish();
                    expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                });

                it('should change status to finished', function () {
                    viewModel.status('');
                    viewModel.finish();
                    expect(viewModel.status()).toBe(viewModel.statuses.finished);
                });

                it('should close window', function () {
                    viewModel.finish();
                    expect(windowOperations.close).toHaveBeenCalled();
                });

                it('should not trigger events', function () {
                    spyOn(app, 'trigger');
                    viewModel.finish();
                    expect(app.trigger).not.toHaveBeenCalled();
                });

            });

            describe('when app.callbacks is undefined', function () {

                beforeEach(function () {
                    app.callbacks = [];
                    app.on(eventManager.events.courseFinished, function (finishedEventData) {
                        finishedEventData.callback();
                    });
                });

                it('should trigger \'events.courseFinished\' event', function () {
                    spyOn(app, 'trigger');
                    viewModel.finish();
                    expect(app.trigger).toHaveBeenCalled();
                });

                it('should turn off all events', function () {
                    viewModel.finish();
                    expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                });

                it('should change status to finished', function () {
                    viewModel.status('');
                    viewModel.finish();
                    expect(viewModel.status()).toBe(viewModel.statuses.finished);
                });

                it('should close window', function () {
                    viewModel.finish();
                    expect(windowOperations.close).toHaveBeenCalled();
                });

            });

        });

    });
});