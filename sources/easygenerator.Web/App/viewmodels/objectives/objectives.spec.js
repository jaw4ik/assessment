define(['viewmodels/objectives/objectives'],
    function (viewModel) {
        "use strict";

        var
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            objectiveRepository = require('repositories/objectiveRepository'),
            courseRepository = require('repositories/courseRepository'),
            notify = require('notify'),
            localizationManager = require('localization/localizationManager'),
            userContext = require('userContext'),
            imageUpload = require('imageUpload'),
            createObjectiveCommand = require('commands/createObjectiveCommand')
        ;


        describe('viewModel [objectives]', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(createObjectiveCommand, 'execute');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('objectives:', function () {

                it('should be observable', function () {
                    expect(viewModel.objectives).toBeObservable();
                });

            });

            describe('updateObjectiveImage:', function () {

                it('should be function', function () {
                    expect(viewModel.updateObjectiveImage).toBeFunction();
                });

                it('should send event \'Open "change objective image" dialog\'', function () {
                    spyOn(imageUpload, 'upload');
                    viewModel.updateObjectiveImage();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Open "change objective image" dialog');
                });

                it('should upload image', function () {
                    spyOn(imageUpload, 'upload');
                    viewModel.updateObjectiveImage();
                    expect(imageUpload.upload).toHaveBeenCalled();
                });

                var objective = {
                    id: 'some_objective_id',
                    imageUrl: ko.observable(''),
                    isImageLoading: ko.observable(false),
                    modifiedOn: ko.observable(new Date())
                };

                describe('when image loading started', function () {

                    beforeEach(function () {
                        spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                            spec.startLoading();
                        });
                    });

                    it('should set isImageLoading to true', function () {
                        objective.isImageLoading(false);
                        viewModel.updateObjectiveImage(objective);
                        expect(objective.isImageLoading()).toBeTruthy();
                    });

                });

                describe('when image was uploaded', function () {

                    var url = 'http://url.com', updateImageDefer;
                    beforeEach(function () {
                        spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                            spec.success(url);
                        });

                        updateImageDefer = Q.defer();
                        spyOn(objectiveRepository, 'updateImage').and.returnValue(updateImageDefer.promise);
                    });

                    it('should update objective image', function () {
                        viewModel.updateObjectiveImage(objective);
                        expect(objectiveRepository.updateImage).toHaveBeenCalledWith(objective.id, url);
                    });

                    describe('and when objective image updated successfully', function () {

                        var lastModifiedDate = new Date(), newUrl = 'new/image/url';
                        beforeEach(function () {
                            updateImageDefer.resolve({
                                modifiedOn: lastModifiedDate,
                                imageUrl: newUrl
                            });
                        });

                        it('should set imageUrl', function (done) {
                            objective.imageUrl('');
                            viewModel.updateObjectiveImage(objective);

                            updateImageDefer.promise.fin(function () {
                                expect(objective.imageUrl()).toBe(newUrl);
                                done();
                            });
                        });

                        it('should update modifiedOn date', function () {
                            objective.modifiedOn(0);
                            viewModel.updateObjectiveImage(objective);

                            updateImageDefer.promise.fin(function () {
                                expect(objective.modifiedOn()).toBe(lastModifiedDate);
                                done();
                            });
                        });

                        it('should set isImageLoading to false', function (done) {
                            objective.isImageLoading(true);
                            viewModel.updateObjectiveImage(objective);

                            updateImageDefer.promise.fin(function () {
                                expect(objective.isImageLoading()).toBeFalsy();
                                done();
                            });
                        });

                        it('should send event \'Change objective image\'', function (done) {
                            viewModel.updateObjectiveImage(objective);

                            updateImageDefer.promise.fin(function () {
                                expect(eventTracker.publish).toHaveBeenCalledWith('Change objective image');
                                done();
                            });
                        });

                        it('should update notificaion', function (done) {
                            spyOn(notify, 'saved');
                            viewModel.updateObjectiveImage(objective);

                            updateImageDefer.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                });

                describe('when image loading failed', function () {

                    beforeEach(function () {
                        spyOn(imageUpload, 'upload').and.callFake(function (spec) {
                            spec.error();
                        });
                    });

                    it('should set isImageLoading to false', function () {
                        objective.isImageLoading(true);
                        viewModel.updateObjectiveImage(objective);
                        expect(objective.isImageLoading()).toBeFalsy();
                    });

                });

            });

            describe('currentLanguage:', function () {

                it('should be defined', function () {
                    expect(viewModel.currentLanguage).toBeDefined();
                });

            });

            describe('createObjective', function () {

                it('should be a function', function () {
                    expect(viewModel.createObjective).toBeFunction();
                });

                it('should execute create objective command', function () {
                    viewModel.createObjective();
                    expect(createObjectiveCommand.execute).toHaveBeenCalled();
                });
            });

            describe('navigateToDetails', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToDetails).toBeFunction();
                });

                it('should send event \'Navigate to objective details\'', function () {
                    viewModel.navigateToDetails({ id: 1 });
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details');
                });

                it('should navigate to #/objective/{id}', function () {
                    var objectiveId = 1;
                    viewModel.navigateToDetails({ id: objectiveId });
                    expect(router.navigate).toHaveBeenCalledWith('library/objectives/' + objectiveId);
                });

            });

            describe('navigateToCourses', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCourses).toBeFunction();
                });

                it('should send event \'Navigate to courses\'', function () {
                    viewModel.navigateToCourses();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
                });

                it('should navigate to #/courses', function () {
                    viewModel.navigateToCourses();
                    expect(router.navigate).toHaveBeenCalledWith('courses');
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
                        expect(eventTracker.publish).toHaveBeenCalledWith('Select Objective');
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
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unselect Objective');
                    });

                    it('should set objective.isSelected to false', function () {
                        var objective = { isSelected: ko.observable(true) };
                        viewModel.toggleObjectiveSelection(objective);
                        expect(objective.isSelected()).toBeFalsy();
                    });

                });
            });

            describe('activate:', function () {

                var
                    getObjectivesDeferred,
                    getCoursesDeferred;
                var createdBy = 'user';

                beforeEach(function () {
                    getObjectivesDeferred = Q.defer();
                    getCoursesDeferred = Q.defer();

                    spyOn(objectiveRepository, 'getCollection').and.returnValue(getObjectivesDeferred.promise);
                    spyOn(courseRepository, 'getCollection').and.returnValue(getCoursesDeferred.promise);
                    userContext.identity = { email: createdBy };
                });

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    var promise = viewModel.activate();
                    expect(promise).toBePromise();
                });

                it('should call objective repository getCollection', function () {
                    viewModel.activate();
                    expect(objectiveRepository.getCollection).toHaveBeenCalled();
                });

                describe('when objectives have been recieved', function () {

                    var objectiveItem = { id: '1', title: 'z', image: 'image/url', questions: [{ id: 0 }, { id: 1 }], modifiedOn: 'some date', createdBy: createdBy };
                    var objectivesCollection = [
                        objectiveItem,
                        { id: '2', title: 'a', image: '', questions: [{}, {}], createdBy: createdBy },
                        { id: '3', title: 'A', image: '', questions: [{}, {}], createdBy: createdBy },
                        { id: '4', title: 'c', image: '', questions: [{}, {}], createdBy: createdBy },
                        { id: '5', title: 'B', image: '', questions: [{}, {}], createdBy: createdBy },
                        { id: '6', title: 'D', image: '', questions: [{}, {}], createdBy: 'anonym' }
                    ];

                    beforeEach(function () {
                        viewModel.objectives([]);
                    });

                    describe('and when objective received', function () {

                        it('should call course repository getCollection', function (done) {
                            viewModel.activate();
                            getObjectivesDeferred.resolve(objectivesCollection);

                            getObjectivesDeferred.promise.fin(function () {
                                expect(courseRepository.getCollection).toHaveBeenCalled();
                                done();
                            });
                        });

                        describe('and when courses have been received', function () {

                            it('should define objectives', function (done) {
                                getObjectivesDeferred.resolve(objectivesCollection);
                                getCoursesDeferred.resolve([]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives().length).toBeGreaterThan(0);
                                    done();
                                });
                            });

                            it('should filter shared objectives', function (done) {
                                getObjectivesDeferred.resolve(objectivesCollection);
                                getCoursesDeferred.resolve([]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives().length).toBe(objectivesCollection.length - 1);
                                    done();
                                });
                            });

                            it('should set id for each objective', function (done) {
                                getObjectivesDeferred.resolve([objectiveItem]);
                                getCoursesDeferred.resolve([]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives()[0].id).toBe(objectiveItem.id);
                                    done();
                                });
                            });

                            it('should set title for each objective', function (done) {
                                getCoursesDeferred.resolve([]);
                                getObjectivesDeferred.resolve([objectiveItem]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives()[0].title()).toBe(objectiveItem.title);
                                    done();
                                });
                            });

                            it('should set imageUrl for each objective', function (done) {
                                getCoursesDeferred.resolve([]);
                                getObjectivesDeferred.resolve([objectiveItem]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives()[0].imageUrl()).toBe(objectiveItem.image);
                                    done();
                                });
                            });

                            it('should set isImageLoading for each objective', function (done) {
                                getCoursesDeferred.resolve([]);
                                getObjectivesDeferred.resolve([objectiveItem]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives()[0].isImageLoading()).toBeFalsy();
                                    done();
                                });
                            });

                            it('should set modifiedOn for each objective', function (done) {
                                getCoursesDeferred.resolve([]);
                                getObjectivesDeferred.resolve([objectiveItem]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives()[0].modifiedOn()).toBe(objectiveItem.modifiedOn);
                                    done();
                                });
                            });

                            it('should set isSelected observable to false for each objective', function (done) {
                                getCoursesDeferred.resolve([]);
                                getObjectivesDeferred.resolve([objectiveItem]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives()[0].isSelected()).toBeFalsy();
                                    done();
                                });
                            });

                            describe('when objective questions count > 0', function () {

                                it('should set canBeDeleted to false for each objective', function (done) {
                                    getCoursesDeferred.resolve([]);
                                    getObjectivesDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [{ id: 0 }, { id: 1 }], createdBy: createdBy }]);

                                    var promise = viewModel.activate();

                                    promise.fin(function () {
                                        expect(promise).toBeResolved();
                                        expect(viewModel.objectives()[0].canBeDeleted).toBeFalsy();
                                        done();
                                    });
                                });

                            });

                            describe('when objective questions count = 0', function () {

                                describe('when objectives count included to expiriences = 0', function () {

                                    it('should set canBeDeleted to true for each objective', function (done) {
                                        getCoursesDeferred.resolve([]);
                                        getObjectivesDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [], createdBy: createdBy }]);

                                        var promise = viewModel.activate();

                                        promise.fin(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives()[0].canBeDeleted).toBeTruthy();
                                            done();
                                        });
                                    });
                                });

                                describe('when objective is included to expirience', function () {

                                    it('should set canBeDeleted to false', function (done) {
                                        getCoursesDeferred.resolve([{ objectives: [{ id: '1' }] }]);
                                        getObjectivesDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [], createdBy: createdBy }]);

                                        var promise = viewModel.activate();

                                        promise.fin(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives()[0].canBeDeleted).toBeFalsy();
                                            done();
                                        });
                                    });
                                });

                            });

                            it('should sort objectives collection desc by created on', function (done) {
                                getObjectivesDeferred.resolve(objectivesCollection);
                                getCoursesDeferred.resolve([]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives()).toBeSortedDesc('createdOn');
                                    done();
                                });
                            });

                        });

                    });

                });

                it('should set currentLanguage', function () {
                    viewModel.currentLanguage = null;
                    viewModel.activate();
                    expect(viewModel.currentLanguage).toBe(localizationManager.currentLanguage);
                });

            });

            describe('enableDeleteObjectives:', function () {

                it('should be computed', function () {
                    expect(viewModel.enableDeleteObjectives).toBeComputed();
                });

                describe('when no selected objectives', function () {
                    it('should be false', function () {
                        viewModel.objectives([{ isSelected: ko.observable(false) }]);
                        expect(viewModel.enableDeleteObjectives()).toBeFalsy();
                    });
                });

                describe('when 1 objective is selected', function () {
                    it('should be true', function () {
                        viewModel.objectives([{ isSelected: ko.observable(true) }]);
                        expect(viewModel.enableDeleteObjectives()).toBeTruthy();
                    });
                });

                describe('when there are few objectives selected', function () {
                    it('should be false', function () {
                        viewModel.objectives([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                        expect(viewModel.enableDeleteObjectives()).toBeTruthy();
                    });
                });
            });

            describe('deleteSelectedObjectives:', function () {

                beforeEach(function () {
                    spyOn(notify, 'info');
                });

                it('should be function', function () {
                    expect(viewModel.deleteSelectedObjectives).toBeFunction();
                });

                it('should send event \'Delete selected objectives\'', function () {
                    viewModel.objectives([{ isSelected: ko.observable(true) }]);
                    viewModel.deleteSelectedObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected objectives');
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
                    it('should show error notification', function () {
                        viewModel.objectives([{ isSelected: ko.observable(true) }, { isSelected: ko.observable(true) }]);
                        spyOn(notify, 'error');

                        viewModel.deleteSelectedObjectives();
                        expect(notify.error).toHaveBeenCalled();
                    });
                });

                describe('when there is only 1 selected objective', function () {

                    describe('and when objective cannot be deleted', function () {
                        beforeEach(function () {
                            viewModel.objectives([{ isSelected: ko.observable(true), canBeDeleted: false }]);
                            spyOn(notify, 'error');
                        });

                        it('should send event \'Delete selected objectives\'', function () {
                            viewModel.deleteSelectedObjectives();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Delete selected objectives');
                        });

                        it('should return undefined', function () {
                            var result = viewModel.deleteSelectedObjectives();
                            expect(result).toBeUndefined();
                        });

                        it('should show error notification', function () {
                            viewModel.deleteSelectedObjectives();
                            expect(notify.error).toHaveBeenCalled();
                        });
                    });

                    describe('and when objective can be deleted', function () {
                        var deleteDeferred,
                            selectedObjective = {
                                id: 0,
                                isSelected: ko.observable(true),
                                canBeDeleted: true
                            };

                        beforeEach(function () {
                            viewModel.objectives([selectedObjective]);
                            deleteDeferred = Q.defer();
                            spyOn(objectiveRepository, 'removeObjective').and.returnValue(deleteDeferred.promise);
                        });

                        it('should delete objective in repository', function (done) {
                            deleteDeferred.resolve();

                            viewModel.deleteSelectedObjectives();

                            deleteDeferred.promise.fin(function () {
                                expect(deleteDeferred.promise).toBeResolved();
                                expect(objectiveRepository.removeObjective).toHaveBeenCalledWith(selectedObjective.id);
                                done();
                            });
                        });

                        it('should delete objective in view model', function (done) {
                            deleteDeferred.resolve();

                            viewModel.deleteSelectedObjectives();

                            deleteDeferred.promise.fin(function () {
                                expect(deleteDeferred.promise).toBeResolved();
                                expect(viewModel.objectives().length).toBe(0);
                                done();
                            });
                        });

                        it('should show saved notification', function (done) {
                            spyOn(notify, 'saved');
                            deleteDeferred.resolve();

                            viewModel.deleteSelectedObjectives();

                            deleteDeferred.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });
                });

            });

            describe('objectiveImageUpdated:', function () {

                var objectiveId = "objectiveId";
                var vmObjective = {
                    id: objectiveId,
                    title: ko.observable(""),
                    imageUrl: ko.observable(""),
                    isSelected: ko.observable(false),
                    modifiedOn: ko.observable("")
                };
                var objective = {
                    id: objectiveId,
                    title: "new title",
                    image: 'new/image/url',
                    modifiedOn: new Date()
                };

                it('should be function', function () {
                    expect(viewModel.objectiveImageUpdated).toBeFunction();
                });

                it('should update objective imageUrl', function () {
                    viewModel.objectives([vmObjective]);
                    viewModel.objectiveImageUpdated(objective);

                    expect(vmObjective.imageUrl()).toBe(objective.image);
                });

                it('should update course modified on date', function () {
                    viewModel.objectives([vmObjective]);
                    viewModel.objectiveImageUpdated(objective);

                    expect(vmObjective.modifiedOn().toISOString()).toBe(objective.modifiedOn.toISOString());
                });

            });

            describe('objectiveTitleUpdated:', function () {

                var objectiveId = "objectiveId";
                var vmObjective = {
                    id: objectiveId,
                    title: ko.observable(""),
                    isSelected: ko.observable(false),
                    modifiedOn: ko.observable("")
                };
                var objective = {
                    id: objectiveId,
                    title: "new title",
                    modifiedOn: new Date()
                };

                it('should be function', function () {
                    expect(viewModel.objectiveTitleUpdated).toBeFunction();
                });

                it('should update objective title', function () {
                    viewModel.objectives([vmObjective]);
                    viewModel.objectiveTitleUpdated(objective);

                    expect(vmObjective.title()).toBe(objective.title);
                });

                it('should update course modified on date', function () {
                    viewModel.objectives([vmObjective]);
                    viewModel.objectiveTitleUpdated(objective);

                    expect(vmObjective.modifiedOn().toISOString()).toBe(objective.modifiedOn.toISOString());
                });

            });

        });
    }
);