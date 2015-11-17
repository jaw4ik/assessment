define(['viewmodels/courses/course/index'], function (viewModel) {
    "use strict";

    var
        repository = require('repositories/courseRepository'),
        collaboratorRepository = require('repositories/collaboratorRepository'),

        app = require('durandal/app'),
        userContext = require('userContext'),
        clientContext = require('clientContext'),
        constants = require('constants'),
        eventTracker = require('eventTracker'),
        notify = require('notify'),
        localizationManager = require('localization/localizationManager'),
        changeTemplateDialog = require('dialogs/course/changeTemplate/changeTemplate')
    ;

    describe('viewModel [course index]', function () {

        beforeEach(function () {
            spyOn(eventTracker, 'publish');
            spyOn(notify, 'saved');
            spyOn(app, 'on');
            spyOn(app, 'off');
            spyOn(localizationManager, "localize").and.callFake(function (key) {
                return key;
            });
            spyOn(changeTemplateDialog, 'show');
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

        describe('template:', function () {
            it('should be defined:', function () {
                expect(viewModel.template).toBeDefined();
            });

            describe('id:', function () {
                it('should be observable:', function () {
                    expect(viewModel.template.id).toBeObservable();
                });
            });

            describe('name:', function () {
                it('should be observable:', function () {
                    expect(viewModel.template.name).toBeObservable();
                });
            });

            describe('thumbnail:', function () {
                it('should be observable:', function () {
                    expect(viewModel.template.thumbnail).toBeObservable();
                });
            });
        });

        describe('titleField:', function () {
            it('should be defined', function () {
                expect(viewModel.titleField).toBeDefined();
            });

            describe('maxLength:', function () {
                it('should be constants.validation.courseTitleMaxLength', function () {
                    expect(viewModel.titleField.maxLength).toBe(constants.validation.courseTitleMaxLength);
                });
            });

            describe('updateTitleHandler:', function () {
                var updateDefer;

                beforeEach(function () {
                    updateDefer = Q.defer();
                    spyOn(repository, 'updateCourseTitle').and.returnValue(updateDefer.promise);
                });

                it('should return promise', function () {
                    expect(viewModel.titleField.updateTitleHandler()).toBePromise();
                });

                it('should call repository update title', function () {
                    var newTitle = 'new title', id = 'id';
                    viewModel.id = id;
                    viewModel.titleField.updateTitleHandler(newTitle);
                    expect(repository.updateCourseTitle).toHaveBeenCalledWith(id, newTitle);
                });

                it('should publish \'Update course title\' event', function () {
                    viewModel.titleField.updateTitleHandler('new title2');
                    expect(eventTracker.publish).toHaveBeenCalledWith('Update course title');
                });
            });

            describe('getTitleHandler:', function () {
                var getDefer;

                beforeEach(function () {
                    getDefer = Q.defer();
                    spyOn(repository, 'getById').and.returnValue(getDefer.promise);
                });

                it('should return promise', function () {
                    expect(viewModel.titleField.getTitleHandler()).toBePromise();
                });

                describe('when data received', function () {
                    var title = 'title';
                    beforeEach(function () {
                        getDefer.resolve({ title: title });
                    });

                    it('should return title', function (done) {
                        viewModel.titleField.getTitleHandler().then(function (result) {
                            expect(result).toEqual(title);
                            done();
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

        describe('isDirty:', function () {

            it('should be observable', function () {
                expect(viewModel.isDirty).toBeObservable();
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

            var publishDialog = require('dialogs/course/publishCourse/publishDialog');

            beforeEach(function () {
                spyOn(publishDialog, 'show');
            });

            it('should be function', function () {
                expect(viewModel.share).toBeFunction();
            });

            it('should show publish dialog', function () {
                viewModel.share();
                expect(publishDialog.show).toHaveBeenCalled();
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

            describe('enabled:', function () {

                beforeEach(function () {
                    userContext.identity = {
                        email: 'a@a.a'
                    };
                });

                it('should be computed', function () {
                    expect(viewModel.collaborate.enabled).toBeComputed();
                });

                describe('when current user is an owner', function () {

                    beforeEach(function () {
                        viewModel.createdBy('a@a.a');
                    });

                    it('should be true', function () {
                        expect(viewModel.collaborate.enabled()).toEqual(true);
                    });
                });

                describe('when current user is not owner', function () {
                    beforeEach(function () {
                        viewModel.createdBy('b@b.b');
                    });

                    it('should be false', function () {
                        expect(viewModel.collaborate.enabled()).toEqual(false);
                    });
                });

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
                    isDirty: true,
                    template: {
                        name: 'template',
                        id: 'templateId',
                        thumbnail: 'template.thumbnail'
                    }
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
                    viewModel.titleField.title('');

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.titleField.title()).toEqual(course.title);
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

                it('should set isDirty', function (done) {
                    viewModel.isDirty(false);

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.isDirty()).toBe(course.isDirty);
                        done();
                    });
                });

                it('should set template name', function (done) {
                    viewModel.template.name('');

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.template.name()).toBe(course.template.name);
                        done();
                    });
                });

                it('should set template id', function (done) {
                    viewModel.template.id('');

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.template.id()).toBe(course.template.id);
                        done();
                    });
                });

                it('should set template thumbnail', function (done) {
                    viewModel.template.thumbnail('');

                    viewModel.activate(course.id).fin(function () {
                        expect(viewModel.template.thumbnail()).toBe(course.template.thumbnail);
                        done();
                    });
                });

                it('should subscribe to courseStateChanged event', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.course.stateChanged + course.id, viewModel.stateChanged);
                        done();
                    });
                });

                it('should subscribe to templateUpdated event', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.course.templateUpdated + course.id, viewModel.templateUpdated);
                        done();
                    });
                });

                it('should subscribe to templateUpdatedByCollaborator event', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.course.templateUpdatedByCollaborator, viewModel.templateUpdatedByCollaborator);
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

                describe('and when last created course is current course', function () {
                    beforeEach(function () {
                        spyOn(clientContext, 'get').and.returnValue(course.id);
                    });

                    it('should select title', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.titleField.isSelected()).toBeTruthy();
                            done();
                        });
                    });
                });

                describe('and when last created course is not current course', function () {
                    beforeEach(function () {
                        spyOn(clientContext, 'get').and.returnValue('other id');
                    });

                    it('should not select title', function (done) {
                        viewModel.activate(course.id).fin(function () {
                            expect(viewModel.titleField.isSelected()).toBeFalsy();
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


                it('should subscribe to titleUpdated event', function (done) {
                    viewModel.activate(course.id).fin(function () {
                        expect(app.on).toHaveBeenCalledWith(constants.messages.course.titleUpdatedByCollaborator, viewModel.titleUpdated);
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

        describe('deactivate:', function () {

            beforeEach(function () {
                viewModel.id = 'id';
            });

            it('should be function', function () {
                expect(viewModel.deactivate).toBeFunction();
            });

            it('should unsubscribe from titleUpdated event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.titleUpdatedByCollaborator, viewModel.titleUpdated);
            });

            it('should unsubscribe from collaboratorAdded event', function () {

                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorAdded + viewModel.id, viewModel.collaboratorAdded);
            });

            it('should unsubscribe from collaboratorRemoved event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.collaboration.collaboratorRemoved + viewModel.id, viewModel.collaboratorRemoved);
            });

            it('should unsubscribe from courseStateChanged event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.stateChanged + viewModel.id, viewModel.stateChanged);
            });

            it('should unsubscribe from templateUpdated event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.templateUpdated + viewModel.id, viewModel.templateUpdated);
            });

            it('should unsubscribe from templateUpdatedByCollaborator event', function () {
                viewModel.deactivate();
                expect(app.off).toHaveBeenCalledWith(constants.messages.course.templateUpdatedByCollaborator, viewModel.templateUpdatedByCollaborator);
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

        describe('titleUpdated:', function () {

            var course = {
                id: 'id',
                title: 'title',
                createdBy: 'createdBy',
            };

            it('should be function', function () {
                expect(viewModel.titleUpdated).toBeFunction();
            });

            describe('when course is current course', function () {
                beforeEach(function () {
                    viewModel.id = course.id;
                    viewModel.titleField.title('');
                });

                describe('when course title is editing', function () {
                    beforeEach(function () {
                        viewModel.titleField.isEditing(true);
                    });

                    it('should not update course title', function () {
                        viewModel.titleUpdated(course);
                        expect(viewModel.titleField.title()).toBe('');
                    });
                });

                describe('when course title is not editing', function () {
                    beforeEach(function () {
                        viewModel.titleField.isEditing(false);
                    });

                    it('should update course title', function () {
                        viewModel.titleUpdated(course);
                        expect(viewModel.titleField.title()).toBe(course.title);
                    });
                });
            });

            describe('when course is not current course', function () {
                it('should not update course title', function () {
                    viewModel.id = 'qwe';
                    viewModel.titleField.title('');
                    viewModel.titleUpdated(course);

                    expect(viewModel.titleField.title()).toBe('');
                });
            });
        });

        describe('stateChanged:', function () {

            var state;
            beforeEach(function () {
                state = { isDirty: true };
            });

            it('should update isDirty', function () {
                viewModel.isDirty(false);
                viewModel.stateChanged(state);
                expect(viewModel.isDirty()).toBe(state.isDirty);
            });
        });

        describe('changeTemplate:', function () {
            it('should show change template dialog', function () {
                var id = 'id',
                    templateId = 'templateId';
                viewModel.id = id;
                viewModel.template.id(templateId);

                viewModel.changeTemplate();
                expect(changeTemplateDialog.show).toHaveBeenCalledWith(id, templateId);
            });
        });

        describe('templateUpdated:', function () {
            var template = {
                name: 'template',
                id: 'templateId',
                thumbnail: 'template.thumbnail'
            }

            it('should set template name', function () {
                viewModel.template.name('');
                viewModel.templateUpdated(template);
                expect(viewModel.template.name()).toBe(template.name);
            });

            it('should set template id', function () {
                viewModel.template.id('');
                viewModel.templateUpdated(template);
                expect(viewModel.template.id()).toBe(template.id);
            });

            it('should set template thumbnail', function () {
                viewModel.template.thumbnail('');
                viewModel.templateUpdated(template);
                expect(viewModel.template.thumbnail()).toBe(template.thumbnail);
            });
        });

        describe('templateUpdatedByCollaborator:', function() {
            var course = {
                id: 'id',
                title: 'title',
                createdBy: 'createdBy',
                isDirty: true,
                template: {
                    name: 'template',
                    id: 'templateId',
                    thumbnail: 'template.thumbnail'
                }
            };

            describe('when course is current course', function() {
                beforeEach(function() {
                    viewModel.id = course.id;
                });

                it('should set template name', function () {
                    viewModel.template.name('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.template.name()).toBe(course.template.name);
                });

                it('should set template id', function () {
                    viewModel.template.id('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.template.id()).toBe(course.template.id);
                });

                it('should set template thumbnail', function () {
                    viewModel.template.thumbnail('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.template.thumbnail()).toBe(course.template.thumbnail);
                });
            });

            describe('when course is not current course', function () {
                beforeEach(function () {
                    viewModel.id = 'some id';
                });

                it('should not update template name', function () {
                    viewModel.template.name('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.template.name()).toBe('');
                });

                it('should not update template id', function () {
                    viewModel.template.id('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.template.id()).toBe('');
                });

                it('should not update template thumbnail', function () {
                    viewModel.template.thumbnail('');
                    viewModel.templateUpdatedByCollaborator(course);
                    expect(viewModel.template.thumbnail()).toBe('');
                });
            });
        });
    });
});