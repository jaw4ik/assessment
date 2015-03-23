define(['localization/localizationManager', 'models/course', 'constants', 'dataContext', 'viewmodels/courses/publishingActions/publishToAim4You', 'eventTracker',
    'notify', 'durandal/app', 'userContext'],
    function (localizationManager, Course, constants, dataContext, publishToAim4You, eventTracker, notify, app, userContext) {

        describe('viewModel [publishToAim4You]', function () {

            var
                viewModel,
                course = new Course({
                    id: 'someId'
                }),
                serviceRegisterDefer;

            beforeEach(function () {
                viewModel = publishToAim4You(course);
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

            describe('states:', function () {

                it('should be equal to allowed publish states', function () {
                    expect(viewModel.states).toEqual(constants.publishingStates);
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

            describe('courseId:', function () {
                it('should be defined', function () {
                    expect(viewModel.courseId).toBeDefined();
                });

                it('should be equal to ctor parameter', function () {
                    expect(viewModel.courseId).toBe(course.id);
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

            describe('publishToAim4You', function () {

                it('should be function', function () {
                    expect(viewModel.publishToAim4You).toBeFunction();
                });

                describe('when course is delivering', function () {

                    beforeEach(function () {
                        viewModel.isCourseDelivering(true);
                    });

                    it('should return undefined', function () {
                        expect(viewModel.publishToAim4You()).toBeUndefined();
                    });
                });

                describe('when course is not delivering', function () {

                    var coursePublishToStoreDefer;

                    beforeEach(function () {
                        coursePublishToStoreDefer = Q.defer();
                        spyOn(course, 'publishToStore').and.returnValue(coursePublishToStoreDefer.promise);
                        viewModel.isCourseDelivering(false);
                    });

                    it('should send event \'Publish to Aim4You\'', function () {
                        viewModel.publishToAim4You();
                        expect(eventTracker.publish).toHaveBeenCalledWith('Publish to Aim4You');
                    });

                    it('should return promise', function () {
                        expect(viewModel.publishToAim4You()).toBePromise();
                    });

                    it('should start publishToStore to current course', function (done) {
                        coursePublishToStoreDefer.resolve();

                        viewModel.publishToAim4You().fin(function () {
                            expect(course.publishToStore).toHaveBeenCalled();
                            done();
                        });
                    });

                    describe('when course published to store successfully', function () {

                        beforeEach(function () {
                            coursePublishToStoreDefer.resolve();
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

                        var message = 'Some error message';
                        beforeEach(function () {
                            coursePublishToStoreDefer.reject(message);
                        });

                        it('should show error notification', function (done) {
                            viewModel.publishToAim4You().fin(function () {
                                expect(notify.error).toHaveBeenCalledWith(message);
                                done();
                            });
                        });

                    });
                });

            });

            describe('when course build was started', function () {

                describe('and when course is current course', function () {

                    beforeEach(function () {
                        viewModel.courseId = course.id;
                    });

                    describe('and when course.publishToStore state is not ' + constants.publishingStates.building, function () {

                        beforeEach(function () {
                            course.publishToStore.state = '';
                        });

                        it('should not change action state', function () {
                            viewModel.state(constants.publishingStates.notStarted);

                            viewModel.courseBuildStarted(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                        });
                    });

                    describe('and when course.publishToStore state is ' + constants.publishingStates.building, function () {

                        beforeEach(function () {
                            course.publishToStore.state = constants.publishingStates.building;
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

                    describe('and when course.publishToStore state is not ' + constants.publishingStates.failed, function () {

                        beforeEach(function () {
                            course.publishToStore.state = '';
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

                    describe('and when course.publishToStore state is ' + constants.publishingStates.failed, function () {

                        beforeEach(function () {
                            course.publishToStore.state = constants.publishingStates.failed;
                        });

                        it('should change action state to ' + constants.publishingStates.failed, function () {
                            viewModel.state('');

                            viewModel.courseBuildFailed(course);

                            expect(viewModel.state()).toEqual(constants.publishingStates.failed);
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

                        viewModel.publishToAim4YouFailed(course);

                        expect(viewModel.state()).toEqual(constants.publishingStates.failed);
                    });
                });

                describe('and when course is any other course', function () {
                    it('should not update publish action state to \'failed\'', function () {
                        viewModel.courseId = course.id;
                        viewModel.state('');

                        viewModel.publishToAim4YouFailed({ id: '100500' });

                        expect(viewModel.state()).toEqual('');
                    });

                    it('should not clear package url', function () {
                        viewModel.courseId = course.id;
                        viewModel.packageUrl('packageUrl');

                        viewModel.publishToAim4YouFailed({ id: '100500' });

                        expect(viewModel.packageUrl()).toEqual('packageUrl');
                    });
                });

            });

            describe('when course delivering was started', function () {

                it('should hide info message', function () {
                    viewModel.initializeCourseDelivering(course);
                    expect(viewModel.messageState()).toEqual(viewModel.infoMessageStates.none);
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

    });