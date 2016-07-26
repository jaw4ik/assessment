import ScormBuild from './scormBuild';

import app from 'durandal/app';
import Course from 'models/course';
import constants from 'constants';
import notify from 'notify';
import eventTracker from 'eventTracker';
import fileHelper from 'fileHelper';
import router from 'routing/router';
import userContext from 'userContext';
import repository from 'repositories/courseRepository';

describe('publishing action [scormBuild]', function () {

    var
        action = function () { },
        getByIdDefer,
        viewModel,
        course = new Course({
            id: 'someId',
            saleInfo: { isProcessing: false }
        });

    action.state = 'someState';
    action.packageUrl = 'some/package/url';
    course.scormBuild = action;

    beforeEach(function () {
        viewModel = new ScormBuild();
        course.scormBuild.url = 'scormBuildUrl';
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'hide');
        spyOn(fileHelper, 'downloadFile').and.callFake(function () { });
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

    describe('includeMedia:', function () {
        it('should be observable', function () {
            expect(viewModel.includeMedia).toBeObservable();
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

    describe('activate:', function () {
        it('should be function', function () {
            expect(viewModel.activate).toBeFunction();
        });

        it('should return promise', function () {
            expect(viewModel.activate()).toBePromise();
        });

        describe('when course received', function () {
            beforeEach(function () {
                getByIdDefer.resolve(course);
            });

            it('should set state', done => (async () => {
                viewModel.state('');
                await viewModel.activate(course.id);
                expect(viewModel.state()).toBe(action.state);
            })().then(done));

            it('should set packageUrl', done => (async () => {
                viewModel.packageUrl('');
                await viewModel.activate(course.id);
                expect(viewModel.packageUrl()).toBe(action.packageUrl);
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

            it('should fill subscriptions', done => (async () => {
                await viewModel.activate(course.id);
                expect(viewModel.subscriptions.length).toBe(6);
            })().then(done));

            it('should subscribe to course.scormBuild.started event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.scormBuild.started);
            })().then(done));

            it('should subscribe to course.scormBuild.completed event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.scormBuild.completed);
            })().then(done));

            it('should subscribe to course.scormBuild.failed event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.scormBuild.failed);
            })().then(done));

            describe('when user has starter access', function () {
                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(true);
                });

                it('should set hasStarterAccess to true', done => (async () => {
                    viewModel.hasStarterAccess = false;
                    await viewModel.activate(course.id);
                    expect(viewModel.userHasPublishAccess).toBeTruthy();
                })().then(done));
            });

            describe('when user does not have starter access', function () {
                beforeEach(function () {
                    spyOn(userContext, 'hasStarterAccess').and.returnValue(false);
                });

                it('should set hasStarterAccess to false', done => (async () => {
                    viewModel.hasStarterAccess = true;
                    await viewModel.activate(course.id);
                    expect(viewModel.userHasPublishAccess).toBeFalsy();
                })().then(done));
            });
        });
    });

    //#endregion

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
            beforeEach(function () {
                viewModel.state('');
            });

            it('should return true', function () {
                expect(viewModel.isPublishing()).toBeFalsy();
            });
        });
    });

    describe('downloadCourse:', function () {

        var courseScormBuildDefer;
        var courseScormBuildPromise;

        beforeEach(function () {
            viewModel.course = course;
            courseScormBuildDefer = Q.defer();
            courseScormBuildPromise = courseScormBuildDefer.promise;
            spyOn(course, 'scormBuild').and.returnValue(courseScormBuildPromise);
        });

        it('should be a function', function () {
            expect(viewModel.downloadCourse).toBeFunction();
        });

        describe('when course received', function () {
            beforeEach(function () {
                getByIdDefer.resolve(course);
            });

            describe('when course is not delivering', function () {

                beforeEach(function () {
                    viewModel.isCourseDelivering(false);
                });

                it('should send event \"Download SCORM 1.2 course\"', function () {
                    viewModel.downloadCourse();
                    expect(eventTracker.publish).toHaveBeenCalledWith('Download SCORM 1.2 course');
                });

                it('should start scorm build of current course', done => (async () => {
                    courseScormBuildDefer.resolve();

                    await viewModel.downloadCourse();
                    expect(course.scormBuild).toHaveBeenCalledWith(viewModel.includeMedia());
                })().then(done));

                describe('when course scorm build finished successfully', function () {
                    beforeEach(function () {
                        courseScormBuildDefer.resolve({ scormBuild: { packageUrl: 'scorm_package_url' } });
                    });

                    it('should download file', done => (async () => {
                        await viewModel.downloadCourse();
                        expect(fileHelper.downloadFile).toHaveBeenCalledWith('download/scorm_package_url');
                    })().then(done));

                });

                describe('when course scorm build failed', function () {

                    var message = 'Some error message';
                    beforeEach(function () {
                        courseScormBuildDefer.reject(message);
                    });

                    it('should show error notification', done => (async () => {
                        spyOn(notify, 'error');
                        await viewModel.downloadCourse();
                        expect(notify.error).toHaveBeenCalledWith(message);
                    })().then(done));

                });

            });

            describe('when course is delivering', function () {

                beforeEach(function () {
                    viewModel.isCourseDelivering(true);
                });

                it('should not send event \"Download SCORM 1.2 course\"', function () {
                    viewModel.downloadCourse();
                    expect(eventTracker.publish).not.toHaveBeenCalledWith('Download SCORM 1.2 course');
                });

            });
        });
    });

    describe('openUpgradePlanUrl:', function () {

        beforeEach(function () {
            spyOn(router, 'openUrl');
        });

        it('should be function', function () {
            expect(viewModel.openUpgradePlanUrl).toBeFunction();
        });

        it('should send event \'Upgrade now\'', function () {
            viewModel.openUpgradePlanUrl();
            expect(eventTracker.publish).toHaveBeenCalledWith(constants.upgradeEvent, constants.upgradeCategory.scorm);
        });

        it('should open upgrade link in new window', function () {
            viewModel.openUpgradePlanUrl();
            expect(router.openUrl).toHaveBeenCalledWith(constants.upgradeUrl);
        });

    });

    describe('scormBuildStarted:', function () {

        describe('and when course is current course', function () {

            it('should change action state to \'building\'', function () {
                viewModel.courseId = course.id;
                viewModel.state('');

                viewModel.scormBuildStarted(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.building);
            });

        });

        describe('and when course is any other course', function () {
            it('should not change scorm build action state', function () {
                viewModel.courseId = course.id;
                viewModel.state('');

                viewModel.scormBuildStarted({ id: '100500' });

                expect(viewModel.state()).toEqual('');
            });

        });

    });

    describe('scormBuildCompleted:', function () {

        describe('and when course is current course', function () {
            it('should update scorm build action state to \'success\'', function () {
                viewModel.courseId = course.id;
                viewModel.state('');

                course.buildingStatus = constants.publishingStates.succeed;
                viewModel.scormBuildCompleted(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.succeed);
            });

            it('should update current scorm build package url to the corresponding one', function () {
                viewModel.courseId = course.id;
                viewModel.packageUrl('');

                course.scormBuild.packageUrl = "http://xxx.com";
                viewModel.scormBuildCompleted(course);

                expect(viewModel.packageUrl()).toEqual(course.scormBuild.packageUrl);
            });
        });

        describe('and when course is any other course', function () {

            it('should not update action state', function () {
                viewModel.courseId = course.id;
                viewModel.state(constants.publishingStates.notStarted);

                viewModel.scormBuildCompleted({ id: '100500' });

                expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
            });

            it('should not update current publishedPackageUrl', function () {
                viewModel.courseId = course.id;
                viewModel.packageUrl("http://xxx.com");

                viewModel.scormBuildCompleted({ id: '100500' });

                expect(viewModel.packageUrl()).toEqual("http://xxx.com");
            });
        });

    });

    describe('scormBuildFailed:', function () {

        describe('and when course is current course', function () {

            it('should update scorm build action state to \'failed\'', function () {
                viewModel.courseId = course.id;
                viewModel.state('');

                viewModel.scormBuildFailed(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.failed);
            });

            it('should remove scorm build package url', function () {
                viewModel.courseId = course.id;
                viewModel.packageUrl('publishedPackageUrl');

                viewModel.scormBuildFailed(course);

                expect(viewModel.packageUrl()).toEqual('');
            });

        });

        describe('and when course is any other course', function () {

            it('should not update scorm build action state to \'failed\'', function () {
                viewModel.courseId = course.id;
                viewModel.state('');

                viewModel.scormBuildFailed({ id: '100500' });

                expect(viewModel.state()).toEqual('');
            });

            it('should not remove packageUrl', function () {
                viewModel.courseId = course.id;
                viewModel.packageUrl('packageUrl');

                viewModel.scormBuildFailed({ id: '100500' });

                expect(viewModel.packageUrl()).toEqual('packageUrl');
            });

        });

    });
});
