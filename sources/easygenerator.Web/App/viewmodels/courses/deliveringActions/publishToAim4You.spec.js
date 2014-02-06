define(['localization/localizationManager', 'constants', 'dataContext', 'viewmodels/courses/deliveringActions/publishToAim4You', 'eventTracker', 'services/aim4YouService', 'notify', 'repositories/courseRepository', 'durandal/app'],
    function (localizationManager, constants, dataContext, publishToAim4You, eventTracker, aim4YouService, notify, courseRepository, app) {

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
                spyOn(aim4YouService, 'register').andReturn(serviceRegisterDefer.promise);
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

                describe('when state is \'publishing\'', function () {

                    beforeEach(function () {
                        viewModel.state(constants.deliveringStates.publishing);
                    });

                    it('should return true', function () {
                        expect(viewModel.isDelivering()).toBeTruthy();
                    });

                });

                describe('when state is not \'publushing\'', function () {

                    beforeEach(function () {
                        viewModel.state(constants.deliveringStates.notStarted);
                    });

                    it('should return false', function () {
                        expect(viewModel.isDelivering()).toBeFalsy();
                    });

                });

                describe('when state is \'inProgress\' register on Aim4You', function () {

                    beforeEach(function () {
                        viewModel.state(constants.registerOnAim4YouStates.inProgress);
                    });

                    it('should return true', function () {
                        expect(viewModel.isDelivering()).toBeTruthy();
                    });

                });

                describe('when state is not \'inProgress\' register on Aim4You', function () {

                    beforeEach(function () {
                        viewModel.state(constants.registerOnAim4YouStates.success);
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

                    it('should be true', function () {
                        dataContext.isTryMode = true;
                        var view = publishToAim4You(courseId);
                        expect(view.isTryMode).toBeTruthy();
                    });

                });

                describe('when user to not be in try mode', function () {

                    it('should be false', function () {
                        dataContext.isTryMode = false;
                        var view = publishToAim4You(courseId);
                        expect(view.isTryMode).toBeFalsy();
                    });

                });

            });

            describe('isRegisteredOnAim4You', function () {

                it('should be observable', function () {
                    expect(viewModel.isRegisteredOnAim4You).toBeObservable();
                });

                describe('when user is registered in Aim4You', function () {

                    it('should be true', function () {
                        dataContext.isRegisteredOnAim4You = true;
                        var view = publishToAim4You(courseId);
                        expect(view.isRegisteredOnAim4You()).toBeTruthy();
                    });

                });

                describe('when user is not registered in Aim4You', function () {

                    it('should be false', function () {
                        dataContext.isRegisteredOnAim4You = false;
                        var view = publishToAim4You(courseId);
                        expect(view.isRegisteredOnAim4You()).toBeFalsy();
                    });

                });

            });

            describe('register:', function () {

                it('should be function', function () {
                    expect(viewModel.register).toBeFunction();
                });

                describe('when registration in progress', function () {

                    beforeEach(function () {
                        viewModel.state(constants.deliveringStates.building);
                    });

                    describe('and when user is registered in Aim4You', function () {

                        beforeEach(function () {
                            viewModel.isRegisteredOnAim4You(true);
                        });

                        it('should return undefined', function () {
                            expect(viewModel.register()).toBeUndefined();
                        });

                    });

                    describe('when user is not registered on Aim4You', function () {

                        beforeEach(function () {
                            viewModel.isRegisteredOnAim4You(false);
                        });

                        it('should return undefined', function () {
                            expect(viewModel.register()).toBeUndefined();
                        });

                    });

                });

                describe('when registration is not in progress', function () {

                    describe('when user is registered on Aim4You', function () {
                        beforeEach(function () {
                            viewModel.isRegisteredOnAim4You(true);
                        });

                        it('should return undefined', function () {
                            expect(viewModel.register()).toBeUndefined();
                        });
                    });

                    describe('when user is not registered on Aim4You', function () {

                        beforeEach(function () {
                            viewModel.isRegisteredOnAim4You(false);
                        });

                        it('should hide notify', function () {
                            viewModel.register();
                            expect(notify.hide).toHaveBeenCalled();
                        });

                        it('should send event \'Register to Aim4You\'', function () {
                            viewModel.register();
                            expect(eventTracker.publish).toHaveBeenCalledWith('Register to Aim4You');
                        });

                        it('should start registration', function () {
                            viewModel.state(null);
                            viewModel.register();
                            expect(viewModel.state()).toBeTruthy(constants.registerOnAim4YouStates.inProgress);
                        });

                        it('should return promise', function () {
                            expect(viewModel.register()).toBePromise();
                        });

                        describe('when registration is success', function () {

                            beforeEach(function () {
                                serviceRegisterDefer.resolve();
                            });

                            it('should stop registration', function () {
                                var promise = viewModel.register();
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.state()).toBe(constants.registerOnAim4YouStates.success);
                                });
                            });

                            it('should update isRegisteredOnAim4You to true', function () {
                                viewModel.isRegisteredOnAim4You(false);
                                var promise = viewModel.register();
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.isRegisteredOnAim4You()).toBeTruthy();
                                });
                            });

                            it('should show confirm registration message', function () {
                                viewModel.messageState(viewModel.infoMessageStates.none);
                                var promise = viewModel.register();
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.messageState()).toBe(viewModel.infoMessageStates.registered);
                                });
                            });

                        });

                        describe('when registration is fail', function () {

                            beforeEach(function () {
                                serviceRegisterDefer.reject();
                            });

                            it('should stop registration', function () {
                                var promise = viewModel.register();
                                waitsFor(function () {
                                    return !promise.isPending();
                                });
                                runs(function () {
                                    expect(viewModel.state()).toBe(constants.registerOnAim4YouStates.fail);
                                });
                            });

                        });
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
                        spyOn(courseRepository, 'getById').andReturn(courseRepositoryDefer.promise);
                        spyOn(course, 'publishToStore').andReturn(coursePublishToStoreDefer.promise);
                        viewModel.isActive(false);
                    });

                    it('should hide notify', function () {
                        viewModel.register();
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

                    it('should start publishToStore to current course', function () {
                        courseRepositoryDefer.resolve(course);
                        coursePublishToStoreDefer.resolve();
                        var promise = viewModel.publishToAim4You();
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(course.publishToStore).toHaveBeenCalled();
                        });
                    });

                    describe('when course published to store successfully', function () {

                        beforeEach(function () {
                            courseRepositoryDefer.resolve(course);
                            coursePublishToStoreDefer.resolve();
                        });

                        it('should set publishing active to false', function () {
                            var promise = viewModel.publishToAim4You();
                            viewModel.isActive(true);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.isActive()).toBeFalsy();
                            });
                        });

                        it('should show publish success message', function () {
                            viewModel.messageState(viewModel.infoMessageStates.none);
                            var promise = viewModel.publishToAim4You();
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.messageState()).toBe(viewModel.infoMessageStates.published);
                            });
                        });

                    });

                    describe('when course published to store fail', function () {

                        beforeEach(function () {
                            courseRepositoryDefer.resolve(course);
                            coursePublishToStoreDefer.reject();
                        });

                        it('should set publishing active to false', function () {
                            var promise = viewModel.publishToAim4You();
                            viewModel.isActive(true);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(viewModel.isActive()).toBeFalsy();
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

            describe('when course publish to Aim4You was started', function () {

                describe('and when course is current course', function () {
                    it('should change action state to \'publishing\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');
                        app.trigger(constants.messages.course.publishToAim4You.started, course);

                        expect(viewModel.state()).toEqual(constants.deliveringStates.publishing);
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not change action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.publishToAim4You.started, { id: '100500' });

                        expect(viewModel.state()).toEqual(constants.deliveringStates.notStarted);
                    });
                });

            });

            describe('when course publish to Aim4You completed', function () {

                describe('and when course is current course', function () {
                    it('should update action state to \'success\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        course.buildingStatus = constants.deliveringStates.succeed;
                        app.trigger(constants.messages.course.publishToAim4You.completed, course);

                        expect(viewModel.state()).toEqual(constants.deliveringStates.succeed);
                    });
                });

                describe('and when course is any other course', function () {

                    it('should not update action state', function () {
                        viewModel.courseId = course.id;
                        viewModel.state(constants.deliveringStates.notStarted);
                        app.trigger(constants.messages.course.publishToAim4You.completed, { id: '100500' });

                        expect(viewModel.state()).toEqual(constants.deliveringStates.notStarted);
                    });

                });

            });

            describe('when course publish to Aim4You failed', function () {

                describe('and when course is current course', function () {
                    var message = "message";

                    it('should update action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        app.trigger(constants.messages.course.publishToAim4You.failed, course.id, message);

                        expect(viewModel.state()).toEqual(constants.deliveringStates.failed);
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not update publish action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        app.trigger(constants.messages.course.publishToAim4You.failed, '100500');

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not clear package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        app.trigger(constants.messages.course.publishToAim4You.failed, '100500');

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });
                });

            });

            describe('when some action was started', function () {

                it('should hide info message', function () {
                    app.trigger(constants.messages.course.action.started, course);
                    expect(viewModel.messageState()).toEqual(viewModel.infoMessageStates.none);
                });

            });

        });

    });