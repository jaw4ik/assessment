define(['viewmodels/question'], function (viewModel) {

    var app = require('durandal/app'),
        context = require('context'),
        eventManager = require('eventManager'),
        router = require('plugins/router');

    describe('viewModel [question]', function () {

        var objectiveId = '1',
            questionId = '1',
            objectives = [{
                id: objectiveId,
                title: 'Some objective 1',
                questions: [{
                    id: questionId,
                    title: 'Some question 1',
                    answers: [
                        { id: '1', isCorrect: false, text: 'Some answer option 1' },
                        { id: '2', isCorrect: true, text: 'Some answer option 2' }
                    ],
                    learningContents: [
                        { id: '1' },
                        { id: '2' }
                    ]
                }]
            }];

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('objectiveId:', function () {

            it('should be defined', function () {
                expect(viewModel.objectiveId).toBeDefined();
            });

        });

        describe('questionId:', function () {

            it('should be defined', function () {
                expect(viewModel.questionId).toBeDefined();
            });

        });

        describe('title:', function () {

            it('should be defined', function () {
                expect(viewModel.title).toBeDefined();
            });

        });

        describe('content:', function () {

            it('should be defined', function () {
                expect(viewModel.content).toBeDefined();
            });

        });

        describe('answers:', function () {

            it('should be array', function () {
                expect(viewModel.answers).toBeArray();
            });

        });

        describe('learningContents:', function () {

            it('should be array', function () {
                expect(viewModel.learningContents).toBeArray();
            });

        });

        describe('backToObjectives:', function () {

            it('should be a function', function () {
                expect(viewModel.backToObjectives).toBeFunction();
            });

            it('should navigate to objectives list', function () {
                spyOn(router, 'navigate');
                viewModel.backToObjectives();
                expect(router.navigate).toHaveBeenCalledWith('objectives');
            });

        });

        describe('activate:', function () {

            it('should be a function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                var result = viewModel.activate();

                expect(result).toBePromise();
            });

            describe('when objective is not found', function () {

                beforeEach(function () {
                    context.objectives = [];
                });

                it('should navigate to 404', function () {
                    spyOn(router, 'navigate');

                    var promise = viewModel.activate();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.navigate).toHaveBeenCalledWith('404');
                    });
                });

            });

            describe('when objective is found', function () {

                describe('and question is not found', function () {

                    it('should navigate to 404', function () {
                        spyOn(router, 'navigate');
                        context.objectives = objectives;
                        var promise = viewModel.activate(objectiveId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.navigate).toHaveBeenCalledWith('404');
                        });
                    });

                });

                describe('and question is found', function () {

                    beforeEach(function () {
                        context.objectives = objectives;
                    });

                    it('should not navigate', function () {
                        spyOn(router, 'navigate');

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.navigate).not.toHaveBeenCalled();
                        });
                    });

                    it('should set objectiveId', function () {
                        viewModel.objectiveId = null;

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.objectiveId).toBe(objectiveId);
                        });
                    });

                    it('should set questionId', function () {
                        viewModel.questionId = null;

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.questionId).toBe(questionId);
                        });
                    });

                    it('should set title', function () {
                        viewModel.title = null;

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.title).toBe(objectives[0].questions[0].title);
                        });
                    });

                    it('should set answers', function () {
                        viewModel.answers = null;

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.answers).not.toBeNull();
                        });
                    });

                    it('should set id for each answer', function () {
                        viewModel.answers = null;

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.answers.length).toBe(2);
                            expect(viewModel.answers[0].id).toBe(objectives[0].questions[0].answers[0].id);
                            expect(viewModel.answers[1].id).toBe(objectives[0].questions[0].answers[1].id);
                        });
                    });

                    it('should set text for each answer', function () {
                        viewModel.answers = null;

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.answers.length).toBe(2);
                            expect(viewModel.answers[0].text).toBe(objectives[0].questions[0].answers[0].text);
                            expect(viewModel.answers[1].text).toBe(objectives[0].questions[0].answers[1].text);
                        });
                    });

                    it('should set isCorrect for each answer', function () {
                        viewModel.answers = null;

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.answers.length).toBe(2);
                            expect(viewModel.answers[0].isCorrect).toBe(objectives[0].questions[0].answers[0].isCorrect);
                            expect(viewModel.answers[1].isCorrect).toBe(objectives[0].questions[0].answers[1].isCorrect);
                        });
                    });

                    it('should set isChecked to false for each answer', function () {
                        viewModel.answers = null;

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.answers.length).toBe(2);
                            expect(viewModel.answers[0].isChecked).toBeObservable();
                            expect(viewModel.answers[1].isChecked).toBeObservable();
                            expect(viewModel.answers[0].isChecked()).toBe(false);
                            expect(viewModel.answers[1].isChecked()).toBe(false);
                        });
                    });

                    it('should set learningContents', function () {
                        viewModel.learningContents = null;

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.learningContents.length).toBe(2);

                            expect(viewModel.learningContents[0].view).toBe('content/' + objectiveId + '/' + questionId + '/1');
                            expect(viewModel.learningContents[1].view).toBe('content/' + objectiveId + '/' + questionId + '/2');
                        });
                    });

                    describe('and question has content', function () {

                        it('should set content path', function () {
                            viewModel.content = null;
                            objectives[0].questions[0].hasContent = true;

                            var promise = viewModel.activate(objectiveId, questionId);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.content).toBe('content/' + objectiveId + '/' + questionId + '/content');
                            });
                        });

                    });

                    describe('and question has not content', function () {

                        it('should set content to empty', function () {
                            viewModel.content = null;
                            objectives[0].questions[0].hasContent = false;

                            var promise = viewModel.activate(objectiveId, questionId);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.content).toBe('');
                            });
                        });

                    });

                });

            });

        });

        describe('checkItem:', function () {

            it('shouldBeFunction', function () {
                expect(viewModel.checkItem).toBeFunction();
            });

            describe('when item is unchecked', function () {

                it('should check item', function () {
                    var item = { isChecked: ko.observable(false) };

                    viewModel.checkItem(item);

                    expect(item.isChecked()).toBeTruthy();
                });

            });

            describe('when item is checked', function () {

                it('should uncheck item', function () {
                    var item = { isChecked: ko.observable(true) };

                    viewModel.checkItem(item);

                    expect(item.isChecked()).toBeFalsy();
                });

            });

        });

        xdescribe('submit:', function () {

            it('should be a function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            it('should invoke answersSubmitted event', function () {
                spyOn(eventManager, 'answersSubmitted');

                viewModel.submit();

                expect(eventManager.answersSubmitted).toHaveBeenCalled();
            });

            it('should navigate to feedback', function () {
                spyOn(router, 'navigate');
                viewModel.objectiveId = 'objectiveId';
                viewModel.questionId = 'questionId';

                viewModel.submit();

                expect(router.navigate).toHaveBeenCalledWith('objective/objectiveId/question/questionId/feedback');
            });

        });

    });

});