define(['viewmodels/objectives/objectives'],
    function (viewModel) {
        "use strict";

        var
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            objectiveRepository = require('repositories/objectiveRepository'),
            experienceRepository = require('repositories/experienceRepository'),
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

                it('should be observable', function() {
                    expect(viewModel.objectives).toBeObservable();
                });

            });

            describe('currentLanguage:', function() {

                it('should be defined', function() {
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

            describe('navigateToExperiences', function () {

                it('should be a function', function () {
                    expect(viewModel.navigateToExperiences).toBeFunction();
                });

                it('should send event \'Navigate to Experiences\'', function () {
                    viewModel.navigateToExperiences();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to Experiences');
                });

                it('should navigate to #/experiences', function () {
                    viewModel.navigateToExperiences();
                    expect(router.navigate).toHaveBeenCalledWith('experiences');
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
                    getExperiencesDeferred;

                beforeEach(function() {
                    getObjectivesDeferred = Q.defer();
                    getExperiencesDeferred = Q.defer();

                    spyOn(objectiveRepository, 'getCollection').andReturn(getObjectivesDeferred.promise);
                    spyOn(experienceRepository, 'getCollection').andReturn(getExperiencesDeferred.promise);
                });
                
                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    var promise = viewModel.activate();
                    expect(promise).toBePromise();
                });

                describe('when get objectives collection', function () {

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

                                    it('should set modifiedOn for each objective', function() {
                                        getExperiencesDeferred.resolve([]);
                                        getObjectivesDeferred.resolve([objectiveItem]);

                                        var promise = viewModel.activate();
                                        waitsFor(function () {
                                            return !promise.isPending();
                                        });
                                        runs(function () {
                                            expect(promise).toBeResolved();
                                            expect(viewModel.objectives()[0].modifiedOn).toBe(objectiveItem.modifiedOn);
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
                                
                                it('should sort objectives collection desc by created on', function () {
                                    getObjectivesDeferred.resolve(objectivesCollection);
                                    getExperiencesDeferred.resolve([]);

                                    var promise = viewModel.activate();
                                    waitsFor(function () {
                                        return !promise.isPending();
                                    });
                                    runs(function () {
                                        expect(promise).toBeResolved();
                                        expect(viewModel.objectives()).toBeSortedDesc('createdOn');
                                    });
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

                        it('should show error notification', function() {
                            viewModel.deleteSelectedObjectives();
                            expect(notify.error).toHaveBeenCalled();
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
                        
                        it('should hide notification', function () {
                            spyOn(notify, 'hide');
                            viewModel.deleteSelectedObjectives();
                            expect(notify.hide).toHaveBeenCalled();
                        });
                    });
                });
                
            });
        });
    }
);