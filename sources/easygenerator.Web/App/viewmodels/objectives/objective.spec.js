define(['viewmodels/objectives/objective'],
    function (viewModel) {
        "use strict";

        var router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker'),
            dataContext = require('dataContext'),
            images = require('configuration/images'),
            constants = require('constants'),
            repository = require('repositories/objectiveRepository');

        var eventsCategory = 'Learning Objective';

        describe('viewModel [objective]', function () {

            var objective = {
                id: '1',
                title: 'Test Objective 1',
                image: images[0],
                questions: [
                    { id: 0, title: 'A' },
                    { id: 1, title: 'b' },
                    { id: 2, title: 'B' },
                    { id: 3, title: 'a' }
                ]
            };

            beforeEach(function () {
                jasmine.Clock.useMock();

                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('is object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activate:', function () {
                var deferred;
                beforeEach(function () {
                    deferred = Q.defer();
                    spyOn(repository, 'getCollection').andReturn(deferred.promise);
                });

                describe('when route data is not defined', function () {
                    it('should navigate to #/400', function () {
                        viewModel.activate(undefined);
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });

                    it('should return undefined', function () {
                        var result = viewModel.activate(undefined);
                        expect(result).toBeUndefined();
                    });
                });

                describe('when objective id is not defined', function () {
                    it('should navigate to #/400', function () {
                        viewModel.activate({ id: undefined });
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });

                    it('should return undefined', function () {
                        var result = viewModel.activate({ id: undefined });
                        expect(result).toBeUndefined();
                    });
                });

                it('should return promise', function () {
                    var promise = viewModel.activate({ id: 0 });
                    expect(promise).toBePromise();
                });

                describe('when objective not found', function () {
                    it('should navigate to #/404', function () {
                        var promise = viewModel.activate({ id: 'Invalid id' });
                        deferred.resolve(null);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                        });
                    });

                    it('should return undefined', function () {
                        var promise = viewModel.activate({ id: 'Invalid id' });
                        deferred.resolve(null);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(promise.inspect().value).toEqual(undefined);
                        });
                    });
                });

                it('should set current objective title', function () {
                    viewModel.title = null;

                    var promise = viewModel.activate({ id: objective.id });
                    deferred.resolve([objective]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.title).toBe(objective.title);
                    });
                });

                it('should set current objective image', function () {
                    viewModel.image(null);

                    var promise = viewModel.activate({ id: objective.id });
                    deferred.resolve([objective]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.image()).toBe(objective.image);
                    });
                });

                it('should initialize questions collection', function () {
                    viewModel.questions([]);

                    var promise = viewModel.activate({ id: objective.id });
                    deferred.resolve([objective]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.questions().length).toBe(objective.questions.length);
                    });
                });

                describe('when currentSortingOption is asc', function () {
                    it('should sort questions asc', function () {
                        viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);

                        var promise = viewModel.activate({ id: objective.id });
                        deferred.resolve([objective]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.questions).toBeSortedAsc('title');
                        });
                    });
                });

                describe('when currentSortingOption is desc', function () {
                    it('should sort questions desc', function () {
                        viewModel.currentSortingOption(constants.sortingOptions.byTitleDesc);

                        var promise = viewModel.activate({ id: objective.id });
                        deferred.resolve([objective]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.questions).toBeSortedDesc('title');
                        });
                    });
                });

                describe('when previous objective exists in sorted by title objectives collection', function () {
                    it('should set previousObjectiveId', function () {
                        var previousObjectiveId = '0';
                        var promise = viewModel.activate({ id: objective.id });
                        deferred.resolve([{ id: previousObjectiveId, title: 'B' }, { id: '0', title: 'a' }, objective]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.previousObjectiveId).toBe(previousObjectiveId);
                        });
                    });
                });

                describe('when previous objective does not exist in sorted by title objectives collection', function () {
                    it('should set previousObjectiveId to null', function () {
                        var promise = viewModel.activate({ id: objective.id });
                        deferred.resolve([{ id: '0', title: 'z' }, { id: '5', title: 'Z' }, objective]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.previousObjectiveId).toBeNull();
                        });
                    });
                });

                describe('when next objective exists in sorted by title objectives collection', function () {
                    it('should set nextObjectiveId', function () {
                        var nextObjectiveId = '2';
                        var promise = viewModel.activate({ id: objective.id });
                        deferred.resolve([objective, { id: nextObjectiveId, title: 'z' }, { id: '5', title: 'Z' }]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.nextObjectiveId).toBe(nextObjectiveId);
                        });
                    });
                });

                describe('when next objective does not exist in sorted by title objectives collection', function () {
                    it('should set nextObjectiveId to null', function () {
                        var promise = viewModel.activate({ id: objective.id });
                        deferred.resolve([objective, { id: '0', title: 'a' }, { id: '5', title: 'B' }]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.nextObjectiveId).toBeNull();
                        });
                    });
                });
            });

            describe('navigateToObjectives', function () {

                it('should navigate to #/objectives', function () {
                    viewModel.navigateToObjectives();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objectives');
                });

                it('should send event \"Navigate to Learning Objectives\"', function () {
                    viewModel.navigateToObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Learning Objectives', eventsCategory);
                });

            });

            describe('navigateToEditQuestion', function () {
                describe('when question is null', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(null); };
                        expect(f).toThrow();
                    });
                });

                describe('when question is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion(); };
                        expect(f).toThrow();
                    });
                });

                describe('when question does not have property id', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({}); };
                        expect(f).toThrow();
                    });
                });

                describe('when question id is null', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.navigateToEditQuestion({ id: null }); };
                        expect(f).toThrow();
                    });
                });

                it('should navigate to #/objectives', function () {
                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + objective.id + '/question/' + objective.questions[0].id);
                });

                it('should send event \"Navigate to edit question\"', function () {
                    viewModel.objectiveId = objective.id;

                    viewModel.navigateToEditQuestion(objective.questions[0]);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to edit question', eventsCategory);
                });

            });

            describe('navigateToNextObjective:', function () {
                var nextObjectiveId = 1;

                it('should be a function', function () {
                    expect(viewModel.navigateToNextObjective).toBeFunction();
                });

                it('should send event \'Navigate to next objective\'', function () {
                    viewModel.navigateToNextObjective();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next objective', eventsCategory);
                });

                describe('when nextObjectiveId is undefined', function () {

                    it('should navigate to #/404', function () {
                        viewModel.nextObjectiveId = undefined;
                        viewModel.navigateToNextObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });

                });

                describe('when nextObjectiveId is null', function () {

                    it('should navigate to #/404', function () {
                        viewModel.nextObjectiveId = null;
                        viewModel.navigateToNextObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });

                });

                describe('when nextObjectiveId is not null or undefined', function () {
                    it('should navigate to #/objective/{nextObjectiveId}', function () {
                        viewModel.nextObjectiveId = nextObjectiveId;
                        viewModel.navigateToNextObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + nextObjectiveId);
                    });
                });
            });

            describe('navigateToCreateQuestion:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreateQuestion).toBeFunction();
                });

                it('should send event \'Navigate to create question\'', function () {
                    viewModel.navigateToCreateQuestion();

                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create question', eventsCategory);
                });

                it('should navigate to #/objective/{objectiveId}/question/create', function () {
                    viewModel.objectiveId = '0';

                    viewModel.navigateToCreateQuestion();

                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + viewModel.objectiveId + '/question/create');
                });
            });

            describe('navigateToPreviousObjective:', function () {
                var previousObjectiveId = 0;

                it('should be a function', function () {
                    expect(viewModel.navigateToPreviousObjective).toBeFunction();
                });

                it('should send event \'Navigate to previous objective\'', function () {
                    viewModel.navigateToPreviousObjective();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous objective', eventsCategory);
                });

                describe('when previousObjectiveId is null', function () {
                    it('should navigate to #/404', function () {
                        viewModel.previousObjectiveId = null;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });
                });

                describe('when previousObjectiveId is undefined', function () {
                    it('should navigate to #/404', function () {
                        viewModel.previousExperienceId = undefined;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });
                });

                describe('when previousObjectiveId is not null', function () {

                    it('should navigate to #/experience/{previousObjectiveId}', function () {
                        viewModel.previousObjectiveId = previousObjectiveId;
                        viewModel.navigateToPreviousObjective();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + previousObjectiveId);
                    });
                });
            });

            describe('sortByTitleAsc', function () {
                it('should send event \"Sort questions by title ascending\"', function () {
                    viewModel.sortByTitleAsc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title ascending', eventsCategory);
                });

                it('should change sorting option to constants.sortingOptions.byTitleAcs', function () {
                    viewModel.sortByTitleAsc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleAsc);
                });

                it('should sort questions', function () {
                    viewModel.questions(ko.observableArray(objective.questions));
                    viewModel.sortByTitleAsc();
                    expect(viewModel.questions()).toBeSortedAsc('title');
                });
            });

            describe('sortByTitleDesc', function () {
                it('should send event \"Sort questions by title descending\"', function () {
                    viewModel.sortByTitleDesc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort questions by title descending', eventsCategory);
                });

                it('should change sorting option to constants.sortingOptions.byTitleDecs', function () {
                    viewModel.sortByTitleDesc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleDesc);
                });

                it('should sort questions', function () {
                    viewModel.questions(ko.observableArray([objective.questions]));
                    viewModel.sortByTitleDesc();
                    expect(viewModel.questions()).toBeSortedDesc('title');
                });
            });

            describe('deleteSelectedQuestions', function () {

                var getDeferred;
                var updateDeferred;

                beforeEach(function () {
                    getDeferred = Q.defer();
                    updateDeferred = Q.defer();
                    spyOn(repository, 'getById').andReturn(getDeferred.promise);
                    spyOn(repository, 'update').andReturn(updateDeferred.promise);
                });

                it('should be a function', function () {
                    expect(viewModel.deleteSelectedQuestions).toBeFunction();
                });

                it('should send event \'Delete question\'', function () {
                    viewModel.questions([{ isSelected: ko.observable(true) }]);
                    viewModel.deleteSelectedQuestions();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete question', eventsCategory);
                });

                describe('when no selected questions', function () {
                    it('should throw exception', function () {
                        viewModel.questions([]);
                        var f = function () { viewModel.deleteSelectedQuestions(); };
                        expect(f).toThrow();
                    });
                });

                it('should return promise', function () {
                    var promise = viewModel.activate({ id: 0 });
                    expect(promise).toBePromise();
                });

                describe('when there are selected questions', function () {
                    it('should delete selected question from viewModel', function () {
                        viewModel.questions([{ id: '0', isSelected: ko.observable(true) }]);
                        var promise = viewModel.deleteSelectedQuestions();

                        getDeferred.resolve({ id: '0', qurstions: [{ id: '0' }] });
                        updateDeferred.resolve(true);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.questions().length).toBe(0);
                        });
                    });
                });
            });

            describe('canDeleteQuestions:', function () {

                it('should be observable', function () {
                    expect(viewModel.canDeleteQuestions).toBeObservable();
                });

                describe('when no question selected', function () {
                    it('should be false', function () {
                        viewModel.questions([]);
                        expect(viewModel.canDeleteQuestions()).toBe(false);
                    });
                });

                describe('when question is selected', function () {
                    it('should be true', function () {
                        viewModel.questions([
                            { isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.canDeleteQuestions()).toBe(true);
                    });
                });

                describe('when few questions are selected', function () {
                    it('should befalse', function () {
                        viewModel.questions([
                            { isSelected: ko.observable(true) },
                            { isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.canDeleteQuestions()).toBe(false);
                    });
                });
            });

            describe('toggleQuestionSelection', function () {

                it('should be a function', function () {
                    expect(viewModel.toggleQuestionSelection).toBeFunction();
                });

                describe('when question is null', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(null); };
                        expect(f).toThrow();
                    });
                });

                describe('when question is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection(); };
                        expect(f).toThrow();
                    });
                });

                describe('when question does not have isSelected() observable', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleQuestionSelection({}); };
                        expect(f).toThrow();
                    });
                });

                describe('when question is not selected', function () {
                    it('should send event \'Select question\'', function () {
                        viewModel.toggleQuestionSelection({ isSelected: ko.observable(false) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Select question', eventsCategory);
                    });

                    it('should set question.isSelected to true', function () {
                        var question = { isSelected: ko.observable(false) };
                        viewModel.toggleQuestionSelection(question);
                        expect(question.isSelected()).toBeTruthy();
                    });
                });

                describe('when question is selected', function () {
                    it('should send event \'Unselect question\'', function () {
                        viewModel.toggleQuestionSelection({ isSelected: ko.observable(true) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect question', eventsCategory);
                    });

                    it('should set question.isSelected to false', function () {
                        var question = { isSelected: ko.observable(true) };
                        viewModel.toggleQuestionSelection(question);
                        expect(question.isSelected()).toBeFalsy();
                    });
                });
            });

            describe('questions', function () {
                it('should be observable', function () {
                    expect(viewModel.questions).toBeObservable();
                });
            });
        });
    }
);