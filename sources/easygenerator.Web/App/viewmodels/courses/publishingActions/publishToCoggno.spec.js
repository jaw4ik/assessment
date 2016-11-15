import Publish from './publishToCoggno';

import app from 'durandal/app';
import constants from 'constants';
import notify from 'notify';
import eventTracker from 'eventTracker';
import repository from 'repositories/courseRepository';
import userContext from 'userContext';
import upgradeDialog from 'widgets/upgradeDialog/viewmodel';
import allowCoggnoDialog from 'widgets/allowCoggno/viewmodel';
import localizationManager from 'localization/localizationManager';

describe('course delivering action [publishToCoggno]', function () {

    var
        getByIdDefer,
        viewModel,
        action = function () { };

    action.state = 'someState';
    action.packageUrl = 'some/package/url';
    var course = { id: 'someId', createdBy: 'r@p.com', isDelivering: true, publishToCoggno: action, isDirty: true, isDirtyForSale: false, saleInfo: { isProcessing: false} };

    beforeEach(function () {
        userContext.identity = { email: 'r@p.com' }
        viewModel = new Publish();
        course.publishToCoggno.packageUrl = 'packageUrl';
        spyOn(eventTracker, 'publish');
        spyOn(notify, 'error');
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

    describe('publicationUrl:', function () {
        it('should be observable', function () {
            expect(viewModel.publicationUrl).toBeObservable();
        });
    });

    describe('isCourseOwn:', function () {
        it('should be observable', function () {
            expect(viewModel.isCourseOwn).toBeObservable();
        });
    });

    describe('isProcessing:', function () {
        it('should be observable', function () {
            expect(viewModel.isProcessing).toBeObservable();
        });
    });

    describe('coggnoServiceProviderUrl:', function () {
        it('should be defined', function () {
            expect(viewModel.coggnoServiceProviderUrl).toBeDefined();
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
                expect(viewModel.subscriptions.length).toBe(9);
            })().then(done));

            it('should subscribe to course.scormBuild.started event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.scormBuild.started);
            })().then(done));

            it('should subscribe to course.scormBuild.failed event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.scormBuild.failed);
            })().then(done));

            it('should subscribe to course.publishToCoggno.started event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.publishToCoggno.started);
            })().then(done));

            it('should subscribe to course.publishToCoggno.completed event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.publishToCoggno.completed);
            })().then(done));

            it('should subscribe to course.publishToCoggno.processed event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.publishToCoggno.processed);
            })().then(done));

            it('should subscribe to course.publishToCoggno.failed event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.publishToCoggno.failed);
            })().then(done));

            it('should subscribe to course.stateChanged event', done => (async () => {
                await viewModel.activate(course.id);
                expect(app.on).toHaveBeenCalledWith(constants.messages.course.stateChanged + course.id);
            })().then(done));

            it('should set courseIsDirty', done => (async () => {
                viewModel.courseIsDirty(false);
                await viewModel.activate(course.id);
                expect(viewModel.courseIsDirty()).toBe(course.isDirtyForSale);
            })().then(done));

            it('should set isProcessing', done => (async () => {
                viewModel.isProcessing(false);
                await viewModel.activate(course.id);
                expect(viewModel.isProcessing()).toBe(course.saleInfo.isProcessing);
            })().then(done));

            it('should set isCourseOwn', done => (async () => {
                viewModel.isCourseOwn(false);
                await viewModel.activate(course.id);
                expect(viewModel.isCourseOwn()).toBe(course.createdBy === userContext.identity.email);
            })().then(done));

            it('should set publicationUrl', done => (async () => {
                viewModel.publicationUrl('');
                await viewModel.activate(course.id);
                expect(viewModel.publicationUrl()).toBe(`${viewModel.coggnoServiceProviderUrl}?uid=${course.id}`);
            })().then(done));

        });
    });

    //#endregion

    describe('courseIsDirty:', function () {
        it('should be observable', function () {
            expect(viewModel.courseIsDirty).toBeObservable();
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
    });

    describe('publishCourse:', function () {

        beforeEach(function () {
            viewModel.courseId = course.id;
            spyOn(viewModel, 'doPublishCourse');
        });

        it('should be a function', function () {
            expect(viewModel.publishCourse).toBeFunction();
        });

        describe('when user has not plus access', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(false);
                spyOn(upgradeDialog, 'show');
            });

            it('should show upgrade dialog', () => {
                viewModel.publishCourse();
                expect(upgradeDialog.show).toHaveBeenCalledWith(constants.dialogs.upgrade.settings.publishToCoggno);
            });

            it('should not do publiah', () => {
                viewModel.publishCourse();
                expect(viewModel.doPublishCourse).not.toHaveBeenCalled();
            });

        });

        describe('when publication is not allowed', () => {

            beforeEach(() => {
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
                spyOn(viewModel, 'isPublicationAllowed').and.returnValue(false);
            });

            it('should not do publiah', () => {
                viewModel.publishCourse();
                expect(viewModel.doPublishCourse).not.toHaveBeenCalled();
            });

        });

        describe('when CoggnoSamlServiceProvider is not allowed for user', () => {

            beforeEach(() => {
                userContext.identity = { isCoggnoSamlServiceProviderAllowed: false, email: 'r@p.com' }
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
                spyOn(viewModel, 'isPublicationAllowed').and.returnValue(true);
                spyOn(allowCoggnoDialog, 'show');
            });

            it('should show allowCoggnoDialog', () => {
                viewModel.publishCourse();
                expect(allowCoggnoDialog.show).toHaveBeenCalledWith(viewModel.doPublishCourse);
            });

            it('should not do publiah', () => {
                viewModel.publishCourse();
                expect(viewModel.doPublishCourse).not.toHaveBeenCalled();
            });

        });

        describe('when publication is allowed for user', () => {

            beforeEach(() => {
                userContext.identity = { isCoggnoSamlServiceProviderAllowed: true, email: 'r@p.com' }
                spyOn(userContext, 'hasPlusAccess').and.returnValue(true);
                spyOn(viewModel, 'isPublicationAllowed').and.returnValue(true);
            });

            it('should do publish', () => {
                viewModel.publishCourse();
                expect(viewModel.doPublishCourse).toHaveBeenCalled();
            });

        });

    });

    describe('courseStateChanged:', function () {

        describe('when state courseIsDirty is true', function () {
            it('should update courseIsDirty to true', function () {
                viewModel.courseIsDirty(false);
                viewModel.courseStateChanged({ isDirtyForSale: true });
                expect(viewModel.courseIsDirty()).toBeTruthy();
            });
        });

        describe('when state courseIsDirty is false', function () {
            it('should update courseIsDirty to false', function () {
                viewModel.courseIsDirty(true);
                viewModel.courseStateChanged({ isDirtyForSale: false });
                expect(viewModel.courseIsDirty()).toBeFalsy();
            });
        });
    });

    describe('courseBuildStarted:', function () {
        it('should be function', function () {
            expect(viewModel.courseBuildStarted).toBeFunction();
        });

        describe('and when course is current course', function () {

            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            describe('and when course.publish state is not ' + constants.publishingStates.building, function () {

                beforeEach(function () {
                    course.publishToCoggno.state = '';
                });

                it('should not change action state', function () {
                    viewModel.state(constants.publishingStates.notStarted);

                    viewModel.courseBuildStarted(course);

                    expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                });
            });

            describe('and when course.publish state is ' + constants.publishingStates.building, function () {

                beforeEach(function () {
                    course.publishToCoggno.state = constants.publishingStates.building;
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

    describe('courseBuildFailed:', function () {

        it('should be function', function () {
            expect(viewModel.courseBuildFailed).toBeFunction();
        });

        describe('and when course is current course', function () {

            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            describe('and when course.publish state is not ' + constants.publishingStates.failed, function () {

                beforeEach(function () {
                    course.publishToCoggno.state = '';
                });

                it('should not change action state', function () {
                    viewModel.state(constants.publishingStates.notStarted);

                    viewModel.courseBuildFailed(course);

                    expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
                });

            });

            describe('and when course.publish state is ' + constants.publishingStates.failed, function () {

                beforeEach(function () {
                    course.publishToCoggno.state = constants.publishingStates.failed;
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

            describe('and when ', function () {

            });

            it('should change action state to \'publishing\'', function () {
                viewModel.state('');

                viewModel.coursePublishStarted(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.publishing);
            });

        });

        describe('and when course is any other course', function () {

            beforeEach(function () {
                viewModel.courseId = '100500';
            });

            it('should not change action state', function () {
                viewModel.state(constants.publishingStates.notStarted);

                viewModel.coursePublishStarted(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
            });

        });

    });

    describe('coursePublishCompleted:', function () {
        beforeEach(function () {
            viewModel.course = course;
        });

        it('should be function', function () {
            expect(viewModel.coursePublishCompleted).toBeFunction();
        });

        describe('and when course is current course', function () {

            beforeEach(function () {
                viewModel.courseId = course.id;
            });

            it('should update action state to \'success\'', function () {
                viewModel.state('');
                course.buildingStatus = constants.publishingStates.succeed;

                viewModel.coursePublishCompleted(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.succeed);
            });

        });

        describe('and when course is any other course', function () {

            it('should not update action state', function () {
                viewModel.courseId = course.id;
                viewModel.state(constants.publishingStates.notStarted);

                viewModel.coursePublishCompleted({ id: '100500' });

                expect(viewModel.state()).toEqual(constants.publishingStates.notStarted);
            });

        });

    });

    describe('coursePublishFailed:', function () {
        it('should be function', function () {
            expect(viewModel.coursePublishFailed).toBeFunction();
        });

        describe('and when course is current course', function () {

            it('should update action state to \'failed\'', function () {
                viewModel.courseId = course.id;
                viewModel.state('');

                viewModel.coursePublishFailed(course);

                expect(viewModel.state()).toEqual(constants.publishingStates.failed);
            });

        });

        describe('and when course is any other course', function () {

            it('should not update publish action state to \'failed\'', function () {
                viewModel.courseId = course.id;
                viewModel.state('');

                viewModel.coursePublishFailed({ id: '100500' });

                expect(viewModel.state()).toEqual('');
            });

        });

    });

    describe('isCourseDelivering:', function () {
        it('should be observable', function () {
            expect(viewModel.isCourseDelivering).toBeObservable();
        });
    });

    describe('courseDeliveringStarted:', function () {
        beforeEach(function () {
            viewModel.course = course;
        });

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

    describe('courseProcessed:', () => {

        it('should be function', () => {
            expect(viewModel.courseProcessed).toBeFunction();
        });

        describe('when course id is not equal to viewModel id', () => {

            beforeEach(() => {
                viewModel.courseId = 'id';
                course.id = 'id1';
            });

            it('should not change isProcessing property', () => {
                viewModel.isProcessing(true);
                viewModel.courseProcessed(course, false);
                expect(viewModel.isProcessing()).toBeTruthy();
            });

        });

        describe('when course id is equal to viewModel id', () => {

            beforeEach(() => {
                viewModel.courseId = 'id';
                course.id = 'id';
            });

            it('should change isProcessing and packageUrl props if needed', () => {
                viewModel.isProcessing(false);
                viewModel.packageUrl('');
                course.saleInfo = { isProcessing: true };
                course.publishToCoggno = { packageUrl: 'url' };
                viewModel.courseProcessed(course, true);
                expect(viewModel.isProcessing()).toBe(course.saleInfo.isProcessing);
                expect(viewModel.packageUrl()).toBe(course.publishToCoggno.packageUrl);
            });

            describe('when processing was not success', () => {

                it('should notify about error', () => {
                    viewModel.isProcessing(false);
                    viewModel.packageUrl('');
                    course.saleInfo = { isProcessing: true };
                    course.publishToCoggno = { packageUrl: 'url' };
                    viewModel.courseProcessed(course, false);
                    expect(notify.error).toHaveBeenCalledWith(localizationManager.localize('courseProcessingFailed'));
                });

            });

        });

    });

});
