define(['viewmodels/courses/publishingActions/publish', 'viewmodels/courses/publishingActions/publishingAction', 'models/course',
    'constants', 'durandal/app', 'notify', 'eventTracker', 'plugins/router'],
    function (publish, publishingAction, Course, constants, app, notify, eventTracker, router) {

        describe('viewModel [publish]', function () {

            var
                viewModel,
                course = new Course({
                    id: 'someId'
                });

            beforeEach(function () {
                course.publish.packageUrl = 'packageUrl';
                viewModel = publish(course);
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'hide');
                spyOn(router, 'openUrl');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('state:', function () {
                it('should be observable', function () {
                    expect(viewModel.state).toBeObservable();
                });
            });

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

                    describe('when state is \'publishing\'', function () {
                        beforeEach(function () {
                            viewModel.state(constants.publishingStates.publishing);
                        });

                        it('should return true', function () {
                            expect(viewModel.isPublishing()).toBeTruthy();
                        });
                    });

                    describe('when state is not \'publishing\'', function () {
                        beforeEach(function () {
                            viewModel.state('');
                        });

                        it('should return false', function () {
                            expect(viewModel.isPublishing()).toBeFalsy();
                        });
                    });

                });
            });

            describe('packageUrl:', function () {
                it('should be observable', function () {
                    expect(viewModel.packageUrl).toBeObservable();
                });

                it('should be equal to ctor parameter', function () {
                    expect(viewModel.packageUrl()).toBe(course.publish.packageUrl);
                });
            });

            describe('courseId:', function () {
                it('should be defined', function () {
                    expect(viewModel.courseId).toBeDefined();
                });

                it('should be equal to ctor parameter', function () {
                    expect(viewModel.courseId).toBe(course.id);
                });
            });

            describe('isActive:', function () {
                it('should be observable', function () {
                    expect(viewModel.isActive).toBeObservable();
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

            describe('publishCourse:', function () {

                var coursePublishDefer;
                var coursePublishPromise;

                beforeEach(function () {
                    coursePublishDefer = Q.defer();
                    coursePublishPromise = coursePublishDefer.promise;
                    spyOn(course, 'publish').and.returnValue(coursePublishPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.publishCourse).toBeFunction();
                });

                describe('when action is not active', function () {

                    beforeEach(function () {
                        viewModel.isActive(false);
                    });

                    it('should send event \"Publish course\"', function () {
                        viewModel.publishCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Publish course');
                    });

                    it('should hide notification', function () {
                        viewModel.publishCourse();
                        expect(notify.hide).toHaveBeenCalled();
                    });

                    it('should set isActive to true', function () {
                        viewModel.publishCourse();
                        expect(viewModel.isActive()).toBeTruthy();
                    });

                    it('should start publish of current course', function (done) {
                        coursePublishDefer.resolve();
                        viewModel.publishCourse().fin(function () {
                            expect(course.publish).toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('when course publish finished successfully', function () {
                        beforeEach(function () {
                            coursePublishDefer.resolve();
                        });

                        it('should set isActive() to false', function (done) {
                            viewModel.publishCourse().fin(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                                done();
                            });
                        });
                    });

                    describe('when course publish failed', function () {

                        var message = 'Some error message';
                        beforeEach(function () {
                            coursePublishDefer.reject(message);
                        });

                        it('should show error notification', function (done) {
                            spyOn(notify, 'error');
                            viewModel.publishCourse().fin(function () {
                                expect(notify.error).toHaveBeenCalledWith(message);
                                done();
                            });
                        });

                        it('should set isActive() to false', function (done) {
                            viewModel.publishCourse().fin(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                                done();
                            });
                        });
                    });
                });

                describe('when publish process is running', function () {
                    beforeEach(function () {
                        viewModel.isActive(true);
                    });

                    it('should not send event \"Publish course\"', function () {
                        viewModel.publishCourse();
                        expect(eventTracker.publish).not.toHaveBeenCalledWith('Publish course');
                    });
                });
            });

            describe('openPublishedCourse:', function () {

                it('should be function', function () {
                    expect(viewModel.openPublishedCourse).toBeFunction();
                });

                describe('when package exists', function () {

                    beforeEach(function () {
                        spyOn(viewModel, 'packageExists').and.returnValue(true);
                    });

                    it('should open publish url', function () {
                        viewModel.packageUrl('Some url');

                        viewModel.openPublishedCourse();
                        expect(router.openUrl).toHaveBeenCalledWith(viewModel.packageUrl());
                    });

                });

                describe('when package not exists', function () {

                    beforeEach(function () {
                        spyOn(viewModel, 'packageExists').and.returnValue(false);
                    });

                    it('should not open link', function () {
                        viewModel.packageUrl('Some url');

                        viewModel.openPublishedCourse();
                        expect(router.openUrl).not.toHaveBeenCalledWith(viewModel.packageUrl());
                    });

                });

            });

            describe('when course build was started', function () {

                describe('and when course is current course', function () {

                    beforeEach(function() {
                        viewModel.courseId = course.id;
                    });

                    describe('and when course.publish state is not ' + constants.publishingStates.building, function () {

                        beforeEach(function () {
                            course.publish.state = '';
                        });

                        it('should not change action state', function () {
                            viewModel.state(constants.publishingStates.notStarted);

                            viewModel.courseBuildStarted(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                        });
                    });

                    describe('and when course.publish state is ' + constants.publishingStates.building, function () {

                        beforeEach(function () {
                            course.publish.state = constants.publishingStates.building;
                        });

                        it('should change action state to ' + constants.publishingStates.building, function () {
                            viewModel.state('');

                            viewModel.courseBuildStarted(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.building);
                        });
                    });
                });

                describe('and when course is any other course', function () {

                    beforeEach(function() {
                        viewModel.courseId = '100500';
                    });

                    it('should not change action state', function () {
                        viewModel.state(constants.publishingStates.notStarted);

                        viewModel.courseBuildStarted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                    });
                });

            });

            describe('when course build was failed', function () {

                describe('and when course is current course', function () {

                    beforeEach(function () {
                        viewModel.courseId = course.id;
                    });

                    describe('and when course.publish state is not ' + constants.publishingStates.failed, function () {

                        beforeEach(function () {
                            course.publish.state = '';
                        });

                        it('should not change action state', function () {
                            viewModel.state(constants.publishingStates.notStarted);

                            viewModel.courseBuildFailed(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                        });

                        it('should not clear package url', function () {
                            viewModel.packageUrl('packageUrl');

                            viewModel.courseBuildFailed(course);

                            expect(viewModel.packageUrl()).toEqual('packageUrl');
                        });
                    });

                    describe('and when course.publish state is ' + constants.publishingStates.failed, function () {

                        beforeEach(function () {
                            course.publish.state = constants.publishingStates.failed;
                        });

                        it('should change action state to ' + constants.publishingStates.failed, function () {
                            viewModel.state('');

                            viewModel.courseBuildFailed(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.failed);
                        });

                        it('should clear package url', function () {
                            viewModel.packageUrl('packageUrl');

                            viewModel.courseBuildFailed(course);

                            expect(viewModel.packageUrl()).toEqual('');
                        });
                    });
                });

                describe('and when course is any other course', function () {

                    beforeEach(function () {
                        viewModel.courseId = '100500';
                    });

                    it('should not change action state', function () {
                        viewModel.state(constants.publishingStates.notStarted);

                        viewModel.courseBuildFailed(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                    });

                    it('should not clear package url', function () {
                        viewModel.packageUrl('packageUrl');

                        viewModel.courseBuildFailed(course);

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });

                });

            });

            describe('when course publish was started', function () {

                describe('and when course is current course', function () {

                    beforeEach(function() {
                        viewModel.courseId = course.id;
                    });

                    describe('and when ', function() {
                        
                    });

                    it('should change action state to \'publishing\'', function () {
                        viewModel.state('');

                        viewModel.coursePublishStarted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.publishing);
                    });

                });

                describe('and when course is any other course', function () {

                    beforeEach(function() {
                        viewModel.courseId = '100500';
                    });

                    it('should not change action state', function () {
                        viewModel.state(constants.publishingStates.notStarted);

                        viewModel.coursePublishStarted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                    });

                });

            });

            describe('when course publish completed', function () {

                describe('and when course is current course', function () {

                    it('should update action state to \'success\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');
                        course.buildingStatus = constants.publishingStates.succeed;

                        viewModel.coursePublishCompleted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.succeed);
                    });

                    it('should update action packageUrl to the corresponding one', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('');
                        course.publish.packageUrl = "http://xxx.com";

                        viewModel.coursePublishCompleted(course);

                        expect(viewModel.packageUrl()).toEqual(course.publish.packageUrl);
                    });

                });

                describe('and when course is any other course', function () {

                    it('should not update action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.publishingStates.notStarted);

                        viewModel.coursePublishCompleted({ id: '100500' });

                        expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                    });

                    it('should not update current publishedPackageUrl', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('http://xxx.com');

                        viewModel.coursePublishCompleted({ id: '100500' });

                        expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                    });
                });

            });

            describe('when course publish failed', function () {

                describe('and when course is current course', function () {

                    it('should update action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.coursePublishFailed(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.failed);
                    });

                    it('should clear package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('publishedPackageUrl');

                        viewModel.coursePublishFailed(course);

                        expect(viewModel.packageUrl()).toEqual('');
                    });
                });

                describe('and when course is any other course', function () {

                    it('should not update publish action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.coursePublishFailed({ id: '100500' });

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not clear package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        viewModel.coursePublishFailed({ id: '100500' });

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });

                });

            });

        });
    })