define(['viewmodels/experiences/experiences'],
    function (viewModel) {
        "use strict";

        var
            router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker'),
            dataContext = require('dataContext'),
            experienceModel = require('models/experience'),
            constants = require('constants'),
            http = require('durandal/http');

        var
            eventsCategory = 'Experiences',
            experiences = [
                new experienceModel({
                    id: 'testId3',
                    title: 'Test Experience 3',
                    objectives: []
                }),
                new experienceModel({
                    id: 'testId2',
                    title: 'Test Experience 2',
                    objectives: []
                }),
                new experienceModel({
                    id: 'testId1',
                    title: 'Test Experience 1',
                    objectives: []
                })
            ];

        describe('viewModel [experience]', function () {

            it('should be object', function () {
                expect(viewModel).toEqual(jasmine.any(Object));
            });

            it('should expose experiences observable', function () {
                expect(ko.isObservable(viewModel.experiences)).toBeTruthy();
            });

            it('should expose objectives sortingOptions', function () {
                expect(viewModel.sortingOptions).toBeDefined();
            });

            it('should expose current sortingOption observable', function () {
                expect(ko.isObservable(viewModel.currentSortingOption)).toBeTruthy();
            });

            describe('activate', function () {

                it('should be a function', function () {
                    expect(viewModel.activate).toEqual(jasmine.any(Function));
                });

                it('should take data from dataContext', function () {
                    dataContext.experiences = experiences;
                    viewModel.activate();
                    expect(viewModel.experiences().length).toEqual(3);
                });

                it('should sort experiences asc', function () {
                    dataContext.experiences = experiences;
                    viewModel.activate();
                    expect(viewModel.experiences()).toBeSortedAsc('title');
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleAsc);
                });

            });

            describe('experience item', function () {

                beforeEach(function () {
                    dataContext.experiences = [
                        new experienceModel({
                            id: 'testId',
                            title: 'Test Experience',
                            objectives: []
                        })];

                    viewModel.activate();

                    spyOn(eventTracker, 'publish');
                });

            });

            describe('navigateToCreation', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be a function', function () {
                    expect(viewModel.navigateToCreation).toEqual(jasmine.any(Function));
                });

                it('should send event \"Navigate to create experience\"', function () {
                    viewModel.navigateToCreation();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create experience', eventsCategory);
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
                    expect(viewModel.navigateToDetails).toEqual(jasmine.any(Function));
                });

                it('should send event \"Navigate to details\"', function () {
                    dataContext.experiences = experiences;
                    viewModel.navigateToDetails(experiences[0]);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to details', eventsCategory);
                });

                it('should navigate to #/experience/id', function () {
                    dataContext.experiences = experiences;
                    viewModel.navigateToDetails(experiences[0]);
                    expect(router.navigateTo).toHaveBeenCalledWith('#/experience/' + experiences[0].id);
                });

            });

            describe('navigateToObjectives', function () {

                beforeEach(function () {
                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be a function', function () {
                    expect(viewModel.navigateToObjectives).toEqual(jasmine.any(Function));
                });

                it('should send event \"Navigate to objectives\"', function () {
                    viewModel.navigateToObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objectives', eventsCategory);
                });

                it('should navigate to #/objectives', function () {
                    viewModel.navigateToObjectives();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objectives');
                });

            });

            describe('toggleSelection', function () {

                beforeEach(function () {
                    dataContext.experiences = experiences;
                    viewModel.activate();

                    spyOn(eventTracker, 'publish');
                });

                it('should be a function', function () {
                    expect(viewModel.toggleSelection).toEqual(jasmine.any(Function));
                });

                it('should select experience', function () {
                    var experience = viewModel.experiences()[0];
                    experience.isSelected(false);
                    viewModel.toggleSelection(experience);
                    expect(experience.isSelected()).toBe(true);
                });

                it('should send event \"Experience unselected\" when was selected', function () {
                    var experience = viewModel.experiences()[0];
                    experience.isSelected(true);
                    viewModel.toggleSelection(experience);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Experience unselected', eventsCategory);
                });

                it('should send event \"Experience selected\" when was not selected', function () {
                    var experience = viewModel.experiences()[0];
                    experience.isSelected(false);
                    viewModel.toggleSelection(experience);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Experience selected', eventsCategory);
                });

            });

            describe('sortByTitleAsc', function () {

                beforeEach(function () {
                    dataContext.experiences = experiences;
                    viewModel.activate();

                    spyOn(eventTracker, 'publish');
                });

                it('should be a function', function () {
                    expect(viewModel.sortByTitleAsc).toEqual(jasmine.any(Function));
                });

                it('should set currentSortingoption to constants.sortingOptions.byTitleAsc', function () {
                    viewModel.sortByTitleAsc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleAsc);
                });

                it('should sort experiences', function () {
                    viewModel.sortByTitleDesc();
                    viewModel.sortByTitleAsc();
                    expect(viewModel.experiences()).toBeSortedAsc('title');
                });

                it('should send event \"Sort by title ascending\"', function () {
                    viewModel.currentSortingOption(constants.sortingOptions.byTitleDesc);
                    viewModel.sortByTitleAsc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort by title ascending', eventsCategory);
                });

            });

            describe('sortByTitleDesc', function () {

                beforeEach(function () {
                    dataContext.experiences = experiences;
                    viewModel.activate();

                    spyOn(eventTracker, 'publish');
                });

                it('should be a function', function () {
                    expect(viewModel.sortByTitleDesc).toEqual(jasmine.any(Function));
                });

                it('should set currentSortingoption to constants.sortingOptions.byTitleDesc', function () {
                    viewModel.sortByTitleDesc();
                    expect(viewModel.currentSortingOption()).toBe(constants.sortingOptions.byTitleDesc);
                });

                it('should sort experiences', function () {
                    viewModel.sortByTitleAsc();
                    viewModel.sortByTitleDesc();
                    expect(viewModel.experiences()).toBeSortedDesc('title');
                });

                it('should send event \"Sort by title descending\"', function () {
                    viewModel.currentSortingOption(constants.sortingOptions.byTitleAsc);
                    viewModel.sortByTitleDesc();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Sort by title descending', eventsCategory);
                });

            });

            describe('buildExperience', function () {
                var deferred;

                beforeEach(function () {
                    dataContext.experiences = experiences;
                    viewModel.activate();

                    spyOn(eventTracker, 'publish');
                    deferred = $.Deferred();
                    spyOn(http, 'post').andReturn(deferred.promise());
                });

                it('should be a function', function () {
                    expect(viewModel.buildExperience).toEqual(jasmine.any(Function));
                });

                it('should send event \"Build experience\"', function () {
                    var experience = viewModel.experiences()[0];

                    viewModel.buildExperience(experience);

                    expect(eventTracker.publish).toHaveBeenCalledWith('Build experience', eventsCategory);
                });

                it('should start building experience', function () {
                    var experience = viewModel.experiences()[0];
                    experience.isBuilding(false);

                    viewModel.buildExperience(experience);

                    expect(experience.isBuilding()).toBe(true);
                });

                it('should reset previous building state', function () {
                    var experience = viewModel.experiences()[0];
                    experience.isBuilding(false);
                    experience.isBuildFinished(true);
                    experience.isBuildSucceed(true);

                    viewModel.buildExperience(experience);

                    expect(experience.isBuilding()).toBe(true);
                    expect(experience.isBuildFinished()).toBe(false);
                    expect(experience.isBuildSucceed()).toBe(false);
                });

                it('should reset selection', function () {
                    var experience = viewModel.experiences()[0];
                    experience.isBuilding(false);
                    experience.isSelected(true);

                    viewModel.buildExperience(experience);

                    expect(experience.isBuilding()).toBe(true);
                    expect(experience.isSelected()).toBe(false);
                });

                it('should return promise', function () {
                    var experience = viewModel.experiences()[0],
                        promise;

                    experience.isBuilding(false);

                    promise = viewModel.buildExperience(experience);

                    expect(promise).toEqual(jasmine.any(Object));
                    expect(promise.then).toEqual(jasmine.any(Function));
                });

                it('should stop building when responce is succeed', function () {
                    var experience = viewModel.experiences()[0],
                        experienceData,
                        promise;

                    deferred.resolve({ Success: true });
                    experience.isBuilding(false);
                    experienceData = _.find(experiences, function (item) {
                        return item.id == experience.id;
                    });

                    promise = viewModel.buildExperience(experience);

                    waitsFor(function () {
                        return promise.state() == 'resolved';
                    });
                    runs(function () {
                        expect(http.post).toHaveBeenCalledWith('experience/build', experienceData);
                        expect(experience.isBuildFinished()).toEqual(true);
                        expect(experience.isBuildSucceed()).toEqual(true);
                        expect(experience.isBuilding()).toEqual(false);
                    });
                });

                it('should stop building when response is failed', function () {
                    var experience = viewModel.experiences()[0],
                        experienceData,
                        promise;

                    deferred.resolve({ Success: false });
                    experience.isBuilding(false);
                    experienceData = _.find(experiences, function (item) {
                        return item.id == experience.id;
                    });
                    
                    promise = viewModel.buildExperience(experience);

                    waitsFor(function () {
                        return promise.state() == 'resolved';
                    });

                    runs(function () {
                        expect(http.post).toHaveBeenCalledWith('experience/build', experienceData);
                        expect(experience.isBuildFinished()).toEqual(true);
                        expect(experience.isBuildSucceed()).toEqual(false);
                        expect(experience.isBuilding()).toEqual(false);
                    });
                });

                it('should stop building when request is failed', function () {
                    var experience = viewModel.experiences()[0],
                        promise;

                    deferred.reject();
                    experience.isBuilding(false);

                    promise = viewModel.buildExperience(experience);

                    waitsFor(function () {
                        return promise.state() == 'rejected';
                    });

                    runs(function () {
                        expect(http.post).toHaveBeenCalled();
                        expect(experience.isBuilding()).toEqual(false);
                    });
                });

            });

            describe('downloadExperience', function () {

                beforeEach(function () {
                    dataContext.experiences = experiences;
                    viewModel.activate();

                    spyOn(eventTracker, 'publish');
                    spyOn(router, 'navigateTo');
                });

                it('should be a function', function () {
                    expect(viewModel.downloadExperience).toEqual(jasmine.any(Function));
                });

                it('should send event \"Download experience\"', function () {
                    var experience = viewModel.experiences()[0];
                    viewModel.downloadExperience(experience);
                    expect(eventTracker.publish).toHaveBeenCalledWith('Download experience', eventsCategory);
                });

                it('should navigate to file for download', function () {
                    var experience = viewModel.experiences()[0];
                    viewModel.downloadExperience(experience);

                    expect(router.navigateTo).toHaveBeenCalledWith('download/' + experience.id + '.zip');
                });
            });

        });

    }
);