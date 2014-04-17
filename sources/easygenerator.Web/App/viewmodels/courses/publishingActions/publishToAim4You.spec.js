define(['localization/localizationManager', 'constants', 'dataContext', 'viewmodels/courses/publishingActions/publishToAim4You', 'eventTracker', 'notify', 'repositories/courseRepository', 'durandal/app', 'userContext'],
    function (localizationManager, constants, dataContext, publishToAim4You, eventTracker, notify, courseRepository, app, userContext) {

        describe('viewModel [publishToAim4You]', function () {

            var viewModel,
                courseId = 'courseId',
                course = {
                    id: 'someId',
                    publishToStore: function () { }
                },
                serviceRegisterDefer;

            beforeEach(function () {
                viewModel = publishToAim4You(courseId);
                spyOn(eventTracker, 'publish');
                spyOn(notify, 'hide');
                spyOn(notify, 'error');

                serviceRegisterDefer = Q.defer();
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

                describe('when state is \'publishing\'', function () {

                    beforeEach(function () {
                        viewModel.state(constants.publishingStates.publishing);
                    });

                    it('should return true', function () {
                        expect(viewModel.isPublishing()).toBeTruthy();
                    });

                });

                describe('when state is not \'publushing\'', function () {

                    beforeEach(function () {
                        viewModel.state(constants.publishingStates.notStarted);
                    });

                    it('should return false', function () {
                        expect(viewModel.isPublishing()).toBeFalsy();
                    });

                });

                describe('when state is \'inProgress\' register on Aim4You', function () {

                    beforeEach(function () {
                        viewModel.state(constants.registerOnAim4YouStates.inProgress);
                    });

                    it('should return true', function () {
                        expect(viewModel.isPublishing()).toBeTruthy();
                    });

                });

                describe('when state is not \'inProgress\' register on Aim4You', function () {

                    beforeEach(function () {
                        viewModel.state(constants.registerOnAim4YouStates.success);
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
                    expect(viewModel.packageUrl()).toBeUndefined();
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

            describe('messageState:', function () {

                it('should be observable', function () {
                    expect(viewModel.messageState).toBeObservable();
                });

                it('should be start value \'none\'', function () {
                    expect(viewModel.messageState()).toBe(viewModel.infoMessageStates.none);
                });

            });

            describe('isTryMode:', function () {

                it('should be defined', function () {
                    expect(viewModel.isTryMode).toBeDefined();
                });

                describe('when user to be in try mode', function () {

                    beforeEach(function () {
                        userContext.identity = null;
                    });

                    it('should be true', function () {
                        var view = publishToAim4You(courseId);
                        expect(view.isTryMode).toBeTruthy();
                    });

                });

                describe('when user to not be in try mode', function () {

                    beforeEach(function () {
                        userContext.identity = {};
                    });

                    it('should be false', function () {
                        var view = publishToAim4You(courseId);
                        expect(view.isTryMode).toBeFalsy();
                    });

                });

            });

            describe('publishToAim4You', function () {

                it('should be function', function () {
                    expect(viewModel.publishToAim4You).toBeFunction();
                });

                describe('when publishing is active', function () {

                    it('should return undefined', function () {
                        viewModel.isActive(true);
                        expect(viewModel.publishToAim4You()).toBeUndefined();
                    });

                });

                describe('when publishing is not active', function () {

                    var courseRepositoryDefer,
                        coursePublishToStoreDefer;

                    beforeEach(function () {
                        courseRepositoryDefer = Q.defer();
                        coursePublishToStoreDefer = Q.defer();
                        spyOn(courseRepository, 'getById').and.returnValue(courseRepositoryDefer.promise);
                        spyOn(course, 'publishToStore').and.returnValue(coursePublishToStoreDefer.promise);
                        viewModel.isActive(false);
                    });

                    it('should hide notify', function () {
                        viewModel.publishToAim4You();
                        expect(notify.hide).toHaveBeenCalled();
                    });

                    it('should activate publishing proccess', function () {
                        viewModel.publishToAim4You();
                        expect(viewModel.isActive()).toBeTruthy();
                    });

                    it('should send event \'Publish to Aim4You\'', function () {
                        viewModel.publishToAim4You();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Publish to Aim4You');
                    });

                    it('should return promise', function () {
                        expect(viewModel.publishToAim4You()).toBePromise();
                    });

                    it('should start publishToStore to current course', function (done) {
                        courseRepositoryDefer.resolve(course);
                        coursePublishToStoreDefer.resolve();

                        viewModel.publishToAim4You().fin(function () {
                            expect(course.publishToStore).toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('when course published to store successfully', function () {

                        beforeEach(function () {
                            courseRepositoryDefer.resolve(course);
                            coursePublishToStoreDefer.resolve();
                        });

                        it('should set publishing active to false', function (done) {
                            viewModel.publishToAim4You().fin(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                                done();
                            });
                        });

                        it('should show publish success message', function (done) {
                            viewModel.messageState(viewModel.infoMessageStates.none);
                            viewModel.publishToAim4You().fin(function () {
                                expect(viewModel.messageState()).toBe(viewModel.infoMessageStates.published);
                                done();
                            });
                        });

                    });

                    describe('when course published to store fail', function () {

                        beforeEach(function () {
                            courseRepositoryDefer.resolve(course);
                            coursePublishToStoreDefer.reject();
                        });

                        it('should set publishing active to false', function (done) {
                            viewModel.publishToAim4You().fin(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                                done();
                            });
                        });

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
                            viewModel.state(constants.publishingStates.notStarted);

                            viewModel.courseBuildStarted(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
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

                            expect(viewModel.state()).toEqual(constants.publishingStates.building);
                        });
                    });
                });

                describe('and when course is any other course', function () {

                    it('should not change action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.publishingStates.notStarted);

                        viewModel.courseBuildStarted({ id: '100500' });

                        expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
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
                            viewModel.state(constants.publishingStates.notStarted);

                            viewModel.courseBuildFailed(course.id);

                            expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                        });

                        it('should not clear package url', function () {
                            viewModel.courseId = course.id;
                            viewModel.packageUrl('packageUrl');

                            viewModel.courseBuildFailed(course.id);

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

                            viewModel.courseBuildFailed(course.id);

                            expect(viewModel.state()).toEqual(constants.publishingStates.failed);
                        });
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not change action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.publishingStates.notStarted);

                        viewModel.courseBuildFailed({ id: '100500' });

                        expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                    });

                    it('should not clear package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        viewModel.courseBuildFailed({ id: '100500' });

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });
                });

            });

            describe('when course publish to Aim4You was started', function () {

                describe('and when course is current course', function () {

                    it('should change action state to \'publishing\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.publishToAim4YouStarted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.publishing);
                    });

                });

                describe('and when course is any other course', function () {

                    it('should not change action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.publishingStates.notStarted);

                        viewModel.publishToAim4YouStarted({ id: '100500' });

                        expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                    });

                });

            });

            describe('when course publish to Aim4You completed', function () {

                describe('and when course is current course', function () {

                    it('should update action state to \'success\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        course.buildingStatus = constants.publishingStates.succeed;

                        viewModel.publishToAim4YouCompleted(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.succeed);
                    });

                });

                describe('and when course is any other course', function () {

                    it('should not update action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.publishingStates.notStarted);

                        viewModel.publishToAim4YouCompleted({ id: '100500' });

                        expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                    });

                });

            });

            describe('when course publish to Aim4You failed', function () {

                describe('and when course is current course', function () {

                    it('should update action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.publishToAim4YouFailed(course.id);

                        expect(viewModel.state()).toEqual(constants.publishingStates.failed);
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not update publish action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.publishToAim4YouFailed('100500');

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not clear package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        viewModel.publishToAim4YouFailed('100500');

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });
                });

            });

            describe('when some action was started', function () {

                it('should hide info message', function () {
                    viewModel.courseActionStarted(course);
                    expect(viewModel.messageState()).toEqual(viewModel.infoMessageStates.none);
                });

            });

        });

    });