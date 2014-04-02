define(['viewmodels/courses/deliveringActions/build', 'constants', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'dom'],
    function (buildDeliveringAction, constants, app, notify, eventTracker, repository, dom) {

        describe('viewModel [build]', function () {

            var
                viewModel,
                packageUrl = 'someUrl',
                courseId = 'courseId',
                course = { id: 'courseId', build: function () { } }
            ;

            beforeEach(function () {
                viewModel = buildDeliveringAction(courseId, packageUrl);
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

            describe('isDelivering', function () {
                it('should be computed', function () {
                    expect(viewModel.isDelivering).toBeComputed();
                });

                describe('when state is \'building\'', function () {
                    beforeEach(function () {
                        viewModel.state(constants.deliveringStates.building);
                    });

                    it('should return true', function () {
                        expect(viewModel.isDelivering()).toBeTruthy();
                    });
                });

                describe('when state is not \'building\'', function () {
                    beforeEach(function () {
                        viewModel.state('');
                    });

                    it('should return true', function () {
                        expect(viewModel.isDelivering()).toBeFalsy();
                    });
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
                var courseBuildDefer;
                var courseBuildPromise;

                beforeEach(function () {
                    courseRepositoryGetByIdDefer = Q.defer();
                    courseBuildDefer = Q.defer();
                    courseRepositoryGetByIdPromise = courseRepositoryGetByIdDefer.promise;
                    courseBuildPromise = courseBuildDefer.promise;
                    spyOn(repository, 'getById').and.returnValue(courseRepositoryGetByIdPromise);
                    spyOn(course, 'build').and.returnValue(courseBuildPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.downloadCourse).toBeFunction();
                });

                describe('when action is not active', function () {

                    beforeEach(function () {
                        viewModel.isActive(false);
                    });

                    it('should send event \"Download course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Download course');
                    });

                    it('should hide notification', function () {
                        viewModel.downloadCourse();
                        expect(notify.hide).toHaveBeenCalled();
                    });

                    it('should set isActive to true', function () {
                        viewModel.downloadCourse();
                        expect(viewModel.isActive()).toBeTruthy();
                    });

                    it('should start build of current course', function (done) {
                        courseRepositoryGetByIdDefer.resolve(course);
                        courseBuildDefer.resolve();

                        viewModel.downloadCourse().fin(function () {
                            expect(course.build).toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('when course build finished successfully', function () {

                        beforeEach(function () {
                            courseRepositoryGetByIdDefer.resolve(course);
                            courseBuildDefer.resolve();
                        });

                        it('should click dom element \'packageLink\'', function (done) {
                            viewModel.downloadCourse().fin(function () {
                                expect(dom.clickElementById).toHaveBeenCalledWith('packageLink');
                                done();
                            });
                        });

                        it('should set isActive to false', function (done) {
                            viewModel.downloadCourse().fin(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                                done();
                            });
                        });

                    });

                    describe('when course build failed', function () {

                        beforeEach(function () {
                            courseRepositoryGetByIdDefer.resolve(course);
                            courseBuildDefer.reject();
                        });

                        it('should set isActive to false', function (done) {
                            viewModel.downloadCourse().fin(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                                done();
                            });
                        });

                    });
                });

                describe('when deliver process is running', function () {

                    beforeEach(function () {
                        viewModel.isActive(true);
                    });

                    it('should not send event \"Download course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).not.toHaveBeenCalledWith('Download course');
                    });

                });
            });

            describe('when course build was started', function () {

                describe('and when course is current course', function () {

                    describe('and when action is not active', function () {

                        beforeEach(function () {
                            viewModel.isActive(false);
                        });

                        it('should not change action state to \'building\'', function () {
                            viewModel.courseId = course.id;
                            viewModel.state('');

                            viewModel.courseBuildStarted(course);

                            expect(viewModel.state()).toEqual('');
                        });

                    });

                    describe('and when action is active', function () {

                        beforeEach(function () {
                            viewModel.isActive(true);
                        });

                        it('should change action state to \'building\'', function () {
                            viewModel.courseId = course.id;
                            viewModel.state('');

                            viewModel.courseBuildStarted(course);

                            expect(viewModel.state()).toEqual(constants.deliveringStates.building);
                        });

                    });
                });

                describe('and when course is any other course', function () {

                    it('should not change build action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.courseBuildStarted({ id: '100500' });

                        expect(viewModel.state()).toEqual('');
                    });

                });

            });

            describe('when course build completed', function () {

                describe('and when course is current course', function () {

                    describe('and when action is not active', function () {

                        beforeEach(function () {
                            viewModel.isActive(false);
                        });

                        it('should not update action state', function () {
                            viewModel.courseId = course.id;
                            viewModel.state('');

                            viewModel.courseBuildCompleted({ id: '100500' });

                            expect(viewModel.state()).toEqual('');
                        });

                        it('should not update current package url', function () {
                            viewModel.courseId = course.id;
                            viewModel.packageUrl("http://xxx.com");

                            viewModel.courseBuildCompleted({ id: '100500' });

                            expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                        });

                    });

                    describe('and when action is active', function () {

                        beforeEach(function () {
                            viewModel.isActive(true);
                        });

                        it('should update action state to \'success\'', function () {
                            viewModel.courseId = course.id;
                            viewModel.state('');

                            course.buildingStatus = constants.deliveringStates.succeed;

                            viewModel.courseBuildCompleted(course);

                            expect(viewModel.state()).toEqual(constants.deliveringStates.succeed);
                        });

                        it('should update current package url to the corresponding one', function () {
                            viewModel.courseId = course.id;
                            viewModel.packageUrl('');

                            course.packageUrl = "http://xxx.com";

                            viewModel.courseBuildCompleted(course);

                            expect(viewModel.packageUrl()).toEqual(course.packageUrl);
                        });

                    });

                });

                describe('and when course is any other course', function () {

                    it('should not update action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.courseBuildCompleted({ id: '100500' });

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not update current package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl("http://xxx.com");

                        viewModel.courseBuildCompleted({ id: '100500' });

                        expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                    });

                });

            });

            describe('when course build failed', function () {

                describe('and when course is current course', function () {

                    describe('and when action is not active', function () {

                        beforeEach(function () {
                            viewModel.isActive(false);
                        });

                        it('should not update build action state to \'failed\'', function () {
                            viewModel.courseId = course.id;
                            viewModel.state('');

                            viewModel.courseBuildCompleted('100500');

                            expect(viewModel.state()).toEqual('');
                        });

                        it('should not remove packageUrl', function () {
                            viewModel.courseId = course.id;
                            viewModel.packageUrl('packageUrl');

                            viewModel.courseBuildCompleted('100500');

                            expect(viewModel.packageUrl()).toEqual('packageUrl');
                        });

                    });

                    describe('and when action is active', function () {

                        beforeEach(function () {
                            viewModel.isActive(true);
                        });

                        it('should update action state to \'failed\'', function () {
                            viewModel.courseId = course.id;
                            viewModel.state('');

                            viewModel.courseBuildFailed(course.id);

                            expect(viewModel.state()).toEqual(constants.deliveringStates.failed);
                        });

                        it('should remove package url', function () {
                            viewModel.courseId = course.id;
                            viewModel.packageUrl('publishedPackageUrl');

                            viewModel.courseBuildFailed(course.id);

                            expect(viewModel.packageUrl()).toEqual('');
                        });

                    });
                });

                describe('and when course is any other course', function () {

                    it('should not update build action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.courseBuildFailed('100500');

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not remove packageUrl', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        viewModel.courseBuildFailed('100500');

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });

                });

            });

        });
    })