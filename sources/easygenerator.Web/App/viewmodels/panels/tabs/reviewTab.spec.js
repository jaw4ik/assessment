import viewModel from './reviewTab';

import router from 'plugins/router';
import constants from 'constants';
import repository from 'repositories/courseRepository';
import commentRepository from 'repositories/commentRepository';
import eventTracker from 'eventTracker';
import userContext from 'userContext';
import notify from 'notify';
import Course from 'models/course';

describe('viewModel [reviewTab]', function () {

    var course = new Course({
        id: 'someId',
        reviewUrl: 'url'
    });

    beforeEach(function () {
        spyOn(router, 'openUrl');
        spyOn(eventTracker, 'publish');
    });

    it('should be object', function () {
        expect(viewModel).toBeObject();
    });

    describe('isPublishing:', function () {
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

    describe('courseReviewUrl:', function () {
        it('should be observable', function () {
            expect(viewModel.reviewUrl).toBeObservable();
        });
    });

    describe('openCourseReviewUrl:', function () {

        it('should be function', function () {
            expect(viewModel.openCourseReviewUrl).toBeFunction();
        });

        describe('when reviewUrl exists', function () {

            beforeEach(function () {
                viewModel.reviewUrl('someUrl');
            });

            describe('when course is not publishing', function () {

                beforeEach(function () {
                    viewModel.state(constants.publishingStates.failed);
                });

                it('should open course review url', function () {
                    viewModel.openCourseReviewUrl();
                    expect(router.openUrl).toHaveBeenCalledWith(viewModel.reviewUrl());
                });

            });

            describe('when course is publishing', function () {

                beforeEach(function () {
                    viewModel.state(constants.publishingStates.building);
                });

                it('should not open link', function () {
                    viewModel.openCourseReviewUrl();
                    expect(router.openUrl).not.toHaveBeenCalledWith(viewModel.reviewUrl());
                });

            });

        });

        describe('when reviewUrl does not exist', function () {

            beforeEach(function () {
                viewModel.reviewUrl('');
            });

            it('should not open link', function () {
                viewModel.openCourseReviewUrl();
                expect(router.openUrl).not.toHaveBeenCalledWith(viewModel.reviewUrl());
            });

        });

    });

    describe('updateCourseForReview:', function () {

        var getByIdDefer;
        var getByIdPromise;
        var publishForReviewDefer;
        var pblishForReviewPromise;

        beforeEach(function () {
            getByIdDefer = Q.defer();
            publishForReviewDefer = Q.defer();
            getByIdPromise = getByIdDefer.promise;
            pblishForReviewPromise = publishForReviewDefer.promise;
            spyOn(repository, 'getById').and.returnValue(getByIdPromise);
            spyOn(course, 'publishForReview').and.returnValue(pblishForReviewPromise);
        });

        it('should be a function', function () {
            expect(viewModel.updateCourseForReview).toBeFunction();
        });

        describe('when is not active', function () {

            beforeEach(function () {
                viewModel.isActive(false);
            });

            it('should send event \"Update course for review\"', function () {
                viewModel.updateCourseForReview();
                expect(eventTracker.publish).toHaveBeenCalledWith('Update course for review');
            });

            it('should set isActive to true', function () {
                viewModel.updateCourseForReview();
                expect(viewModel.isActive()).toBeTruthy();
            });

            it('should start publish for review of current course', function (done) {
                getByIdDefer.resolve(course);
                publishForReviewDefer.resolve();
                viewModel.updateCourseForReview().fin(function () {
                    expect(course.publishForReview).toHaveBeenCalled();
                    done();
                });
            });

            describe('when course publish finished successfully', function () {
                beforeEach(function () {
                    getByIdDefer.resolve(course);
                    publishForReviewDefer.resolve();
                });

                it('should set isActive() to false', function (done) {
                    viewModel.updateCourseForReview().fin(function () {
                        expect(viewModel.isActive()).toBeFalsy();
                        done();
                    });
                });
            });

            describe('when course publish failed', function () {

                var message = 'Some error message';
                beforeEach(function () {
                    getByIdDefer.resolve(course);
                    publishForReviewDefer.reject(message);
                });

                it('should show error notification', function (done) {
                    spyOn(notify, 'error');
                    viewModel.updateCourseForReview().fin(function () {
                        expect(notify.error).toHaveBeenCalledWith(message);
                        done();
                    });
                });

                it('should set isActive() to false', function (done) {
                    viewModel.updateCourseForReview().fin(function () {
                        expect(viewModel.isActive()).toBeFalsy();
                        done();
                    });
                });
            });
        });

        describe('when publish process is running', function () {
            beforeEach(function () {
                viewModel.isActive(true);
            });

            it('should not send event \"Update course for review\"', function () {
                viewModel.updateCourseForReview();
                expect(eventTracker.publish).not.toHaveBeenCalledWith('Update course for review');
            });
        });
    });

    describe('reviewUrlExists:', function () {

        it('should be computed', function () {
            expect(viewModel.reviewUrlExists).toBeComputed();
        });

        describe('when reviewUrl is not defined', function () {

            it('should be false', function () {
                viewModel.reviewUrl(undefined);
                expect(viewModel.reviewUrlExists()).toBeFalsy();
            });

        });

        describe('when reviewUrl is empty', function () {

            it('should be false', function () {
                viewModel.reviewUrl('');
                expect(viewModel.reviewUrlExists()).toBeFalsy();
            });

        });

        describe('when reviewUrl is whitespace', function () {

            it('should be false', function () {
                viewModel.reviewUrl("    ");
                expect(viewModel.reviewUrlExists()).toBeFalsy();
            });

        });

        describe('when reviewUrl is a non-whitespace string', function () {

            it('should be true', function () {
                viewModel.reviewUrl("reviewUrl");
                expect(viewModel.reviewUrlExists()).toBeTruthy();
            });

        });

    });

    describe('state:', function () {
        it('should be observable', function () {
            expect(viewModel.state).toBeObservable();
        });
    });

    describe('states:', function () {
        it('should be defined', function () {
            expect(viewModel.states).toBeDefined();
        });
    });

    describe('activate:', function () {

        var dataDeferred, dataPromise;
        var getCommentsCollectionDefer,
            userContextIdentityDefer;

        beforeEach(function () {
            dataDeferred = Q.defer();
            dataPromise = dataDeferred.promise;

            getCommentsCollectionDefer = Q.defer();
            userContextIdentityDefer = Q.defer();

            spyOn(commentRepository, 'getCollection').and.returnValue(getCommentsCollectionDefer.promise);
            spyOn(userContext, 'identify').and.returnValue(userContextIdentityDefer.promise);

            userContextIdentityDefer.resolve();
        });

        it('should be function', function () {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.activate(dataPromise)).toBePromise();
        });

        describe('when activation data is not an object', function () {

            it('should reject promise with \'Activation data promise is not an object\'', function (done) {
                var promise = viewModel.activate(null);

                promise.fin(function () {
                    expect(promise).toBeRejectedWith('Activation data promise is not an object');
                    done();
                });
            });

        });

        describe('when activation data is an object', function () {

            describe('and activation data courseId is not a string', function () {

                it('should reject promise with \'Course id is not a string\'', function (done) {
                    dataDeferred.resolve({ courseId: null });

                    var promise = viewModel.activate(dataPromise);

                    promise.fin(function () {
                        expect(promise).toBeRejectedWith('Course id is not a string');
                        done();
                    });
                });

            });

            describe('and activation data courseId is a string', function () {

                var activationData = { courseId: 'id' };

                beforeEach(function () {
                    dataDeferred.resolve(activationData);
                });

                it('should send event \'Open review tab\'', function (done) {
                    getCommentsCollectionDefer.reject();

                    viewModel.activate(dataPromise).fin(function () {
                        expect(eventTracker.publish).toHaveBeenCalledWith('Open review tab');
                        done();
                    });
                });

                it('should set courseId to corresponding value', function (done) {
                    getCommentsCollectionDefer.reject();

                    viewModel.activate(dataPromise).fin(function () {
                        expect(viewModel.courseId).toBe(activationData.courseId);
                        done();
                    });
                });

                it('should set reviewUrl to corresponding value', function (done) {
                    activationData.reviewUrl = 'url';

                    getCommentsCollectionDefer.reject();

                    viewModel.activate(dataPromise).fin(function () {
                        expect(viewModel.reviewUrl()).toBe(activationData.reviewUrl);
                        done();
                    });
                });

                describe('and activationData reviewUrl is string', function () {
                    beforeEach(function () {
                        activationData.reviewUrl = 'url';
                    });

                    it('should set state to succeed', function (done) {
                        dataDeferred.resolve(activationData);
                        getCommentsCollectionDefer.reject();

                        viewModel.activate(dataPromise).fin(function () {
                            expect(viewModel.state()).toBe(constants.publishingStates.succeed);
                            done();
                        });
                    });
                });

                describe('and activationData reviewUrl is not a string', function () {
                    beforeEach(function () {
                        activationData.reviewUrl = null;
                    });

                    it('should set state to failed', function (done) {
                        getCommentsCollectionDefer.reject();

                        viewModel.activate(dataPromise).fin(function () {
                            expect(viewModel.state()).toBe(constants.publishingStates.failed);
                            done();
                        });
                    });

                });

            });

        });

    });

    describe('isActive:', function () {
        it('should be observable', function () {
            expect(viewModel.isActive).toBeObservable();
        });
    });

    describe('when course build was started', function () {

        describe('and when course is current course', function () {

            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            describe('and when course.build state is not ' + constants.publishingStates.building, function () {

                beforeEach(function () {
                    course.publishForReview.state = '';
                });

                it('should not change state', function () {
                    viewModel.state(constants.publishingStates.notStarted);

                    viewModel.courseBuildStarted(course);

                    expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                });
            });

            describe('and when course.build state is ' + constants.publishingStates.building, function () {

                beforeEach(function () {
                    course.publishForReview.state = constants.publishingStates.building;
                });

                it('should change  state to ' + constants.publishingStates.building, function () {
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

            it('should not change state', function () {
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

            describe('and when course.build state is not ' + constants.publishingStates.failed, function () {

                beforeEach(function () {
                    course.publishForReview.state = '';
                });

                it('should not change state', function () {
                    viewModel.state(constants.publishingStates.notStarted);

                    viewModel.courseBuildFailed(course);

                    expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                });
            });

            describe('and when course.build state is ' + constants.publishingStates.failed, function () {

                beforeEach(function () {
                    course.publishForReview.state = constants.publishingStates.failed;
                });

                it('should change state to ' + constants.publishingStates.failed, function () {
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

            it('should not change state', function () {
                viewModel.state(constants.publishingStates.notStarted);

                viewModel.courseBuildFailed(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
            });

            it('should not clear courseReviewUrl', function () {
                viewModel.reviewUrl('url');

                viewModel.courseBuildFailed(course);

                expect(viewModel.reviewUrl()).toEqual('url');
            });
        });

    });

    describe('when course publishForReview was started', function () {

        describe('and when course is current course', function () {

            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should change state to ' + constants.publishingStates.publishing, function () {
                viewModel.state('');

                viewModel.coursePublishForReviewStarted(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.publishing);
            });
        });

        describe('and when course is any other course', function () {

            beforeEach(function () {
                viewModel.courseId = '100500';
            });

            it('should not change state', function () {
                viewModel.state(constants.publishingStates.notStarted);

                viewModel.coursePublishForReviewStarted(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
            });
        });

    });

    describe('when course publishForReview completed', function () {

        describe('and when course is current course', function () {

            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should update state to ' + constants.publishingStates.succeed, function () {
                viewModel.state('');

                viewModel.coursePublishForReviewCompleted(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.succeed);
            });

            it('should update courseReviewUrl to the corresponding one', function () {
                viewModel.reviewUrl('');
                course.publishForReview.packageUrl = 'someUrl';

                viewModel.coursePublishForReviewCompleted(course);

                expect(viewModel.reviewUrl()).toEqual(course.publishForReview.packageUrl);
            });
        });

        describe('and when course is any other course', function () {

            beforeEach(function () {
                viewModel.courseId = '100500';
            });

            it('should not update state', function () {
                viewModel.state(constants.publishingStates.notStarted);
                        
                viewModel.coursePublishForReviewCompleted(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
            });

            it('should not update current courseReviewUrl', function () {
                viewModel.reviewUrl('url');
                        
                viewModel.coursePublishForReviewCompleted(course);

                expect(viewModel.reviewUrl()).toEqual("url");
            });
        });

    });

    describe('when course publishForReview failed', function () {

        describe('and when course is current course', function () {

            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should update state to \'failed\'', function () {
                viewModel.state('');

                viewModel.coursePublishForReviewFailed(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.failed);
            });
        });

        describe('and when course is any other course', function () {

            beforeEach(function () {
                viewModel.courseId = '100500';
            });

            it('should not update publish state to \'failed\'', function () {
                viewModel.state('');

                viewModel.coursePublishForReviewFailed(course);

                expect(viewModel.state()).toEqual('');
            });
        });

    });

});
