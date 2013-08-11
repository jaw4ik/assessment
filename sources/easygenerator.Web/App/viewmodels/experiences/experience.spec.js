define(['viewmodels/experiences/experience'],
    function (viewModel) {
        "use strict";

        var
            router = require('durandal/plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants');

        var
            eventsCategory = 'Experience';


        describe('viewModel [experience]', function () {

            var
                previousExperienceId = 0,
                experience = {
                    id: 1,
                    title: 'experience',
                    objectives: [
                        { id: '0', title: 'A' },
                        { id: '1', title: 'a' },
                        { id: '2', title: 'z' },
                        { id: '3', title: 'b' }
                    ],
                    buildingStatus: ''
                },
                nextExperienceId = 2
            ;

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigateTo');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            it('should expose allowed build statuses', function () {
                expect(viewModel.statuses).toEqual(constants.buildingStatuses);
            });

            describe('navigateToExperiences:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToExperiences).toBeFunction();
                });

                it('should send event \'Navigate to experiences\'', function () {
                    viewModel.navigateToExperiences();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to experiences', eventsCategory);
                });

                it('should navigate to #/experiences', function () {
                    viewModel.navigateToExperiences();
                    expect(router.navigateTo).toHaveBeenCalledWith('#/experiences');
                });

            });

            describe('navigateToNextExperience:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToNextExperience).toBeFunction();
                });

                it('should send event \'Navigate to next experience\'', function () {
                    viewModel.navigateToNextExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next experience', eventsCategory);
                });

                describe('when nextExperience is undefined', function () {

                    it('should navigate to #/404', function () {
                        viewModel.nextExperienceId = null;
                        viewModel.navigateToNextExperience();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });

                });

                describe('when nextExperience is null', function () {

                    it('should navigate to #/404', function () {
                        viewModel.nextExperienceId = null;
                        viewModel.navigateToNextExperience();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });

                });

                describe('when nextExperience is not null or undefined', function () {

                    it('should navigate to #/experience/{nextExperienceId}', function () {
                        viewModel.nextExperienceId = nextExperienceId;
                        viewModel.navigateToNextExperience();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/experience/' + nextExperienceId);
                    });

                });

            });

            describe('navigateToPreviousExperience:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToPreviousExperience).toBeFunction();
                });

                it('should send event \'Navigate to previous experience\'', function () {
                    viewModel.navigateToPreviousExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous experience', eventsCategory);
                });

                describe('when previousExperienceId is null', function () {

                    it('should navigate to #/404', function () {
                        viewModel.previousExperienceId = null;
                        viewModel.navigateToPreviousExperience();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                    });

                });

                describe('when previousExperienceId is not null', function () {

                    it('should navigate to #/experience/{previousExperienceId}', function () {
                        viewModel.previousExperienceId = previousExperienceId;
                        viewModel.navigateToPreviousExperience();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/experience/' + previousExperienceId);
                    });

                });

            });

            describe('navigateToObjectiveDetails:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToObjectiveDetails).toBeFunction();
                });


                describe('when objective is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () {
                            viewModel.navigateToObjectiveDetails();
                        };
                        expect(f).toThrow();
                    });

                });

                describe('when objective is null', function () {

                    it('should throw exception', function () {
                        var f = function () {
                            viewModel.navigateToObjectiveDetails(null);
                        };
                        expect(f).toThrow();
                    });

                });

                describe('when objective.id is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () {
                            viewModel.navigateToObjectiveDetails({});
                        };
                        expect(f).toThrow();
                    });

                });

                it('should send event \'Navigate to Objective details\'', function () {
                    viewModel.navigateToObjectiveDetails({ id: 1 });
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective details', eventsCategory);
                });


                it('should navigate to #/objective/{id}', function () {
                    var objectiveId = 1;
                    viewModel.navigateToObjectiveDetails({ id: objectiveId });
                    expect(router.navigateTo).toHaveBeenCalledWith('#/objective/' + objectiveId);
                });

            });

            describe('toggleObjectiveSelection', function () {

                it('should be a function', function () {
                    expect(viewModel.toggleObjectiveSelection).toBeFunction();
                });

                describe('when objective is undefined', function () {

                    it('should throw exception', function () {
                        var f = function () {
                            viewModel.toggleObjectiveSelection();
                        };
                        expect(f).toThrow();
                    });

                });

                describe('when objective is null', function () {

                    it('should throw exception', function () {
                        var f = function () {
                            viewModel.toggleObjectiveSelection(null);
                        };
                        expect(f).toThrow();
                    });

                });

                describe('when objective.isSelected is not an observable', function () {

                    it('should throw exception', function () {
                        var f = function () {
                            viewModel.toggleObjectiveSelection({});
                        };
                        expect(f).toThrow();
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

            });

            describe('buildExperience:', function () {

                var service = require('services/buildExperience');

                var build;

                beforeEach(function () {
                    build = Q.defer();
                    spyOn(service, 'build').andReturn(build.promise);
                });

                it('should be a function', function () {
                    expect(viewModel.buildExperience).toBeFunction();
                });

                it('should return promise', function () {
                    var promise = viewModel.buildExperience();

                    expect(promise).toBePromise();
                });

                it('should send event \'Build experience\'', function () {
                    viewModel.buildExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Build experience', eventsCategory);
                });

                it('should change status to \'inProgress\'', function () {
                    viewModel.buildExperience();
                    expect(viewModel.status()).toEqual(constants.buildingStatuses.inProgress);
                });

                it('should start build of current experience', function () {
                    viewModel.id = 1;
                    viewModel.buildExperience();
                    expect(service.build).toHaveBeenCalledWith(1);
                });

                describe('when build is finished successfully', function () {

                    it('should change status to \'succeed\'', function () {

                        build.resolve(true);

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.status()).toEqual(constants.buildingStatuses.succeed);
                        });

                    });

                    it('should resolve promise', function () {

                        build.resolve(true);

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual("fulfilled");
                        });

                    });

                });

                describe('when build is failed', function () {

                    it('should change status to \'succeed\'', function () {

                        build.resolve(false);

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.status()).toEqual(constants.buildingStatuses.failed);
                        });

                    });

                    it('should resolve promise', function () {

                        build.resolve(false);

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual("fulfilled");
                        });

                    });

                });
            });

            describe('downloadExperience:', function () {

                it('should be a function', function () {
                    expect(viewModel.downloadExperience).toBeFunction();
                });

                it('should send event \"Download experience\"', function () {
                    viewModel.downloadExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Download experience', eventsCategory);
                });

                it('should navigate to file for download', function () {
                    viewModel.id = experience.id;
                    viewModel.downloadExperience();
                    expect(router.navigateTo).toHaveBeenCalledWith('download/' + experience.id + '.zip');
                });
            });

            describe('activate:', function () {

                var repository = require('repositories/experienceRepository');

                var deferred;

                beforeEach(function () {
                    deferred = Q.defer();
                    spyOn(repository, 'getCollection').andReturn(deferred.promise);
                });


                describe('when routeData is not an object', function () {

                    it('should navigate to #/400', function () {
                        viewModel.activate();
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });

                    it('should return undefined', function () {
                        expect(viewModel.activate()).toBeUndefined();
                    });

                });

                describe('when routeData.id is empty', function () {

                    it('should navigate to #/400', function () {
                        viewModel.activate({});
                        expect(router.navigateTo).toHaveBeenCalledWith('#/400');
                    });

                    it('should return undefined', function () {
                        expect(viewModel.activate({})).toBeUndefined();
                    });

                });

                it('should return promise', function () {
                    var promise = viewModel.activate({ id: 0 });
                    expect(promise).toBePromise();
                });

                describe('when experience does not exist', function () {

                    it('should navigate to #/404 ', function () {
                        var promise = viewModel.activate({ id: 0 });
                        deferred.resolve(null);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(router.navigateTo).toHaveBeenCalledWith('#/404');
                        });
                    });

                    it('should resolve promise with undefined', function () {
                        var promise = viewModel.activate({ id: 0 });
                        deferred.resolve(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise.inspect().state).toEqual('fulfilled');
                            expect(promise.inspect().value).toEqual(undefined);
                        });
                    });

                });

                it('should set current experience id', function () {
                    viewModel.id = null;

                    var promise = viewModel.activate({ id: experience.id });
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.id).toEqual(experience.id);
                    });
                });

                it('should set current experience title', function () {
                    viewModel.title = null;

                    var promise = viewModel.activate({ id: 1 });
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.title).toEqual(experience.title);
                    });
                });

                it('should set current experience objectives sorted by title ascending', function () {
                    viewModel.objectives = null;

                    var promise = viewModel.activate({ id: 1 });
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.objectives.length).toEqual(4);
                        expect(viewModel.objectives).toBeSortedAsc('title');
                    });
                });

                describe('when previous experience exists', function () {

                    it('should set previousExperienceId', function () {
                        viewModel.previousExperienceId = null;

                        var promise = viewModel.activate({ id: experience.id });
                        deferred.resolve([{ id: previousExperienceId }, experience]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.previousExperienceId).toEqual(previousExperienceId);
                        });
                    });

                });

                describe('when next experience exists', function () {

                    it('should set nextExperienceId', function () {
                        viewModel.nextExperienceId = null;

                        var promise = viewModel.activate({ id: experience.id });
                        deferred.resolve([experience, { id: nextExperienceId }]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.nextExperienceId).toEqual(nextExperienceId);
                        });
                    });

                });

                it('should resolve promise with undefined', function () {
                    var promise = viewModel.activate({ id: 0 });
                    deferred.resolve(null);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise.inspect().state).toEqual('fulfilled');
                        expect(promise.inspect().value).toEqual(undefined);
                    });
                });

            });

        });

    }
);