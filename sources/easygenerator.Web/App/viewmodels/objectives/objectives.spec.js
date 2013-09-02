﻿define(['viewmodels/objectives/objectives'],
    function (viewModel) {
        "use strict";

        var
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            objectiveRepository = require('repositories/objectiveRepository'),
            experienceRepository = require('repositories/experienceRepository');

        var
            eventsCategory = 'Objectives';


        describe('viewModel [objectives]', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            it('should expose objectives observable', function () {
                expect(viewModel.objectives).toBeObservable();
            });

            it('should expose objectives sortingOptions', function () {
                expect(viewModel.sortingOptions).toBeDefined();
            });

            it('should expose current sortingOption observable', function () {
                expect(viewModel.currentSortingOption).toBeObservable();
            });

            describe('navigateToCreation', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreation).toBeFunction();
                });

                it('should send event \'Navigate to Objective creation\'', function () {
                    viewModel.navigateToCreation();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective creation', eventsCategory);
                });

                it('should navigate to 404', function () {
                    viewModel.navigateToCreation();
                    expect(router.navigate).toHaveBeenCalledWith('objective/create');
                });

            });

            describe('navigateToDetails', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreation).toBeFunction();
                });

                it('should send event \'Navigate to Objective details\'', function () {
                    viewModel.navigateToDetails({ id: 1 });
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective details', eventsCategory);
                });

                it('should navigate to #/objective/{id}', function () {
                    var objectiveId = 1;
                    viewModel.navigateToDetails({ id: objectiveId });
                    expect(router.navigate).toHaveBeenCalledWith('objective/' + objectiveId);
                });

            });

            describe('navigateToExperiences', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToExperiences).toBeFunction();
                });

                it('should send event \'Navigate to Experiences\'', function () {
                    viewModel.navigateToExperiences();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Experiences', eventsCategory);
                });

                it('should navigate to #/experiences', function () {
                    viewModel.navigateToExperiences();
                    expect(router.navigate).toHaveBeenCalledWith('experiences');
                });

            });

            describe('sortByTitleAsc', function () {

                it('should be a function', function () {
                    expect(viewModel.sortByTitleAsc).toBeFunction();
                });

                it('should send event \'Sort by title ascending\'', function () {
                    viewModel.sortByTitleAsc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort by title ascending', eventsCategory);
                });

                it('should set currentSortingOption observable', function () {
                    viewModel.sortByTitleAsc();
                    expect(viewModel.currentSortingOption()).toEqual(constants.sortingOptions.byTitleAsc);
                });

                it('should sort objectives by title ascending', function () {
                    var objectives = [
                        { id: '1', title: 'c' },
                        { id: '2', title: 'z' },
                        { id: '3', title: 'B' },
                        { id: '4', title: 'a' },
                        { id: '5', title: 'A' },
                        { id: '6', title: 'b' }
                    ];
                    viewModel.objectives(objectives);
                    viewModel.sortByTitleAsc();
                    expect(viewModel.objectives()).toBeSortedAsc('title');
                });

            });

            describe('sortByTitleDesc', function () {

                it('should be a function', function () {
                    expect(viewModel.sortByTitleDesc).toBeFunction();
                });

                it('should send event \'Sort by title descending\'', function () {
                    viewModel.sortByTitleDesc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort by title descending', eventsCategory);
                });

                it('should set currentSortingOption observable', function () {
                    viewModel.sortByTitleDesc();
                    expect(viewModel.currentSortingOption()).toEqual(constants.sortingOptions.byTitleDesc);
                });

                it('should sort objectives by title descending', function () {
                    var objectives = [
                        { id: '1', title: 'a' },
                        { id: '2', title: 'A' },
                        { id: '3', title: 'Z' },
                        { id: '4', title: 'c' },
                        { id: '5', title: 'z' },
                        { id: '6', title: 'B' }
                    ];
                    viewModel.objectives(objectives);
                    viewModel.sortByTitleDesc();
                    expect(viewModel.objectives()).toBeSortedDesc('title');
                });

            });

            describe('toggleObjectiveSelection:', function () {

                it('should be a function', function () {
                    expect(viewModel.toggleObjectiveSelection).toBeFunction();
                });

                describe('when objective is null', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleObjectiveSelection(null); };
                        expect(f).toThrow();
                    });
                });

                describe('when objective is undefined', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleObjectiveSelection(); };
                        expect(f).toThrow();
                    });
                });

                describe('when objective does not have isSelected() observable', function () {
                    it('should throw exception', function () {
                        var f = function () { viewModel.toggleObjectiveSelection({}); };
                        expect(f).toThrow();
                    });
                });

                describe('when objective is not selected', function () {

                    it('should send event \'Select Objective\'', function () {
                        viewModel.toggleObjectiveSelection({ isSelected: ko.observable(false) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Select Objective', eventsCategory);
                    });

                    it('should set objective.isSelected to true', function () {
                        var objective = { isSelected: ko.observable(false) };
                        viewModel.toggleObjectiveSelection(objective);
                        expect(objective.isSelected()).toBeTruthy();
                    });
                });

                describe('when objective is selected', function () {

                    it('should send event \'Unselect Objective\'', function () {
                        viewModel.toggleObjectiveSelection({ isSelected: ko.observable(true) });
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect Objective', eventsCategory);
                    });

                    it('should set objective.isSelected to false', function () {
                        var objective = { isSelected: ko.observable(true) };
                        viewModel.toggleObjectiveSelection(objective);
                        expect(objective.isSelected()).toBeFalsy();
                    });

                });
            });

            describe('activate:', function () {

                beforeEach(function () {
                    spyOn(viewModel.notification, 'close');
                });

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should close notification', function () {
                    viewModel.activate();
                    expect(viewModel.notification.close).toHaveBeenCalled();
                });

                it('should return promise', function () {
                    var promise = viewModel.activate();
                    expect(promise).toBePromise();
                });

                describe('when get objectives collection', function () {

                    var getObjectivesDeferred;
                    var objectiveItem = { id: '1', title: 'z', image: '', questions: [{ id: 0 }, { id: 1 }] };
                    var objectivesCollection = [
                        objectiveItem,
                        { id: '2', title: 'a', image: '', questions: [{}, {}] },
                        { id: '3', title: 'A', image: '', questions: [{}, {}] },
                        { id: '4', title: 'c', image: '', questions: [{}, {}] },
                        { id: '5', title: 'B', image: '', questions: [{}, {}] }
                    ];

                    beforeEach(function () {
                        viewModel.objectives([]);

                        getObjectivesDeferred = Q.defer();
                        spyOn(objectiveRepository, 'getCollection').andReturn(getObjectivesDeferred.promise);
                    });

                    it('should call repository getCollection', function () {
                        getObjectivesDeferred.resolve(objectivesCollection);

                        var promise = viewModel.activate();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(objectiveRepository.getCollection).toHaveBeenCalled();
                        });
                    });

                    describe('and when objective received', function () {

                        describe('when get experiences collection', function () {

                            var getExperiencesDeferred;

                            beforeEach(function () {
                                viewModel.objectives([]);

                                getExperiencesDeferred = Q.defer();
                                spyOn(experienceRepository, 'getCollection').andReturn(getExperiencesDeferred.promise);
                            });

                            it('should call repository getCollection', function () {
                                getObjectivesDeferred.resolve(objectivesCollection);

                                var promise = viewModel.activate();
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(promise).toBeResolved();
                                    expect(experienceRepository.getCollection).toHaveBeenCalled();
                                });
                            });

                            describe('and when expreriences received', function () {

                                describe('when initialize objectives collection', function () {

                                    it('should define objectives', function () {
                                        getObjectivesDeferred.resolve(objectivesCollection);
                                        getExperiencesDeferred.resolve([]);

                                        var promise = viewModel.activate();
                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives().length).toBe(objectivesCollection.length);
                                        });
                                    });

                                    it('should set id for each objective', function () {
                                        getExperiencesDeferred.resolve([]);
                                        getObjectivesDeferred.resolve([objectiveItem]);

                                        var promise = viewModel.activate();
                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives()[0].id).toBe(objectiveItem.id);
                                        });
                                    });

                                    it('should set title for each objective', function () {
                                        getExperiencesDeferred.resolve([]);
                                        getObjectivesDeferred.resolve([objectiveItem]);

                                        var promise = viewModel.activate();
                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives()[0].title).toBe(objectiveItem.title);
                                        });
                                    });

                                    it('should set image for each objective', function () {
                                        getExperiencesDeferred.resolve([]);
                                        getObjectivesDeferred.resolve([objectiveItem]);

                                        var promise = viewModel.activate();
                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives()[0].image).toBe(objectiveItem.image);
                                        });
                                    });

                                    it('should set isSelected observable to false for each objective', function () {
                                        getExperiencesDeferred.resolve([]);
                                        getObjectivesDeferred.resolve([objectiveItem]);

                                        var promise = viewModel.activate();
                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives()[0].isSelected()).toBeFalsy();
                                        });
                                    });

                                    describe('when objective questions count > 0', function () {

                                        it('should set canBeDeleted to false for each objective', function () {
                                            getExperiencesDeferred.resolve([]);
                                            getObjectivesDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [{ id: 0 }, { id: 1 }] }]);

                                            var promise = viewModel.activate();
                                            waitsFor(function () {
                                                return !promise.isPending();
                                            });
                                            runs(function () {
                                                expect(promise).toBeResolved();
                                                expect(viewModel.objectives()[0].canBeDeleted).toBeFalsy();
                                            });
                                        });

                                    });

                                    describe('when objective questions count = 0', function () {

                                        describe('when objectives count included to expiriences = 0', function () {
                                            it('should set canBeDeleted to true for each objective', function () {
                                                getExperiencesDeferred.resolve([]);
                                                getObjectivesDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [] }]);

                                                var promise = viewModel.activate();
                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(promise).toBeResolved();
                                                    expect(viewModel.objectives()[0].canBeDeleted).toBeTruthy();
                                                });
                                            });
                                        });

                                        describe('when objective is included to expirience', function () {
                                            it('should set canBeDeleted to false', function () {
                                                getExperiencesDeferred.resolve([{ objectives: [{ id: '1' }] }]);
                                                getObjectivesDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [] }]);

                                                var promise = viewModel.activate();
                                                waitsFor(function () {
                                                    return !promise.isPending();
                                                });
                                                runs(function () {
                                                    expect(promise).toBeResolved();
                                                    expect(viewModel.objectives()[0].canBeDeleted).toBeFalsy();
                                                });
                                            });
                                        });

                                    });

                                });

                                describe('when currectSorting option is \'asc\'', function () {
                                    it('should sort objectives collection asc', function () {
                                        viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);
                                        getObjectivesDeferred.resolve(objectivesCollection);
                                        getExperiencesDeferred.resolve([]);

                                        var promise = viewModel.activate();
                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives()).toBeSortedAsc('title');
                                        });
                                    });
                                });

                                describe('when currectSorting option is \'desc\'', function () {
                                    it('should sort objectives collection asc', function () {
                                        viewModel.currentSortingOption(constants.sortingOptions.byTitleDesc);
                                        getObjectivesDeferred.resolve(objectivesCollection);
                                        getExperiencesDeferred.resolve([]);

                                        var promise = viewModel.activate();
                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives()).toBeSortedDesc('title');
                                        });
                                    });
                                });

                            });

                        });

                    });

                });

            });

            describe('canDeleteObjectives:', function () {

                it('should be computed', function () {
                    expect(viewModel.canDeleteObjectives).toBeComputed();
                });

                describe('when no selected objectives', function () {
                    it('should be false', function () {
                        viewModel.objectives([{ isSelected: ko.observable(false) }]);
                        expect(viewModel.canDeleteObjectives()).toBeFalsy();
                    });
                });

                describe('when only 1 objective is selected', function () {
                    it('should be true', function () {
                        viewModel.objectives([{ isSelected: ko.observable(true) }]);
                        expect(viewModel.canDeleteObjectives()).toBeTruthy();
                    });
                });

                describe('when there are few objectives selected', function () {
                    it('should be false', function () {
                        viewModel.objectives([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                        expect(viewModel.canDeleteObjectives()).toBeFalsy();
                    });
                });
            });

            describe('deleteSelectedObjectives:', function () {

                beforeEach(function () {
                    spyOn(viewModel.notification, 'showMessage');
                    spyOn(viewModel.notification, 'close');
                });

                it('should be function', function () {
                    expect(viewModel.deleteSelectedObjectives).toBeFunction();
                });

                it('should send event \'Delete selected objectives\'', function () {
                    viewModel.objectives([{ isSelected: ko.observable(true) }]);
                    viewModel.deleteSelectedObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected objectives', eventsCategory);
                });

                it('should close notification', function () {
                    viewModel.objectives([{ isSelected: ko.observable(true) }]);
                    viewModel.deleteSelectedObjectives();
                    expect(viewModel.notification.close).toHaveBeenCalled();
                });

                describe('when no selected objectives', function () {
                    it('should throw exception', function () {
                        viewModel.objectives([{ isSelected: ko.observable(false) }]);

                        var f = function () {
                            viewModel.deleteSelectedObjectives();
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when there are few selected objectives', function () {
                    it('should throw exception', function () {
                        viewModel.objectives([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);

                        var f = function () {
                            viewModel.deleteSelectedObjectives();
                        };
                        expect(f).toThrow();
                    });
                });

                describe('when there is only 1 selected objective', function () {

                    describe('and when objective cannot be deleted', function () {
                        beforeEach(function () {
                            viewModel.objectives([{ isSelected: ko.observable(true), canBeDeleted: false }]);
                        });

                        it('should show notification message', function () {
                            viewModel.deleteSelectedObjectives();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected objectives', eventsCategory);
                        });

                        it('should return undefined', function () {
                            var result = viewModel.deleteSelectedObjectives();
                            expect(result).toBeUndefined();
                        });
                    });

                    describe('and when objective can be deleted', function () {
                        var promise = null, deleteDeferred = null;
                        var selectedObjective = { id: 0, isSelected: ko.observable(true), canBeDeleted: true };
                        beforeEach(function () {
                            viewModel.objectives([selectedObjective]);
                            deleteDeferred = Q.defer();
                            spyOn(objectiveRepository, 'removeObjective').andReturn(deleteDeferred.promise);
                            promise = deleteDeferred.promise.finally(function () { });
                        });

                        it('should delete objective in repository', function () {
                            viewModel.deleteSelectedObjectives();
                            deleteDeferred.resolve();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(objectiveRepository.removeObjective).toHaveBeenCalled();
                                expect(objectiveRepository.removeObjective.mostRecentCall.args[0]).toEqual(selectedObjective.id);
                            });
                        });

                        it('should delete objective in view model', function () {
                            viewModel.deleteSelectedObjectives();
                            deleteDeferred.resolve();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.objectives().length).toBe(0);
                            });
                        });
                    });
                });
            });
        });
    }
);