import PublishToCustomLms from './publishToCustomLms';

import app from 'durandal/app';
import constants from 'constants';
import eventTracker from 'eventTracker';
import notify from 'notify';
import repository from 'repositories/courseRepository';

describe('course delivering action [publishToCustomLms]', function () {

    var viewModel,
        getByIdDefer,
        eventCategory = 'some/event/category';

    var publishAction = function () { };
    publishAction.state = 'someState';
    publishAction.packageUrl = 'some/package/url';

    var publishToCustomLmsAction = function () { };

    var course = { id: 'someId', isDelivering: true, publish: publishAction, publishToCustomLms: publishToCustomLmsAction, isDirty: true, courseCompanies: [] };

    beforeEach(function () {
        viewModel = new PublishToCustomLms(eventCategory);

        spyOn(eventTracker, 'publish');
        spyOn(app, 'on').and.returnValue(Q.defer().promise);
        spyOn(app, 'off');
        getByIdDefer = Q.defer();
        spyOn(repository, 'getById').and.returnValue(getByIdDefer.promise);
    });

    it('should be object', function () {
        expect(viewModel).toBeObject();
    });

    //#region Inherited functionality

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

    describe('isCourseDelivering:', function () {
        it('should be observable', function () {
            expect(viewModel.isCourseDelivering).toBeObservable();
        });
    });

    describe('packageUrl:', function () {
        it('should be observable', function () {
            expect(viewModel.packageUrl).toBeObservable();
        });
    });

    describe('courseId:', function () {
        it('should be defined', function () {
            expect(viewModel.courseId).toBeDefined();
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

    describe('subscriptions:', function () {
        it('should be array', function () {
            expect(viewModel.subscriptions).toBeArray();
        });
    });

    describe('courseDeliveringStarted:', function () {
        it('should be function', function () {
            expect(viewModel.courseDeliveringStarted).toBeFunction();
        });

        describe('when course is current course', function () {
            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should set isCourseDelivering to true', function () {
                viewModel.isCourseDelivering(false);
                viewModel.courseDeliveringStarted(course);
                expect(viewModel.isCourseDelivering()).toBeTruthy();
            });
        });

        describe('when course is not current course', function () {
            beforeEach(function () {
                viewModel.courseId = '';
            });

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
            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should set isCourseDelivering to false', function () {
                viewModel.isCourseDelivering(true);
                viewModel.courseDeliveringFinished(course);
                expect(viewModel.isCourseDelivering()).toBeFalsy();
            });
        });

        describe('when course is not current course', function () {
            beforeEach(function () {
                viewModel.courseId = '';
            });

            it('should not change isCourseDelivering', function () {
                viewModel.isCourseDelivering(true);
                viewModel.courseDeliveringFinished({ id: 'none' });
                expect(viewModel.isCourseDelivering()).toBeTruthy();
            });
        });
    });

    describe('deactivate:', function () {
        var subscriptions;
        beforeEach(function () {
            subscriptions = [{ off: function () { } }, { off: function () { } }];
            spyOn(subscriptions[0], 'off');
            spyOn(subscriptions[1], 'off');

            viewModel.subscriptions = [subscriptions[0], subscriptions[1]];
        });

        it('should be function', function () {
            expect(viewModel.deactivate).toBeFunction();
        });

        it('should call off() for each subsription', function () {
            viewModel.deactivate();
            expect(subscriptions[0].off).toHaveBeenCalled();
            expect(subscriptions[1].off).toHaveBeenCalled();
        });

        it('should clear subscriptions', function () {
            viewModel.deactivate();
            expect(viewModel.subscriptions.length).toBe(0);
        });
    });

    describe('base activate:', function () {
        it('should be function', function () {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.activate(course, course.publish)).toBePromise();
        });

        describe('when course received', function () {
            beforeEach(function () {
                getByIdDefer.resolve(course);
            });

            it('should set state', done => (async () => {
                viewModel.state('');
                await viewModel.activate(course.id);
                expect(viewModel.state()).toBe(publishAction.state);
            })().then(done));

            it('should set packageUrl', done => (async () => {
                viewModel.packageUrl('');
                await viewModel.activate(course.id);
                expect(viewModel.packageUrl()).toBe(publishAction.packageUrl);
            })().then(done));

            it('should set isCourseDelivering', done => (async () => {
                viewModel.isCourseDelivering(false);
                await viewModel.activate(course.id);
                expect(viewModel.isCourseDelivering()).toBe(course.isDelivering);
            })().then(done));

            it('should set courseId', done => (async () => {
                viewModel.courseId = '';
                await viewModel.activate(course.id);
                expect(viewModel.courseId).toBe(course.id);
            })().then(done));

            it('should subscribe to course.delivering.started event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.delivering.started);
            })().then(done));

            it('should subscribe to course.delivering.finished event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.delivering.finished);
            })().then(done));
        });
    });

    //#endregion

    describe('eventCategory:', function () {

        it('should be defined', function () {
            expect(viewModel.eventCategory).toBeDefined();
        });

        it('shoulb be equal constructor argument', function () {
            expect(viewModel.eventCategory).toBe(eventCategory);
        });

    });

    describe('isDirty:', function () {

        it('should be observable', function () {
            expect(viewModel.isDirty).toBeObservable();
        });

    });

    describe('isPublishingToLms:', function () {

        it('should be observable', function () {
            expect(viewModel.isPublishingToLms).toBeObservable();
        });

    });

    describe('isPublished:', function () {

        it('should be observable', function () {
            expect(viewModel.isPublished).toBeObservable();
        });

    });

    describe('isPublishing:', function () {

        it('should be computed', function () {
            expect(viewModel.isPublishing).toBeComputed();
        });

        describe('when isCourseDelivering and isPublishingToLms are false', function () {

            beforeEach(function () {
                viewModel.isCourseDelivering(false);
                viewModel.isPublishingToLms(false);
            });

            it('should be false', function () {
                expect(viewModel.isPublishing()).toBeFalsy();
            });

        });

        describe('when isCourseDelivering true', function () {

            beforeEach(function () {
                viewModel.isCourseDelivering(true);
                viewModel.isPublishingToLms(false);
            });

            it('should be true', function () {
                expect(viewModel.isPublishing()).toBeTruthy();
            });

        });

        describe('when isPublishingToLms true', function () {

            beforeEach(function () {
                viewModel.isPublishingToLms(true);
                viewModel.isCourseDelivering(false);
            });

            it('should be true', function () {
                expect(viewModel.isPublishing()).toBeTruthy();
            });

        });

    });

    describe('publishToCustomLms:', function () {

        it('should be defined', function () {
            expect(viewModel.publishToCustomLms).toBeDefined();
        });

        it('should send event \'Publish course to custom hosting\'', function () {
            viewModel.publishToCustomLms();
            expect(eventTracker.publish).toHaveBeenCalledWith('Publish course to custom hosting', eventCategory);
        });

        var publishDefer,
            publishToCustomLmsDefer;
        beforeEach(function () {
            publishDefer = Q.defer();
            publishToCustomLmsDefer = Q.defer();
            spyOn(course, 'publish').and.returnValue(publishDefer.promise);
            spyOn(course, 'publishToCustomLms').and.returnValue(publishToCustomLmsDefer.promise);
            viewModel.courseId = course.id;
            getByIdDefer.resolve(course);
        });

        describe('when isDirty true', function () {

            beforeEach(function () {
                viewModel.isDirty(true);
                viewModel.companyInfo = { id: 'id' };
                publishToCustomLmsDefer.resolve();
            });

            it('should call publish action', done => (async () => {
                publishDefer.resolve();
                await viewModel.publishToCustomLms();
                expect(course.publish).toHaveBeenCalled();
            })().then(done));

            describe('and when publish action rejected', function () {

                var errorReason = 'some reason';
                beforeEach(function () {
                    publishDefer.reject(errorReason);
                });

                it('should notify error', done => (async () => {
                    spyOn(notify, 'error');
                    await viewModel.publishToCustomLms();
                    expect(notify.error).toHaveBeenCalledWith(errorReason);
                })().then(done));

            });

            describe('and when publish action resolved', function () {

                beforeEach(function () {
                    publishDefer.resolve();
                });

                describe('and when isPublished true', function () {

                    beforeEach(function () {
                        viewModel.isPublished(true);
                    });

                    it('should not call publishToCustomLms action', done => (async () => {
                        await viewModel.publishToCustomLms();
                        expect(course.publishToCustomLms).not.toHaveBeenCalled();
                    })().then(done));

                });

                describe('and when isPublished false', function () {

                    beforeEach(function () {
                        viewModel.isPublished(false);
                    });

                    it('should call publishToCustomLms action', done => (async () => {
                        await viewModel.publishToCustomLms();
                        expect(course.publishToCustomLms).toHaveBeenCalledWith(viewModel.companyInfo.id);
                    })().then(done));

                });

            });

        });

    });

    describe('activate:', function () {

        beforeEach(function () {
            getByIdDefer.resolve(course);
        });

        it('should set courseId', done => (async () => {
            viewModel.courseId = null;

            await viewModel.activate({ courseId: course.id });
            expect(viewModel.courseId).toBe(course.id);
        })().then(done));

        it('should set companyInfo', done => (async () => {
            var companyInfo = { id: 'companyId' };
            viewModel.companyInfo = null;

            await viewModel.activate({ courseId: course.id, companyInfo: companyInfo });
            expect(viewModel.companyInfo).toBe(companyInfo);
        })().then(done));

        it('should set isPublished', done => (async () => {
            var companyInfo = { id: 'companyId' };
            viewModel.isPublished(false);
            course.courseCompanies = [companyInfo];

            await viewModel.activate({ courseId: course.id, companyInfo: companyInfo });
            expect(viewModel.isPublished()).toBeTruthy();
        })().then(done));

        it('should set isDirty', done => (async () => {
            var companyInfo = { id: 'companyId' };
            viewModel.isDirty(false);
            course.isDirty = true;

            await viewModel.activate({ courseId: course.id, companyInfo: companyInfo });
            expect(viewModel.isDirty()).toBeTruthy();
        })().then(done));

        it('should subscribe to course.stateChanged event', done => (async () => {
            var companyInfo = { id: 'companyId' };
            await viewModel.activate({ courseId: course.id, companyInfo: companyInfo });
            expect(app.on).toHaveBeenCalledWith(constants.messages.course.stateChanged + course.id);
        })().then(done));

        it('should subscribe to course.publishToCustomLms.started event', done => (async () => {
            var companyInfo = { id: 'companyId' };
            await viewModel.activate({ courseId: course.id, companyInfo: companyInfo });
            expect(app.on).toHaveBeenCalledWith(constants.messages.course.publishToCustomLms.started);
        })().then(done));

        it('should subscribe to course.publishToCustomLms.completed event', done => (async () => {
            var companyInfo = { id: 'companyId' };
            await viewModel.activate({ courseId: course.id, companyInfo: companyInfo });
            expect(app.on).toHaveBeenCalledWith(constants.messages.course.publishToCustomLms.completed);
        })().then(done));

        it('should subscribe to course.publishToCustomLms.failed event', done => (async () => {
            var companyInfo = { id: 'companyId' };
            await viewModel.activate({ courseId: course.id, companyInfo: companyInfo });
            expect(app.on).toHaveBeenCalledWith(constants.messages.course.publishToCustomLms.failed);
        })().then(done));

    });

    //#region App-wide events

    describe('courseStateChanged:', function () {

        it('should be function', function () {
            expect(viewModel.courseStateChanged).toBeFunction();
        });

        it('should set isDirty', function () {
            viewModel.isDirty(false);

            viewModel.courseStateChanged({ isDirty: true });

            expect(viewModel.isDirty()).toBeTruthy();
        });

    });

    describe('coursePublishStarted:', function () {

        it('should be function', function () {
            expect(viewModel.coursePublishStarted).toBeFunction();
        });

        describe('and when course is current course', function () {

            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should set isPublishingToLms to true', function () {
                viewModel.isPublishingToLms(false);

                viewModel.coursePublishStarted(course);

                expect(viewModel.isPublishingToLms()).toBeTruthy();
            });

        });

        describe('and when course is any other course', function () {

            beforeEach(function () {
                viewModel.courseId = '100500';
            });

            it('should not set isPublishingToLms to true', function () {
                viewModel.isPublishingToLms(false);

                viewModel.coursePublishStarted(course);

                expect(viewModel.isPublishingToLms()).toBeFalsy();
            });

        });

    });

    describe('coursePublishCompleted:', function () {

        it('should be function', function () {
            expect(viewModel.coursePublishCompleted).toBeFunction();
        });

        describe('and when course is current course', function () {

            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should set isPublishingToLms to false', function () {
                viewModel.companyInfo = { id: '123' };
                viewModel.isPublishingToLms(true);

                viewModel.coursePublishCompleted(course);

                expect(viewModel.isPublishingToLms()).toBeFalsy();
            });

            describe('and when course contains current company', function () {

                var company = { id: 'companyId' };

                beforeEach(function () {
                    course.courseCompanies = [company];
                    viewModel.companyInfo = company;
                });

                it('should set isPublished to true', function () {
                    viewModel.isPublished(false);

                    viewModel.coursePublishCompleted(course);

                    expect(viewModel.isPublished()).toBeTruthy();
                });

            });

        });

        describe('and when course is any other course', function () {

            beforeEach(function () {
                viewModel.courseId = '100500';
            });

            it('should not set isPublishingToLms to false', function () {
                viewModel.isPublishingToLms(true);

                viewModel.coursePublishCompleted(course);

                expect(viewModel.isPublishingToLms()).toBeTruthy();
            });

            it('should not set isPublished to true', function () {
                viewModel.isPublished(false);

                viewModel.coursePublishCompleted(course);

                expect(viewModel.isPublished()).toBeFalsy();
            });

        });

    });

    describe('coursePublishFailed:', function () {

        it('should be function', function () {
            expect(viewModel.coursePublishFailed).toBeFunction();
        });

        describe('and when course is current course', function () {

            var errorReason = 'some reason';
            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should set isPublishingToLms to false', function () {
                viewModel.isPublishingToLms(true);

                viewModel.coursePublishFailed(course, errorReason);

                expect(viewModel.isPublishingToLms()).toBeFalsy();
            });

            it('should notify error', function () {
                spyOn(notify, 'error');

                viewModel.coursePublishFailed(course, errorReason);

                expect(notify.error).toHaveBeenCalledWith(errorReason);
            });

        });

        describe('and when course is any other course', function () {

            beforeEach(function () {
                viewModel.courseId = '100500';
            });

            it('should not set isPublishingToLms to false', function () {
                viewModel.isPublishingToLms(true);

                viewModel.coursePublishFailed(course);

                expect(viewModel.isPublishingToLms()).toBeTruthy();
            });

        });

    });

    //#endregion

});