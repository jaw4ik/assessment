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
                context.title = "courseTitle";
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

        describe('finish: ', function () {

            beforeEach(function () {
                app.off("courseFinished");
                app.off("courseStopped");

                spyOn(eventManager, 'turnAllEventsOff');
                spyOn(windowOperations, 'close');
            });
            
            it('should be function', function () {
                expect(viewModel.finish).toBeFunction();
            });
            
            it('should return promise', function () {
                var result = viewModel.finish();
                expect(result).toBePromise();
            });

            describe('whene there are subscribers on "courseFinished" event', function() {

                describe('and there are subscribers on "courseStopped" event', function () {
                    var promise;
                    var actions;

                    beforeEach(function () {
                        actions = [];

                        var subscriptionFinished = app.on("courseFinished").then(function () {
                            actions.push("courseFinished");
                            subscriptionFinished.off();
                        });
                        
                        var subscriptionStopped = app.on("courseStopped").then(function () {
                            actions.push("courseStopped");
                            subscriptionStopped.off();
                        });
                        
                        viewModel.status('');
                        promise = viewModel.finish();
                    });

                    it('should execute both "courseFinished" and "courseStopped" subscribers', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(actions.length).toBe(2);
                        });
                    });

                    it('should execute "courseFinished" subscribers at first step', function() {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(actions[0]).toBe("courseFinished");
                        });
                    });
                    
                    it('should execute "courseStopped" subscribers at second step', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(actions[1]).toBe("courseStopped");
                        });
                    });

                    it('should turn off all events', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                        });
                    });

                    it('should change status to finished', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.status()).toBe(viewModel.statuses.finished);
                        });
                    });

                    it('should close window', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(windowOperations.close).toHaveBeenCalled();
                        });
                    });
                });
                
                describe('and there are no subscribers on "courseStopped" event', function () {
                    var promise;
                    var actions;

                    beforeEach(function () {
                        actions = [];

                        var subscriptionFinished = app.on("courseFinished").then(function () {
                            actions.push("courseFinished");
                            subscriptionFinished.off();
                        });

                        viewModel.status('');
                        promise = viewModel.finish();
                    });

                    it('should execute "courseFinished" subscribers', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(actions.length).toBe(1);
                            expect(actions[0]).toBe("courseFinished");
                        });
                    });

                    it('should turn off all events', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                        });
                    });

                    it('should change status to finished', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.status()).toBe(viewModel.statuses.finished);
                        });
                    });

                    it('should close window', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(windowOperations.close).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('whene there are no subscribers on "courseFinished" event', function () {

                describe('and there are subscribers on "courseStopped" event', function () {
                    var promise;
                    var actions;

                    beforeEach(function () {
                        actions = [];

                        var subscriptionFinished = app.on("courseStopped").then(function () {
                            actions.push("courseStopped");
                            subscriptionFinished.off();
                        });

                        viewModel.status('');
                        promise = viewModel.finish();
                    });

                    it('should execute "courseStopped" subscribers', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(actions.length).toBe(1);
                            expect(actions[0]).toBe("courseStopped");
                        });
                    });

                    it('should turn off all events', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                        });
                    });

                    it('should change status to finished', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.status()).toBe(viewModel.statuses.finished);
                        });
                    });

                    it('should close window', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(windowOperations.close).toHaveBeenCalled();
                        });
                    });
                });

                describe('and there are no subscribers on "courseStopped" event', function () {
                    var promise;

                    beforeEach(function () {
                        viewModel.status('');
                        promise = viewModel.finish();
                    });

                    it('should turn off all events', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                        });
                    });

                    it('should change status to finished', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.status()).toBe(viewModel.statuses.finished);
                        });
                    });

                    it('should close window', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(windowOperations.close).toHaveBeenCalled();
                        });
                    });
                });
            });
        });

    });
});