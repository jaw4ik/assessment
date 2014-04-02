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
            localizationManager = require('localization/localizationManager');


        describe('viewModel [objectives]', function () {

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('objectives:', function () {

                it('should be observable', function () {
                    expect(viewModel.objectives).toBeObservable();
                });

            });

            describe('currentLanguage:', function () {

                it('should be defined', function () {
                    expect(viewModel.currentLanguage).toBeDefined();
                });

            });

            describe('navigateToCreation', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCreation).toBeFunction();
                });

                it('should send event \'Navigate to Objective creation\'', function () {
                    viewModel.navigateToCreation();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective creation');
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
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Objective details');
                });

                it('should navigate to #/objective/{id}', function () {
                    var objectiveId = 1;
                    viewModel.navigateToDetails({ id: objectiveId });
                    expect(router.navigate).toHaveBeenCalledWith('objective/' + objectiveId);
                });

            });

            describe('navigateToCourses', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToCourses).toBeFunction();
                });

                it('should send event \'Navigate to Courses\'', function () {
                    viewModel.navigateToCourses();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Courses');
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

                beforeEach(function () {
                    getObjectivesDeferred = Q.defer();
                    getCoursesDeferred = Q.defer();

                    spyOn(objectiveRepository, 'getCollection').and.returnValue(getObjectivesDeferred.promise);
                    spyOn(courseRepository, 'getCollection').and.returnValue(getCoursesDeferred.promise);
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

                    var objectiveItem = { id: '1', title: 'z', image: '', questions: [{ id: 0 }, { id: 1 }], modifiedOn: 'some date' };
                    var objectivesCollection = [
                        objectiveItem,
                        { id: '2', title: 'a', image: '', questions: [{}, {}] },
                        { id: '3', title: 'A', image: '', questions: [{}, {}] },
                        { id: '4', title: 'c', image: '', questions: [{}, {}] },
                        { id: '5', title: 'B', image: '', questions: [{}, {}] }
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
                                    expect(viewModel.objectives().length).toBe(objectivesCollection.length);
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
                                    expect(viewModel.objectives()[0].title).toBe(objectiveItem.title);
                                    done();
                                });
                            });

                            it('should set image for each objective', function (done) {
                                getCoursesDeferred.resolve([]);
                                getObjectivesDeferred.resolve([objectiveItem]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives()[0].image).toBe(objectiveItem.image);
                                    done();
                                });
                            });

                            it('should set modifiedOn for each objective', function (done) {
                                getCoursesDeferred.resolve([]);
                                getObjectivesDeferred.resolve([objectiveItem]);

                                var promise = viewModel.activate();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    expect(viewModel.objectives()[0].modifiedOn).toBe(objectiveItem.modifiedOn);
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
                                    getObjectivesDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [{ id: 0 }, { id: 1 }] }]);

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
                                        getObjectivesDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [] }]);

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
                                        getObjectivesDeferred.resolve([{ id: '1', title: 'z', image: '', questions: [] }]);

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
        });
    }
);