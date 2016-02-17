import viewModel from './sidePanel';

import app from 'durandal/app';
import constants from 'constants';
import repository from 'repositories/courseRepository';
import router from 'plugins/router';
import notify from 'notify';
import Course from 'models/course';

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

        var course = new Course({ id: 'id' });

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

                    course.publishForReview.packageUrl = 'url';
                    app.trigger(constants.messages.course.publishForReview.completed, course);

                    expect(viewModel.lastReviewTabActivationData().reviewUrl).toEqual(course.publishForReview.packageUrl);
                });
            });

            describe('and when lastReviewTabActivationData is null', function () {
                beforeEach(function () {
                    viewModel.lastReviewTabActivationData(null);
                });

                it('should not change lastReviewTabActivationData', function () {
                    course.publishForReview.packageUrl = 'someUrl';

                    app.trigger(constants.messages.course.publishForReview.completed, course);

                    expect(viewModel.lastReviewTabActivationData()).toBeNull();
                });
            });

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

            it('should trigger event ' + constants.messages.sidePanel.expanded, function () {
                spyOn(app, 'trigger');
                viewModel.toggleTabVisibility(tab);
                expect(app.trigger).toHaveBeenCalledWith(constants.messages.sidePanel.expanded);
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

        it('should trigger event ' + constants.messages.sidePanel.collapsed, function () {
            spyOn(app, 'trigger');
            viewModel.onCollapsed();
            expect(app.trigger).toHaveBeenCalledWith(constants.messages.sidePanel.collapsed);
        });

    });

    describe('getReviewTabActivationData:', function () {
        var courseId = 'courseId';

        beforeEach(function () {
            spyOn(notify, 'error');
        });

        it('should return promise', function () {
            expect(viewModel.getReviewTabActivationData()).toBePromise();
        });

        describe('when router.routeData courseId is null', function () {
            beforeEach(function () {
                router.routeData({ courseId: null });
            });

            it('should set lastReviewTabActivationData to null', function (done) {
                viewModel.getReviewTabActivationData().fin(function () {
                    expect(viewModel.lastReviewTabActivationData()).toBe(null);
                    done();
                });
            });

            it('should resolve promise with null', function (done) {
                var promise = viewModel.getReviewTabActivationData();

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

                    viewModel.getReviewTabActivationData().fin(function () {
                        expect(repository.getById).toHaveBeenCalledWith(courseId);
                        done();
                    });
                });

                describe('when course exists', function () {

                    it('should update lastReviewTabActivationData', function (done) {
                        var
                            promise = viewModel.getReviewTabActivationData(),
                            course = { id: 'someId', publishForReview: { packageUrl: 'some/package/url' } };

                        getById.resolve(course);

                        promise.fin(function () {
                            expect(promise).toBeResolvedWith({
                                courseId: course.id,
                                reviewUrl: course.publishForReview.packageUrl
                            });
                            done();
                        });
                    });

                    it('should resolve promise', function (done) {
                        getById.resolve({ id: 'courseId', publishForReview: { packageUrl: '' } });

                        var promise = viewModel.getReviewTabActivationData();

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
                        viewModel.lastReviewTabActivationData({ courseId: courseId });
                    });

                    it('should not get course from repository', function (done) {
                        getById.resolve();

                        viewModel.getReviewTabActivationData().fin(function () {
                            expect(repository.getById).not.toHaveBeenCalledWith(courseId);
                            done();
                        });
                    });

                    it('should return lastReviewTabActivationData', function (done) {
                        var promise = viewModel.getReviewTabActivationData();

                        promise.fin(function () {
                            expect(promise).toBeResolvedWith(viewModel.lastReviewTabActivationData());
                            done();
                        });
                    });
                });

                describe('and when lastReviewTabActivationData courseId is not equal to current courseId', function () {
                    beforeEach(function () {
                        viewModel.lastReviewTabActivationData({ courseId: '100500' });
                    });

                    it('should get course from repository', function (done) {
                        getById.resolve();

                        viewModel.getReviewTabActivationData().fin(function () {
                            expect(repository.getById).toHaveBeenCalledWith(courseId);
                            done();
                        });
                    });

                    describe('when course exists', function () {

                        it('should update lastReviewTabActivationData', function (done) {
                            var
                                promise = viewModel.getReviewTabActivationData(),
                                course = { id: 'someId', publishForReview: { packageUrl: 'some/package/url' } };

                            getById.resolve(course);

                            promise.fin(function () {
                                expect(promise).toBeResolvedWith({
                                    courseId: course.id,
                                    reviewUrl: course.publishForReview.packageUrl
                                });
                                done();
                            });
                        });

                        it('should resolve promise', function (done) {
                            var promise = viewModel.getReviewTabActivationData();
                            getById.resolve({ id: 'courseId', publishForReview: { packageUrl: '' } });

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
