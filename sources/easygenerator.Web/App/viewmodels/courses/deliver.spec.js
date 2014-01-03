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

            describe('deliveringState:', function () {

                it('should be observable', function () {
                    expect(viewModel.deliveringState).toBeObservable();
                });

            });

            describe('publishedPackageUrl:', function () {

                it('should be observable', function () {
                    expect(viewModel.publishedPackageUrl).toBeObservable();
                });

            });

            describe('states:', function () {

                it('should be equal to allowed deliver states', function () {
                    expect(viewModel.states).toEqual(constants.deliveringStates);
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
                        viewModel.deliveringState(constants.deliveringStates.notStarted);
                    });

                    it('should send event \'Publish course\'', function () {
                        viewModel.publishCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Publish course');
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
                        viewModel.deliveringState(constants.deliveringStates.notStarted);
                    });

                    it('should send event \"Download course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Download course');
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

                    it('should set current course id', function () {
                        viewModel.id = undefined;

                        var promise = viewModel.activate(course.id);

                        waitsFor(function () {
                            return promise.isFulfilled();
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
                    viewModel.showStatus = ko.observable(false);
                    viewModel.packageUrl = ko.observable('');
                    viewModel.publishedPackageUrl = ko.observable('');
                });

                describe('when current course build was started in any part of application', function () {

                    it('should change course deliveringState to \'building\'', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState('');
                        app.trigger(constants.messages.course.build.started, course);

                        expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.building);
                    });

                });

                describe('when any other course build was started in any part of application', function () {

                    it('should not change course deliveringState', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.build.started, { id: '100500' });

                        expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                    });

                });

                describe('when current course build completed in any part of application', function () {

                    it('should update current packageUrl to the corresponding one', function () {
                        viewModel.id = course.id;
                        viewModel.packageUrl("");

                        course.packageUrl = "http://xxx.com";
                        app.trigger(constants.messages.course.build.completed, course);

                        expect(viewModel.packageUrl()).toEqual(course.packageUrl);
                    });

                });

                describe('when any other course build completed in any part of application', function () {

                    it('should not update current deliveringState', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.build.completed, { id: '100500' });

                        expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                    });

                    it('should not update current packageUrl', function () {
                        viewModel.id = course.id;
                        viewModel.packageUrl("http://xxx.com");
                        app.trigger(constants.messages.course.build.completed, { id: '100500' });

                        expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                    });

                });

                describe('when current course build failed in any part of application', function () {

                    var message = "message";

                    it('should update current deliveringState to \'failed\'', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState("");

                        app.trigger(constants.messages.course.build.failed, course.id, message);

                        expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.failed);
                    });

                    it('should remove packageUrl', function () {
                        viewModel.id = course.id;
                        viewModel.packageUrl("packageUrl");

                        app.trigger(constants.messages.course.build.failed, course.id, message);

                        expect(viewModel.packageUrl()).toEqual("");
                    });

                });

                describe('when any other course build failed in any part of application', function () {

                    it('should not update current deliveringState to \'failed\'', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState("");

                        app.trigger(constants.messages.course.build.failed, '100500');

                        expect(viewModel.deliveringState()).toEqual("");
                    });

                    it('should not remove packageUrl', function () {
                        viewModel.id = course.id;
                        viewModel.packageUrl("packageUrl");

                        app.trigger(constants.messages.course.build.failed, '100500');

                        expect(viewModel.packageUrl()).toEqual("packageUrl");
                    });

                });


                // publish
                describe('when current course publish was started in any part of application', function () {

                    it('should change course deliveringState to \'publishing\'', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState('');
                        app.trigger(constants.messages.course.publish.started, course);

                        expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.publishing);
                    });

                });

                describe('when any other course publish was started in any part of application', function () {

                    it('should not change course deliveringState', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.publish.started, { id: '100500' });

                        expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                    });

                });

                describe('when current course publish completed in any part of application', function () {

                    it('should update current publishState to \'success\'', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState("");

                        course.buildingStatus = constants.deliveringStates.succeed;
                        app.trigger(constants.messages.course.publish.completed, course);

                        expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.succeed);
                    });

                    it('should update current publishedPackageUrl to the corresponding one', function () {
                        viewModel.id = course.id;
                        viewModel.publishedPackageUrl("");

                        course.publishedPackageUrl = "http://xxx.com";
                        app.trigger(constants.messages.course.publish.completed, course);

                        expect(viewModel.publishedPackageUrl()).toEqual(course.publishedPackageUrl);
                    });

                });

                describe('when any other course publish completed in any part of application', function () {

                    it('should not update current publishState', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.publish.completed, { id: '100500' });

                        expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.notStarted);
                    });

                    it('should not update current publishedPackageUrl', function () {
                        viewModel.id = course.id;
                        viewModel.publishedPackageUrl("http://xxx.com");
                        app.trigger(constants.messages.course.publish.completed, { id: '100500' });

                        expect(viewModel.publishedPackageUrl()).toEqual("http://xxx.com");
                    });

                });

                describe('when current course publish failed in any part of application', function () {

                    var message = "message";

                    it('should update current deliveringState to \'failed\'', function () {
                        viewModel.id = course.id;
                        viewModel.deliveringState("");

                        app.trigger(constants.messages.course.publish.failed, course.id, message);

                        expect(viewModel.deliveringState()).toEqual(constants.deliveringStates.failed);
                    });

                    it('should remove publishedPackageUrl', function () {
                        viewModel.id = course.id;
                        viewModel.publishedPackageUrl("publishedPackageUrl");

                        app.trigger(constants.messages.course.publish.failed, course.id, message);

                        expect(viewModel.publishedPackageUrl()).toEqual("");
                    });

                });

                describe('when any other course publish failed in any part of application', function () {

                    it('should not update current deliveringState to \'failed\'', function () {
                        viewModel.id = course.id;
                        viewModel.publishedPackageUrl("");

                        app.trigger(constants.messages.course.publish.failed, '100500');

                        expect(viewModel.publishedPackageUrl()).toEqual("");
                    });

                    it('should not remove packageUrl', function () {
                        viewModel.id = course.id;
                        viewModel.publishedPackageUrl("packageUrl");

                        app.trigger(constants.messages.course.publish.failed, '100500');

                        expect(viewModel.publishedPackageUrl()).toEqual("packageUrl");
                    });

                });

            });

            describe('openPublishedCourse:', function () {

                it('should be function', function () {
                    expect(viewModel.openPublishedCourse).toBeFunction();
                });

                describe('when course successfully published', function () {

                    it('should open publish url', function () {
                        viewModel.publishedPackageUrl('Some url');
                        viewModel.deliveringState(viewModel.states.succeed);

                        viewModel.openPublishedCourse();
                        expect(router.openUrl).toHaveBeenCalledWith(viewModel.publishedPackageUrl());
                    });

                });

                describe('when course not published', function () {

                    it('should not open link', function () {
                        viewModel.publishedPackageUrl('Some url');
                        viewModel.deliveringState(viewModel.states.failed);

                        viewModel.openPublishedCourse();
                        expect(router.openUrl).not.toHaveBeenCalledWith(viewModel.publishedPackageUrl());
                    });

                });

            });
        });

    }
);
