define(['viewmodels/objectives/objectives'],
    function (viewModel) {
        "use strict";

        var
            router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants');

        var
            eventsCategory = 'Objectives';


        describe('viewModel [objectives]', function () {

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

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be a function', function () {
                    expect(viewModel.navigateToCreation).toBeFunction();
                });

                it('should send event \'Navigate to Objective creation\'', function () {
                    viewModel.navigateToCreation();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective creation', eventsCategory);
                });

                it('should navigate to #/404', function () {
                    viewModel.navigateToCreation();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                });

            });

            describe('navigateToDetails', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

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
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + objectiveId);
                });

            });

            describe('navigateToExperiences', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be a function', function () {
                    expect(viewModel.navigateToExperiences).toBeFunction();
                });

                it('should send event \'Navigate to Experiences\'', function () {
                    viewModel.navigateToExperiences();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Experiences', eventsCategory);
                });

                it('should navigate to #/experiences', function () {
                    viewModel.navigateToExperiences();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/experiences');
                });

            });

            describe('sortByTitleAsc', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

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

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

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

            describe('activate', function () {

                var repository = require('repositories/objectiveBriefRepository');

                beforeEach(function () {
                    var deferred = Q.defer();
                    deferred.resolve([
                        { id: '', title: 'z', image: '', questionsCount: 2 },
                        { id: '', title: 'a', image: '', questionsCount: 2 },
                        { id: '', title: 'A', image: '', questionsCount: 2 },
                        { id: '', title: 'c', image: '', questionsCount: 2 },
                        { id: '', title: 'B', image: '', questionsCount: 2 }
                    ]);
                    spyOn(repository, 'getCollection').andReturn(deferred.promise);
                });

                it('should return promise', function () {
                    var promise = viewModel.activate();
                    
                    expect(promise).toBePromise();
                });

                describe("when promise is resolved", function () {

                    it('should set currentSortingOption observable', function () {
                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        
                        runs(function () {
                            var isPossibleOption =
                                viewModel.currentSortingOption() == constants.sortingOptions.byTitleAsc || viewModel.currentSortingOption() == constants.sortingOptions.byTitleDesc;
                            expect(isPossibleOption).toBe(true);
                        });
                    });

                    it('should sort objectives collection by title ascending', function () {
                        viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);
                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        
                        runs(function () {
                            expect(viewModel.objectives().length).toEqual(5);
                            expect(viewModel.objectives()).toBeSortedAsc('title');
                        });
                    });
                    
                });

            });

        });

    }
);