define(['viewmodels/courses/deliveringActions/publish', 'constants', 'durandal/app', 'notify', 'eventTracker', 'repositories/courseRepository', 'plugins/router'],
    function (publishDeliveringAction, constants, app, notify, eventTracker, repository, router) {

        describe('viewModel [publish]', function () {

            var viewModel,
                packageUrl = 'someUrl',
                courseId = 'courseId',
                course = {
                    id: 'someId',
                    publish: function () {
                    }
                };

            beforeEach(function () {
                viewModel = publishDeliveringAction(courseId, packageUrl);
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

                    describe('when state is \'publishing\'', function () {
                        beforeEach(function () {
                            viewModel.state(constants.deliveringStates.publishing);
                        });

                        it('should return true', function () {
                            expect(viewModel.isDelivering()).toBeTruthy();
                        });
                    });

                    describe('when state is not \'publishing\'', function () {
                        beforeEach(function () {
                            viewModel.state('');
                        });

                        it('should return false', function () {
                            expect(viewModel.isDelivering()).toBeFalsy();
                        });
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

            describe('publishCourse:', function () {

                var courseRepositoryGetByIdDefer;
                var courseRepositoryGetByIdPromise;
                var coursePublishDefer;
                var coursePublishPromise;

                beforeEach(function () {
                    courseRepositoryGetByIdDefer = Q.defer();
                    coursePublishDefer = Q.defer();
                    courseRepositoryGetByIdPromise = courseRepositoryGetByIdDefer.promise;
                    coursePublishPromise = coursePublishDefer.promise;
                    spyOn(repository, 'getById').andReturn(courseRepositoryGetByIdPromise);
                    spyOn(course, 'publish').andReturn(coursePublishPromise);
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

                    it('should start publish of current course', function () {
                        courseRepositoryGetByIdDefer.resolve(course);
                        coursePublishDefer.resolve();
                        var promise = viewModel.publishCourse();

                        waitsFor(function () {
                            return !promise.isPending();
                        });

                        runs(function () {
                            expect(course.publish).toHaveBeenCalled();
                        });
                    });

                    describe('when course publish finished successfully', function () {
                        beforeEach(function () {
                            courseRepositoryGetByIdDefer.resolve(course);
                            coursePublishDefer.resolve();
                        });

                        it('should set isActive() to false', function () {
                            var promise = viewModel.publishCourse();

                            waitsFor(function () {
                                return !promise.isPending();
                            });

                            runs(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                            });
                        });
                    });

                    describe('when course publish failed', function () {
                        beforeEach(function () {
                            courseRepositoryGetByIdDefer.resolve(course);
                            coursePublishDefer.reject();
                        });

                        it('should set isActive() to false', function () {
                            var promise = viewModel.publishCourse();

                            waitsFor(function () {
                                return !promise.isPending();
                            });

                            runs(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                            });
                        });
                    });
                });

                describe('when deliver process is running', function () {
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

                describe('when course successfully published', function () {

                    beforeEach(function () {
                        viewModel.state(constants.deliveringStates.succeed);
                    });

                    it('should open publish url', function () {
                        viewModel.packageUrl('Some url');

                        viewModel.openPublishedCourse();
                        expect(router.openUrl).toHaveBeenCalledWith(viewModel.packageUrl());
                    });

                });

                describe('when course not published', function () {

                    beforeEach(function () {
                        viewModel.state(constants.deliveringStates.failed);
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

                    describe('and when action is not active', function () {

                        beforeEach(function () {
                            viewModel.isActive(false);
                        });

                        it('should not change action state', function () {
                            viewModel.courseId = course.id;
                            viewModel.state(constants.deliveringStates.notStarted);
                            app.trigger(constants.messages.course.build.started, course);

                            expect(viewModel.state()).toEqual(constants.deliveringStates.notStarted);
                        });
                    });

                    describe('and when action is active', function () {

                        beforeEach(function () {
                            viewModel.isActive(true);
                        });

                        it('should change action state to \'building\'', function () {
                            viewModel.courseId = course.id;
                            viewModel.state('');
                            app.trigger(constants.messages.course.build.started, course);

                            expect(viewModel.state()).toEqual(constants.deliveringStates.building);
                        });
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not change action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.build.started, { id: '100500' });

                        expect(viewModel.state()).toEqual(constants.deliveringStates.notStarted);
                    });
                });

            });

            describe('when course build was failed', function () {

                describe('and when course is current course', function () {

                    describe('and when action is not active', function () {

                        beforeEach(function () {
                            viewModel.isActive(false);
                        });

                        it('should not change action state', function () {
                            viewModel.courseId = course.id;
                            viewModel.state(constants.deliveringStates.notStarted);
                            app.trigger(constants.messages.course.build.failed, course);

                            expect(viewModel.state()).toEqual(constants.deliveringStates.notStarted);
                        });

                        it('should not clear package url', function () {
                            viewModel.courseId = course.id;
                            viewModel.packageUrl('packageUrl');

                            app.trigger(constants.messages.course.build.failed, course.id);

                            expect(viewModel.packageUrl()).toEqual('packageUrl');
                        });
                    });

                    describe('and when action is active', function () {

                        beforeEach(function () {
                            viewModel.isActive(true);
                        });

                        it('should change action state to \'failed\'', function () {
                            viewModel.courseId = course.id;
                            viewModel.state('');
                            app.trigger(constants.messages.course.build.failed, course.id);

                            expect(viewModel.state()).toEqual(constants.deliveringStates.failed);
                        });

                        it('should clear package url', function () {
                            viewModel.courseId = course.id;
                            viewModel.packageUrl('packageUrl');

                            app.trigger(constants.messages.course.build.failed, course.id);

                            expect(viewModel.packageUrl()).toEqual('');
                        });
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not change action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.build.failed, { id: '100500' });

                        expect(viewModel.state()).toEqual(constants.deliveringStates.notStarted);
                    });

                    it('should not clear package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        app.trigger(constants.messages.course.build.failed, '100500');

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });
                });

            });

            describe('when course publish was started', function () {

                describe('and when course is current course', function () {
                    it('should change action state to \'publishing\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');
                        app.trigger(constants.messages.course.publish.started, course);

                        expect(viewModel.state()).toEqual(constants.deliveringStates.publishing);
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not change action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.publish.started, { id: '100500' });

                        expect(viewModel.state()).toEqual(constants.deliveringStates.notStarted);
                    });
                });

            });

            describe('when course publish completed', function () {

                describe('and when course is current course', function () {
                    it('should update action state to \'success\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        course.buildingStatus = constants.deliveringStates.succeed;
                        app.trigger(constants.messages.course.publish.completed, course);

                        expect(viewModel.state()).toEqual(constants.deliveringStates.succeed);
                    });

                    it('should update action packageUrl to the corresponding one', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('');

                        course.publishedPackageUrl = "http://xxx.com";
                        app.trigger(constants.messages.course.publish.completed, course);

                        expect(viewModel.packageUrl()).toEqual(course.publishedPackageUrl);
                    });
                });

                describe('and when course is any other course', function () {

                    it('should not update action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.publish.completed, { id: '100500' });

                        expect(viewModel.state()).toEqual(constants.deliveringStates.notStarted);
                    });

                    it('should not update current publishedPackageUrl', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('http://xxx.com');
                        app.trigger(constants.messages.course.publish.completed, { id: '100500' });

                        expect(viewModel.packageUrl()).toEqual("http://xxx.com");
                    });
                });

            });

            describe('when course publish failed', function () {

                describe('and when course is current course', function () {
                    var message = "message";

                    it('should update action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        app.trigger(constants.messages.course.publish.failed, course.id, message);

                        expect(viewModel.state()).toEqual(constants.deliveringStates.failed);
                    });

                    it('should clear package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('publishedPackageUrl');

                        app.trigger(constants.messages.course.publish.failed, course.id, message);

                        expect(viewModel.packageUrl()).toEqual('');
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not update publish action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        app.trigger(constants.messages.course.publish.failed, '100500');

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not clear package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        app.trigger(constants.messages.course.publish.failed, '100500');

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });
                });

            });

        });
    })