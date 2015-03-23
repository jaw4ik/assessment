define(['viewmodels/courses/publishingActions/build', 'models/course', 'constants', 'durandal/app', 'notify', 'eventTracker', 'fileHelper', 'constants'],
    function (buildPublishingAction, Course, constants, app, notify, eventTracker, fileHelper, constants) {

        describe('viewModel [build]', function () {

            var
                viewModel,
                course = new Course({
                    id: 'someId'
                });

            beforeEach(function () {
                course.build.url = 'buildUrl';
                viewModel = buildPublishingAction(course);
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'hide');
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

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

            describe('packageUrl:', function () {
                it('should be observable', function () {
                    expect(viewModel.packageUrl).toBeObservable();
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

            describe('downloadCourse:', function () {

                var courseBuildDefer;
                var courseBuildPromise;

                beforeEach(function () {
                    courseBuildDefer = Q.defer();
                    courseBuildPromise = courseBuildDefer.promise;
                    spyOn(course, 'build').and.returnValue(courseBuildPromise);
                    spyOn(fileHelper, 'downloadFile').and.callFake(function () { });
                });

                it('should be a function', function () {
                    expect(viewModel.downloadCourse).toBeFunction();
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

            describe('when course build was started', function () {

                describe('and when course is current course', function () {

                    beforeEach(function() {
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

                    beforeEach(function() {
                        viewModel.courseId = '100500';
                    });

                    it('should not change build action state', function () {
                        viewModel.state('');

                        viewModel.courseBuildStarted(course);

                        expect(viewModel.state()).toEqual('');
                    });

                });

            });

            describe('when course build completed', function () {

                describe('and when course is current course', function () {

                    beforeEach(function() {
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

                    beforeEach(function() {
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

            describe('when course build failed', function () {

                describe('and when course is current course', function () {

                    beforeEach(function() {
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

            describe('isCourseDelivering:', function () {
                it('should be observable', function () {
                    expect(viewModel.isCourseDelivering).toBeObservable();
                });
            });

            describe('courseDeliveringStarted:', function () {
                it('should be function', function () {
                    expect(viewModel.courseDeliveringStarted).toBeFunction();
                });

                describe('when course is current course', function () {
                    it('should set isCourseDelivering to true', function () {
                        viewModel.isCourseDelivering(false);
                        viewModel.courseDeliveringStarted(course);
                        expect(viewModel.isCourseDelivering()).toBeTruthy();
                    });
                });

                describe('when course is not current course', function () {
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
                    it('should set isCourseDelivering to false', function () {
                        viewModel.isCourseDelivering(true);
                        viewModel.courseDeliveringFinished(course);
                        expect(viewModel.isCourseDelivering()).toBeFalsy();
                    });
                });

                describe('when course is not current course', function () {
                    it('should not change isCourseDelivering', function () {
                        viewModel.isCourseDelivering(true);
                        viewModel.courseDeliveringFinished({ id: 'none' });
                        expect(viewModel.isCourseDelivering()).toBeTruthy();
                    });
                });
            });
        });
    })