define(['viewmodels/questionsNavigation'], function (ViewModel) {
    var context = require('context');

    describe('viewModel [questionsNavigation]', function () {

        it('should be defined', function () {
            expect(ViewModel).toBeDefined();
        });

        it('should return function', function () {
            expect(ViewModel).toBeFunction();
        });

        var viewModel;
        beforeEach(function () {
            viewModel = new ViewModel();
        });

        describe('nextQuestionUrl:', function () {
            it('should be observable', function () {
                expect(viewModel.nextQuestionUrl).toBeObservable();
            });
        });

        describe('previousQuestionUrl:', function () {
            it('should be observable', function () {
                expect(viewModel.previousQuestionUrl).toBeObservable();
            });
        });

        describe('showTitle:', function () {
            it('should be observable', function () {
                expect(viewModel.showTitle).toBeObservable();
            });

            it('should be equal to false by default', function () {
                expect(viewModel.showTitle()).toBeFalsy();
            });
        });

        describe('currentQuestionIndex:', function () {
            it('should be defined', function () {
                expect(viewModel.currentQuestionIndex).toBeDefined();
            });
        });

        describe('isNextQuestionAvailable:', function () {
            it('should be computed', function () {
                expect(viewModel.isNextQuestionAvailable).toBeComputed();
            });

            it('should return false if nextQuestionUrl is undefined', function () {
                viewModel.nextQuestionUrl = undefined;
                expect(viewModel.isNextQuestionAvailable()).toBeFalsy();
            });

            it('should return false if nextQuestionUrl is null', function () {
                viewModel.nextQuestionUrl = null;
                expect(viewModel.isNextQuestionAvailable()).toBeFalsy();
            });

            it('should return false if nextQuestionUrl is empty string', function () {
                viewModel.nextQuestionUrl('');
                expect(viewModel.isNextQuestionAvailable()).toBeFalsy();
            });

            it('should return false if nextQuestionUrl is whitespace string', function () {
                viewModel.nextQuestionUrl('    ');
                expect(viewModel.isNextQuestionAvailable()).toBeFalsy();
            });

            it('should return true if nextQuestionUrl is string with some nonwhitespace value', function () {
                viewModel.nextQuestionUrl('url');
                expect(viewModel.isNextQuestionAvailable()).toBeTruthy();
            });
        });

        describe('isPreviousQuestionAvailable:', function () {
            it('should be computed', function () {
                expect(viewModel.isPreviousQuestionAvailable).toBeComputed();
            });

            it('should return false if previousQuestionUrl is undefined', function () {
                viewModel.previousQuestionUrl = undefined;
                expect(viewModel.isPreviousQuestionAvailable()).toBeFalsy();
            });

            it('should return false if previousQuestionUrl is null', function () {
                viewModel.previousQuestionUrl = null;
                expect(viewModel.isPreviousQuestionAvailable()).toBeFalsy();
            });

            it('should return false if previousQuestionUrl is empty string', function () {
                viewModel.previousQuestionUrl('');
                expect(viewModel.isPreviousQuestionAvailable()).toBeFalsy();
            });

            it('should return false if previousQuestionUrl is whitespace string', function () {
                viewModel.previousQuestionUrl('    ');
                expect(viewModel.isPreviousQuestionAvailable()).toBeFalsy();
            });

            it('should return true if previousQuestionUrl is string with some nonwhitespace value', function () {
                viewModel.previousQuestionUrl('url');
                expect(viewModel.isPreviousQuestionAvailable()).toBeTruthy();
            });
        });

        describe('activate:', function () {
            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.activate()).toBePromise();
            });

            describe('when objectives exist in context', function () {

                describe('when activationData contains objectiveId, questionId and showTitle params', function () {

                    var objectives = [
                       {
                           id: "1",
                           questions: [{ id: "1" }, { id: "2" }, { id: "3" }]
                       },
                       {
                           id: "2",
                           questions: [{ id: "1" }]
                       }
                    ];

                    beforeEach(function () {
                        context.course.objectives = objectives;
                    });

                    it('should update showTitle to true if true was passed in activationData', function () {
                        var promise = viewModel.activate({ objectiveId: "1", questionId: "1", showTitle: true });
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.showTitle()).toBeTruthy();
                        });
                    });

                    it('should update showTitle to false if false was passed in activationData', function () {
                        var promise = viewModel.activate({ objectiveId: "1", questionId: "1", showTitle: false });
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.showTitle()).toBeFalsy();
                        });
                    });

                    it('should update previousQuestionUrl to undefined if there is no previous question', function () {
                        var promise = viewModel.activate({ objectiveId: "1", questionId: "1", showTitle: false });
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.previousQuestionUrl()).toBeUndefined();
                        });
                    });
                    
                    it('should update previousQuestionUrl to previous question url if there is previous question', function () {
                        var promise = viewModel.activate({ objectiveId: "1", questionId: "2", showTitle: false });
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.previousQuestionUrl()).toBe('#/objective/1/question/1');
                        });
                    });
                    

                    it('should update nextQuestionUrl to undefined if there is no next question', function () {
                        var promise = viewModel.activate({ objectiveId: "1", questionId: "3", showTitle: false });
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.nextQuestionUrl()).toBeUndefined();
                        });
                    });

                    it('should update nextQuestionUrl to next question url if there is next question', function () {
                        var promise = viewModel.activate({ objectiveId: "1", questionId: "2", showTitle: false });
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.nextQuestionUrl()).toBe('#/objective/1/question/3');
                        });
                    });
                    
                    it('should update questionsCount to questions count', function () {
                        var promise = viewModel.activate({ objectiveId: "1", questionId: "2", showTitle: false });
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.questionsCount).toBe(3);
                        });
                    });
                    
                    it('should update currentQuestionIndex to current question\'s index plus one', function () {
                        var promise = viewModel.activate({ objectiveId: "1", questionId: "2", showTitle: false });
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.questionsCount).toBe(3);
                        });
                    });
                });
            });
        });
    });
});