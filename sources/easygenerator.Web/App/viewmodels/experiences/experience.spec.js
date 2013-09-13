define(['viewmodels/experiences/experience'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/experienceRepository'),
            objectiveRepository = require('repositories/objectiveRepository'),
            templateRepository = require('repositories/templateRepository'),
            notify = require('notify');

        var eventsCategory = 'Experience';


        describe('viewModel [experience]', function () {
            var previousExperienceId = '0',
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
                    builtOn: 'builtOn',
                    templateId: '1'
                },
                nextExperienceId = '2';

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
                spyOn(notify, 'info');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('isFirstBuild:', function () {

                it('should be defined', function () {
                    expect(viewModel.isFirstBuild()).toBeDefined();
                });

            });

            describe('templates', function () {
                it('should be defined', function () {
                    expect(viewModel.templates).toBeDefined();
                });
            });

            describe('templateId', function () {
                it('should be observable', function () {
                    expect(viewModel.templateId).toBeObservable();
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

            describe('title:', function () {

                it('should be observable', function () {
                    expect(viewModel.title).toBeObservable();
                });

                describe('isValid', function () {

                    it('should be computed', function () {
                        expect(viewModel.title.isValid).toBeComputed();
                    });

                    describe('when title is empty', function () {

                        it('should be false', function () {
                            viewModel.title('');
                            expect(viewModel.title.isValid()).toBeFalsy();
                        });

                    });

                    describe('when title is longer than 255', function () {

                        it('should be false', function () {
                            viewModel.title(utils.createString(viewModel.experienceTitleMaxLength + 1));
                            expect(viewModel.title.isValid()).toBeFalsy();
                        });

                    });

                    describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                        it('should be true', function () {
                            viewModel.title('   ' + utils.createString(viewModel.experienceTitleMaxLength - 1) + '   ');
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });

                    describe('when title is not empty and not longer than 255', function () {

                        it('should be true', function () {
                            viewModel.title(utils.createString(viewModel.experienceTitleMaxLength - 1));
                            expect(viewModel.title.isValid()).toBeTruthy();
                        });

                    });
                });
            });

            it('should expose allowed build statuses', function () {
                expect(viewModel.statuses).toEqual(constants.buildingStatuses);
            });

            describe('language:', function () {

                it('should be defined', function () {
                    expect(viewModel.language).toBeDefined();
                });

                it('should be observable', function () {
                    expect(viewModel.language).toBeObservable();
                });

            });

            describe('navigateToExperiences:', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToExperiences).toBeFunction();
                });

                it('should send event \'Navigate to experiences\'', function () {
                    viewModel.navigateToExperiences();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to experiences');
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
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to next experience');
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
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to previous experience');
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
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective details');
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
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect Objective');
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
                        expect(eventTracker.publish).toHaveBeenCalledWith('Select Objective');
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

                it('should send event \'Build experience\'', function () {
                    viewModel.buildExperience();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Build experience');
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
                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () {
                        });

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
                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () {
                        });

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
                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () {
                        });

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
                        var promise = experiencerepositorygetByIdPromise.fin(function () {
                        });
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

                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () {
                        });

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
                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () {
                        });

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
                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () { });

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
                        var promise = experiencerepositorygetByIdPromise.fin(function () {
                        });
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
                        viewModel.buildExperience();

                        var promise = build.promise.fin(function () { });

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
                        viewModel.buildExperience();

                        var promise = build.promise.fin(function () { });

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
                        viewModel.buildExperience();

                        var promise = build.promise.fin(function () { });

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
                        viewModel.buildExperience();
                        var promise = build.promise.fin(function () { });

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
                        viewModel.buildExperience();

                        var promise = build.promise.fin(function () { });

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
                    expect(eventTracker.publish).toHaveBeenCalledWith('Download experience');
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

            describe('startEditTitle:', function () {

                it('should be function', function () {
                    expect(viewModel.startEditTitle).toBeFunction();
                });

                it('should be set isEditing to true', function () {
                    viewModel.isEditing(false);
                    viewModel.startEditTitle();
                    expect(viewModel.isEditing()).toBeTruthy();
                });

            });

            describe('endEditTitle:', function () {

                beforeEach(function () {
                    viewModel.title(experience.title);
                    viewModel.startEditTitle();
                });

                it('should be function', function () {
                    expect(viewModel.endEditTitle).toBeFunction();
                });

                it('should trim title', function () {
                    viewModel.title('    Some title          ');
                    viewModel.endEditTitle();
                    expect(viewModel.title()).toEqual('Some title');
                });

                describe('when title is not valid', function () {

                    it('should clear title', function () {
                        viewModel.title(utils.createString(viewModel.experienceTitleMaxLength + 1));
                        viewModel.endEditTitle();

                        expect(viewModel.title()).toBe(experience.title);
                    });

                    it('should not show notification', function () {
                        viewModel.endEditTitle();
                        expect(notify.info).not.toHaveBeenCalled();
                    });

                    describe('when title contains only spaces', function () {

                        it('should trim title', function () {
                            viewModel.title('              ');
                            viewModel.endEditTitle();

                            expect(viewModel.title()).toBe(experience.title);
                        });
                    });

                });

                describe('when title is valid', function () {

                    var updateExperienceDeferred, updateExperiencePromise;
                    var newTitle = 'Valid title';

                    beforeEach(function () {
                        updateExperienceDeferred = Q.defer();

                        spyOn(repository, 'updateExperience').andReturn(updateExperienceDeferred.promise);
                        updateExperiencePromise = updateExperienceDeferred.promise.fin(function () { });

                        viewModel.title(newTitle);
                    });

                    it('should update experience in repository', function () {
                        viewModel.endEditTitle();
                        expect(repository.updateExperience).toHaveBeenCalled();
                    });

                    describe('and when experience updated successfully', function () {

                        var updatedExperience = { title: newTitle, templateId: "0", modifiedOn: new Date() };
                        beforeEach(function () {
                            updateExperienceDeferred.resolve(updatedExperience);
                        });

                        it('should update notificaion', function () {
                            viewModel.endEditTitle();

                            waitsFor(function () {
                                return !updateExperiencePromise.isPending();
                            });
                            runs(function () {
                                expect(updateExperiencePromise).toBeResolved();
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should update modifiedOn', function () {
                            viewModel.endEditTitle();

                            waitsFor(function () {
                                return !updateExperiencePromise.isPending();
                            });
                            runs(function () {
                                expect(updateExperiencePromise).toBeResolved();
                                expect(viewModel.modifiedOn()).toEqual(updatedExperience.modifiedOn);
                            });
                        });

                        it('should send event \'Update experience title\'', function () {
                            viewModel.endEditTitle();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Update experience title');
                        });

                    });

                    it('should set isEditing to false', function () {
                        viewModel.isEditing(true);
                        viewModel.endEditTitle();
                        expect(viewModel.isEditing()).toBeFalsy();
                    });
                });
            });

            describe('updateExperienceTemplate:', function () {
                it('should be function', function () {
                    expect(viewModel.updateExperienceTemplate).toBeFunction();
                });

                var updateExperienceDeferred, updateExperiencePromise;
                beforeEach(function () {
                    updateExperienceDeferred = Q.defer();

                    spyOn(repository, 'updateExperience').andReturn(updateExperienceDeferred.promise);
                    updateExperiencePromise = updateExperienceDeferred.promise.fin(function () { });
                });

                it('should update experience in repository', function () {
                    viewModel.endEditTitle();
                    expect(repository.updateExperience).toHaveBeenCalled();
                });

                describe('and when experience updated successfully', function () {
                    var templateItem = { id: '0', name: 'template' };
                    var updatedExperience = { title: 'some title', templateId: '0', modifiedOn: new Date() };
                    beforeEach(function () {
                        viewModel.templates.splice(0, viewModel.templates.length);
                        viewModel.templates.push(templateItem, { id: '1', name: 'tmpl' });
                        viewModel.templateId(templateItem.id);
                        updateExperienceDeferred.resolve(updatedExperience);
                    });

                    it('should update notificaion', function () {
                        viewModel.updateExperienceTemplate(templateItem);

                        waitsFor(function () {
                            return !updateExperiencePromise.isPending();
                        });
                        runs(function () {
                            expect(updateExperiencePromise).toBeResolved();
                            expect(notify.info).toHaveBeenCalled();
                        });
                    });

                    it('should update modifiedOn', function () {
                        viewModel.updateExperienceTemplate(templateItem);

                        waitsFor(function () {
                            return !updateExperiencePromise.isPending();
                        });
                        runs(function () {
                            expect(updateExperiencePromise).toBeResolved();
                            expect(viewModel.modifiedOn()).toEqual(updatedExperience.modifiedOn);
                        });
                    });

                    it('should send event \'Change experience template to \'<templateName>\'\'', function () {
                        viewModel.updateExperienceTemplate(templateItem);
                        expect(eventTracker.publish).toHaveBeenCalledWith('Change experience template to \'' + templateItem.name + '\'');
                    });

                });

            });

            describe('objectivesMode:', function () {

                it('should be observable', function () {
                    expect(viewModel.objectivesMode).toBeObservable();
                });

            });

            describe('startAppendingObjectives:', function () {

                it('should be function', function () {
                    expect(viewModel.startAppendingObjectives).toBeFunction();
                });

                it('should send event \'Start appending related objectives\'', function () {
                    viewModel.startAppendingObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Start appending related objectives');
                });

                it('should get objectives from repository', function () {
                    spyOn(objectiveRepository, 'getCollection').andReturn(Q.defer().promise);
                    
                    viewModel.startAppendingObjectives();
                    expect(objectiveRepository.getCollection).toHaveBeenCalled();
                });

                describe('when get objectives', function() {
                    var getObjectivesDefer,
                        getObjectivesPromise;

                    beforeEach(function () {
                        getObjectivesDefer = Q.defer();
                        getObjectivesPromise = getObjectivesDefer.promise.fin(function () { });
                        spyOn(objectiveRepository, 'getCollection').andReturn(getObjectivesDefer.promise);
                        
                        getObjectivesDefer.resolve([{ id: '0', title: 'B' }, { id: '1', title: 'A' }]);
                    });

                    describe('and experience does not have related objectives', function () {
                        
                        it('should set all objectives as available', function () {
                            viewModel.relatedObjectives([]);
                            
                            viewModel.startAppendingObjectives();

                            waitsFor(function () {
                                return !getObjectivesPromise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.availableObjectives().length).toBe(2);
                            });
                        });

                    });

                    describe('and experience has related objectives', function () {

                        it('should set not related objectives as available', function () {
                            viewModel.relatedObjectives([{ id: '0', title: 'B', isSelected: ko.observable(false) }]);

                            viewModel.startAppendingObjectives();

                            waitsFor(function () {
                                return !getObjectivesPromise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.availableObjectives().length).toBe(1);
                                expect(viewModel.availableObjectives()[0].id).toBe('1');
                            });
                        });

                    });

                    it('should set objectivesMode to \'appending\'', function () {
                        viewModel.startAppendingObjectives();

                        waitsFor(function () {
                            return !getObjectivesPromise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.objectivesMode()).toBe('appending');
                        });
                    });

                    it('should sort available objectives by title', function () {
                        viewModel.startAppendingObjectives();

                        waitsFor(function () {
                            return !getObjectivesPromise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.availableObjectives()).toBeSortedAsc('title');
                        });
                    });

                });

            });

            describe('finishAppendingObjectives:', function () {

                it('should be function', function () {
                    expect(viewModel.finishAppendingObjectives).toBeFunction();
                });

                it('should send event \'Finish appending related objectives\'', function () {
                    viewModel.finishAppendingObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Finish appending related objectives');
                });

                describe('when experience has related objectives', function () {

                    beforeEach(function () {
                        viewModel.relatedObjectives([
                            { id: '0', title: 'C', isSelected: ko.observable(false) },
                            { id: '1', title: 'A', isSelected: ko.observable(false) }
                        ]);
                    });

                    describe('and nothing is selected', function () {

                        beforeEach(function () {
                            var objectivesList = [
                                { isSelected: ko.observable(false) }
                            ];
                            viewModel.availableObjectives(objectivesList);
                        });

                        it('should not call repository relateObjectives method', function () {
                            spyOn(repository, 'relateObjectives');

                            viewModel.finishAppendingObjectives();
                            expect(repository.relateObjectives).not.toHaveBeenCalled();
                        });

                        it('should change objectivesMode to \'display\' ', function () {
                            viewModel.finishAppendingObjectives();
                            expect(viewModel.objectivesMode()).toBe('display');
                        });

                        it('should set related objectives', function () {
                            viewModel.finishAppendingObjectives();
                            expect(viewModel.relatedObjectives().length).toBe(2);
                        });

                    });

                    describe('and some available objectives selected', function () {
                        var selectedObjectives,
                            relateObjectivesDefer,
                            relateObjectivesPromise;

                        beforeEach(function () {
                            selectedObjectives = [
                                { isSelected: ko.observable(false), _original: { id: '2', title: 'D' } },
                                { isSelected: ko.observable(true), _original: { id: '3', title: 'B' } }
                            ];
                            viewModel.availableObjectives(selectedObjectives);

                            relateObjectivesDefer = Q.defer();
                            relateObjectivesPromise = relateObjectivesDefer.promise.fin(function () { });
                            spyOn(repository, 'relateObjectives').andReturn(relateObjectivesDefer.promise);
                        });

                        it('should call relateObjectives repository function with selected objectives', function () {
                            viewModel.finishAppendingObjectives();
                            expect(repository.relateObjectives).toHaveBeenCalledWith(viewModel.id, [selectedObjectives[1]._original]);
                        });

                        describe('and objectives were added', function () {

                            beforeEach(function () {
                                relateObjectivesDefer.resolve('modified date');
                            });

                            it('should call \'notify.info\' function', function () {
                                viewModel.finishAppendingObjectives();

                                waitsFor(function () {
                                    return !relateObjectivesPromise.isPending();
                                });
                                runs(function () {
                                    expect(notify.info).toHaveBeenCalled();
                                });
                            });

                            it('should update related objectives', function () {
                                viewModel.finishAppendingObjectives();

                                waitsFor(function () {
                                    return !relateObjectivesPromise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.relatedObjectives().length).toBe(3);
                                });
                            });

                            it('should sort related objectives by title', function () {
                                viewModel.finishAppendingObjectives();

                                waitsFor(function () {
                                    return !relateObjectivesPromise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.relatedObjectives()).toBeSortedAsc('title');
                                });
                            });

                            it('should update modified on date', function () {
                                viewModel.finishAppendingObjectives();

                                waitsFor(function () {
                                    return !relateObjectivesPromise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.modifiedOn()).toBe('modified date');
                                });
                            });

                            it('should set objectivesMode to \'display\'', function () {
                                viewModel.finishAppendingObjectives();

                                waitsFor(function () {
                                    return !relateObjectivesPromise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.objectivesMode()).toBe('display');
                                });
                            });

                        });

                    });

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
                    viewModel.title('');

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
                    viewModel.relatedObjectives(null);

                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.relatedObjectives().length).toEqual(4);
                        expect(viewModel.relatedObjectives()).toBeSortedAsc('title');
                    });
                });

                it('should set objectivesMode to \'display\'', function () {
                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.objectivesMode()).toBe('display');
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

                it('should set current experience templateId', function () {
                    viewModel.templateId('');

                    var promise = viewModel.activate(experience.id);
                    deferred.resolve([experience]);

                    waitsFor(function () {
                        return promise.isFulfilled();
                    });
                    runs(function () {
                        expect(viewModel.templateId()).toEqual(experience.templateId);
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

                describe('when get templates from repository', function () {
                    var getTemplatesDeferred, getTemplatesPromise;

                    beforeEach(function () {
                        getTemplatesDeferred = Q.defer();

                        spyOn(templateRepository, 'getCollection').andReturn(getTemplatesDeferred.promise);
                        getTemplatesPromise = getTemplatesDeferred.promise.fin(function () { });

                        deferred.resolve([{ id: experience.id, title: 'z' }]);
                    });

                    it('should get templates from repository', function () {
                        var promise = viewModel.activate(experience.id);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                            expect(templateRepository.getCollection).toHaveBeenCalled();
                        });
                    });

                    describe('when received templates successfully', function () {
                        beforeEach(function () {
                            viewModel.templates.splice(0, viewModel.templates.length);
                            getTemplatesDeferred.resolve([{ id: "0", name: "Default" }, { id: "1", name: "Quizz" }]);
                        });

                        it('should initialize templates collection', function () {
                            var promise = viewModel.activate(experience.id);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.templates.length).toBe(2);
                            });
                        });

                        it('should initialize templates collection sorted by name asc', function () {
                            var promise = viewModel.activate(experience.id);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(promise).toBeResolved();
                                expect(viewModel.templates).toBeSortedAsc('name');
                            });
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

            describe('relatedObjectives:', function () {

                it('should be observable', function () {
                    expect(viewModel.relatedObjectives).toBeObservable();
                });

            });

            describe('availableObjectives:', function () {

                it('should be observable', function () {
                    expect(viewModel.availableObjectives).toBeObservable();
                });

            });

            describe('canUnrelateObjectives:', function () {

                it('should be observable', function () {
                    expect(viewModel.canUnrelateObjectives).toBeObservable();
                });

                describe('when all related objectives is unselected', function () {

                    it('should be false', function () {
                        viewModel.relatedObjectives([
                            { id: '0', isSelected: ko.observable(false) },
                            { id: '1', isSelected: ko.observable(false) },
                            { id: '2', isSelected: ko.observable(false) }
                        ]);

                        expect(viewModel.canUnrelateObjectives()).toBeFalsy();
                    });

                });

                describe('when one of related objectives is selected', function () {

                    it('should be true', function () {
                        viewModel.relatedObjectives([
                            { id: '0', isSelected: ko.observable(true) },
                            { id: '1', isSelected: ko.observable(false) },
                            { id: '2', isSelected: ko.observable(false) }
                        ]);

                        expect(viewModel.canUnrelateObjectives()).toBeTruthy();
                    });

                });

                describe('when several related objectives are selected', function () {

                    it('should be true', function () {
                        viewModel.relatedObjectives([
                            { id: '0', isSelected: ko.observable(false) },
                            { id: '1', isSelected: ko.observable(true) },
                            { id: '2', isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.canUnrelateObjectives()).toBeTruthy();
                    });

                });

            });

            describe('unrelateSelectedObjectives', function () {

                beforeEach(function () {
                    viewModel.id = 'experienceId';
                });

                it('should be a function', function () {
                    expect(viewModel.unrelateSelectedObjectives).toBeFunction();
                });

                describe('when some of related objectives is selected', function () {
                    var relatedObjectives,
                        unrelateObjectives,
                        unrelateObjectivesPromise;

                    beforeEach(function () {
                        relatedObjectives = [
                            { id: '0', isSelected: ko.observable(true) },
                            { id: '1', isSelected: ko.observable(false) },
                            { id: '2', isSelected: ko.observable(true) }
                        ];

                        viewModel.relatedObjectives(relatedObjectives);

                        unrelateObjectives = Q.defer();
                        unrelateObjectivesPromise = unrelateObjectives.promise.finally(function () { });
                        spyOn(repository, 'unrelateObjectives').andReturn(unrelateObjectives.promise);
                    });

                    it('should send event \'Unrelate objectives from experience\'', function () {
                        viewModel.unrelateSelectedObjectives();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unrelate objectives from experience');
                    });

                    it('should call repository \"unrelateObjectives\" method', function () {
                        viewModel.unrelateSelectedObjectives();
                        expect(repository.unrelateObjectives).toHaveBeenCalledWith('experienceId', ['0', '2']);
                    });

                    describe('and unrelate objectives succeed', function () {

                        beforeEach(function () {
                            unrelateObjectives.resolve('modified date');
                        });

                        it('should call \'notify.info\' function', function () {
                            viewModel.unrelateSelectedObjectives();

                            waitsFor(function () {
                                return !unrelateObjectivesPromise.isPending();
                            });

                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should update related objectives', function () {
                            viewModel.unrelateSelectedObjectives();

                            waitsFor(function () {
                                return !unrelateObjectivesPromise.isPending();
                            });

                            runs(function () {
                                expect(viewModel.relatedObjectives().length).toBe(1);
                                expect(viewModel.relatedObjectives()[0].id).toBe('1');
                            });
                        });

                        it('should update modified on date', function () {
                            viewModel.unrelateSelectedObjectives();

                            waitsFor(function () {
                                return !unrelateObjectivesPromise.isPending();
                            });

                            runs(function () {
                                expect(viewModel.modifiedOn()).toBe('modified date');
                            });
                        });

                    });

                });

            });

        });

    });