﻿define(['viewmodels/courses/course'], function (viewModel) {
    "use strict";

    var
        router = require('plugins/router'),
        eventTracker = require('eventTracker'),
        constants = require('constants'),
        repository = require('repositories/courseRepository'),
        objectiveRepository = require('repositories/objectiveRepository'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager'),
        clientContext = require('clientContext'),
        ping = require('ping'),
        BackButton = require('models/backButton'),
        userContext = require('userContext')
    ;

    describe('viewModel [course]', function () {
        var
            course = {
                id: '1',
                title: 'course',
                objectives: [
                    { id: '0', title: 'A' },
                    { id: '1', title: 'a' },
                    { id: '2', title: 'z' },
                    { id: '3', title: 'b' }
                ],
                packageUrl: '',
                createdOn: 'createdOn',
                createdBy: 'createdBy',
                modifiedOn: 'modifiedOn',
                builtOn: 'builtOn',
                template: {},
                introductionContent: 'intro'
            },
            identity = { email: 'email' }
        ;

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(router, 'navigate');
            spyOn(router, 'replace');
            spyOn(notify, 'info');
            spyOn(notify, 'error');
            spyOn(notify, 'saved');
            userContext.identity = identity;
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(viewModel.id).toBeDefined();
            });
        });

        describe('createdBy:', function () {
            it('should be defined', function () {
                expect(viewModel.createdBy).toBeDefined();
            });
        });

        describe('navigateToCoursesEvent:', function () {

            it('should be function', function () {
                expect(viewModel.navigateToCoursesEvent).toBeFunction();
            });

            it('should send event \'Navigate to courses\'', function () {
                viewModel.navigateToCoursesEvent();
                expect(eventTracker.publish).toHaveBeenCalledWith('Navigate to courses');
            });

        });

        describe('isEditing:', function () {

            it('should be observable', function () {
                expect(viewModel.isEditing).toBeObservable();
            });

        });

        describe('courseTitleMaxLength:', function () {

            it('should be defined', function () {
                expect(viewModel.courseTitleMaxLength).toBeDefined();
            });

            it('should equal constants.validation.courseTitleMaxLength', function () {
                expect(viewModel.courseTitleMaxLength).toEqual(constants.validation.courseTitleMaxLength);
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
                        viewModel.title(utils.createString(viewModel.courseTitleMaxLength + 1));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title('   ' + utils.createString(viewModel.courseTitleMaxLength - 1) + '   ');
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });

                describe('when title is not empty and not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title(utils.createString(viewModel.courseTitleMaxLength - 1));
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

            var updateDeferred, getByIdDeferred;

            beforeEach(function () {
                updateDeferred = Q.defer();
                getByIdDeferred = Q.defer();

                spyOn(repository, 'updateCourseTitle').and.returnValue(updateDeferred.promise);
                spyOn(repository, 'getById').and.returnValue(getByIdDeferred.promise);
            });

            it('should be function', function () {
                expect(viewModel.endEditTitle).toBeFunction();
            });

            it('should set isEditing to false', function () {
                viewModel.isEditing(true);
                viewModel.endEditTitle();
                expect(viewModel.isEditing()).toBeFalsy();
            });

            it('should trim title', function () {
                viewModel.title('    Some title     ');
                viewModel.endEditTitle();
                expect(viewModel.title()).toEqual('Some title');
            });

            describe('when title is not modified', function () {
                var promise = null;
                beforeEach(function () {
                    viewModel.title(course.title);
                    promise = getByIdDeferred.promise.finally(function () { });
                    getByIdDeferred.resolve(course);
                });

                it('should not send event', function (done) {
                    viewModel.endEditTitle();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        expect(eventTracker.publish).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should not show notification', function (done) {
                    viewModel.endEditTitle();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        expect(notify.saved).not.toHaveBeenCalled();
                        done();
                    });
                });

                it('should not update course in repository', function (done) {
                    viewModel.endEditTitle();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        expect(repository.updateCourseTitle).not.toHaveBeenCalled();
                        done();
                    });
                });
            });

            describe('when title is modified', function () {

                var getPromise = null, newTitle = course.title + 'test';
                beforeEach(function () {

                    viewModel.title(newTitle);
                    getPromise = getByIdDeferred.promise.finally(function () { });
                    getByIdDeferred.resolve(course);
                });

                it('should send event \'Update course title\'', function (done) {
                    viewModel.endEditTitle();

                    getPromise.fin(function () {
                        expect(getPromise).toBeResolved();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Update course title');
                        done();
                    });
                });

                describe('and when title is valid', function () {

                    it('should update course in repository', function (done) {
                        viewModel.endEditTitle();

                        getPromise.fin(function () {
                            expect(getPromise).toBeResolved();
                            expect(repository.updateCourseTitle).toHaveBeenCalled();
                            expect(repository.updateCourseTitle.calls.mostRecent().args[1]).toEqual(newTitle);
                            done();
                        });
                    });

                    describe('and when course updated successfully', function () {

                        it('should update notificaion', function (done) {
                            var promise = updateDeferred.promise.fin(function () { });
                            updateDeferred.resolve(new Date());

                            viewModel.endEditTitle();

                            promise.fin(function () {
                                expect(promise).toBeResolved();
                                expect(notify.saved).toHaveBeenCalled();
                                done();
                            });
                        });

                    });

                });

                describe('and when title is not valid', function () {

                    it('should revert course title value', function (done) {
                        viewModel.title('');
                        viewModel.endEditTitle();

                        getPromise.fin(function () {
                            expect(viewModel.title()).toBe(course.title);
                            done();
                        });
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

            it('should send event \'Navigate to objective details\'', function () {
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
                    spyOn(objectiveRepository, 'getCollection').and.returnValue(Q.defer().promise);

                    viewModel.showAllAvailableObjectives();
                    expect(objectiveRepository.getCollection).not.toHaveBeenCalled();
                });

            });

            describe('when objectivesMode is not appending', function () {

                var getObjectivesDefer;

                beforeEach(function () {
                    getObjectivesDefer = Q.defer();

                    spyOn(objectiveRepository, 'getCollection').and.returnValue(getObjectivesDefer.promise);

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
                        getObjectivesDefer.resolve([{ id: '0', title: 'B', createdBy: identity.email }, { id: '1', title: 'A', createdBy: identity.email }]);
                    });


                    describe('and course does not have related objectives', function () {

                        it('should set owned objectives as available', function (done) {
                            viewModel.connectedObjectives([]);

                            viewModel.showAllAvailableObjectives();

                            getObjectivesDefer.promise.fin(function () {
                                expect(viewModel.availableObjectives().length).toBe(2);
                                done();
                            });
                        });

                    });

                    describe('and course has related objectives', function (done) {

                        it('should set not related objectives as available', function () {
                            viewModel.connectedObjectives([{ id: '0', title: 'B', isSelected: ko.observable(false) }]);

                            viewModel.showAllAvailableObjectives();

                            getObjectivesDefer.promise.fin(function () {
                                expect(viewModel.availableObjectives().length).toBe(1);
                                expect(viewModel.availableObjectives()[0].id).toBe('1');
                                done();
                            });
                        });

                    });

                    it('should set objectivesMode to \'appending\'', function (done) {
                        viewModel.showAllAvailableObjectives();

                        getObjectivesDefer.promise.fin(function () {
                            expect(viewModel.objectivesMode()).toBe('appending');
                            done();
                        });
                    });

                    it('should sort available objectives by title', function (done) {
                        viewModel.showAllAvailableObjectives();

                        getObjectivesDefer.promise.fin(function () {
                            expect(viewModel.availableObjectives()).toBeSortedAsc('title');
                            done();
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

        describe('isObjectivesListReorderedByCollaborator:', function () {

            it('should be observable', function () {
                expect(viewModel.isObjectivesListReorderedByCollaborator).toBeObservable();
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
                viewModel.id = 'courseId';
            });

            it('should be a function', function () {
                expect(viewModel.disconnectSelectedObjectives).toBeFunction();
            });

            describe('when no objectives selected', function () {
                beforeEach(function () {
                    viewModel.connectedObjectives([]);
                    spyOn(repository, 'unrelateObjectives');
                });

                it('should not send event \'Unrelate objectives from course\'', function () {
                    viewModel.disconnectSelectedObjectives();
                    expect(eventTracker.publish).not.toHaveBeenCalledWith('Unrelate objectives from course');
                });

                it('should not call repository \"unrelateObjectives\" method', function () {
                    viewModel.disconnectSelectedObjectives();
                    expect(repository.unrelateObjectives).not.toHaveBeenCalled();
                });

            });

            describe('when some of related objectives is selected', function () {
                var
                    relatedObjectives,
                    unrelateObjectives
                ;

                beforeEach(function () {
                    relatedObjectives = [
                        { id: '0', isSelected: ko.observable(true) },
                        { id: '1', isSelected: ko.observable(false) },
                        { id: '2', isSelected: ko.observable(true) }
                    ];

                    viewModel.connectedObjectives(relatedObjectives);

                    unrelateObjectives = Q.defer();
                    spyOn(repository, 'unrelateObjectives').and.returnValue(unrelateObjectives.promise);
                });

                it('should send event \'Unrelate objectives from course\'', function () {
                    viewModel.disconnectSelectedObjectives();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Unrelate objectives from course');
                });

                it('should call repository \"unrelateObjectives\" method', function () {
                    var objectives = _.filter(viewModel.connectedObjectives(), function (item) {
                        return item.isSelected();
                    });
                    viewModel.disconnectSelectedObjectives();
                    expect(repository.unrelateObjectives).toHaveBeenCalledWith('courseId', objectives);
                });

                describe('and unrelate objectives succeed', function () {

                    beforeEach(function () {
                        unrelateObjectives.resolve(new Date());
                    });

                    it('should call \'notify.info\' function', function (done) {
                        viewModel.disconnectSelectedObjectives();

                        unrelateObjectives.promise.finally(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should update related objectives', function (done) {
                        viewModel.disconnectSelectedObjectives();

                        unrelateObjectives.promise.finally(function () {
                            expect(viewModel.connectedObjectives().length).toBe(1);
                            expect(viewModel.connectedObjectives()[0].id).toBe('1');
                            done();
                        });
                    });

                });

            });

        });

        describe('canActivate:', function () {

            var dfd;

            beforeEach(function () {
                dfd = Q.defer();
                spyOn(ping, 'execute').and.returnValue(dfd.promise);
            });

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.canActivate()).toBePromise();
            });

            it('should ping', function () {
                viewModel.canActivate();
                expect(ping.execute).toHaveBeenCalled();
            });

            describe('when ping failed', function () {

                beforeEach(function () {
                    dfd.reject();
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.canActivate();
                    promise.fin(function () {
                        expect(promise).toBeRejected();
                        done();
                    });
                });

            });

            describe('when ping succeed', function () {

                beforeEach(function () {
                    dfd.resolve();
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.canActivate();
                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

            });

        });

        describe('activate:', function () {

            var getById;

            beforeEach(function () {
                getById = Q.defer();
                spyOn(repository, 'getById').and.returnValue(getById.promise);
                spyOn(localizationManager, 'localize').and.returnValue('text');
            });

            it('should get course from repository', function () {
                var id = 'courseId';
                viewModel.activate(id);
                expect(repository.getById).toHaveBeenCalledWith(id);
            });

            describe('when course does not exist', function () {

                beforeEach(function () {
                    getById.reject('reason');
                });

                it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function (done) {
                    router.activeItem.settings.lifecycleData = null;

                    viewModel.activate('courseId').fin(function () {
                        expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                        done();
                    });
                });

                it('should reject promise', function (done) {
                    var promise = viewModel.activate('courseId');

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('reason');
                        done();
                    });
                });
            });

            describe('when course exists', function () {

                beforeEach(function () {
                    getById.resolve(course);
                    spyOn(clientContext, 'set');
                });

                it('should set current course id', function (done) {
                    viewModel.id = undefined;

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.id).toEqual(course.id);
                        done();
                    });
                });

                it('should set createdBy', function (done) {
                    viewModel.id = undefined;

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.createdBy).toEqual(course.createdBy);
                        done();
                    });
                });

                it('should set current course title', function (done) {
                    viewModel.title('');

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.title()).toEqual(course.title);
                        done();
                    });
                });

                it('should display related objectives', function (done) {
                    viewModel.objectivesMode('appending');

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.objectivesMode()).toBe('display');
                        done();
                    });
                });

                it('should set current course objectives', function (done) {
                    viewModel.connectedObjectives([]);

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.connectedObjectives().length).toEqual(4);
                        done();
                    });
                });

                it('should resolve promise', function (done) {
                    var promise = viewModel.activate(course.id);

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

                it('should set course id as the last visited in client context', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastVistedCourse', course.id);
                        done();
                    });
                });

                it('should reset last visited objective in client context', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith('lastVisitedObjective', null);
                        done();
                    });
                });

            });

        });

        describe('courseIntroductionContent:', function () {

            it('should be object', function () {
                expect(viewModel.courseIntroductionContent).toBeObject();
            });

        });

        describe('reorderObjectives:', function () {

            var
                relatedObjectives,
                updateObjectiveOrderDefer
            ;

            beforeEach(function () {
                relatedObjectives = [
                    { id: '0', isSelected: ko.observable(true) },
                    { id: '1', isSelected: ko.observable(false) },
                    { id: '2', isSelected: ko.observable(true) }
                ];

                viewModel.connectedObjectives(relatedObjectives);
                updateObjectiveOrderDefer = Q.defer();
                spyOn(repository, 'updateObjectiveOrder').and.returnValue(updateObjectiveOrderDefer.promise);
            });

            it('should be function', function () {
                expect(viewModel.reorderObjectives).toBeFunction();
            });

            it('should send event \'Change order of learning objectives\'', function () {
                viewModel.reorderObjectives();
                expect(eventTracker.publish).toHaveBeenCalledWith('Change order of learning objectives');
            });

            it('should set isReorderingObjectives to false', function () {
                viewModel.isReorderingObjectives(true);
                viewModel.reorderObjectives();
                expect(viewModel.isReorderingObjectives()).toBeFalsy();
            });

            it('should call repository \"updateObjectiveOrder\" method', function () {
                viewModel.reorderObjectives();
                expect(repository.updateObjectiveOrder).toHaveBeenCalledWith(viewModel.id, relatedObjectives);
            });

            describe('when ObjectivesSortedList is updated', function () {

                it('should show notify saved message', function (done) {
                    viewModel.reorderObjectives();
                    updateObjectiveOrderDefer.resolve();

                    updateObjectiveOrderDefer.promise.finally(function () {
                        expect(notify.saved).toHaveBeenCalled();
                        done();
                    });
                });

            });

        });

        describe('isSortingEnabled:', function () {

            it('should be observable', function () {
                expect(viewModel.isSortingEnabled).toBeObservable();
            });

            describe('when connectedObjectives length not equal 1', function () {

                it('should return true', function () {
                    var objectivesList = [
                        { isSelected: ko.observable(false) },
                        { isSelected: ko.observable(false) }
                    ];
                    viewModel.connectedObjectives(objectivesList);
                    expect(viewModel.isSortingEnabled()).toBeTruthy();
                });

            });

            describe('when connectedObjectives length equal 1', function () {

                it('should return false', function () {
                    var objectivesList = [
                        { isSelected: ko.observable(false) }
                    ];
                    viewModel.connectedObjectives(objectivesList);
                    expect(viewModel.isSortingEnabled()).toBeFalsy();
                });

            });

        });

        describe('isReorderingObjectives:', function () {
            it('should be observable', function () {
                expect(viewModel.isReorderingObjectives).toBeObservable();
            });
        });

        describe('backButtonData:', function () {

            it('should be instance of BackButton', function () {
                expect(viewModel.backButtonData).toBeInstanceOf(BackButton);
            });

            it('should be configured', function () {
                expect(viewModel.backButtonData.url).toBe('courses');
                expect(viewModel.backButtonData.backViewName).toBe(localizationManager.localize('courses'));
                expect(viewModel.backButtonData.callback).toBe(viewModel.navigateToCoursesEvent);
            });

        });

        describe('disconnectObjective:', function () {

            beforeEach(function () {
                viewModel.id = 'courseId';
            });

            it('should be function', function () {
                expect(viewModel.disconnectObjective).toBeFunction();
            });

            describe('when objective is not related to course', function () {

                var objective;

                beforeEach(function () {
                    objective = {
                        title: 'abc'
                    };
                    viewModel.availableObjectives.push(objective);
                    spyOn(repository, 'unrelateObjectives');
                });

                it('should not send event \'Unrelate objectives from course\'', function () {
                    viewModel.disconnectObjective({ item: objective });
                    expect(eventTracker.publish).not.toHaveBeenCalledWith('Unrelate objectives from course');
                });

                it('should not call updateObjectiveOrder repository function with selected objectives', function () {
                    viewModel.disconnectObjective({ item: objective });
                    expect(repository.unrelateObjectives).not.toHaveBeenCalled();
                });

            });

            describe('when objective is related to course', function () {

                var unrelateObjectives,
                    objective;

                beforeEach(function () {
                    objective = {
                        id: '0', isSelected: ko.observable(false)
                    };

                    viewModel.connectedObjectives.push(objective);
                    unrelateObjectives = Q.defer();

                    spyOn(repository, 'unrelateObjectives').and.returnValue(unrelateObjectives.promise);
                });

                it('should send event \'Unrelate objectives from course\'', function () {
                    viewModel.disconnectObjective({ item: objective });
                    expect(eventTracker.publish).toHaveBeenCalledWith('Unrelate objectives from course');
                });

                it('should call repository \"unrelateObjectives\" method', function () {
                    viewModel.disconnectObjective({ item: objective });
                    expect(repository.unrelateObjectives).toHaveBeenCalledWith('courseId', [objective]);
                });

                describe('and unrelate objective succeed', function () {

                    beforeEach(function () {
                        unrelateObjectives.resolve(new Date());
                    });

                    it('should call \'notify.info\' function', function (done) {
                        viewModel.disconnectObjective({ item: objective });

                        unrelateObjectives.promise.finally(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });

        });

        describe('connectObjective:', function () {

            var relateObjectiveDefer;

            beforeEach(function () {
                relateObjectiveDefer = Q.defer();

                spyOn(repository, 'relateObjective').and.returnValue(relateObjectiveDefer.promise);
            });

            var objective = {
                id: "id1",
                title: ko.observable('objective1'),
                modifiedOn: ko.observable('date'),
                isSelected: ko.observable(false)
            };

            it('should be function', function () {
                expect(viewModel.connectObjective).toBeFunction();
            });

            it('should send event \'Connect selected objectives to course\'', function () {
                viewModel.connectObjective({ item: objective });
                expect(eventTracker.publish).toHaveBeenCalledWith('Connect selected objectives to course');
            });

            describe('when objective already exists in connected objectives', function () {

                var orderObjectiveDefer, objective1, objective2;

                beforeEach(function () {
                    objective1 = {
                        id: '0',
                        isSelected: function () { }
                    };
                    objective2 = {
                        id: '1',
                        isSelected: function () { }
                    };
                    viewModel.connectedObjectives([]);
                    viewModel.connectedObjectives.push(objective1);
                    viewModel.connectedObjectives.push(objective2);
                    orderObjectiveDefer = Q.defer();
                    spyOn(repository, 'updateObjectiveOrder').and.returnValue(orderObjectiveDefer.promise);
                });

                it('should send event \'Change order of learning objectives\'', function () {
                    viewModel.connectObjective({ item: objective1, targetIndex: 1, sourceIndex: 0 });
                    expect(eventTracker.publish).toHaveBeenCalledWith('Change order of learning objectives');
                });

                it('should call updateObjectiveOrder repository function with selected objectives', function () {
                    viewModel.connectObjective({ item: objective1, targetIndex: 1, sourceIndex: 0 });
                    expect(repository.updateObjectiveOrder).toHaveBeenCalledWith(viewModel.id, [{ id: '1' }, { id: '0' }]);
                });

                it('should not send event \'Connect selected objectives to course\'', function () {
                    viewModel.connectObjective({ item: objective1, targetIndex: 1, sourceIndex: 0 });
                    expect(eventTracker.publish).not.toHaveBeenCalledWith('Connect selected objectives to course');
                });

                it('should not call updateObjectiveOrder repository function with selected objectives', function () {
                    viewModel.connectObjective({ item: objective1, targetIndex: 1, sourceIndex: 0 });
                    expect(repository.relateObjective).not.toHaveBeenCalled();
                });

            });

            describe('when objective not exists in connected objectives', function () {

                beforeEach(function () {
                    viewModel.connectedObjectives([]);
                });

                it('should call relateObjectives repository function with selected objectives', function () {
                    viewModel.connectObjective({ item: objective, targetIndex: 5 });

                    expect(repository.relateObjective).toHaveBeenCalled();

                    expect(repository.relateObjective.calls.mostRecent().args[0]).toEqual(viewModel.id);
                    expect(repository.relateObjective.calls.mostRecent().args[1].id).toEqual(objective.id);
                    expect(repository.relateObjective.calls.mostRecent().args[2]).toEqual(5);
                });

                describe('and objectives were connected successfully', function () {

                    it('should call \'notify.info\' function', function (done) {
                        relateObjectiveDefer.resolve({ modifiedOn: new Date() });
                        viewModel.connectObjective({ item: objective, targetIndex: 5 });

                        relateObjectiveDefer.promise.fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });

        });

        describe('titleUpdated:', function () {

            it('should be function', function () {
                expect(viewModel.titleUpdated).toBeFunction();
            });

            describe('when course is current course', function () {
                beforeEach(function () {
                    viewModel.id = course.id;
                    viewModel.title('');
                });

                describe('when course title is editing', function () {
                    beforeEach(function () {
                        viewModel.isEditing(true);
                    });

                    it('should not update course title', function () {
                        viewModel.titleUpdated(course);
                        expect(viewModel.title()).toBe('');
                    });
                });

                describe('when course title is not editing', function () {
                    beforeEach(function () {
                        viewModel.isEditing(false);
                    });

                    it('should update course title', function () {
                        viewModel.titleUpdated(course);
                        expect(viewModel.title()).toBe(course.title);
                    });
                });
            });

            describe('when course is not current course', function () {
                it('should not update course title', function () {
                    viewModel.id = 'qwe';
                    viewModel.title('');
                    viewModel.titleUpdated(course);

                    expect(viewModel.title()).toBe('');
                });
            });
        });

        describe('introductionContentUpdated:', function () {

            var introductionContent = {
                text: ko.observable(''),
                originalText: ko.observable(''),
                isEditing: ko.observable(false)
            };

            it('should be function', function () {
                expect(viewModel.introductionContentUpdated).toBeFunction();
            });

            describe('when course is current course', function () {

                describe('when introduction content is editing', function () {
                    beforeEach(function () {
                        introductionContent.isEditing(true);
                    });

                    it('should not update course introduction content', function () {
                        viewModel.id = course.id;
                        introductionContent.text('');
                        viewModel.courseIntroductionContent = introductionContent;
                        viewModel.introductionContentUpdated(course);

                        expect(viewModel.courseIntroductionContent.text()).toBe('');
                    });

                    it('should update original course introduction content', function () {
                        viewModel.id = course.id;
                        introductionContent.originalText('');
                        viewModel.courseIntroductionContent = introductionContent;
                        viewModel.introductionContentUpdated(course);

                        expect(viewModel.courseIntroductionContent.originalText()).toBe(course.introductionContent);
                    });
                });

                describe('when introduction content not is editing', function () {
                    beforeEach(function () {
                        introductionContent.isEditing(false);
                    });

                    it('should update course introduction content', function () {
                        viewModel.id = course.id;
                        introductionContent.text('');
                        viewModel.courseIntroductionContent = introductionContent;
                        viewModel.introductionContentUpdated(course);

                        expect(viewModel.courseIntroductionContent.text()).toBe(course.introductionContent);
                    });

                    it('should update original course introduction content', function () {
                        viewModel.id = course.id;
                        introductionContent.originalText('');
                        viewModel.courseIntroductionContent = introductionContent;
                        viewModel.introductionContentUpdated(course);

                        expect(viewModel.courseIntroductionContent.originalText()).toBe(course.introductionContent);
                    });
                });

            });

            describe('when course is not current course', function () {
                it('should not update course introduction content', function () {
                    viewModel.id = 'qwe';
                    introductionContent.text('');
                    viewModel.courseIntroductionContent = introductionContent;
                    viewModel.introductionContentUpdated(course);

                    expect(viewModel.courseIntroductionContent.text()).toBe('');
                });
            });
        });

        describe('objectivesReordered:', function () {
            var objectiveId1 = 'obj1',
                objectiveId2 = 'obj2',
                vmObjective1 = { id: objectiveId1, isSelected: ko.observable(false) },
                vmObjective2 = { id: objectiveId2, isSelected: ko.observable(false) },
                courseData = {
                    id: 'courseId',
                    objectives: [{ id: objectiveId1 }, { id: objectiveId2 }]
                };

            it('should be function', function () {
                expect(viewModel.objectivesReordered).toBeFunction();
            });

            describe('when course is current course', function () {

                describe('when objectives are reordering', function () {
                    beforeEach(function () {
                        viewModel.isReorderingObjectives(true);
                    });

                    it('should not reorder objectives', function () {
                        viewModel.id = 'qwe';
                        viewModel.connectedObjectives([vmObjective2, vmObjective1]);

                        viewModel.objectivesReordered(courseData);

                        expect(viewModel.connectedObjectives()[0].id).toBe(objectiveId2);
                        expect(viewModel.connectedObjectives()[1].id).toBe(objectiveId1);
                    });
                });

                describe('when objectives are not reordering', function () {
                    beforeEach(function () {
                        viewModel.isReorderingObjectives(false);
                    });

                    it('should reorder objectives', function () {
                        viewModel.id = courseData.id;
                        viewModel.connectedObjectives([vmObjective2, vmObjective1]);

                        viewModel.objectivesReordered(courseData);

                        expect(viewModel.connectedObjectives()[0].id).toBe(objectiveId1);
                        expect(viewModel.connectedObjectives()[1].id).toBe(objectiveId2);
                    });
                });
            });

            describe('when course is not current course', function () {
                it('should not reorder objectives', function () {
                    viewModel.id = 'qwe';
                    viewModel.connectedObjectives([vmObjective2, vmObjective1]);

                    viewModel.objectivesReordered(courseData);

                    expect(viewModel.connectedObjectives()[0].id).toBe(objectiveId2);
                    expect(viewModel.connectedObjectives()[1].id).toBe(objectiveId1);
                });
            });
        });

        describe('startReorderingObjectives:', function () {

            it('should be function', function () {
                expect(viewModel.startReorderingObjectives).toBeFunction();
            });

            it('should set isReorderingObjectives to true', function () {
                viewModel.isReorderingObjectives(false);
                viewModel.startReorderingObjectives();
                expect(viewModel.isReorderingObjectives()).toBeTruthy();
            });

        });

        describe('endReorderingObjectives:', function () {

            var getById;

            beforeEach(function () {
                getById = Q.defer();
                spyOn(repository, 'getById').and.returnValue(getById.promise);
            });

            it('should be function', function () {
                expect(viewModel.endReorderingObjectives).toBeFunction();
            });

            describe('when reordering objectives has been finished', function () {
                beforeEach(function () {
                    viewModel.isReorderingObjectives(false);
                });

                it('should resolve promise', function (done) {
                    var promise = viewModel.endReorderingObjectives();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });
            });

            describe('when objectives have not been reordered by collaborator', function () {
                beforeEach(function () {
                    viewModel.isReorderingObjectives(true);
                    viewModel.isObjectivesListReorderedByCollaborator(false);
                });

                it('should resolve promise', function (done) {
                    var promise = viewModel.endReorderingObjectives();

                    promise.fin(function () {
                        expect(promise).toBeResolved();
                        done();
                    });
                });

                it('should set isReorderingObjectives to false', function (done) {
                    viewModel.isReorderingObjectives(true);
                    var promise = viewModel.endReorderingObjectives();

                    promise.fin(function () {
                        expect(viewModel.isReorderingObjectives()).toBeFalsy();
                        done();
                    });
                });
            });

            describe('when objectives have been reordered by collaborator', function () {
                var objectiveId1 = 'obj1',
                objectiveId2 = 'obj2',
                vmObjective1 = { id: objectiveId1, isSelected: ko.observable(false) },
                vmObjective2 = { id: objectiveId2, isSelected: ko.observable(false) },
                course = {
                    id: 'courseId',
                    objectives: [{ id: objectiveId1 }, { id: objectiveId2 }]
                };

                beforeEach(function () {
                    viewModel.isReorderingObjectives(true);
                    viewModel.isObjectivesListReorderedByCollaborator(true);
                    getById.resolve(course);
                });

                it('should set isReorderingObjectives to false', function (done) {
                    viewModel.isReorderingObjectives(true);
                    var promise = viewModel.endReorderingObjectives();

                    promise.fin(function () {
                        expect(viewModel.isReorderingObjectives()).toBeFalsy();
                        done();
                    });
                });

                it('should set isObjectivesListReorderedByCollaborator to false', function (done) {
                    viewModel.isReorderingObjectives(true);
                    var promise = viewModel.endReorderingObjectives();

                    promise.fin(function () {
                        expect(viewModel.isObjectivesListReorderedByCollaborator()).toBeFalsy();
                        done();
                    });
                });

                it('should reorder objectives', function (done) {
                    viewModel.connectedObjectives([vmObjective2, vmObjective1]);

                    var promise = viewModel.endReorderingObjectives();

                    promise.fin(function () {
                        expect(viewModel.connectedObjectives()[0].id).toBe(objectiveId1);
                        expect(viewModel.connectedObjectives()[1].id).toBe(objectiveId2);
                        done();
                    });
                });
            });

        });

        describe('objectiveTitleUpdated', function () {

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
                viewModel.connectedObjectives([vmObjective]);
                viewModel.objectiveTitleUpdated(objective);

                expect(vmObjective.title()).toBe(objective.title);
            });

            it('should update course modified on date', function () {
                viewModel.connectedObjectives([vmObjective]);
                viewModel.objectiveTitleUpdated(objective);

                expect(vmObjective.modifiedOn().toISOString()).toBe(objective.modifiedOn.toISOString());
            });

        });

        describe('objectiveUpdated', function () {

            var objectiveId = "objectiveId";
            var vmObjective = {
                id: objectiveId,
                title: ko.observable(""),
                isSelected: ko.observable(false),
                modifiedOn: ko.observable("")
            };
            var objective = {
                id: objectiveId,
                modifiedOn: new Date()
            };

            it('should be function', function () {
                expect(viewModel.objectiveUpdated).toBeFunction();
            });

            it('should update course modified on date', function () {
                viewModel.connectedObjectives([vmObjective]);
                viewModel.objectiveUpdated(objective);

                expect(vmObjective.modifiedOn().toISOString()).toBe(objective.modifiedOn.toISOString());
            });
        });

        describe('objectiveConnected:', function () {
            var courseId = 'courseId',
                objectiveId = 'objectiveId',
                connectedObjectiveId = 'obj1',
                 vmObjective = {
                     id: connectedObjectiveId,
                     title: ko.observable(""),
                     isSelected: ko.observable(false),
                     modifiedOn: ko.observable("")
                 },
                objective = { id: objectiveId };

            beforeEach(function () {
                viewModel.id = courseId;
            });

            it('should be function', function () {
                expect(viewModel.objectiveConnected).toBeFunction();
            });

            describe('when course is not current course', function () {
                it('should not add objective', function () {
                    viewModel.id = 'id';
                    viewModel.connectedObjectives([]);

                    viewModel.objectiveConnected(courseId, objective, 0);
                    expect(viewModel.connectedObjectives().length).toBe(0);
                });
            });

            describe('when target index is not defined', function () {
                it('should push objective', function () {
                    viewModel.connectedObjectives([vmObjective]);
                    viewModel.objectiveConnected(courseId, objective, null);
                    expect(viewModel.connectedObjectives()[1].id).toBe(objectiveId);
                });
            });

            describe('when target index is defined', function () {
                it('should insert objective', function () {
                    viewModel.connectedObjectives([vmObjective]);
                    viewModel.objectiveConnected(courseId, objective, 0);
                    expect(viewModel.connectedObjectives()[0].id).toBe(objectiveId);
                });
            });

            it('should remove connected objective from available objectives list', function () {
                viewModel.availableObjectives([vmObjective]);
                viewModel.objectiveConnected(courseId, vmObjective, 0);
                expect(viewModel.availableObjectives().length).toBe(0);
            });
        });

        describe('objectivesDisconnected:', function () {
            var courseId = 'courseId',
             connectedObjectiveId = 'obj1',
              vmObjective = {
                  id: connectedObjectiveId,
                  title: ko.observable(""),
                  isSelected: ko.observable(false),
                  modifiedOn: ko.observable("")
              },
             getObjectivesDefer;

            beforeEach(function () {
                getObjectivesDefer = Q.defer();

                spyOn(objectiveRepository, 'getCollection').and.returnValue(getObjectivesDefer.promise);

                viewModel.id = courseId;
            });

            it('should be function', function () {
                expect(viewModel.objectivesDisconnected).toBeFunction();
            });

            describe('when course is not current course', function () {
                it('should not disconnect objective', function () {
                    viewModel.id = 'id';
                    viewModel.connectedObjectives([vmObjective]);

                    viewModel.objectivesDisconnected(courseId, [vmObjective.id]);
                    expect(viewModel.connectedObjectives().length).toBe(1);
                });
            });

            it('should disconnect objective', function () {
                viewModel.connectedObjectives([vmObjective]);
                viewModel.objectivesDisconnected(courseId, [vmObjective.id]);
                expect(viewModel.connectedObjectives().length).toBe(0);
            });

            describe('when get objectives', function () {
                beforeEach(function () {
                    getObjectivesDefer.resolve([{ id: '0', title: 'B', createdBy: identity.email }, { id: '1', title: 'A', createdBy: identity.email }]);
                });


                describe('and course does not have related objectives', function () {

                    it('should set owned objectives as available', function (done) {
                        viewModel.connectedObjectives([]);

                        viewModel.objectivesDisconnected(courseId, [vmObjective.id]);

                        getObjectivesDefer.promise.fin(function () {
                            expect(viewModel.availableObjectives().length).toBe(2);
                            done();
                        });
                    });

                });

                describe('and course has related objectives', function () {

                    it('should set not related objectives as available', function (done) {
                        viewModel.connectedObjectives([{ id: '0', title: 'B', isSelected: ko.observable(false) }]);

                        viewModel.objectivesDisconnected(courseId, [vmObjective.id]);

                        getObjectivesDefer.promise.fin(function () {
                            expect(viewModel.availableObjectives().length).toBe(1);
                            expect(viewModel.availableObjectives()[0].id).toBe('1');
                            done();
                        });
                    });

                });

                it('should sort available objectives by title', function (done) {
                    viewModel.objectivesDisconnected(courseId, [vmObjective.id]);

                    getObjectivesDefer.promise.fin(function () {
                        expect(viewModel.availableObjectives()).toBeSortedAsc('title');
                        done();
                    });
                });

            });
        });

        describe('collaborators:', function() {
            it('should be defined', function() {
                expect(viewModel.collaborators).toBeDefined();
            });
        });

        describe('deactivate:', function() {
            it('should be a function', function() {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should call collaborators deactivate', function() {
                spyOn(viewModel.collaborators, 'deactivate');

                viewModel.deactivate();

                expect(viewModel.collaborators.deactivate).toHaveBeenCalled();
            });
        });
    });

});
