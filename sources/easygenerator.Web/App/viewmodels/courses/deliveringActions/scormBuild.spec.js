define(['viewmodels/courses/deliveringActions/scormBuild', 'constants', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'dom'],
    function (scormBuildDeliveringAction, constants, app, notify, eventTracker, repository, dom) {

        describe('delivering action [scormBuild]', function () {

            var viewModel,
                packageUrl = 'someUrl',
                courseId = 'courseId',
                course = {
                    id: 'courseId',
                    scormBuild: function () {
                    }
                };

            beforeEach(function () {
                viewModel = scormBuildDeliveringAction(courseId, packageUrl);
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
                    spyOn(repository, 'getById').andReturn(courseRepositoryGetByIdPromise);
                    spyOn(course, 'scormBuild').andReturn(courseScormBuildPromise);
                });

                it('should be a function', function () {
                    expect(viewModel.downloadCourse).toBeFunction();
                });

                describe('when action is not active', function () {

                    beforeEach(function () {
                        viewModel.isActive(false);
                    });

                    it('should send event \"Download scorm course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Download scorm course');
                    });

                    it('should hide notification', function () {
                        viewModel.downloadCourse();
                        expect(notify.hide).toHaveBeenCalled();
                    });

                    it('should set isActive to true', function () {
                        viewModel.downloadCourse();
                        expect(viewModel.isActive()).toBe(true);
                    });

                    it('should start scorm build of current course', function () {
                        courseRepositoryGetByIdDefer.resolve(course);
                        courseScormBuildDefer.resolve();
                        var promise = viewModel.downloadCourse();

                        waitsFor(function () {
                            return !promise.isPending();
                        });

                        runs(function () {
                            expect(course.scormBuild).toHaveBeenCalled();
                        });
                    });

                    describe('when course scorm build finished successfully', function () {
                        beforeEach(function () {
                            courseRepositoryGetByIdDefer.resolve(course);
                            courseScormBuildDefer.resolve();
                        });

                        it('should click dom element \'scormPackageLink\'', function () {
                            var promise = viewModel.downloadCourse();

                            waitsFor(function () {
                                return !promise.isPending();
                            });

                            runs(function () {
                                expect(dom.clickElementById).toHaveBeenCalledWith('scormPackageLink');
                            });
                        });

                        it('should set isActive() to false', function () {
                            var promise = viewModel.downloadCourse();

                            waitsFor(function () {
                                return !promise.isPending();
                            });

                            runs(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                            });
                        });
                    });

                    describe('when course scorm build failed', function () {
                        beforeEach(function () {
                            courseRepositoryGetByIdDefer.resolve(course);
                            courseScormBuildDefer.reject();
                        });

                        it('should set isActive() to false', function () {
                            var promise = viewModel.downloadCourse();

                            waitsFor(function () {
                                return !promise.isPending();
                            });

                            runs(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                            });
                        });
                    });
                });

                describe('when action is active', function () {
                    beforeEach(function () {
                        viewModel.isActive(true);
                    });

                    it('should not send event \"Download scorm course\"', function () {
                        viewModel.downloadCourse();
                        expect(eventTracker.publish).not.toHaveBeenCalledWith('Download scorm course');
                    });
                });
            });

            describe('when course scorm build was started', function () {

                describe('and when course is current course', function () {
                    it('should change action state to \'building\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');
                        app.trigger(constants.messages.course.scormBuild.started, course);

                        expect(viewModel.state()).toEqual(constants.deliveringStates.building);
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not change scorm build action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');
                        app.trigger(constants.messages.course.scormBuild.started, { id: '100500' });

                        expect(viewModel.state()).toEqual('');
                    });

                });

            });

            describe('when course scorm build completed', function () {

                describe('and when course is current course', function () {
                    it('should update scorm build action state to \'success\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        course.buildingStatus = constants.deliveringStates.succeed;
                        app.trigger(constants.messages.course.scormBuild.completed, course);

                        expect(viewModel.state()).toEqual(constants.deliveringStates.succeed);
                    });

                    it('should update current scorm build package url to the corresponding one', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('');

                        course.scormPackageUrl = "http://xxx.com";
                        app.trigger(constants.messages.course.scormBuild.completed, course);

                        expect(viewModel.packageUrl()).toEqual(course.scormPackageUrl);
                    });
                });

                describe('and when course is any other course', function () {

                    it('should not update action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.scormBuild.completed, { id: '100500' });

                        expect(viewModel.state()).toEqual(constants.deliveringStates.notStarted);
                    });

                    it('should not update current publishedPackageUrl', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl("http://xxx.com");
                        app.trigger(constants.messages.course.scormBuild.completed, { id: '100500' });

                        expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                    });
                });

            });

            describe('when course scorm build failed', function () {

                describe('and when course is current course', function () {
                    var message = "message";

                    it('should update scorm build action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        app.trigger(constants.messages.course.scormBuild.failed, course.id, message);

                        expect(viewModel.state()).toEqual(constants.deliveringStates.failed);
                    });

                    it('should remove scorm build package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('publishedPackageUrl');

                        app.trigger(constants.messages.course.scormBuild.failed, course.id, message);

                        expect(viewModel.packageUrl()).toEqual('');
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not update scorm build action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        app.trigger(constants.messages.course.scormBuild.failed, '100500');

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not remove packageUrl', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        app.trigger(constants.messages.course.scormBuild.failed, '100500');

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });
                });

            });

        });
    })