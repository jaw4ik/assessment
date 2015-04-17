define(['viewmodels/courses/publishingActions/build'],
    function (build) {

        var app = require('durandal/app'),
              Course = require('models/course'),
              constants = require('constants'),
              notify = require('notify'),
              eventTracker = require('eventTracker'),
              fileHelper = require('fileHelper'),
              repository = require('repositories/courseRepository')
        ;

        describe('viewModel [build]', function () {

            var
                viewModel,
                getByIdDefer,
                action = function () { },
                course = new Course({
                    id: 'someId'
                });

            action.state = 'someState';
            action.packageUrl = 'some/package/url';
            course.build = action;

            beforeEach(function () {
                course.build.url = 'buildUrl';
                viewModel = build();
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'hide');
                spyOn(app, 'on').and.returnValue(Q.defer().promise);
                spyOn(app, 'off');
                getByIdDefer = Q.defer();
                spyOn(repository, 'getById').and.returnValue(getByIdDefer.promise);
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            //#region Inherited functionality 

            describe('state:', function () {

                it('should be observable', function () {
                    expect(viewModel.state).toBeObservable();
                });
            });

            describe('states:', function () {

                it('should be equal to allowed publish states', function () {
                    expect(viewModel.states).toEqual(constants.publishingStates);
                });

            });

            describe('isCourseDelivering:', function () {
                it('should be observable', function () {
                    expect(viewModel.isCourseDelivering).toBeObservable();
                });
            });

            describe('packageUrl:', function () {
                it('should be observable', function () {
                    expect(viewModel.packageUrl).toBeObservable();
                });
            });

            describe('courseId:', function () {
                it('should be defined', function () {
                    expect(viewModel.courseId).toBeDefined();
                });
            });

            describe('packageExists:', function () {

                it('should be computed', function () {
                    expect(viewModel.packageExists).toBeComputed();
                });

                describe('when packageUrl is not defined', function () {

                    it('should be false', function () {
                        viewModel.packageUrl(undefined);
                        expect(viewModel.packageExists()).toBeFalsy();
                    });

                });

                describe('when packageUrl is empty', function () {

                    it('should be false', function () {
                        viewModel.packageUrl('');
                        expect(viewModel.packageExists()).toBeFalsy();
                    });

                });

                describe('when packageUrl is whitespace', function () {

                    it('should be false', function () {
                        viewModel.packageUrl("    ");
                        expect(viewModel.packageExists()).toBeFalsy();
                    });

                });

                describe('when packageUrl is a non-whitespace string', function () {

                    it('should be true', function () {
                        viewModel.packageUrl("packageUrl");
                        expect(viewModel.packageExists()).toBeTruthy();
                    });

                });

            });

            describe('subscriptions:', function () {
                it('should be array', function () {
                    expect(viewModel.subscriptions).toBeArray();
                });
            });

            describe('courseDeliveringStarted:', function () {
                it('should be function', function () {
                    expect(viewModel.courseDeliveringStarted).toBeFunction();
                });

                describe('when course is current course', function () {
                    beforeEach(function () {
                        viewModel.courseId = course.id;
                    });

                    it('should set isCourseDelivering to true', function () {
                        viewModel.isCourseDelivering(false);
                        viewModel.courseDeliveringStarted(course);
                        expect(viewModel.isCourseDelivering()).toBeTruthy();
                    });
                });

                describe('when course is not current course', function () {
                    beforeEach(function () {
                        viewModel.courseId = '';
                    });

                    it('should not change isCourseDelivering', function () {
                        viewModel.isCourseDelivering(false);
                        viewModel.courseDeliveringStarted({ id: 'none' });
                        expect(viewModel.isCourseDelivering()).toBeFalsy();
                    });
                });
            });

            describe('courseDeliveringFinished:', function () {
                it('should be function', function () {
                    expect(viewModel.courseDeliveringFinished).toBeFunction();
                });

                describe('when course is current course', function () {
                    beforeEach(function () {
                        viewModel.courseId = course.id;
                    });

                    it('should set isCourseDelivering to false', function () {
                        viewModel.isCourseDelivering(true);
                        viewModel.courseDeliveringFinished(course);
                        expect(viewModel.isCourseDelivering()).toBeFalsy();
                    });
                });

                describe('when course is not current course', function () {
                    beforeEach(function () {
                        viewModel.courseId = '';
                    });

                    it('should not change isCourseDelivering', function () {
                        viewModel.isCourseDelivering(true);
                        viewModel.courseDeliveringFinished({ id: 'none' });
                        expect(viewModel.isCourseDelivering()).toBeTruthy();
                    });
                });
            });

            describe('deactivate:', function () {
                var subscriptions;
                beforeEach(function () {
                    subscriptions = [{ off: function () { } }, { off: function () { } }];
                    spyOn(subscriptions[0], 'off');
                    spyOn(subscriptions[1], 'off');

                    viewModel.subscriptions = [subscriptions[0], subscriptions[1]];
                });

                it('should be function', function () {
                    expect(viewModel.deactivate).toBeFunction();
                });

                it('should call off() for each subsription', function () {
                    viewModel.deactivate();
                    expect(subscriptions[0].off).toHaveBeenCalled();
                    expect(subscriptions[1].off).toHaveBeenCalled();
                });

                it('should clear subscriptions', function () {
                    viewModel.deactivate();
                    expect(viewModel.subscriptions.length).toBe(0);
                });
            });

            describe('activate:', function () {
                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.activate()).toBePromise();
                });

                describe('when course received', function () {
                    beforeEach(function () {
                        getByIdDefer.resolve(course);
                    });

                    it('should set state', function (done) {
                        viewModel.state('');
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(viewModel.state()).toBe(action.state);
                            done();
                        });
                    });

                    it('should set packageUrl', function (done) {
                        viewModel.packageUrl('');
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(viewModel.packageUrl()).toBe(action.packageUrl);
                            done();
                        });
                    });

                    it('should set isCourseDelivering', function (done) {
                        viewModel.isCourseDelivering(false);
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(viewModel.isCourseDelivering()).toBe(course.isDelivering);
                            done();
                        });
                    });

                    it('should set courseId', function (done) {
                        viewModel.courseId = '';
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(viewModel.courseId).toBe(course.id);
                            done();
                        });
                    });

                    it('should subscribe to course.delivering.started event', function (done) {
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.course.delivering.started);
                            done();
                        });
                    });

                    it('should subscribe to course.delivering.finished event', function (done) {
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.course.delivering.finished);
                            done();
                        });
                    });

                    it('should fill subscriptions', function (done) {
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(viewModel.subscriptions.length).toBe(5);
                            done();
                        });
                    });

                    it('should subscribe to course.build.started event', function (done) {
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.course.build.started);
                            done();
                        });
                    });

                    it('should subscribe to course.build.failed event', function (done) {
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.course.build.failed);
                            done();
                        });
                    });

                    it('should subscribe to course.build.completed event', function (done) {
                        var promise = viewModel.activate(course.id);
                        promise.fin(function () {
                            expect(app.on).toHaveBeenCalledWith(constants.messages.course.build.completed);
                            done();
                        });
                    });
                });
            });

            //#endregion

            describe('isPublishing', function () {
                it('should be computed', function () {
                    expect(viewModel.isPublishing).toBeComputed();
                });

                describe('when state is \'building\'', function () {
                    beforeEach(function () {
                        viewModel.state(constants.publishingStates.building);
                    });

                    it('should return true', function () {
                        expect(viewModel.isPublishing()).toBeTruthy();
                    });
                });

                describe('when state is not \'building\'', function () {
                    beforeEach(function () {
                        viewModel.state('');
                    });

                    it('should return true', function () {
                        expect(viewModel.isPublishing()).toBeFalsy();
                    });
                });
            });

            describe('downloadCourse:', function () {

                var courseBuildDefer;
                var courseBuildPromise;

                beforeEach(function () {
                    viewModel.courseId = course.id;
                    courseBuildDefer = Q.defer();
                    courseBuildPromise = courseBuildDefer.promise;
                    spyOn(course, 'build').and.returnValue(courseBuildPromise);
                    spyOn(fileHelper, 'downloadFile').and.callFake(function () { });
                });

                it('should be a function', function () {
                    expect(viewModel.downloadCourse).toBeFunction();
                });

                describe('when course received', function() {
                    beforeEach(function() {
                        getByIdDefer.resolve(course);
                    });

                    describe('when course is not delivering', function () {

                        beforeEach(function () {
                            viewModel.isCourseDelivering(false);
                        });

                        it('should send event \"Download course\"', function () {
                            viewModel.downloadCourse();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Download course');
                        });

                        it('should start build of current course', function (done) {
                            courseBuildDefer.resolve();

                            viewModel.downloadCourse().fin(function () {
                                expect(course.build).toHaveBeenCalled();
                                done();
                            });
                        });

                        describe('when course build finished successfully', function () {

                            beforeEach(function () {
                                courseBuildDefer.resolve({ build: { packageUrl: 'package_url' } });
                            });

                            it('should download file', function (done) {
                                viewModel.downloadCourse().fin(function () {
                                    expect(fileHelper.downloadFile).toHaveBeenCalledWith('download/package_url');
                                    done();
                                });
                            });
                        });

                        describe('when course build failed', function () {

                            var message = 'Some error messager';
                            beforeEach(function () {
                                courseBuildDefer.reject(message);
                            });

                            it('should show error notification', function (done) {
                                spyOn(notify, 'error');
                                viewModel.downloadCourse().fin(function () {
                                    expect(notify.error).toHaveBeenCalledWith(message);
                                    done();
                                });
                            });
                        });
                    });

                    describe('when course is delivering', function () {

                        beforeEach(function () {
                            viewModel.isCourseDelivering(true);
                        });

                        it('should not send event \"Download course\"', function () {
                            viewModel.downloadCourse();
                            expect(eventTracker.publish).not.toHaveBeenCalledWith('Download course');
                        });

                    });
                });
            });

            describe('courseBuildStarted:', function () {

                describe('and when course is current course', function () {

                    beforeEach(function () {
                        viewModel.courseId = course.id;
                    });

                    describe('and when course.build state is not ' + constants.publishingStates.building, function () {

                        beforeEach(function () {
                            course.build.state = '';
                        });

                        it('should not change action state to ' + constants.publishingStates.building, function () {
                            viewModel.state('');

                            viewModel.courseBuildStarted(course);

                            expect(viewModel.state()).toEqual('');
                        });

                    });

                    describe('and when course.build state is ' + constants.publishingStates.building, function () {

                        beforeEach(function () {
                            course.build.state = constants.publishingStates.building;
                        });

                        it('should change action state to ' + constants.publishingStates.building, function () {
                            viewModel.state('');

                            viewModel.courseBuildStarted(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.building);
                        });

                    });
                });

                describe('and when course is any other course', function () {

                    beforeEach(function () {
                        viewModel.courseId = '100500';
                    });

                    it('should not change build action state', function () {
                        viewModel.state('');

                        viewModel.courseBuildStarted(course);

                        expect(viewModel.state()).toEqual('');
                    });

                });

            });

            describe('courseBuildCompleted:', function () {

                describe('and when course is current course', function () {

                    beforeEach(function () {
                        viewModel.courseId = course.id;
                    });

                    describe('and when course.build state is not ' + constants.publishingStates.succeed, function () {

                        beforeEach(function () {
                            course.build.state = '';
                        });

                        it('should not update action state', function () {
                            viewModel.state('');

                            viewModel.courseBuildCompleted(course);

                            expect(viewModel.state()).toEqual('');
                        });

                        it('should not update current package url', function () {
                            viewModel.packageUrl("http://xxx.com");

                            viewModel.courseBuildCompleted(course);

                            expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                        });

                    });

                    describe('and when course.build state is ' + constants.publishingStates.succeed, function () {

                        beforeEach(function () {
                            course.build.state = constants.publishingStates.succeed;
                        });

                        it('should update action state to ' + constants.publishingStates.succeed, function () {
                            viewModel.state('');

                            viewModel.courseBuildCompleted(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.succeed);
                        });

                        it('should update current package url to the corresponding one', function () {
                            viewModel.packageUrl('');

                            course.build.packageUrl = "http://xxx.com";

                            viewModel.courseBuildCompleted(course);

                            expect(viewModel.packageUrl()).toEqual(course.build.packageUrl);
                        });

                    });

                });

                describe('and when course is any other course', function () {

                    beforeEach(function () {
                        viewModel.courseId = '100500';
                    });

                    it('should not update action state', function () {
                        viewModel.state('');

                        viewModel.courseBuildCompleted(course);

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not update current package url', function () {
                        viewModel.packageUrl("http://xxx.com");

                        viewModel.courseBuildCompleted(course);

                        expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                    });

                });

            });

            describe('courseBuildFailed:', function () {

                describe('and when course is current course', function () {

                    beforeEach(function () {
                        viewModel.courseId = course.id;
                    });

                    describe('and when course.build state is not ' + constants.publishingStates.failed, function () {

                        beforeEach(function () {
                            course.build.state = '';
                        });

                        it('should not update build action state to \'failed\'', function () {
                            viewModel.state('');

                            viewModel.courseBuildCompleted(course);

                            expect(viewModel.state()).toEqual('');
                        });

                        it('should not remove packageUrl', function () {
                            viewModel.packageUrl('packageUrl');

                            viewModel.courseBuildCompleted(course);

                            expect(viewModel.packageUrl()).toEqual('packageUrl');
                        });

                    });

                    describe('and when course.build state is ' + constants.publishingStates.failed, function () {

                        beforeEach(function () {
                            course.build.state = constants.publishingStates.failed;
                        });

                        it('should update action state to ' + constants.publishingStates.failed, function () {
                            viewModel.state('');

                            viewModel.courseBuildFailed(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.failed);
                        });

                        it('should remove package url', function () {
                            viewModel.packageUrl('publishedPackageUrl');

                            viewModel.courseBuildFailed(course);

                            expect(viewModel.packageUrl()).toEqual('');
                        });

                    });
                });

                describe('and when course is any other course', function () {

                    beforeEach(function () {
                        viewModel.courseId = '100500';
                    });

                    it('should not update build action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.courseBuildFailed({ id: '100500' });

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not remove packageUrl', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        viewModel.courseBuildFailed({ id: '100500' });

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });

                });

            });
        });
    })