define(['viewmodels/courses/course'], function (viewModel) {
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
        BackButton = require('models/backButton')
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
            spyOn(notify, 'saved');
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
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

        describe('collaborators', function() {
            it('should be defined', function () {
                expect(viewModel.collaborators).toBeDefined();
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
                viewModel.title(course.title);
                viewModel.startEditTitle();

                updateTitle = Q.defer();

                spyOn(repository, 'updateCourseTitle').and.returnValue(updateTitle.promise);
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
                    viewModel.title(utils.createString(viewModel.courseTitleMaxLength + 1));
                    viewModel.endEditTitle();

                    expect(viewModel.title()).toBe(course.title);
                });

                it('should not show notification', function () {
                    viewModel.endEditTitle();
                    expect(notify.saved).not.toHaveBeenCalled();
                });

                describe('when title contains only spaces', function () {

                    it('should trim title', function () {
                        viewModel.title('              ');
                        viewModel.endEditTitle();

                        expect(viewModel.title()).toBe(course.title);
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

                    it('should send event \'Update course title\'', function () {
                        viewModel.endEditTitle();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Update course title');
                    });

                    it('should update course in repository', function () {
                        viewModel.endEditTitle();
                        expect(repository.updateCourseTitle).toHaveBeenCalled();
                    });

                    describe('and when course updated successfully', function () {

                        beforeEach(function () {
                            updateTitle.resolve(new Date());
                        });

                        it('should update notificaion', function (done) {
                            viewModel.endEditTitle();

                            updateTitle.promise.fin(function () {
                                expect(notify.saved).toHaveBeenCalled();
                                done();
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

                    it('should not update course in repository', function () {
                        viewModel.endEditTitle();
                        expect(repository.updateCourseTitle).not.toHaveBeenCalled();
                    });

                    it('should not send event \'Update course title\'', function () {
                        viewModel.endEditTitle();
                        expect(eventTracker.publish).not.toHaveBeenCalledWith('Update course title');
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
                        getObjectivesDefer.resolve([{ id: '0', title: 'B' }, { id: '1', title: 'A' }]);
                    });

                    describe('and course does not have related objectives', function () {

                        it('should set all objectives as available', function (done) {
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

            describe('when no objectives selected', function() {
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

                it('should set current course collaborators', function (done) {
                    viewModel.collaborators = null;

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.collaborators).not.toBeNull();
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

        describe('language:', function () {

            it('should be observable', function () {
                expect(viewModel.language).toBeObservable();
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

        describe('isSortingEnabled', function () {

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

            it('should be function', function () {
                expect(viewModel.connectObjective).toBeFunction();
            });

            it('should send event \'Connect selected objectives to course\'', function () {
                viewModel.connectObjective({});
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
                    spyOn(repository, 'relateObjective').and.callFake();
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

                var relateObjectiveDefer;

                beforeEach(function () {
                    viewModel.connectedObjectives([]);

                    relateObjectiveDefer = Q.defer();

                    spyOn(repository, 'relateObjective').and.returnValue(relateObjectiveDefer.promise);
                });

                it('should call relateObjectives repository function with selected objectives', function () {
                    viewModel.connectObjective({ item: { id: '0' }, targetIndex: 5 });
                    expect(repository.relateObjective).toHaveBeenCalledWith(viewModel.id, { id: '0' }, 5);
                });

                describe('and objectives were connected successfully', function () {

                    it('should call \'notify.info\' function', function (done) {
                        relateObjectiveDefer.resolve({ modifiedOn: new Date() });
                        viewModel.connectObjective({ item: { id: '0' }, targetIndex: 5 });

                        relateObjectiveDefer.promise.fin(function () {
                            expect(notify.saved).toHaveBeenCalled();
                            done();
                        });
                    });

                });

            });

        });

    });

});
