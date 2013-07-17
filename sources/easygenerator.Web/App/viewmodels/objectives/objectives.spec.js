define(['viewmodels/objectives/objectives'],
    function (viewModel) {
        "use strict";

        var
            dataContext = require('dataContext'),
            router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants');

        var 
            eventsCategory = 'Objectives';


        describe('viewModel [objectives]', function () {

            it('should be object', function () {
                expect(viewModel).toEqual(jasmine.any(Object));
            });

            it('should expose objectives observable', function () {
                expect(ko.isObservable(viewModel.objectives)).toBeTruthy();
            });

            it('should expose objectives sortingOptions', function () {
                expect(viewModel.sortingOptions).toBeDefined();
            });

            it('should expose current sortingOption observable', function () {
                expect(ko.isObservable(viewModel.currentSortingOption)).toBeTruthy();
            });

            describe('navigateToCreation', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be a function', function () {
                    expect(viewModel.navigateToCreation).toEqual(jasmine.any(Function));
                });

                it('should send event \'Navigate to Objective creation\'', function () {
                    viewModel.navigateToCreation();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective creation', eventsCategory);
                });

                it('should navigate to #/objective/create', function () {
                    viewModel.navigateToCreation();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/create');
                });

            });

            describe('navigateToDetails', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be a function', function () {
                    expect(viewModel.navigateToCreation).toEqual(jasmine.any(Function));
                });

                it('should send event \'Navigate to Objective details\'', function () {
                    viewModel.navigateToDetails({ id: 1 });
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective details', eventsCategory);
                });

                it('should navigate to #/objective/{id}', function () {
                    var experienceId = 1;
                    viewModel.navigateToDetails({ id: experienceId });
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + experienceId);
                });

            });

            describe('navigateToExperiences', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be a function', function () {
                    expect(viewModel.navigateToExperiences).toEqual(jasmine.any(Function));
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
                    expect(viewModel.sortByTitleAsc).toEqual(jasmine.any(Function));
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
                    expect(viewModel.sortByTitleDesc).toEqual(jasmine.any(Function));
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

                it('should set currentSortingOption observable', function () {
                    viewModel.activate();
                    expect(viewModel.currentSortingOption()).toEqual(constants.sortingOptions.byTitleAsc);
                });

                it('should set objectives collection sorted by title ascending', function () {
                    dataContext.objectives = [
                        { id: '', title: '', image: '', questions: [] },
                        { id: '', title: '', image: '', questions: [] },
                        { id: '', title: '', image: '', questions: [] },
                        { id: '', title: '', image: '', questions: [] },
                        { id: '', title: '', image: '', questions: [] }
                    ];
                    viewModel.activate();
                    expect(viewModel.objectives().length).toEqual(5);
                    expect(viewModel.objectives()).toBeSortedAsc('title');
                });

            });

        });

    }
);