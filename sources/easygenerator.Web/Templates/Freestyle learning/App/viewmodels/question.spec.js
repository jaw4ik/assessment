define(['viewmodels/question'], function (viewModel) {

    var context = require('context'),
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
                    context.course.objectives = [];
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
                        context.course.objectives = objectives;
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
                        context.course.objectives = objectives;
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

                    it('should set isAnswered', function () {
                        viewModel.isAnswered(null);

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isAnswered()).toBe(false);
                        });
                    });

                    it('should set isCorrect', function () {
                        viewModel.isCorrect(null);

                        var promise = viewModel.activate(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isCorrect()).toBe(false);
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

            describe('when question is answered', function () {

                describe('and item is uncheck', function () {

                    it('should not check item', function () {
                        viewModel.isAnswered(true);
                        var item = { isChecked: ko.observable(false) };

                        viewModel.checkItem(item);

                        expect(item.isChecked()).toBeFalsy();
                    });

                });

                describe('and item is check', function () {

                    it('should not uncheck item', function () {
                        viewModel.isAnswered(true);
                        var item = { isChecked: ko.observable(true) };

                        viewModel.checkItem(item);

                        expect(item.isChecked()).toBeTruthy();
                    });

                });

            });

        });

        describe('isAnswered:', function () {

            it('should be observable', function () {
                expect(viewModel.isAnswered).toBeObservable();
            });

        });

        describe('isCorrect', function () {

            it('should be observable', function () {
                expect(viewModel.isCorrect).toBeObservable();
            });

        });

        describe('isCorrectAnswered', function () {

            it('should be computed', function () {
                expect(viewModel.isCorrectAnswered).toBeComputed();
            });

            describe('when is not answered', function () {

                it('should be falsy', function () {
                    viewModel.isAnswered(false);

                    expect(viewModel.isCorrectAnswered()).toBeFalsy();
                });

            });

            describe('when is answered', function () {

                describe('and answer is not correct', function () {

                    it('should be falsy', function () {
                        viewModel.isAnswered(true);
                        viewModel.isCorrect(false);

                        expect(viewModel.isCorrectAnswered()).toBeFalsy();
                    });

                });

                describe('and answer is correct', function () {

                    it('should be truthy', function () {
                        viewModel.isAnswered(true);
                        viewModel.isCorrect(true);

                        expect(viewModel.isCorrectAnswered()).toBeTruthy();
                    });

                });

            });

        });

        describe('isWrongAnswered', function () {

            it('should be computed', function () {
                expect(viewModel.isWrongAnswered).toBeComputed();
            });

            describe('when is not answered', function () {

                it('should be falsy', function () {
                    viewModel.isAnswered(false);

                    expect(viewModel.isWrongAnswered()).toBeFalsy();
                });

            });

            describe('when is answered', function () {

                describe('and answer is not correct', function () {

                    it('should be truthy', function () {
                        viewModel.isAnswered(true);
                        viewModel.isCorrect(false);

                        expect(viewModel.isWrongAnswered()).toBeTruthy();
                    });

                });

                describe('and answer is correct', function () {

                    it('should be falsy', function () {
                        viewModel.isAnswered(true);
                        viewModel.isCorrect(true);

                        expect(viewModel.isWrongAnswered()).toBeFalsy();
                    });

                });

            });

        });

        describe('submit:', function () {

            it('should be a function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            it('should set question to answered', function () {
                viewModel.isAnswered(null);

                viewModel.submit();

                expect(viewModel.isAnswered()).toBe(true);
            });

        });

        describe('tryAnswerAgain', function () {

            it('should be a function', function () {
                expect(viewModel.tryAnswerAgain).toBeFunction();
            });

            it('should set question to not answered', function () {
                viewModel.isAnswered(null);

                viewModel.tryAnswerAgain();

                expect(viewModel.isAnswered()).toBeFalsy();
            });

            it('should reset answers', function () {
                viewModel.answers = [
                    { isChecked: ko.observable(null) },
                    { isChecked: ko.observable(null) }
                ];

                viewModel.tryAnswerAgain();

                expect(viewModel.answers[0].isChecked()).toBe(false);
                expect(viewModel.answers[1].isChecked()).toBe(false);
            });

        });

        describe('navigateNext', function () {

            it('should be a function', function () {
                expect(viewModel.navigateNext);
            });

            it('should navigate to objectives list', function () {
                spyOn(router, 'navigate');

                viewModel.navigateNext();

                expect(router.navigate).toHaveBeenCalledWith('objectives');
            });

        });

    });

});