define(['viewmodels/courses/publishingActions/scormBuild', 'constants', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'dom'],
    function (scormBuildPublishingAction, constants, app, notify, eventTracker, repository, dom) {

        describe('publishing action [scormBuild]', function () {

            var viewModel,
                packageUrl = 'someUrl',
                courseId = 'courseId',
                course = {
                    id: 'courseId',
                    scormBuild: function () {
                    }
                };

            beforeEach(function () {
                viewModel = scormBuildPublishingAction(courseId, packageUrl);
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'hide');
                spyOn(dom, 'clickElementById');
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

                it('should be equal to cror parameter', function () {
                    expect(viewModel.packageUrl()).toBe(packageUrl);
                });
            });

            describe('courseId:', function () {
                it('should be defined', function () {
                    expect(viewModel.courseId).toBeDefined();
                });

                it('should be equal to cror parameter', function () {
                    expect(viewModel.courseId).toBe(courseId);
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

            describe('downloadCourse:', function () {

                var courseRepositoryGetByIdDefer;
                var courseRepositoryGetByIdPromise;
                var courseScormBuildDefer;
                var courseScormBuildPromise;

                beforeEach(function () {
                    courseRepositoryGetByIdDefer = Q.defer();
                    courseScormBuildDefer = Q.defer();
                    courseRepositoryGetByIdPromise = courseRepositoryGetByIdDefer.promise;
                    courseScormBuildPromise = courseScormBuildDefer.promise;
                    spyOn(repository, 'getById').and.returnValue(courseRepositoryGetByIdPromise);
                    spyOn(course, 'scormBuild').and.returnValue(courseScormBuildPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.downloadCourse).toBeFunction();
                });

                describe('when action is not active', function () {

                    beforeEach(function () {
                        viewModel.isActive(false);
                    });

                    it('should send event \"Download SCORM 1.2 course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Download SCORM 1.2 course');
                    });

                    it('should hide notification', function () {
                        viewModel.downloadCourse();
                        expect(notify.hide).toHaveBeenCalled();
                    });

                    it('should set isActive to true', function () {
                        viewModel.downloadCourse();
                        expect(viewModel.isActive()).toBe(true);
                    });

                    it('should start scorm build of current course', function (done) {
                        courseRepositoryGetByIdDefer.resolve(course);
                        courseScormBuildDefer.resolve();

                        viewModel.downloadCourse().fin(function () {
                            expect(course.scormBuild).toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('when course scorm build finished successfully', function () {
                        beforeEach(function () {
                            courseRepositoryGetByIdDefer.resolve(course);
                            courseScormBuildDefer.resolve();
                        });

                        it('should click dom element \'scormPackageLink\'', function (done) {
                            viewModel.downloadCourse().fin(function () {
                                expect(dom.clickElementById).toHaveBeenCalledWith('scormPackageLink');
                                done();
                            });
                        });

                        it('should set isActive() to false', function (done) {
                            viewModel.downloadCourse().fin(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                                done();
                            });
                        });

                    });

                    describe('when course scorm build failed', function () {

                        beforeEach(function () {
                            courseRepositoryGetByIdDefer.resolve(course);
                            courseScormBuildDefer.reject();
                        });

                        it('should set isActive() to false', function (done) {
                            viewModel.downloadCourse().fin(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                                done();
                            });
                        });

                    });

                });

                describe('when action is active', function () {

                    beforeEach(function () {
                        viewModel.isActive(true);
                    });

                    it('should not send event \"Download SCORM 1.2 course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).not.toHaveBeenCalledWith('Download SCORM 1.2 course');
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

                        course.scormPackageUrl = "http://xxx.com";
                        viewModel.scromBuildCompleted(course);

                        expect(viewModel.packageUrl()).toEqual(course.scormPackageUrl);
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

                        viewModel.scrormBuildFailed(course.id);

                        expect(viewModel.state()).toEqual(constants.publishingStates.failed);
                    });

                    it('should remove scorm build package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('publishedPackageUrl');

                        viewModel.scrormBuildFailed(course.id);

                        expect(viewModel.packageUrl()).toEqual('');
                    });

                });

                describe('and when course is any other course', function () {

                    it('should not update scorm build action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.scrormBuildFailed('100500');

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not remove packageUrl', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        viewModel.scrormBuildFailed('100500');

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });

                });

            });

        });
    })