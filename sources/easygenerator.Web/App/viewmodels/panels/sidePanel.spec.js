define(['viewmodels/panels/sidePanel', 'constants', 'durandal/app', 'repositories/courseRepository', 'plugins/router', 'viewmodels/panels/tabs/reviewTab', 'notify'],
    function (viewModel, constants, app, repository, router, reviewTab, notify) {
        describe('viewModel [sidePanel]', function () {
            var getById;

            beforeEach(function () {
                getById = Q.defer();
                router.routeData({ courseId: 'courseId' });
                spyOn(repository, 'getById').and.returnValue(getById.promise);
            });

            it('should be object', function () {
                expect(viewModel).toBeObject();
            });

            describe('activeTab:', function () {

                it('should be observable', function () {
                    expect(viewModel.activeTab).toBeObservable();
                });

            });

            describe('reviewTabActivationData:', function () {
                it('should be computed', function () {
                    expect(viewModel.reviewTabActivationData).toBeComputed();
                });
            });

            describe('lastReviewTabActivationData:', function () {
                it('should be observable', function () {
                    expect(viewModel.lastReviewTabActivationData).toBeObservable();
                });
            });

            describe('isExpanded:', function () {
                it('should be observable', function () {
                    expect(viewModel.isExpanded).toBeObservable();
                });
            });

            describe('reviewTab:', function () {
                it('should be an object', function () {
                    expect(viewModel.reviewTab).toBeObject();
                });
            });

            describe('isReviewTabVisible:', function () {
                it('should be computed', function () {
                    expect(viewModel.isReviewTabVisible).toBeComputed();
                });

                describe('when router.routeData courseId is null', function () {
                    beforeEach(function () {
                        router.routeData({ courseId: null });
                    });

                    it('should be false', function () {
                        expect(viewModel.isReviewTabVisible()).toBeFalsy();
                    });
                });

                describe('when router.routeData courseId is string', function () {
                    beforeEach(function () {
                        router.routeData({ courseId: 'id' });
                    });

                    it('should be true', function () {
                        expect(viewModel.isReviewTabVisible()).toBeTruthy();
                    });
                });
            });

            describe('when course publishForReview completed', function () {

                var course = { id: 'id' };

                describe('and when course is current course', function () {

                    beforeEach(function () {
                        router.routeData({ courseId: course.id });
                    });

                    describe('and when lastReviewTabActivationData is object', function () {
                        beforeEach(function () {
                            viewModel.lastReviewTabActivationData({});
                        });

                        it('should update lastReviewTabActivationData.reviewUrl to the corresponding one', function () {
                            viewModel.lastReviewTabActivationData().reviewUrl = '';

                            course.reviewUrl = 'url';
                            app.trigger(constants.messages.course.publishForReview.completed, course);

                            expect(viewModel.lastReviewTabActivationData().reviewUrl).toEqual(course.reviewUrl);
                        });
                    });

                    describe('and when lastReviewTabActivationData is null', function () {
                        beforeEach(function () {
                            viewModel.lastReviewTabActivationData(null);
                        });

                        it('should not change lastReviewTabActivationData', function () {
                            course.reviewUrl = 'someUrl';

                            app.trigger(constants.messages.course.publishForReview.completed, course);

                            expect(viewModel.lastReviewTabActivationData()).toBeNull();
                        });
                    });

                });

            });

            describe('feedbackTab:', function () {
                it('should be an object', function () {
                    expect(viewModel.feedbackTab).toBeObject();
                });
            });

            describe('activate:', function () {

                it('should be function', function () {
                    expect(viewModel.activate).toBeFunction();
                });

                it('should return promise', function () {
                    expect(viewModel.activate()).toBePromise();
                });

                it('should clear active tab', function (done) {
                    viewModel.activeTab({});

                    viewModel.activate().fin(function () {
                        expect(viewModel.activeTab()).toBe(null);
                        done();
                    });
                });

            });

            describe('toggleTabVisibility:', function () {

                var tab = {};

                it('should be function', function () {
                    expect(viewModel.toggleTabVisibility).toBeFunction();
                });

                describe('when tab is active', function () {
                    beforeEach(function () {
                        viewModel.activeTab(tab);
                    });

                    it('should not change activeTab', function () {
                        viewModel.toggleTabVisibility(tab);
                        expect(viewModel.activeTab()).toBe(tab);
                    });

                    it('should set isExpanded to false', function () {
                        viewModel.toggleTabVisibility(tab);
                        expect(viewModel.isExpanded()).toBeFalsy();
                    });

                });

                describe('when tab is not active', function () {
                    beforeEach(function () {
                        viewModel.activeTab(null);
                    });

                    it('should set activeTab to tab', function () {
                        viewModel.toggleTabVisibility(tab);
                        expect(viewModel.activeTab()).toBe(tab);
                    });

                    it('should set isExpanded to true', function () {
                        viewModel.toggleTabVisibility(tab);
                        expect(viewModel.isExpanded()).toBeTruthy();
                    });
                });

            });

            describe('onCollapsed:', function () {

                it('should be function', function () {
                    expect(viewModel.onCollapsed).toBeFunction();
                });

                it('should reset active tab', function () {
                    viewModel.activeTab({});

                    viewModel.onCollapsed();

                    expect(viewModel.activeTab()).toBe(null);
                });

            });

            describe('reviewTabActivationData:', function () {
                var courseId = 'courseId';

                beforeEach(function () {
                    spyOn(notify, 'error');
                });

                it('should be computed', function () {
                    expect(viewModel.reviewTabActivationData).toBeComputed();
                });

                it('should return promise', function () {
                    expect(viewModel.reviewTabActivationData()).toBePromise();
                });

                describe('when router.routeData courseId is null', function () {
                    beforeEach(function () {
                        router.routeData({ courseId: null });
                    });

                    it('should set lastReviewTabActivationData to null', function (done) {
                        viewModel.reviewTabActivationData().fin(function () {
                            expect(viewModel.lastReviewTabActivationData()).toBe(null);
                            done();
                        });
                    });

                    it('should resolve promise with null', function (done) {
                        var promise = viewModel.reviewTabActivationData();

                        promise.fin(function () {
                            expect(promise).toBeResolvedWith(null);
                            done();
                        });
                    });
                });

                describe('when router.routeData courseId is string', function () {
                    beforeEach(function () {
                        router.routeData({ courseId: courseId });
                    });

                    describe('and when lastReviewTabActivationData is null', function () {
                        beforeEach(function () {
                            spyOn(viewModel, 'lastReviewTabActivationData').and.returnValue(null);
                        });

                        it('should get course from repository', function (done) {
                            getById.resolve();

                            viewModel.reviewTabActivationData().fin(function () {
                                expect(repository.getById).toHaveBeenCalledWith(courseId);
                                done();
                            });
                        });

                        describe('when course exists', function () {

                            it('should update lastReviewTabActivationData', function (done) {
                                var
                                    promise = viewModel.reviewTabActivationData(),
                                    course = { reviewUrl: '', id: 'someId' };

                                getById.resolve(course);

                                promise.fin(function () {
                                    expect(promise).toBeResolvedWith({
                                        courseId: course.id,
                                        reviewUrl: course.reviewUrl
                                    });
                                    done();
                                });
                            });

                            it('should resolve promise', function (done) {
                                getById.resolve({ id: 'courseId', reviewUrl: '' });

                                var promise = viewModel.reviewTabActivationData();

                                promise.fin(function () {
                                    expect(promise).toBeResolved();
                                    done();
                                });
                            });

                        });

                    });

                    describe('and when lastReviewTabActivationData is not null', function () {

                        describe('and when lastReviewTabActivationData courseId equals to current courseId', function () {
                            beforeEach(function () {
                                spyOn(viewModel, 'lastReviewTabActivationData').and.returnValue({ courseId: courseId });
                            });

                            it('should not get course from repository', function (done) {
                                getById.resolve();

                                viewModel.reviewTabActivationData().fin(function () {
                                    expect(repository.getById).not.toHaveBeenCalledWith(courseId);
                                    done();
                                });
                            });

                            it('should return lastReviewTabActivationData', function (done) {
                                var promise = viewModel.reviewTabActivationData();

                                promise.fin(function () {
                                    expect(promise).toBeResolvedWith(viewModel.lastReviewTabActivationData());
                                    done();
                                });
                            });
                        });

                        describe('and when lastReviewTabActivationData courseId is not equal to current courseId', function () {
                            beforeEach(function () {
                                spyOn(viewModel, 'lastReviewTabActivationData').and.returnValue({ courseId: '100500' });
                            });

                            it('should get course from repository', function (done) {
                                getById.resolve();

                                viewModel.reviewTabActivationData().fin(function () {
                                    expect(repository.getById).toHaveBeenCalledWith(courseId);
                                    done();
                                });
                            });

                            describe('when course exists', function () {

                                it('should update lastReviewTabActivationData', function (done) {
                                    var
                                        promise = viewModel.reviewTabActivationData(),
                                        course = { reviewUrl: '', id: 'someId' };

                                    getById.resolve(course);

                                    promise.fin(function () {
                                        expect(promise).toBeResolvedWith({
                                            courseId: course.id,
                                            reviewUrl: course.reviewUrl
                                        });
                                        done();
                                    });
                                });

                                it('should resolve promise', function (done) {
                                    var promise = viewModel.reviewTabActivationData();
                                    getById.resolve({ id: 'courseId', reviewUrl: '' });

                                    promise.fin(function () {
                                        expect(promise).toBeResolved();
                                        done();
                                    });
                                });

                            });
                        });
                    });
                });
            });
        });

    }
);