define(['viewmodels/courses/course/index'], function (viewModel) {
    "use strict";

    var
        repository = require('repositories/courseRepository'),
        collaboratorRepository = require('repositories/collaboratorRepository'),

        app = require('durandal/app'),
        clientContext = require('clientContext'),
        constants = require('constants'),
        eventTracker = require('eventTracker'),
        notify = require('notify')
    ;

    describe('viewModel [course index]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'saved');
            spyOn(app, 'on');
            spyOn(app, 'off');
        });

        it('should be object', function () {
            expect(viewModel).toBeObject();
        });

        describe('router:', function () {
            it('should be object', function () {
                expect(viewModel.router).toBeObject();
            });
        });

        describe('id:', function () {

            it('should be defined', function () {
                expect(viewModel.id).toBeDefined();
            });

        });

        describe('title:', function () {

            it('should be observable', function () {
                expect(viewModel.title).toBeObservable();
            });

            describe('maxLength:', function () {

                it('should be defined', function () {
                    expect(viewModel.title.maxLength).toEqual(constants.validation.courseTitleMaxLength);
                });

            });

            describe('isValid:', function () {

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
                        viewModel.title(utils.createString(constants.validation.courseTitleMaxLength + 1));
                        expect(viewModel.title.isValid()).toBeFalsy();
                    });

                });

                describe('when title is longer than 255 but after trimming is not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title('   ' + utils.createString(constants.validation.courseTitleMaxLength - 1) + '   ');
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });

                describe('when title is not empty and not longer than 255', function () {

                    it('should be true', function () {
                        viewModel.title(utils.createString(constants.validation.courseTitleMaxLength - 1));
                        expect(viewModel.title.isValid()).toBeTruthy();
                    });

                });

            });

            describe('isEditing:', function () {

                it('should be observable', function () {
                    expect(viewModel.title.isEditing).toBeObservable();
                });

            });

            describe('isSelected:', function () {

                it('should be function', function () {
                    expect(viewModel.title.isSelected).toBeObservable();
                });

            });

            describe('beginEdit:', function () {

                it('should be function', function () {
                    expect(viewModel.title.beginEdit).toBeFunction();
                });

                it('should change isEditing to true', function () {
                    viewModel.title.isEditing(false);

                    viewModel.title.beginEdit();

                    expect(viewModel.title.isEditing()).toBeTruthy();
                });

            });

            describe('endEdit:', function () {

                var update, getById,
                    course = {
                        id: '1',
                        title: 'course',
                        objectives: [],
                        packageUrl: '',
                        createdOn: 'createdOn',
                        createdBy: 'createdBy',
                        modifiedOn: 'modifiedOn',
                        builtOn: 'builtOn',
                    };

                beforeEach(function () {
                    update = Q.defer();
                    getById = Q.defer();

                    spyOn(repository, 'getById').and.returnValue(getById.promise);
                    spyOn(repository, 'updateCourseTitle').and.returnValue(update.promise);
                });

                it('should be function', function () {
                    expect(viewModel.title.endEdit).toBeFunction();
                });

                it('should change isEditing to false', function () {
                    viewModel.title.isEditing(true);

                    viewModel.title.endEdit();

                    expect(viewModel.title.isEditing()).toBeFalsy();
                });


                it('should trim title', function () {
                    viewModel.title('    Some title     ');
                    viewModel.title.endEdit();
                    expect(viewModel.title()).toEqual('Some title');
                });

                describe('when title is not modified', function () {
                    var promise = null;
                    beforeEach(function () {
                        viewModel.title(course.title);
                        promise = getById.promise.finally(function () { });
                        getById.resolve(course);
                    });

                    it('should not send event', function (done) {
                        viewModel.title.endEdit();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(eventTracker.publish).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should not show notification', function (done) {
                        viewModel.title.endEdit();

                        promise.fin(function () {
                            expect(promise).toBeResolved();
                            expect(notify.saved).not.toHaveBeenCalled();
                            done();
                        });
                    });

                    it('should not update course in repository', function (done) {
                        viewModel.title.endEdit();

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
                        getPromise = getById.promise.finally(function () { });
                        getById.resolve(course);
                    });

                    it('should send event \'Update course title\'', function (done) {
                        viewModel.title.endEdit();

                        getPromise.fin(function () {
                            expect(getPromise).toBeResolved();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Update course title');
                            done();
                        });
                    });

                    describe('and when title is valid', function () {

                        it('should update course in repository', function (done) {
                            viewModel.title.endEdit();

                            getPromise.fin(function () {
                                expect(getPromise).toBeResolved();
                                expect(repository.updateCourseTitle).toHaveBeenCalled();
                                expect(repository.updateCourseTitle.calls.mostRecent().args[1]).toEqual(newTitle);
                                done();
                            });
                        });

                        describe('and when course updated successfully', function () {

                            it('should update notificaion', function (done) {
                                var promise = update.promise.fin(function () { });
                                update.resolve(new Date());

                                viewModel.title.endEdit();

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
                            viewModel.title.endEdit();

                            getPromise.fin(function () {
                                expect(viewModel.title()).toBe(course.title);
                                done();
                            });
                        });

                    });
                });
            });
        });

        describe('collaborators:', function () {

            it('should be observable array', function () {
                expect(viewModel.collaborators).toBeObservableArray();
            });

        });

        describe('createdBy:', function () {

            it('should be observable', function () {
                expect(viewModel.createdBy).toBeObservable();
            });

        });

        describe('preview:', function () {

            var router = require('plugins/router');

            beforeEach(function () {
                spyOn(router, 'openUrl');
            });

            it('should be function', function () {
                expect(viewModel.preview).toBeFunction();
            });

            it('should send \'Preview course\' event', function () {
                viewModel.preview();
                expect(eventTracker.publish).toHaveBeenCalledWith('Preview course');
            });

            it('should open course URL', function () {
                viewModel.id = 'id';
                viewModel.preview();
                expect(router.openUrl).toHaveBeenCalledWith('/preview/id');
            });

        });

        describe('share:', function () {

            var share = require('dialogs/publishCourse/publishCourse');

            beforeEach(function () {
                spyOn(share, 'show');
            });

            it('should be function', function () {
                expect(viewModel.share).toBeFunction();
            });

            it('should show collaboration dialog', function () {
                var id = 'id';
                viewModel.id = id;

                viewModel.share();

                expect(share.show).toHaveBeenCalledWith(id);
            });

        });

        describe('collaborate:', function () {

            var collaboration = require('dialogs/collaboration/collaboration');

            beforeEach(function () {
                spyOn(collaboration, 'show');
            });

            it('should be function', function () {
                expect(viewModel.collaborate).toBeFunction();
            });

            it('should show collaboration dialog', function () {
                var id = 'id';
                var createdBy = 'createdBy';

                viewModel.id = id;
                viewModel.createdBy(createdBy);

                viewModel.collaborate();

                expect(collaboration.show).toHaveBeenCalledWith(id, createdBy);
            });

        });

        describe('canActivate:', function () {

            var getById;

            beforeEach(function () {
                getById = Q.defer();
                spyOn(repository, 'getById').and.returnValue(getById.promise);
            });

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.canActivate()).toBePromise();
            });

            describe('when course does not exist', function () {

                beforeEach(function () {
                    getById.reject('reason');
                });

                it('should return redirect to \'404\'', function (done) {

                    viewModel.canActivate('courseId').then(function (result) {
                        expect(result).toEqual({ redirect: "404" });
                        done();
                    });
                });

            });

            describe('when course exists', function () {

                beforeEach(function () {
                    getById.resolve({});
                });

                it('should return true', function (done) {
                    viewModel.canActivate('courseId').then(function (result) {
                        expect(result).toEqual(true);
                        done();
                    });
                });

            });

        });

        describe('activate:', function () {
            var getById;
            var getCourseCollaborators;

            beforeEach(function () {
                getById = Q.defer();
                getCourseCollaborators = Q.defer();

                spyOn(repository, 'getById').and.returnValue(getById.promise);
                spyOn(collaboratorRepository, 'getCollection').and.returnValue(getCourseCollaborators.promise);
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should reject promise', function () {
                expect(viewModel.activate()).toBePromise();
            });


            describe('when course does not exist', function () {

                beforeEach(function () {
                    getById.reject();
                });

                it('should reject promise', function (done) {
                    viewModel.activate().catch(function () {
                        done();
                    });
                });

            });

            describe('when course exists', function () {

                var course = {
                    id: 'id',
                    title: 'title',
                    createdBy: 'createdBy',
                };

                var collaborators = [{ email: 'a@a.a' }, { email: 'b@b.b' }];

                beforeEach(function () {
                    getById.resolve(course);
                    getCourseCollaborators.resolve(collaborators);
                    spyOn(clientContext, 'set');
                });

                it('should set current course id', function (done) {
                    viewModel.id = undefined;

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.id).toEqual(course.id);
                        done();
                    });
                });

                it('should set title', function (done) {
                    viewModel.title('');

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.title()).toEqual(course.title);
                        done();
                    });
                });

                it('should set createdBy', function (done) {
                    viewModel.id = undefined;

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.createdBy()).toEqual(course.createdBy);
                        done();
                    });
                });

                it('should set collaborators', function (done) {
                    viewModel.collaborators([]);
                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.collaborators()).toEqual(['a@a.a', 'b@b.b']);
                        done();
                    });
                });

                it('should resolve promise', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        done();
                    });
                });

                it('should set course id as the last visited in client context', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVistedCourse, course.id);
                        done();
                    });
                });

                it('should reset last visited objective in client context', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(clientContext.set).toHaveBeenCalledWith(constants.clientContextKeys.lastVisitedObjective, null);
                        done();
                    });
                });


                describe('when last created course is current course', function () {
                    beforeEach(function () {
                        spyOn(clientContext, 'get').and.returnValue(course.id);
                    });

                    it('should select title', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.title.isSelected()).toBeTruthy();
                            done();
                        });
                    });
                });

                describe('when last created course is not current course', function () {
                    beforeEach(function () {
                        spyOn(clientContext, 'get').and.returnValue('other id');
                    });

                    it('should not select title', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.title.isSelected()).toBeFalsy();
                            done();
                        });
                    });
                });

                it('should remove lastCreatedCourse key from client context', function (done) {
                    spyOn(clientContext, 'remove');

                    viewModel.activate(course.id).fin(function () {
                        expect(clientContext.remove).toHaveBeenCalledWith(constants.clientContextKeys.lastCreatedCourseId);
                        done();
                    });
                });

                it('should subscribe to collaboratorAdded event', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded + course.id, viewModel.collaboratorAdded);
                        done();
                    });
                });

                it('should subscribe to collaboratorRemoved event', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + course.id, viewModel.collaboratorRemoved);
                        done();
                    });
                });

            });

        });

        describe('collaboratorAdded:', function () {

            it('should be function', function () {
                expect(viewModel.collaboratorAdded).toBeFunction();
            });

            describe('when collaborator does not yet exist', function () {

                it('should add collaborator to collection', function () {
                    viewModel.collaborators([]);
                    viewModel.collaboratorAdded({ email: 'a@a.a' });

                    expect(viewModel.collaborators().length).toEqual(1);
                });

            });

            describe('when collaborator already exists', function () {

                it('should not add collaborator to collection', function () {
                    viewModel.collaborators(['a@a.a']);
                    viewModel.collaboratorAdded({ email: 'a@a.a' });

                    expect(viewModel.collaborators().length).toEqual(1);
                });

            });

        });

        describe('collaboratorRemoved:', function () {

            it('should be function', function () {
                expect(viewModel.collaboratorRemoved).toBeFunction();
            });


            it('should remove collaborator from collection', function () {
                viewModel.collaborators(['a@a.a']);
                viewModel.collaboratorRemoved('a@a.a');

                expect(viewModel.collaborators().length).toEqual(0);
            });

        });

    });
});