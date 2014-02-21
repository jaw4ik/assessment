define(['viewmodels/question'], function (viewModel) {

    var router = require('plugins/router'),
        repository = require('repositories/questionRepository'),
        navigationModule = require('modules/questionsNavigation'),
        objectiveRepository = require('repositories/objectiveRepository');

    describe('viewModel [question]', function () {

        var
            question = {
                id: '1',
                title: 'Some question 1',
                isAnswered: true,
                isCorrectAnswered: false,
                answers: [
                    { id: '1', isCorrect: false, text: 'Some answer option 1', isChecked: false },
                    { id: '2', isCorrect: true, text: 'Some answer option 2', isChecked: true }
                ],
                learningContents: [
                    { id: '1' },
                    { id: '2' }
                ],
                submitAnswer: function () {
                },
                learningContentExperienced: function () {
                }
            },
            objective = {
                id: '1',
                title: 'Objective title',
                score: 80,
                calculateScore: function () { }
            };

        beforeEach(function () {
            spyOn(router, 'navigate');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('objective:', function () {

            it('should be defined', function () {
                expect(viewModel.objective).toBeDefined();
            });

        });

        describe('objectiveScore:', function () {

            it('should be observable', function () {
                expect(viewModel.objectiveScore).toBeObservable();
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

        describe('startTime:', function () {

            it('should be defined', function () {
                expect(viewModel.startTime).toBeDefined();
            });

        });

        describe('navigationContext:', function () {
            it('should be defined', function () {
                expect(viewModel.navigationContext).toBeDefined();
            });
        });

        describe('isNextQuestionAvailable:', function () {
            it('should be defined function', function () {
                expect(viewModel.isNextQuestionAvailable).toBeFunction();
            });

            it('should return false if viewModel.navigationContext.nextQuestionUrl is null', function () {
                viewModel.navigationContext = { nextQuestionUrl: null };
                expect(viewModel.isNextQuestionAvailable()).toBeFalsy();
            });

            it('should return false if viewModel.navigationContext.nextQuestionUrl is undefined', function () {
                viewModel.navigationContext = { nextQuestionUrl: undefined };
                expect(viewModel.isNextQuestionAvailable()).toBeFalsy();
            });

            it('should return true if viewModel.navigationContext.nextQuestionUrl is defined', function () {
                viewModel.navigationContext = { nextQuestionUrl: 'some url' };
                expect(viewModel.isNextQuestionAvailable()).toBeTruthy();
            });
        });

        describe('isPreviousQuestionAvailable:', function () {
            it('should be defined function', function () {
                expect(viewModel.isPreviousQuestionAvailable).toBeFunction();
            });

            it('should return false if viewModel.navigationContext.previousQuestionUrl is null', function () {
                viewModel.navigationContext = { previousQuestionUrl: null };
                expect(viewModel.isPreviousQuestionAvailable()).toBeFalsy();
            });

            it('should return false if viewModel.navigationContext.previousQuestionUrl is undefined', function () {
                viewModel.navigationContext = { previousQuestionUrl: undefined };
                expect(viewModel.isPreviousQuestionAvailable()).toBeFalsy();
            });

            it('should return true if viewModel.navigationContext.previousQuestionUrl is defined', function () {
                viewModel.navigationContext = { previousQuestionUrl: 'some url' };
                expect(viewModel.isPreviousQuestionAvailable()).toBeTruthy();
            });
        });

        describe('backToObjectives:', function () {

            it('should be a function', function () {
                expect(viewModel.backToObjectives).toBeFunction();
            });

            it('should navigate to objectives list', function () {
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
                    spyOn(objectiveRepository, 'get').andReturn(null);
                });

                it('should navigate to 404', function () {
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

                beforeEach(function () {
                    spyOn(objectiveRepository, 'get').andReturn(objective);
                });

                describe('and when question is not found', function () {

                    beforeEach(function () {
                        spyOn(repository, 'get').andReturn(null);
                    });

                    it('should navigate to 404', function () {
                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.navigate).toHaveBeenCalledWith('404');
                        });
                    });

                });

                describe('and when question is found', function () {

                    beforeEach(function () {
                        spyOn(repository, 'get').andReturn(question);
                    });

                    it('should not navigate', function () {
                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.navigate).not.toHaveBeenCalled();
                        });
                    });

                    it('should calculate objective score', function () {
                        spyOn(objective, 'calculateScore');
                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(objective.calculateScore).toHaveBeenCalled();
                        });
                    });

                    it('should set current objective score to objectiveScore variable', function () {
                        objective.score = 75;
                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.objectiveScore()).toBe(objective.score);
                        });
                    });

                    it('should get navigation context from navigation module for correct objective and question', function () {
                        spyOn(navigationModule, "getNavigationContext");
                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(navigationModule.getNavigationContext).toHaveBeenCalledWith(objective.id, question.id, jasmine.any(Function));
                        });
                    });

                    it('should set navigationContext to value returned from navigation module', function () {
                        var navigationContext = {
                            previousQuestionUrl: 'previousQuestionUrl',
                            nextQuestionUrl: 'nextQuestionUrl',
                            questionsCount: 10,
                            currentQuestionIndex: 1
                        };

                        spyOn(navigationModule, 'getNavigationContext').andReturn(navigationContext);

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.navigationContext).toBe(navigationContext);
                        });
                    });

                    it('should set questionId', function () {
                        viewModel.questionId = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.questionId).toBe(question.id);
                        });
                    });

                    it('should set title', function () {
                        viewModel.title = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.title).toBe(question.title);
                        });
                    });

                    it('should set answers', function () {
                        viewModel.answers = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.answers).not.toBeNull();
                        });
                    });

                    it('should set id for each answer', function () {
                        viewModel.answers = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.answers.length).toBe(2);
                            expect(viewModel.answers[0].id).toBe(question.answers[0].id);
                            expect(viewModel.answers[1].id).toBe(question.answers[1].id);
                        });
                    });

                    it('should set text for each answer', function () {
                        viewModel.answers = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.answers.length).toBe(2);
                            expect(viewModel.answers[0].text).toBe(question.answers[0].text);
                            expect(viewModel.answers[1].text).toBe(question.answers[1].text);
                        });
                    });

                    it('should set isChecked for each answer', function () {
                        viewModel.answers = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.answers.length).toBe(2);
                            expect(viewModel.answers[0].isChecked).toBeObservable();
                            expect(viewModel.answers[1].isChecked).toBeObservable();
                            expect(viewModel.answers[0].isChecked()).toBe(false);
                            expect(viewModel.answers[1].isChecked()).toBe(true);
                        });
                    });

                    it('should set learningContents', function () {
                        viewModel.learningContents = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.learningContents.length).toBe(2);

                            expect(viewModel.learningContents[0].view).toBe('content/' + objective.id + '/' + question.id + '/1');
                            expect(viewModel.learningContents[1].view).toBe('content/' + objective.id + '/' + question.id + '/2');
                        });
                    });

                    describe('and question has content', function () {

                        it('should set content path', function () {
                            viewModel.content = null;
                            question.hasContent = true;

                            var promise = viewModel.activate(objective.id, question.id);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.content).toBe('content/' + objective.id + '/' + question.id + '/content');
                            });
                        });

                    });

                    describe('and question has not content', function () {

                        it('should set content to empty', function () {
                            viewModel.content = null;
                            question.hasContent = false;

                            var promise = viewModel.activate(objective.id, question.id);

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

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isAnswered()).toBe(question.isAnswered);
                        });
                    });

                    it('should set isCorrect', function () {
                        viewModel.isCorrect(null);

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isCorrect()).toBe(question.isCorrectAnswered);
                        });
                    });

                    it('should set startTime', function () {
                        viewModel.startTime = null;

                        var promise = viewModel.activate(objective.id, question.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.startTime).not.toBeNull();
                        });
                    });

                });

            });

        });

        describe('checkItem:', function () {

            it('shouldBeFunction', function () {
                expect(viewModel.checkItem).toBeFunction();
            });

            describe('when question is answered', function () {

                beforeEach(function () {
                    viewModel.isAnswered(true);
                });

                describe('and item is uncheck', function () {

                    it('should not check item', function () {

                        var item = { isChecked: ko.observable(false) };

                        viewModel.checkItem(item);

                        expect(item.isChecked()).toBeFalsy();
                    });

                });

                describe('and item is check', function () {

                    it('should not uncheck item', function () {
                        var item = { isChecked: ko.observable(true) };

                        viewModel.checkItem(item);

                        expect(item.isChecked()).toBeTruthy();
                    });

                });

            });

            describe('when question is not answered', function () {
                beforeEach(function () {
                    viewModel.isAnswered(false);
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

            beforeEach(function () {
                spyOn(question, 'submitAnswer');
                spyOn(repository, 'get').andReturn(question);
                viewModel.answers = [{ id: '1', isChecked: ko.observable(false) }, { id: '2', isChecked: ko.observable(true) }];
            });

            it('should be a function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            it('should call question submit answer', function () {
                viewModel.submit();
                expect(question.submitAnswer).toHaveBeenCalledWith(['2']);
            });

            it('should set isAnswered', function () {
                viewModel.isAnswered(null);

                viewModel.submit();

                expect(viewModel.isAnswered()).toBe(question.isAnswered);
            });

            it('should set isCorrect', function () {
                viewModel.isCorrect(null);

                viewModel.submit();

                expect(viewModel.isCorrect()).toBe(question.isCorrectAnswered);
            });

            it('should calculate objective score', function () {
                spyOn(objective, 'calculateScore');

                viewModel.submit();

                expect(objective.calculateScore).toHaveBeenCalled();
            });

            it('should set current objective score to objectiveScore variable', function () {
                objective.score = 23;

                viewModel.submit();

                expect(viewModel.objectiveScore()).toBe(objective.score);
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
                expect(viewModel.navigateNext).toBeFunction();
            });

            describe('should navigate to objectives list', function () {
                it('should navigate to objectives list if viewModel.isNextQuestionAvailable is false', function () {
                    viewModel.isNextQuestionAvailable = function () { return false; };

                    viewModel.navigateNext();

                    expect(router.navigate).toHaveBeenCalledWith('objectives');
                });

                it('should navigate to next question if viewModel.isNextQuestionAvailable is true', function () {
                    viewModel.isNextQuestionAvailable = function () { return true; };
                    viewModel.navigationContext = { nextQuestionUrl: 'nextQuestionUrl' };

                    viewModel.navigateNext();
                    expect(router.navigate).toHaveBeenCalledWith('nextQuestionUrl');
                });
            });

        });

        describe('deactivate', function () {

            beforeEach(function () {
                spyOn(question, 'learningContentExperienced');
                spyOn(repository, 'get').andReturn(question);
            });

            it('should be function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should call question learningContentExperienced', function () {
                viewModel.deactivate();
                expect(question.learningContentExperienced).toHaveBeenCalled();
            });

        });

    });
});