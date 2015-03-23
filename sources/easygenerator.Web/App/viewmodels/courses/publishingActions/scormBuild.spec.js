define(['viewmodels/courses/publishingActions/scormBuild', 'models/course', 'constants', 'durandal/app', 'notify', 'eventTracker', 'fileHelper', 'plugins/router', 'userContext'],
    function (scormBuildPublishingAction, Course, constants, app, notify, eventTracker, fileHelper, router, userContext) {

        describe('publishing action [scormBuild]', function () {

            var
                viewModel,
                course = new Course({
                    id: 'someId'
                });

            beforeEach(function () {
                course.scormBuild.url = 'scormBuildUrl';
                viewModel = scormBuildPublishingAction(course);
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'hide');
                spyOn(fileHelper, 'downloadFile').and.callFake(function () { });
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
                    beforeEach(function () {
                        viewModel.state('');
                    });

                    it('should return true', function () {
                        expect(viewModel.isPublishing()).toBeFalsy();
                    });
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

                var courseScormBuildDefer;
                var courseScormBuildPromise;

                beforeEach(function () {
                    courseScormBuildDefer = Q.defer();
                    courseScormBuildPromise = courseScormBuildDefer.promise;
                    spyOn(course, 'scormBuild').and.returnValue(courseScormBuildPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.downloadCourse).toBeFunction();
                });

                describe('when course is not delivering', function () {

                    beforeEach(function () {
                        viewModel.isCourseDelivering(false);
                    });

                    it('should send event \"Download SCORM 1.2 course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Download SCORM 1.2 course');
                    });

                    it('should start scorm build of current course', function (done) {
                        courseScormBuildDefer.resolve();

                        viewModel.downloadCourse().fin(function () {
                            expect(course.scormBuild).toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('when course scorm build finished successfully', function () {
                        beforeEach(function () {
                            courseScormBuildDefer.resolve({ scormBuild: { packageUrl: 'scorm_package_url' } });
                        });

                        it('should download file', function (done) {
                            viewModel.downloadCourse().fin(function () {
                                expect(fileHelper.downloadFile).toHaveBeenCalledWith('download/scorm_package_url');
                                done();
                            });
                        });

                    });

                    describe('when course scorm build failed', function () {

                        var message = 'Some error message';
                        beforeEach(function () {
                            courseScormBuildDefer.reject(message);
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

                    it('should not send event \"Download SCORM 1.2 course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).not.toHaveBeenCalledWith('Download SCORM 1.2 course');
                    });

                });

            });

            describe('openUpgradePlanUrl:', function () {

                beforeEach(function () {
                    spyOn(router, 'openUrl');
                });

                it('should be function', function () {
                    expect(viewModel.openUpgradePlanUrl).toBeFunction();
                });

                it('should send event \'Upgrade now\'', function () {
                    viewModel.openUpgradePlanUrl();
                    expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.scorm);
                });

                it('should open upgrade link in new window', function () {
                    viewModel.openUpgradePlanUrl();
                    expect(router.openUrl).toHaveBeenCalledWith(constants.upgradeUrl);
                });

            });

            describe('userHasPublishAccess:', function () {
                describe('when user has starter access', function() {
                    beforeEach(function () {
                        spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                        viewModel = scormBuildPublishingAction(course);
                    });

                    it('should be true', function() {
                        expect(viewModel.userHasPublishAccess).toBeTruthy();
                    });
                });

                describe('when user does not have starter access', function () {
                    beforeEach(function () {
                        spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                        viewModel = scormBuildPublishingAction(course);
                    });

                    it('should be false', function () {
                        expect(viewModel.userHasPublishAccess).toBeFalsy();
                    });
                });
            });

            describe('when course scorm build was started', function () {

                describe('and when course is current course', function () {

                    it('should change action state to \'building\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.scromBuildStarted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.building);
                    });

                });

                describe('and when course is any other course', function () {
                    it('should not change scorm build action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.scromBuildStarted({ id: '100500' });

                        expect(viewModel.state()).toEqual('');
                    });

                });

            });

            describe('when course scorm build completed', function () {

                describe('and when course is current course', function () {
                    it('should update scorm build action state to \'success\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        course.buildingStatus = constants.publishingStates.succeed;
                        viewModel.scromBuildCompleted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.succeed);
                    });

                    it('should update current scorm build package url to the corresponding one', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('');

                        course.scormBuild.packageUrl = "http://xxx.com";
                        viewModel.scromBuildCompleted(course);

                        expect(viewModel.packageUrl()).toEqual(course.scormBuild.packageUrl);
                    });
                });

                describe('and when course is any other course', function () {

                    it('should not update action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.publishingStates.notStarted);

                        viewModel.scromBuildCompleted({ id: '100500' });

                        expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                    });

                    it('should not update current publishedPackageUrl', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl("http://xxx.com");

                        viewModel.scromBuildCompleted({ id: '100500' });

                        expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                    });
                });

            });

            describe('when course scorm build failed', function () {

                describe('and when course is current course', function () {

                    it('should update scorm build action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.scrormBuildFailed(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.failed);
                    });

                    it('should remove scorm build package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('publishedPackageUrl');

                        viewModel.scrormBuildFailed(course);

                        expect(viewModel.packageUrl()).toEqual('');
                    });

                });

                describe('and when course is any other course', function () {

                    it('should not update scorm build action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.scrormBuildFailed({ id: '100500' });

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not remove packageUrl', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        viewModel.scrormBuildFailed({ id: '100500' });

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