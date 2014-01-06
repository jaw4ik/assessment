define(['viewmodels/courses/deliver', 'models/course'],
    function (viewModel, CourseModel) {
        "use strict";

        var
            app = require('durandal/app'),
            router = require('plugins/router'),
            eventTracker = require('eventTracker'),
            constants = require('constants'),
            repository = require('repositories/courseRepository'),
            notify = require('notify')
        ;

        describe('viewModel [deliver]', function () {
            var courseCreatedOn = '/Date(1378106938845)/';
            var template = { id: 'template id', name: 'template name', image: 'template image' };
            var course = new CourseModel({
                id: 'testCourseId',
                title: 'title',
                template: template,
                createdOn: utils.getDateFromString(courseCreatedOn),
                modifiedOn: utils.getDateFromString(courseCreatedOn),
                objectives: []
            });

            beforeEach(function () {
                router.openUrl = function (url) { };

                spyOn(eventTracker, 'publish');
                spyOn(router, 'navigate');
                spyOn(router, 'replace');
                spyOn(router, 'openUrl');
                spyOn(notify, 'hide');
                spyOn(notify, 'error');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('states:', function () {

                it('should be equal to allowed deliver states', function () {
                    expect(viewModel.states).toEqual(constants.deliveringStates);
                });

            });

            describe('buildAction:', function () {
                it('should be observable', function () {
                    expect(viewModel.buildAction).toBeObservable();
                });
            });

            describe('scormBuildAction:', function () {
                it('should be observable', function () {
                    expect(viewModel.scormBuildAction).toBeObservable();
                });
            });

            describe('publishAction:', function () {
                it('should be observable', function () {
                    expect(viewModel.publishAction).toBeObservable();
                });
            });

            describe('publishPackageExists:', function () {

                it('should be computed', function () {
                    expect(viewModel.publishPackageExists).toBeComputed();
                });

                describe('when publishPackageUrl is not defined', function () {

                    it('should be false', function () {
                        viewModel.publishedPackageUrl(undefined);
                        expect(viewModel.publishPackageExists()).toBeFalsy();
                    });

                });

                describe('when publishPackageUrl is empty', function () {

                    it('should be false', function () {
                        viewModel.publishedPackageUrl("");
                        expect(viewModel.publishPackageExists()).toBeFalsy();
                    });

                });

                describe('when publishPackageUrl is whitespace', function () {

                    it('should be false', function () {
                        viewModel.publishedPackageUrl("    ");
                        expect(viewModel.publishPackageExists()).toBeFalsy();
                    });

                });

                describe('when publishPackageUrl is a non-whitespace string', function () {

                    it('should be true', function () {
                        viewModel.publishedPackageUrl("packageUrl");
                        expect(viewModel.publishPackageExists()).toBeTruthy();
                    });

                });

            });

            describe('isDelivering:', function () {
                it('should be computed', function () {
                    expect(viewModel.isDelivering).toBeComputed();
                });

                describe('when activeAction is null', function () {
                    beforeEach(function () {
                        viewModel.activeAction(null);
                    });

                    it('should return false', function () {
                        expect(viewModel.isDelivering()).toBeFalsy();
                    });
                });

                describe('when active action is defined', function () {
                    var isDelivering = true;
                    beforeEach(function () {
                        viewModel.activeAction({ isDelivering: ko.observable(isDelivering) });
                    });

                    it('should return active action delivering state value', function () {
                        expect(viewModel.isDelivering()).toBe(isDelivering);
                    });
                });
            });

            describe('publishedPackageUrl:', function () {

                it('should be observable', function () {
                    expect(viewModel.publishedPackageUrl).toBeObservable();
                });

            });

            describe('packageUrl:', function () {

                it('should be observable', function () {
                    expect(viewModel.packageUrl).toBeObservable();
                });

            });

            describe('scormPackageUrl:', function () {

                it('should be observable', function () {
                    expect(viewModel.scormPackageUrl).toBeObservable();
                });

            });

            describe('showOpenLinkDescription:', function () {

                it('should be observable', function () {
                    expect(viewModel.showOpenLinkDescription).toBeObservable();
                });

            });

            describe('publishCourse:', function () {

                var courseRepositoryGetByIdDefer;
                var courseRepositoryGetByIdPromise;

                beforeEach(function () {
                    spyOn(course, 'publish');

                    courseRepositoryGetByIdDefer = Q.defer();
                    courseRepositoryGetByIdPromise = courseRepositoryGetByIdDefer.promise;
                    spyOn(repository, 'getById').andReturn(courseRepositoryGetByIdPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.publishCourse).toBeFunction();
                });

                describe('when deliver process is not running', function () {

                    beforeEach(function () {
                        viewModel.activeAction(null);
                    });

                    it('should send event \'Publish course\'', function () {
                        viewModel.publishCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Publish course');
                    });

                    it('should set active action to publish action', function () {
                        var publishAction = {
                            isDelivering: ko.computed(function () {
                                return false;
                            })
                        };
                        viewModel.publishAction(publishAction);
                        viewModel.publishCourse();
                        expect(viewModel.activeAction()).toBe(publishAction);
                    });

                    it('should hide notification', function () {
                        notify.hide.reset();
                        viewModel.publishCourse();
                        expect(notify.hide).toHaveBeenCalled();
                    });

                    it('should start publish of current course', function () {
                        courseRepositoryGetByIdDefer.resolve(course);
                        var promise = viewModel.publishCourse();

                        waitsFor(function () {
                            return !promise.isPending();
                        });

                        runs(function () {
                            expect(course.publish).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('downloadCourse:', function () {

                var courseRepositoryGetByIdDefer;
                var courseRepositoryGetByIdPromise;

                beforeEach(function () {
                    spyOn(course, 'build');

                    courseRepositoryGetByIdDefer = Q.defer();
                    courseRepositoryGetByIdPromise = courseRepositoryGetByIdDefer.promise;
                    spyOn(repository, 'getById').andReturn(courseRepositoryGetByIdPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.downloadCourse).toBeFunction();
                });

                describe('when deliver process is not running', function () {

                    beforeEach(function () {
                        viewModel.activeAction(null);
                    });

                    it('should send event \"Download course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Download course');
                    });

                    it('should set active action to build action', function () {
                        var buildAction = {
                            isDelivering: ko.computed(function () {
                                return false;
                            })
                        };
                        viewModel.buildAction(buildAction);
                        viewModel.downloadCourse();
                        expect(viewModel.activeAction()).toBe(buildAction);
                    });

                    it('should start build of current course', function () {
                        courseRepositoryGetByIdDefer.resolve(course);
                        var promise = viewModel.downloadCourse();

                        waitsFor(function () {
                            return !promise.isPending();
                        });

                        runs(function () {
                            expect(course.build).toHaveBeenCalled();
                        });
                    });
                });
            });

            describe('downloadScormCourse:', function () {

                var courseRepositoryGetByIdDefer;
                var courseRepositoryGetByIdPromise;

                beforeEach(function () {
                    spyOn(course, 'scormBuild');

                    courseRepositoryGetByIdDefer = Q.defer();
                    courseRepositoryGetByIdPromise = courseRepositoryGetByIdDefer.promise;
                    spyOn(repository, 'getById').andReturn(courseRepositoryGetByIdPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.downloadScormCourse).toBeFunction();
                });

                describe('when deliver process is not running', function () {

                    beforeEach(function () {
                        viewModel.activeAction(null);
                    });

                    it('should send event \"Download scorm course\"', function () {
                        viewModel.downloadScormCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Download scorm course');
                    });

                    it('should set active action to scorm build action', function () {
                        var scormBuildAction = {
                            isDelivering: ko.computed(function () {
                                return false;
                            })
                        };
                        viewModel.scormBuildAction(scormBuildAction);
                        viewModel.downloadScormCourse();
                        expect(viewModel.activeAction()).toBe(scormBuildAction);
                    });

                    it('should start scorm build of current course', function () {
                        courseRepositoryGetByIdDefer.resolve(course);
                        var promise = viewModel.downloadScormCourse();

                        waitsFor(function () {
                            return !promise.isPending();
                        });

                        runs(function () {
                            expect(course.scormBuild).toHaveBeenCalled();
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


                it('should be a function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.activate()).toBePromise();
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

                    it('should set router.activeItem.settings.lifecycleData.redirect to \'404\'', function () {
                        router.activeItem.settings.lifecycleData = null;

                        var promise = viewModel.activate('courseId');
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.activeItem.settings.lifecycleData.redirect).toBe('404');
                        });
                    });

                    it('should reject promise', function () {
                        var promise = viewModel.activate('courseId');

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith('reason');
                        });
                    });
                });

                describe('when course exists', function () {

                    beforeEach(function () {
                        getById.resolve(course);
                    });

                    it('should define publish action', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.publishAction()).toBeDefined();
                        });
                    });

                    it('should set publish action state to succeed', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.publishAction().state()).toEqual(constants.deliveringStates.succeed);
                        });
                    });

                    it('should define build action', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.buildAction()).toBeDefined();
                        });
                    });

                    it('should set build action state to succeed', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.buildAction().state()).toEqual(constants.deliveringStates.succeed);
                        });
                    });

                    it('should define scorm build action', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.scormBuildAction()).toBeDefined();
                        });
                    });

                    it('should set scorm build action state to succeed', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.scormBuildAction().state()).toEqual(constants.deliveringStates.succeed);
                        });
                    });

                    it('should set current course id', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.id).toEqual(course.id);
                        });
                    });

                    it('should set current packageUrl', function () {
                        viewModel.packageUrl('');

                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
                        });
                        runs(function () {
                            expect(viewModel.packageUrl()).toEqual(course.packageUrl);
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

            });

            describe('when course was changed in any part of application', function () {

                beforeEach(function () {
                    viewModel.packageUrl = ko.observable('');
                    viewModel.publishedPackageUrl = ko.observable('');
                    viewModel.activeAction({
                        state: ko.observable(),
                        isDelivering: ko.computed(function () {
                            return false;
                        })
                    });
                });

                describe('when course build was started', function () {

                    describe('for current course', function() {

                        it('should change active action state to \'building\'', function () {
                            viewModel.id = course.id;

                            app.trigger(constants.messages.course.build.started, course);

                            expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.building);
                        });
                    });

                    describe('for any other course', function() {
                        it('should not change active action state', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state(constants.deliveringStates.notStarted);
                            app.trigger(constants.messages.course.build.started, { id: '100500' });

                            expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.notStarted);
                        });
                    });

                });

                describe('when course build completed', function () {

                    describe('for current course', function () {
                        
                        describe('when active action is build action', function () {

                            beforeEach(function () {
                                debugger;
                                var action = {
                                    state: ko.observable(),
                                    isDelivering: ko.computed(function() {
                                        return false;
                                    })
                                };
                                
                                viewModel.activeAction(action);
                                viewModel.buildAction(action);
                            });

                            it('should set active action state to succeed', function () {
                                viewModel.id = course.id;
                                app.trigger(constants.messages.course.build.completed, course);

                                expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.succeed);
                            });
                            
                            it('should set packageUrl form course packageUrl', function () {
                                viewModel.id = course.id;
                                viewModel.packageUrl("");

                                course.packageUrl = "http://xxx.com";
                                app.trigger(constants.messages.course.build.completed, course);

                                expect(viewModel.packageUrl()).toEqual(course.packageUrl);
                            });
                        });
                        
                        describe('when active action is scorm build action', function () {

                            beforeEach(function () {
                                viewModel.scormBuildAction({
                                    state: ko.observable(),
                                    isDelivering: ko.computed(function () {
                                        return false;
                                    })
                                });
                                viewModel.activeAction(viewModel.scormBuildAction());
                            });

                            it('should set active action state to succeed', function () {
                                viewModel.id = course.id;
                                app.trigger(constants.messages.course.build.completed, course);

                                expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.succeed);
                            });
                        });
                        
                    });

                    describe('for any other course', function () {
                        it('should not update active action state', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state(constants.deliveringStates.notStarted);
                            app.trigger(constants.messages.course.build.completed, { id: '100500' });

                            expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.notStarted);
                        });

                        it('should not update current packageUrl', function () {
                            viewModel.id = course.id;
                            viewModel.packageUrl("http://xxx.com");
                            app.trigger(constants.messages.course.build.completed, { id: '100500' });

                            expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                        });
                    });

                });

                describe('when course build failed', function () {

                    describe('for current course', function() {
                        var message = "message";

                        it('should update active action state to \'failed\'', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state('');

                            app.trigger(constants.messages.course.build.failed, course.id, message);

                            expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.failed);
                        });

                        it('should remove packageUrl', function () {
                            viewModel.id = course.id;
                            viewModel.packageUrl("packageUrl");

                            app.trigger(constants.messages.course.build.failed, course.id, message);

                            expect(viewModel.packageUrl()).toEqual("");
                        });
                    });

                    describe('for any other course', function() {
                        it('should not update current active action to \'failed\'', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state('');

                            app.trigger(constants.messages.course.build.failed, '100500');

                            expect(viewModel.activeAction().state()).toEqual('');
                        });

                        it('should not remove packageUrl', function () {
                            viewModel.id = course.id;
                            viewModel.packageUrl("packageUrl");

                            app.trigger(constants.messages.course.build.failed, '100500');

                            expect(viewModel.packageUrl()).toEqual("packageUrl");
                        });
                    });

                });

                // publish

                describe('when course publish was started', function () {

                    describe('for current course', function() {
                        it('should change active action state to \'publishing\'', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state('');
                            app.trigger(constants.messages.course.publish.started, course);

                            expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.publishing);
                        });
                    });

                    describe('for any other course', function() {
                        it('should not change active action state', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state(constants.deliveringStates.notStarted);
                            app.trigger(constants.messages.course.publish.started, { id: '100500' });

                            expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.notStarted);
                        });

                    });

                });

                describe('when course publish completed', function () {

                    describe('for current course', function() {
                        it('should update active action state to \'success\'', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state("");

                            course.buildingStatus = constants.deliveringStates.succeed;
                            app.trigger(constants.messages.course.publish.completed, course);

                            expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.succeed);
                        });

                        it('should update current publishedPackageUrl to the corresponding one', function () {
                            viewModel.id = course.id;
                            viewModel.publishedPackageUrl("");

                            course.publishedPackageUrl = "http://xxx.com";
                            app.trigger(constants.messages.course.publish.completed, course);

                            expect(viewModel.publishedPackageUrl()).toEqual(course.publishedPackageUrl);
                        });
                    });

                    describe('for any other course', function() {

                        it('should not update active action state', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state(constants.deliveringStates.notStarted);
                            app.trigger(constants.messages.course.publish.completed, { id: '100500' });

                            expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.notStarted);
                        });

                        it('should not update current publishedPackageUrl', function () {
                            viewModel.id = course.id;
                            viewModel.publishedPackageUrl("http://xxx.com");
                            app.trigger(constants.messages.course.publish.completed, { id: '100500' });

                            expect(viewModel.publishedPackageUrl()).toEqual("http://xxx.com");
                        });
                    });

                });

                describe('when course publish failed', function () {

                    describe('for current course', function() {
                        var message = "message";

                        it('should update active action state to \'failed\'', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state('');

                            app.trigger(constants.messages.course.publish.failed, course.id, message);

                            expect(viewModel.activeAction().state()).toEqual(constants.deliveringStates.failed);
                        });

                        it('should remove publishedPackageUrl', function () {
                            viewModel.id = course.id;
                            viewModel.publishedPackageUrl("publishedPackageUrl");

                            app.trigger(constants.messages.course.publish.failed, course.id, message);

                            expect(viewModel.publishedPackageUrl()).toEqual("");
                        });
                    });

                    describe('for any other course', function() {
                        it('should not update active action state to \'failed\'', function () {
                            viewModel.id = course.id;
                            viewModel.activeAction().state('');

                            app.trigger(constants.messages.course.publish.failed, '100500');

                            expect(viewModel.activeAction().state()).toEqual('');
                        });

                        it('should not remove packageUrl', function () {
                            viewModel.id = course.id;
                            viewModel.publishedPackageUrl("packageUrl");

                            app.trigger(constants.messages.course.publish.failed, '100500');

                            expect(viewModel.publishedPackageUrl()).toEqual("packageUrl");
                        });
                    });

                });
            });

            describe('openPublishedCourse:', function () {

                it('should be function', function () {
                    expect(viewModel.openPublishedCourse).toBeFunction();
                });

                describe('when course successfully published', function () {

                    beforeEach(function () {
                        viewModel.publishAction({
                            state: ko.observable(constants.deliveringStates.succeed)
                        });
                    });

                    it('should open publish url', function () {
                        viewModel.publishedPackageUrl('Some url');

                        viewModel.openPublishedCourse();
                        expect(router.openUrl).toHaveBeenCalledWith(viewModel.publishedPackageUrl());
                    });

                });

                describe('when course not published', function () {

                    beforeEach(function () {
                        viewModel.publishAction({
                            state: ko.observable(constants.deliveringStates.failed)
                        });
                    });

                    it('should not open link', function () {
                        viewModel.publishedPackageUrl('Some url');

                        viewModel.openPublishedCourse();
                        expect(router.openUrl).not.toHaveBeenCalledWith(viewModel.publishedPackageUrl());
                    });

                });

            });
        });

    }
);
