define(['viewmodels/experiences/define'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/experienceRepository'),
            objectiveRepository = require('repositories/objectiveRepository'),
            notify = require('notify'),
            clientContext = require('clientContext');

        describe('viewModel [define]', function () {
            var
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
                    template: {}
                }
            ;

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
                spyOn(notify, 'info');
                spyOn(notify, 'error');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('isEditing:', function () {

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

                var updateTitle;

                beforeEach(function () {
                    viewModel.title(experience.title);
                    viewModel.startEditTitle();

                    updateTitle = Q.defer();

                    spyOn(repository, 'updateExperienceTitle').andReturn(updateTitle.promise);
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

                    var newTitle = 'Valid title';

                    beforeEach(function () {
                        viewModel.title(newTitle);
                    });

                    describe('and when title was changed', function () {
                        beforeEach(function () {
                            viewModel.originalTitle = "original title";
                        });

                        it('should send event \'Update experience title\'', function () {
                            viewModel.endEditTitle();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Update experience title');
                        });

                        it('should update experience in repository', function () {
                            viewModel.endEditTitle();
                            expect(repository.updateExperienceTitle).toHaveBeenCalled();
                        });

                        describe('and when experience updated successfully', function () {

                            var updatedExperience = { title: newTitle, templateId: "0", modifiedOn: new Date() };
                            beforeEach(function () {
                                updateTitle.resolve(updatedExperience.modifiedOn);
                            });

                            it('should update notificaion', function () {
                                viewModel.endEditTitle();

                                var promise = updateTitle.promise.fin(function () { });

                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(notify.info).toHaveBeenCalled();
                                });
                            });
                        });

                        it('should set isEditing to false', function () {
                            viewModel.isEditing(true);
                            viewModel.endEditTitle();
                            expect(viewModel.isEditing()).toBeFalsy();
                        });

                    });

                    describe('and when title was not changed', function () {
                        beforeEach(function () {
                            viewModel.originalTitle = newTitle;
                        });

                        it('should not update experience in repository', function () {
                            viewModel.endEditTitle();
                            expect(repository.updateExperienceTitle).not.toHaveBeenCalled();
                        });

                        it('should not send event \'Update experience title\'', function () {
                            viewModel.endEditTitle();
                            expect(eventTracker.publish).not.toHaveBeenCalledWith('Update experience title');
                        });

                        it('should set isEditing to false', function () {
                            viewModel.isEditing(true);
                            viewModel.endEditTitle();
                            expect(viewModel.isEditing()).toBeFalsy();
                        });
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
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to objective details');
                });

                it('should navigate', function () {
                    var objectiveId = 1;
                    viewModel.navigateToObjectiveDetails({ id: objectiveId });
                    expect(router.navigate).toHaveBeenCalled();
                });

            });

            describe('navigateToCreateObjective', function () {

                it('should be function', function () {
                    expect(viewModel.navigateToCreateObjective).toBeFunction();
                });

                it('should send event \'Navigate to create objective\'', function () {
                    viewModel.navigateToCreateObjective();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to create objective');
                });

                it('should navigate', function () {
                    viewModel.navigateToCreateObjective();
                    expect(router.navigate).toHaveBeenCalled();
                });

            });

            describe('toggleObjectiveSelection:', function () {

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

            describe('objectivesMode:', function () {

                it('should be observable', function () {
                    expect(viewModel.objectivesMode).toBeObservable();
                });

            });

            describe('showAllAvailableObjectives:', function () {

                it('should be function', function () {
                    expect(viewModel.showAllAvailableObjectives).toBeFunction();
                });

                describe('when objectivesMode is appending', function () {

                    beforeEach(function () {
                        viewModel.objectivesMode('appending');
                    });

                    it('should not send event \'Show all available objectives\'', function () {
                        viewModel.showAllAvailableObjectives();
                        expect(eventTracker.publish).not.toHaveBeenCalledWith('Show all available objectives');
                    });

                    it('should not get objectives from repository', function () {
                        spyOn(objectiveRepository, 'getCollection').andReturn(Q.defer().promise);

                        viewModel.showAllAvailableObjectives();
                        expect(objectiveRepository.getCollection).not.toHaveBeenCalled();
                    });

                });

                describe('when objectivesMode is not appending', function () {

                    var
                        getObjectivesDefer,
                        getObjectivesPromise;

                    beforeEach(function () {
                        getObjectivesDefer = Q.defer();
                        getObjectivesPromise = getObjectivesDefer.promise.fin(function () { });

                        spyOn(objectiveRepository, 'getCollection').andReturn(getObjectivesDefer.promise);

                        viewModel.objectivesMode('display');
                    });

                    it('should send event \'Show all available objectives\'', function () {
                        viewModel.showAllAvailableObjectives();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Show all available objectives');
                    });

                    it('should get objectives from repository', function () {
                        viewModel.showAllAvailableObjectives();
                        expect(objectiveRepository.getCollection).toHaveBeenCalled();
                    });

                    describe('when get objectives', function () {

                        beforeEach(function () {
                            getObjectivesDefer.resolve([{ id: '0', title: 'B' }, { id: '1', title: 'A' }]);
                        });

                        describe('and experience does not have related objectives', function () {

                            it('should set all objectives as available', function () {
                                viewModel.connectedObjectives([]);

                                viewModel.showAllAvailableObjectives();

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
                                viewModel.connectedObjectives([{ id: '0', title: 'B', isSelected: ko.observable(false) }]);

                                viewModel.showAllAvailableObjectives();

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
                            viewModel.showAllAvailableObjectives();

                            waitsFor(function () {
                                return !getObjectivesPromise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.objectivesMode()).toBe('appending');
                            });
                        });

                        it('should sort available objectives by title', function () {
                            viewModel.showAllAvailableObjectives();

                            waitsFor(function () {
                                return !getObjectivesPromise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.availableObjectives()).toBeSortedAsc('title');
                            });
                        });

                    });

                });
            });

            describe('showConnectedObjectives:', function () {

                it('should be function', function () {
                    expect(viewModel.showConnectedObjectives).toBeFunction();
                });

                describe('when objectivesMode is display', function () {

                    beforeEach(function () {
                        viewModel.objectivesMode('display');
                    });

                    it('should send event \'Show connected objectives\'', function () {
                        viewModel.showConnectedObjectives();
                        expect(eventTracker.publish).not.toHaveBeenCalledWith('Show connected objectives');
                    });

                });

                describe('when objectivesMode is not display', function () {

                    beforeEach(function () {
                        viewModel.objectivesMode('appending');
                    });

                    it('should send event \'Show connected objectives\'', function () {
                        viewModel.showConnectedObjectives();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Show connected objectives');
                    });

                    it('should set isSelected property to false for every item in connectedObjectives collection', function () {
                        viewModel.connectedObjectives([{ isSelected: ko.observable(false) }, { isSelected: ko.observable(true) }]);
                        viewModel.showConnectedObjectives();
                        expect(viewModel.connectedObjectives()[0].isSelected()).toBeFalsy();
                        expect(viewModel.connectedObjectives()[1].isSelected()).toBeFalsy();
                    });

                    it('should change objectivesMode to \'display\' ', function () {
                        viewModel.showConnectedObjectives();
                        expect(viewModel.objectivesMode()).toBe('display');
                    });

                });
            });

            describe('connectObjectives:', function () {
                it('should be function', function () {
                    expect(viewModel.connectObjectives).toBeFunction();
                });

                it('should send event \'Connect selected objectives to experience\'', function () {
                    viewModel.connectObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Connect selected objectives to experience');
                });

                describe('and no objectives selected', function () {

                    beforeEach(function () {
                        var objectivesList = [
                                { isSelected: ko.observable(false) }
                        ];
                        viewModel.availableObjectives(objectivesList);
                        viewModel.connectedObjectives([]);
                        spyOn(repository, 'relateObjectives');
                    });

                    it('should not call repository relateObjectives method', function () {
                        viewModel.connectObjectives();
                        expect(repository.relateObjectives).not.toHaveBeenCalled();
                    });

                    it('should not affect related objectives', function () {
                        viewModel.showConnectedObjectives();
                        expect(viewModel.connectedObjectives().length).toBe(0);
                    });
                });

                describe('and there are objectives selected', function () {
                    var availableObjectives,
                        relateObjectivesDefer,
                        relateObjectivesPromise;

                    var selectedObjective = { id: '2', title: 'D' },
                        notSelectedObjective = { id: '3', title: 'B' };
                    beforeEach(function () {
                        availableObjectives = [
                            { isSelected: ko.observable(true), _original: selectedObjective },
                            { isSelected: ko.observable(false), _original: notSelectedObjective }
                        ];
                        viewModel.availableObjectives(availableObjectives);
                        viewModel.connectedObjectives([]);

                        relateObjectivesDefer = Q.defer();
                        relateObjectivesPromise = relateObjectivesDefer.promise.fin(function () { });
                        spyOn(repository, 'relateObjectives').andReturn(relateObjectivesDefer.promise);
                    });

                    it('should call relateObjectives repository function with selected objectives', function () {
                        viewModel.connectObjectives();
                        expect(repository.relateObjectives).toHaveBeenCalledWith(viewModel.id, [selectedObjective]);
                    });

                    describe('and objectives were connected successfully', function () {

                        it('should call \'notify.info\' function', function () {
                            relateObjectivesDefer.resolve({ modifiedOn: new Date(), relatedObjectives: [] });

                            viewModel.connectObjectives();

                            waitsFor(function () {
                                return !relateObjectivesPromise.isPending();
                            });
                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should update related objectives', function () {
                            availableObjectives = [
                               { isSelected: ko.observable(true), _original: selectedObjective },
                               { isSelected: ko.observable(false), _original: notSelectedObjective },
                               { isSelected: ko.observable(true), _original: { id: '3', title: 'E' } }
                            ];
                            viewModel.availableObjectives(availableObjectives);

                            relateObjectivesDefer.resolve({ modifiedOn: new Date(), relatedObjectives: [selectedObjective] });

                            viewModel.connectObjectives();

                            waitsFor(function () {
                                return !relateObjectivesPromise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.connectedObjectives().length).toBe(1);
                                expect(viewModel.connectedObjectives()[0].id).toBe(selectedObjective.id);
                            });
                        });

                        it('should remove connected objectives from available objectives collection', function () {

                            relateObjectivesDefer.resolve({ modifiedOn: new Date(), relatedObjectives: [] });

                            viewModel.connectObjectives();

                            waitsFor(function () {
                                return !relateObjectivesPromise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.availableObjectives().length).toBe(1);
                                expect(viewModel.availableObjectives()[0]._original).toBe(notSelectedObjective);
                            });
                        });

                        describe('and when selected objectives count differs from successfully connected objectives count', function () {
                            it('shoul show error notification', function () {
                                relateObjectivesDefer.resolve({ modifiedOn: new Date(), relatedObjectives: [] });

                                viewModel.connectObjectives();

                                waitsFor(function () {
                                    return !relateObjectivesPromise.isPending();
                                });
                                runs(function () {
                                    expect(notify.error).toHaveBeenCalled();
                                });
                            });
                        });

                    });

                });
            });

            describe('connectedObjectives:', function () {

                it('should be observable', function () {
                    expect(viewModel.connectedObjectives).toBeObservable();
                });

            });

            describe('availableObjectives:', function () {

                it('should be observable', function () {
                    expect(viewModel.availableObjectives).toBeObservable();
                });

            });

            describe('canDisconnectObjectives:', function () {

                it('should be computed', function () {
                    expect(viewModel.canDisconnectObjectives).toBeComputed();
                });

                describe('when all related objectives are unselected', function () {

                    it('should be false', function () {
                        viewModel.connectedObjectives([
                            { id: '0', isSelected: ko.observable(false) },
                            { id: '1', isSelected: ko.observable(false) },
                            { id: '2', isSelected: ko.observable(false) }
                        ]);

                        expect(viewModel.canDisconnectObjectives()).toBeFalsy();
                    });

                });

                describe('when one of related objectives are selected', function () {

                    it('should be true', function () {
                        viewModel.connectedObjectives([
                            { id: '0', isSelected: ko.observable(true) },
                            { id: '1', isSelected: ko.observable(false) },
                            { id: '2', isSelected: ko.observable(false) }
                        ]);

                        expect(viewModel.canDisconnectObjectives()).toBeTruthy();
                    });

                });

                describe('when several related objectives are selected', function () {

                    it('should be true', function () {
                        viewModel.connectedObjectives([
                            { id: '0', isSelected: ko.observable(false) },
                            { id: '1', isSelected: ko.observable(true) },
                            { id: '2', isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.canDisconnectObjectives()).toBeTruthy();
                    });

                });

            });

            describe('canConnectObjectives:', function () {

                it('should be computed', function () {
                    expect(viewModel.canConnectObjectives).toBeComputed();
                });

                describe('when no available objectives are selected', function () {
                    it('should be false', function () {
                        viewModel.availableObjectives([
                            { id: '0', isSelected: ko.observable(false) },
                            { id: '1', isSelected: ko.observable(false) },
                            { id: '2', isSelected: ko.observable(false) }
                        ]);

                        expect(viewModel.canConnectObjectives()).toBeFalsy();
                    });
                });

                describe('when one available objective is selected', function () {
                    it('should be true', function () {
                        viewModel.availableObjectives([
                            { id: '0', isSelected: ko.observable(true) },
                            { id: '1', isSelected: ko.observable(false) },
                            { id: '2', isSelected: ko.observable(false) }
                        ]);

                        expect(viewModel.canConnectObjectives()).toBeTruthy();
                    });
                });

                describe('when several available objectives are selected', function () {
                    it('should be true', function () {
                        viewModel.availableObjectives([
                            { id: '0', isSelected: ko.observable(false) },
                            { id: '1', isSelected: ko.observable(true) },
                            { id: '2', isSelected: ko.observable(true) }
                        ]);

                        expect(viewModel.canConnectObjectives()).toBeTruthy();
                    });
                });
            });

            describe('disconnectSelectedObjectives:', function () {

                beforeEach(function () {
                    viewModel.id = 'experienceId';
                });

                it('should be a function', function () {
                    expect(viewModel.disconnectSelectedObjectives).toBeFunction();
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

                        viewModel.connectedObjectives(relatedObjectives);

                        unrelateObjectives = Q.defer();
                        unrelateObjectivesPromise = unrelateObjectives.promise.finally(function () { });
                        spyOn(repository, 'unrelateObjectives').andReturn(unrelateObjectives.promise);
                    });

                    it('should send event \'Unrelate objectives from experience\'', function () {
                        viewModel.disconnectSelectedObjectives();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Unrelate objectives from experience');
                    });

                    it('should call repository \"unrelateObjectives\" method', function () {
                        var objectives = _.filter(viewModel.connectedObjectives(), function (item) {
                            return item.isSelected();
                        });
                        viewModel.disconnectSelectedObjectives();
                        expect(repository.unrelateObjectives).toHaveBeenCalledWith('experienceId', objectives);
                    });

                    describe('and unrelate objectives succeed', function () {

                        beforeEach(function () {
                            unrelateObjectives.resolve(new Date());
                        });

                        it('should call \'notify.info\' function', function () {
                            viewModel.disconnectSelectedObjectives();

                            waitsFor(function () {
                                return !unrelateObjectivesPromise.isPending();
                            });

                            runs(function () {
                                expect(notify.info).toHaveBeenCalled();
                            });
                        });

                        it('should update related objectives', function () {
                            viewModel.disconnectSelectedObjectives();

                            waitsFor(function () {
                                return !unrelateObjectivesPromise.isPending();
                            });

                            runs(function () {
                                expect(viewModel.connectedObjectives().length).toBe(1);
                                expect(viewModel.connectedObjectives()[0].id).toBe('1');
                            });
                        });

                    });

                });

            });

            describe('activate:', function () {

                var getById;

                beforeEach(function () {
                    getById = Q.defer();
                    spyOn(repository, 'getById').andReturn(getById.promise);
                });

                it('should get experience from repository', function () {
                    var id = 'experienceId';
                    viewModel.activate(id);
                    expect(repository.getById).toHaveBeenCalledWith(id);
                });

                describe('when experience does not exist', function () {

                    beforeEach(function () {
                        getById.reject();
                    });

                    it('should navigate to #404 ', function () {
                        var promise = viewModel.activate('experienceId');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.replace).toHaveBeenCalledWith('404');
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = viewModel.activate('experienceId');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

                describe('when experience exists', function () {

                    beforeEach(function () {
                        getById.resolve(experience);
                    });

                    it('should set current experience id', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(experience.id);

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

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.title()).toEqual(experience.title);
                        });
                    });

                    it('should display related objectives', function () {
                        viewModel.objectivesMode('appending');
                        var promise = viewModel.activate(experience.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.objectivesMode()).toBe('display');
                        });
                    });

                    it('should set current experience objectives sorted by title ascending', function () {
                        viewModel.connectedObjectives(null);

                        var promise = viewModel.activate(experience.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.connectedObjectives().length).toEqual(4);
                            expect(viewModel.connectedObjectives()).toBeSortedAsc('title');
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = viewModel.activate(experience.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

            });

        });

    });
