define(['viewmodels/experiences/define'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/experienceRepository'),
            objectiveRepository = require('repositories/objectiveRepository'),
            templateRepository = require('repositories/templateRepository'),
            notify = require('notify'),
            clientContext = require('clientContext');

        describe('viewModel [define]', function () {
            var
                template = {
                    id: 'template id',
                    name: 'template name',
                    image: 'template image'
                },
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
                    template: template
                }
            ;

            beforeEach(function () {
                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
                spyOn(notify, 'info');
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

                describe('when get objectives', function () {
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

                    it('should show hint popup', function () {
                        spyOn(viewModel.hintPopup, 'show');

                        viewModel.startAppendingObjectives();

                        waitsFor(function () {
                            return !getObjectivesPromise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.hintPopup.show).toHaveBeenCalled();
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

                        it('should hide hint popup', function () {
                            spyOn(viewModel.hintPopup, 'hide');
                            viewModel.finishAppendingObjectives();
                            expect(viewModel.hintPopup.hide).toHaveBeenCalled();
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

                            it('should set objectivesMode to \'display\'', function () {
                                viewModel.finishAppendingObjectives();

                                waitsFor(function () {
                                    return !relateObjectivesPromise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.objectivesMode()).toBe('display');
                                });
                            });

                            it('should hide hint popup', function () {
                                spyOn(viewModel.hintPopup, 'hide');
                                viewModel.finishAppendingObjectives();

                                waitsFor(function () {
                                    return !relateObjectivesPromise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.hintPopup.hide).toHaveBeenCalled();
                                });
                            });

                        });

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

            describe('unrelateSelectedObjectives:', function () {

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
                        var objectives = _.filter(viewModel.relatedObjectives(), function (item) {
                            return item.isSelected();
                        });
                        viewModel.unrelateSelectedObjectives();
                        expect(repository.unrelateObjectives).toHaveBeenCalledWith('experienceId', objectives);
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

                    });

                });

            });

            describe('hintPopup:', function () {

                it('should be object', function () {
                    expect(viewModel.hintPopup).toBeObject();
                });

                describe('displayed:', function () {

                    it('should be observable', function () {
                        expect(viewModel.hintPopup.displayed).toBeObservable();
                    });

                });

                describe('show:', function () {

                    it('should be function', function () {
                        expect(viewModel.hintPopup.show).toBeFunction();
                    });

                    var clientContextGetSpy;

                    beforeEach(function () {
                        clientContextGetSpy = spyOn(clientContext, 'get');
                    });

                    it('should call clientContext.get function', function () {
                        viewModel.hintPopup.show();
                        expect(clientContext.get).toHaveBeenCalledWith('showRelateObjectivesHintPopup');
                    });

                    beforeEach(function () {
                        viewModel.hintPopup.displayed(false);
                    });

                    describe('when \'showRelateObjectivesHintPopup\' value from clientContext is false', function () {

                        it('should not set \'displayed\' property to true', function () {
                            clientContextGetSpy.andReturn(false);
                            viewModel.hintPopup.show();
                            expect(viewModel.hintPopup.displayed()).toBeFalsy();
                        });

                    });

                    describe('when \'showRelateObjectivesHintPopup\' value from clientContext is null', function () {

                        it('should set \'displayed\' property to true', function () {
                            clientContextGetSpy.andReturn(null);
                            viewModel.hintPopup.show();
                            expect(viewModel.hintPopup.displayed()).toBeTruthy();
                        });

                    });

                    describe('when \'showRelateObjectivesHintPopup\' value from clientContext is true', function () {

                        it('should set \'displayed\' property to true', function () {
                            clientContextGetSpy.andReturn(true);
                            viewModel.hintPopup.show();
                            expect(viewModel.hintPopup.displayed()).toBeTruthy();
                        });

                    });

                });

                describe('hide:', function () {

                    it('should be function', function () {
                        expect(viewModel.hintPopup.hide).toBeFunction();
                    });

                    it('should set \'displayed\' to false', function () {
                        viewModel.hintPopup.displayed(true);
                        viewModel.hintPopup.hide();
                        expect(viewModel.hintPopup.displayed()).toBeFalsy();
                    });

                });

                describe('close:', function () {

                    it('should be function', function () {
                        expect(viewModel.hintPopup.close).toBeFunction();
                    });

                    it('should set \'displayed\' property to false', function () {
                        viewModel.hintPopup.displayed(true);
                        viewModel.hintPopup.close();

                        expect(viewModel.hintPopup.displayed()).toBeFalsy();
                    });

                    it('should set \'showRelateObjectivesHintPopup\' value from clientContext to false', function () {
                        spyOn(clientContext, 'set');
                        viewModel.hintPopup.close();
                        expect(clientContext.set).toHaveBeenCalledWith('showRelateObjectivesHintPopup', false);
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
                        getById.resolve();
                    });

                    it('should navigate to #404 ', function () {
                        var promise = viewModel.activate('experienceId');

                        waitsFor(function () {
                            return promise.isFulfilled();
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

                    it('should hide hint popup', function () {

                        viewModel.hintPopup.displayed(true);

                        var promise = viewModel.activate(experience.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.hintPopup.displayed()).toBeFalsy();
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

                    it('should set current experience id as the last visited to client context', function () {
                        spyOn(clientContext, 'set');
                        var promise = viewModel.activate(experience.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(clientContext.set).toHaveBeenCalledWith('lastVistedExperience', experience.id);
                        });
                    });

                    it('should set current experience objectives sorted by title ascending', function () {
                        viewModel.relatedObjectives(null);

                        var promise = viewModel.activate(experience.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.relatedObjectives().length).toEqual(4);
                            expect(viewModel.relatedObjectives()).toBeSortedAsc('title');
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
