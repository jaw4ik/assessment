define(['viewmodels/experiences/experience'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/experienceRepository');

        var eventsCategory = 'Experience';


        describe('viewModel [experience]', function () {

            var
                previousExperienceId = '0',
                experience = {
                    id: '1',
                    title: 'experience',
                    objectives: [
                        { id: '0', title: 'A' },
                        { id: '1', title: 'a' },
                        { id: '2', title: 'z' },
                        { id: '3', title: 'b' }
                    ],
                    buildingStatus: '',
                    packageUrl: '',
                    createdOn: 'createdOn',
                    modifiedOn: 'modifiedOn',
                    builtOn: 'builtOn'
                },
                nextExperienceId = '2'
            ;

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('isFirstBuild:', function () {

                it('should be defined', function () {
                    expect(viewModel.isFirstBuild()).toBeDefined();
                });

            });

            describe('isEditing', function () {

                it('should be isEditing defined', function () {
                    expect(viewModel.isEditing).toBeDefined();
                });

                it('should be observable', function () {
                    expect(viewModel.isEditing).toBeObservable();
                });

            });

            describe('experienceTitleMaxLength:', function () {

                it('should be defined', function () {
                    expect(viewModel.experienceTitleMaxLength).toBeDefined();
                });

                it('should equal constants.validation.experienceTitleMaxLength', function () {
                    expect(viewModel.experienceTitleMaxLength).toEqual(constants.validation.experienceTitleMaxLength);
                });

            });

            it('should expose allowed build statuses', function () {
                expect(viewModel.statuses).toEqual(constants.buildingStatuses);
            });

            describe('language:', function () {

                it('should be defined', function () {
                    expect(viewModel.currentlanguage).toBeDefined();
                });

            });

            describe('navigateToExperiences:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToExperiences).toBeFunction();
                });

                it('should send event \'Navigate to experiences\'', function () {
                    viewModel.navigateToExperiences();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to experiences', eventsCategory);
                });

                it('should navigate to #experiences', function () {
                    viewModel.navigateToExperiences();
                    expect(router.navigate).toHaveBeenCalledWith('experiences');
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

                    it('should navigate to #404', function () {
                        viewModel.nextExperienceId = null;
                        viewModel.navigateToNextExperience();
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });

                });

                describe('when nextExperience is null', function () {

                    it('should navigate to #404', function () {
                        viewModel.nextExperienceId = null;
                        viewModel.navigateToNextExperience();
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });

                });

                describe('when nextExperience is not null or undefined', function () {

                    it('should navigate to #experience/{nextExperienceId}', function () {
                        viewModel.nextExperienceId = nextExperienceId;
                        viewModel.navigateToNextExperience();
                        expect(router.navigate).toHaveBeenCalledWith('experience/' + nextExperienceId);
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

                    it('should navigate to #404', function () {
                        viewModel.previousExperienceId = null;
                        viewModel.navigateToPreviousExperience();
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });

                });

                describe('when previousExperienceId is undefined', function () {

                    it('should navigate to #404', function () {
                        viewModel.previousExperienceId = undefined;
                        viewModel.navigateToPreviousExperience();
                        expect(router.replace).toHaveBeenCalledWith('404');
                    });

                });

                describe('when previousExperienceId is not null', function () {

                    it('should navigate to #/experience/{previousExperienceId}', function () {
                        viewModel.previousExperienceId = previousExperienceId;
                        viewModel.navigateToPreviousExperience();
                        expect(router.navigate).toHaveBeenCalledWith('experience/' + previousExperienceId);
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

                describe('when objective.id is null', function () {

                    it('should throw exception', function () {
                        var f = function () {
                            viewModel.navigateToObjectiveDetails({ id: null });
                        };
                        expect(f).toThrow();
                    });

                });

                it('should send event \'Navigate to Objective details\'', function () {
                    viewModel.navigateToObjectiveDetails({ id: 1 });
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective details', eventsCategory);
                });


                it('should navigate to #objective/{id}', function () {
                    var objectiveId = 1;
                    viewModel.navigateToObjectiveDetails({ id: objectiveId });
                    expect(router.navigate).toHaveBeenCalledWith('objective/' + objectiveId);
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

                var experiencerepositorygetByIdDefer;
                var experiencerepositorygetByIdPromise;

                var service = require('services/buildExperience');

                var build;

                beforeEach(function () {
                    build = Q.defer();
                    spyOn(service, 'build').andReturn(build.promise);
                    experiencerepositorygetByIdDefer = Q.defer();
                    experiencerepositorygetByIdPromise = experiencerepositorygetByIdDefer.promise;
                    spyOn(repository, 'getById').andReturn(experiencerepositorygetByIdPromise);
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
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });

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
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });

                    });


                    it('should be set isFirstBuild to false', function () {
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.isFirstBuild()).toBeFalsy();
                        });
                    });

                    it('should change packageUrl in repository to \'packageUrl\'', function () {
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });

                        experiencerepositorygetByIdDefer.resolve(experience);

                        viewModel.id = 1;
                        var promise = experiencerepositorygetByIdPromise.fin(function () { });
                        viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(experience.packageUrl).toEqual("packageUrl");
                        });
                    });

                    it('should be called getById', function () {
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });

                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(repository.getById).toHaveBeenCalled();
                        });
                    });

                    it('should be called getById with argument 1', function () {
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(repository.getById).toHaveBeenCalledWith(viewModel.id);
                        });
                    });

                    it('should change field builtOn', function () {
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });

                        var builtOn = experience.builtOn;

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.builtOn()).toNotEqual(builtOn);
                        });
                    });

                    it('should change field builtOn in dataContext', function () {
                        build.resolve({ Success: true, PackageUrl: "packageUrl" });
                        var builtOn = experience.builtOn = 'builtOn';

                        viewModel.id = 1;
                        var promise = experiencerepositorygetByIdPromise.fin(function () { });
                        experiencerepositorygetByIdDefer.resolve(experience);
                        viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(experience.builtOn).toNotEqual(builtOn);
                        });
                    });

                    afterEach(function () {
                        experience.packageUrl = '';
                    });

                });

                describe('when build is failed', function () {

                    it('should change status to \'failed\'', function () {
                        build.resolve({ Success: false, PackageUrl: "" });

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
                        build.resolve({ Success: false, PackageUrl: "" });

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });

                    });

                    it('should be change experinceUrl', function () {
                        build.resolve({ Success: false, packageUrl: "" });

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(experience.packageUrl).toEqual("");
                        });

                    });

                    it('should be change packageUrl in repository to \'\'', function () {
                        build.resolve({ Success: false, PackageUrl: "" });

                        experiencerepositorygetByIdDefer.resolve(experience);

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();
                        experiencerepositorygetByIdPromise.fin(function () {
                            experience.packageUrl = '';
                        });

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(experience.packageUrl).toEqual("");
                        });
                    });

                    it('should clear buildOn', function () {
                        build.resolve({ Success: false, PackageUrl: "packageUrl" });

                        viewModel.builtOn(experience.builtOn);

                        viewModel.id = 1;
                        var promise = viewModel.buildExperience();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.builtOn()).toEqual('');
                        });
                    });

                });
            });

            describe('downloadExperience:', function () {

                beforeEach(function () {
                    spyOn(router, 'download');
                });

                it('should be a function', function () {
                    expect(viewModel.downloadExperience).toBeFunction();
                });

                it('should send event \"Download experience\"', function () {
                    viewModel.downloadExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Download experience', eventsCategory);
                });

                it('should download experience package', function () {
                    viewModel.experience = {
                        packageUrl: 'url'
                    };
                    viewModel.downloadExperience();
                    expect(router.download).toHaveBeenCalledWith('download/url');
                });
            });

            describe('resetBuildStatus', function () {

                it('should be a function', function () {
                    expect(viewModel.resetBuildStatus).toBeFunction();
                });

                it('should change status to \'notStarted\'', function () {
                    viewModel.resetBuildStatus();
                    expect(viewModel.status()).toEqual(constants.buildingStatuses.notStarted);
                });

                it('should change isFirstBuild to true', function () {
                    viewModel.resetBuildStatus();
                    expect(viewModel.isFirstBuild()).toBeTruthy();
                });

            });

            describe('startEditing:', function () {

                it('should be function', function () {
                    expect(viewModel.startEditing).toBeFunction();
                });

                it('should be set isEditing to true', function () {
                    viewModel.isEditing(false);
                    viewModel.startEditing();
                    expect(viewModel.isEditing()).toBeTruthy();
                });

            });

            describe('notification:', function () {

                it('should be object', function () {
                    expect(viewModel.notification).toBeObject();
                });

                it('should have text observable', function () {
                    expect(viewModel.notification.text).toBeDefined();
                    expect(viewModel.notification.text).toBeObservable();
                });

                it('should have visibility observable', function () {
                    expect(viewModel.notification.visibility).toBeDefined();
                    expect(viewModel.notification.visibility).toBeObservable();
                });

                describe('close', function () {

                    it('should be function', function () {
                        expect(viewModel.notification.close).toBeFunction();
                    });

                    describe('when called', function () {
                        describe('and visibility is true', function () {
                            it('should set visibility to false', function () {
                                viewModel.notification.visibility(true);
                                viewModel.notification.close();

                                expect(viewModel.notification.visibility()).toBeFalsy();
                            });
                        });
                    });
                });

                describe('update', function () {

                    it('should be function', function () {
                        expect(viewModel.notification.update).toBeFunction();
                    });

                    describe('when called', function () {

                        describe('and visibility is false', function () {

                            it('should set visibility to true', function () {
                                viewModel.notification.visibility(false);
                                viewModel.notification.update();

                                expect(viewModel.notification.visibility()).toBeTruthy();
                            });
                        });
                    });
                });
            });

            describe('saveChanges:', function () {

                beforeEach(function () {
                    spyOn(viewModel.notification, 'update');
                });

                it('should be function', function () {
                    expect(viewModel.saveChanges).toBeFunction();
                });

                it('should send event \'Update experience title\'', function () {
                    viewModel.saveChanges();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Update experience title', eventsCategory);
                });

                describe('when title does not valid', function () {

                    it('should clear title', function () {
                        viewModel.title('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.');
                        viewModel.saveChanges();
                        expect(viewModel.title()).toBe('');
                    });

                    it('should not show notification', function () {
                        viewModel.saveChanges();
                        expect(viewModel.notification.update).not.toHaveBeenCalled();
                    });

                    describe('when title contains only spaces', function () {

                        it('should trim title', function () {
                            viewModel.title('                                      ');
                            viewModel.saveChanges();
                            expect(viewModel.title()).toBe('');
                        });

                    });

                });

                describe('when title is valid', function () {

                    var experienceRepositoryGetById;

                    beforeEach(function () {
                        experienceRepositoryGetById = Q.defer();
                        spyOn(repository, 'getById').andReturn(experienceRepositoryGetById.promise);
                        viewModel.title('Valid title');
                    });

                    it('should be change field modifiedOn', function () {
                        viewModel.saveChanges();
                        expect(viewModel.modifiedOn()).toNotEqual(experience.modifiedOn);
                    });

                    it('should be change field modifiedOn in dataContext', function () {
                        var modifiedOn = experience.modifiedOn;
                        viewModel.saveChanges();
                        var promise = experienceRepositoryGetById.promise.fin(function () { });
                        experienceRepositoryGetById.resolve(experience);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(experience.modifiedOn).toNotEqual(modifiedOn);
                        });
                    });

                    it('should be change field modifiedOn in dataContext', function () {
                        viewModel.title('expected title');
                        viewModel.saveChanges();
                        var promise = experienceRepositoryGetById.promise.fin(function () { });
                        experienceRepositoryGetById.resolve(experience);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(experience.title).toEqual(viewModel.title());
                        });
                    });

                    it('should show notification', function () {
                        viewModel.saveChanges();
                        expect(viewModel.notification.update).toHaveBeenCalled();
                    });

                });

                it('should be set isEditing to false', function () {
                    viewModel.isEditing(true);
                    viewModel.saveChanges();
                    expect(viewModel.isEditing()).toBeFalsy();
                });

                it('should update notification', function () {
                    viewModel.saveChanges();
                    expect(viewModel.notification.update).toHaveBeenCalled();
                });

            });

            describe('activate:', function () {

                var deferred;

                beforeEach(function () {
                    deferred = Q.defer();
                    spyOn(repository, 'getCollection').andReturn(deferred.promise);
                });


                describe('when experienceId is not a string', function () {

                    it('should navigate to #400', function () {
                        viewModel.activate();
                        expect(router.replace).toHaveBeenCalledWith('400');
                    });

                    it('should return undefined', function () {
                        expect(viewModel.activate()).toBeUndefined();
                    });

                });

                it('should return promise', function () {
                    var promise = viewModel.activate('experienceId');
                    expect(promise).toBePromise();
                });

                describe('when experience does not exist', function () {

                    it('should navigate to #404 ', function () {
                        var promise = viewModel.activate('experienceId');
                        deferred.resolve(null);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(router.replace).toHaveBeenCalledWith('404');
                        });
                    });

                    it('should resolve promise with undefined', function () {
                        var promise = viewModel.activate('experienceId');
                        deferred.resolve(null);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith(undefined);
                        });
                    });

                });

                it('should set current experience id', function () {
                    viewModel.id = null;

                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.id).toEqual(experience.id);
                    });
                });

                it('should set current experience title', function () {
                    viewModel.title(null);

                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.title()).toEqual(experience.title);
                    });
                });

                it('should set current experience objectives sorted by title ascending', function () {
                    viewModel.objectives = null;

                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.objectives.length).toEqual(4);
                        expect(viewModel.objectives).toBeSortedAsc('title');
                    });
                });

                it('should set current experience createdOn', function () {
                    viewModel.createdOn = null;

                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.createdOn).toEqual(experience.createdOn);
                    });
                });

                it('should set current experience modifiedOn', function () {
                    viewModel.modifiedOn('');

                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.modifiedOn()).toEqual(experience.modifiedOn);
                    });
                });

                it('should set current experience builtOn', function () {
                    viewModel.builtOn('');

                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.builtOn()).toEqual(experience.builtOn);
                    });
                });

                it('should set notification.visibility to false', function () {
                    viewModel.notification.visibility(true);

                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.notification.visibility()).toBeFalsy();
                    });
                });

                describe('when expierense build status equals \'notStarted\'', function () {

                    it('should set isFirstBuild to true', function () {
                        viewModel.id = null;
                        viewModel.isFirstBuild(false);
                        experience.buildingStatus = 'notStarted';
                        var promise = viewModel.activate(experience.id);
                        deferred.resolve([experience]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.isFirstBuild()).toBeTruthy();
                        });
                    });

                });

                describe('when expierense build status not equals \'notStarted\'', function () {

                    it('should set isFirstBuild to false', function () {
                        viewModel.id = null;
                        viewModel.isFirstBuild(true);
                        experience.buildingStatus = 'succeed';
                        var promise = viewModel.activate(experience.id);
                        deferred.resolve([experience]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.isFirstBuild()).toBeFalsy();
                        });
                    });

                });

                describe('when previous experience exists in sorted by title collection of experiences', function () {

                    it('should set previousExperienceId', function () {
                        viewModel.previousExperienceId = null;

                        var promise = viewModel.activate(experience.id);
                        deferred.resolve([{ id: previousExperienceId, title: 'a' }, { id: experience.id, title: 'b' }]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.previousExperienceId).toEqual(previousExperienceId);
                        });
                    });

                });

                describe('when previous experience does not exist in sorted by title collection of experiences', function () {

                    it('should set previousExperienceId to null ', function () {
                        viewModel.previousExperienceId = null;

                        var promise = viewModel.activate(experience.id);
                        deferred.resolve([{ id: previousExperienceId, title: 'z' }, { id: experience.id, title: 'b' }]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.previousExperienceId).toBeNull();
                        });
                    });

                });

                describe('when next experience exists in sorted by title collection of experiences', function () {

                    it('should set nextExperienceId', function () {
                        viewModel.nextExperienceId = null;

                        var promise = viewModel.activate(experience.id);
                        deferred.resolve([{ id: experience.id, title: 'a' }, { id: nextExperienceId, title: 'b' }]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.nextExperienceId).toEqual(nextExperienceId);
                        });
                    });

                });

                describe('when next experience does not exist in sorted by title collection of experiences', function () {

                    it('should set nextExperienceId to null', function () {
                        viewModel.nextExperienceId = null;

                        var promise = viewModel.activate(experience.id);
                        deferred.resolve([{ id: experience.id, title: 'z' }, { id: nextExperienceId, title: 'b' }]);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.nextExperienceId).toBeNull();
                        });
                    });

                });

                it('should resolve promise with undefined', function () {
                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolvedWith(undefined);
                    });
                });

            });

        });

    }
);