define(['viewmodels/courses/publishingActions/publish', 'viewmodels/courses/publishingActions/publishingAction', 'models/course',
    'constants', 'durandal/app', 'notify', 'eventTracker', 'plugins/router', 'clientContext'],
    function (publish, publishingAction, Course, constants, app, notify, eventTracker, router, clientContext) {

        describe('course delivering action [publish]', function () {

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
                spyOn(clientContext, 'set');
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

            describe('courseHasUnpublishedChanges:', function () {
                it('should be observable', function () {
                    expect(viewModel.courseHasUnpublishedChanges).toBeObservable();
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

                describe('when course is not delivering', function () {

                    beforeEach(function () {
                        viewModel.isCourseDelivering(false);
                    });

                    it('should send event \"Publish course\"', function () {
                        viewModel.publishCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Publish course', undefined);
                    });

                    it('should start publish of current course', function (done) {
                        coursePublishDefer.resolve();
                        viewModel.publishCourse().fin(function () {
                            expect(course.publish).toHaveBeenCalled();
                            done();
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
                    });
                });

                describe('when course is delivering', function () {
                    beforeEach(function () {
                        viewModel.isCourseDelivering(true);
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

            describe('courseStateChanged:', function () {

                describe('when state hasUnpublishedChanges is true', function () {
                    it('should update courseHasUnpublishedChanges to true', function () {
                        viewModel.courseHasUnpublishedChanges(false);
                        viewModel.courseStateChanged({ hasUnpublishedChanges: true });
                        expect(viewModel.courseHasUnpublishedChanges()).toBeTruthy();
                    });
                });

                describe('when state hasUnpublishedChanges is false', function () {
                    it('should update courseHasUnpublishedChanges to false', function () {
                        viewModel.courseHasUnpublishedChanges(true);
                        viewModel.courseStateChanged({ hasUnpublishedChanges: false });
                        expect(viewModel.courseHasUnpublishedChanges()).toBeFalsy();
                    });
                });
            });

            describe('when course build was started', function () {

                describe('and when course is current course', function () {

                    beforeEach(function () {
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

                    beforeEach(function () {
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

                    beforeEach(function () {
                        viewModel.courseId = course.id;
                    });

                    describe('and when ', function () {

                    });

                    it('should change action state to \'publishing\'', function () {
                        viewModel.state('');

                        viewModel.coursePublishStarted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.publishing);
                    });

                });

                describe('and when course is any other course', function () {

                    beforeEach(function () {
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

                    beforeEach(function () {
                        viewModel.courseId = course.id;
                    });

                    it('should update action state to \'success\'', function () {
                        viewModel.state('');
                        course.buildingStatus = constants.publishingStates.succeed;

                        viewModel.coursePublishCompleted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.succeed);
                    });

                    it('should update action packageUrl to the corresponding one', function () {
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

            describe('frameWidth:', function () {

                it('should be observable', function () {
                    expect(viewModel.frameWidth).toBeObservable();
                });

            });

            describe('frameHeight:', function () {

                it('should be observable', function () {
                    expect(viewModel.frameHeight).toBeObservable();
                });

            });

            describe('embedCode:', function () {

                var embedCode;

                beforeEach(function () {
                    embedCode = constants.embedCode.replace('{W}', viewModel.frameWidth()).replace('{H}', viewModel.frameHeight()).replace('{src}', course.publish.packageUrl);
                });

                it('should be observable', function () {
                    expect(viewModel.embedCode).toBeObservable();
                });

                it('should be equal embedCode', function () {
                    expect(viewModel.embedCode()).toBe(embedCode);
                });

            });

            describe('copyLinkToClipboard:', function () {

                it('should be function', function () {
                    expect(viewModel.copyLinkToClipboard).toBeFunction();
                });

                it('should send event \'Copy publish link\'', function () {
                    viewModel.eventCategory = 'category';
                    viewModel.copyLinkToClipboard();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Copy publish link', 'category');
                });

            });

            describe('copyLinkToClipboard:', function () {

                it('should be function', function () {
                    expect(viewModel.copyEmbedCodeToClipboard).toBeFunction();
                });

                it('should send event \'Copy embed code\'', function () {
                    viewModel.eventCategory = 'category';
                    viewModel.copyEmbedCodeToClipboard();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Copy embed code', 'category');
                });

            });

            describe('validateFrameWidth:', function () {

                it('should be function', function () {
                    expect(viewModel.validateFrameWidth).toBeFunction();
                });

                describe('when frameWidth is not validate', function () {

                    it('should set frameWidth to default value', function () {
                        viewModel.frameWidth(0);
                        viewModel.validateFrameWidth();
                        expect(viewModel.frameWidth()).toBe(constants.frameSize.width.value);
                    });

                });

                describe('when frameWidth is validate', function () {

                    it('should not update frameWidth', function () {
                        viewModel.frameWidth(25);
                        viewModel.validateFrameWidth();
                        expect(viewModel.frameWidth()).toBe(25);
                    });

                });

            });

            describe('validateFrameHeight:', function () {

                it('should be function', function () {
                    expect(viewModel.validateFrameHeight).toBeFunction();
                });

                describe('when frameHeight is not validate', function () {

                    it('should set frameHeight to default value', function () {
                        viewModel.frameHeight(0);
                        viewModel.validateFrameHeight();
                        expect(viewModel.frameHeight()).toBe(constants.frameSize.height.value);
                    });

                });

                describe('when frameHeight is validate', function () {

                    it('should not update frameHeight', function () {
                        viewModel.frameHeight(25);
                        viewModel.validateFrameHeight();
                        expect(viewModel.frameHeight()).toBe(25);
                    });

                });

            });
        });
    });